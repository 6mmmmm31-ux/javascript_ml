// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isFunction(f) { return typeof f === 'function' }

function _base64ToArrayBuffer(base64) {
    const binaryString = atob(base64.split(',')[1] || base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
}

function _arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

function _base64ToAudioContext(base64) {
    return new Promise(function(resolve, reject) {
        const arrayBuffer = _base64ToArrayBuffer(base64)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        audioContext.decodeAudioData(arrayBuffer, function(buffer) {
            resolve({ context: audioContext, buffer: buffer })
        }, function(error) {
            reject(error)
        })
    })
}

function _getAudioData(buffer) {
    const channelData = buffer.getChannelData(0)
    const data = []
    for (let i = 0; i < channelData.length; i++) {
        data.push(channelData[i])
    }
    return data
}

function _normalizeAudio(data) {
    const max = Math.max(...data.map(Math.abs))
    if (max === 0) return data
    return data.map(function(v) { return v / max })
}

function _fft(data) {
    const n = data.length
    if (n <= 1) return data
    
    const even = []
    const odd = []
    for (let i = 0; i < n; i++) {
        if (i % 2 === 0) even.push(data[i])
        else odd.push(data[i])
    }
    
    const fftEven = _fft(even)
    const fftOdd = _fft(odd)
    
    const result = new Array(n)
    for (let k = 0; k < n / 2; k++) {
        const angle = -2 * Math.PI * k / n
        const re = Math.cos(angle)
        const im = Math.sin(angle)
        const oddRe = fftOdd[k]
        const oddIm = 0
        
        result[k] = fftEven[k] + re * oddRe - im * oddIm
        result[k + n/2] = fftEven[k] - re * oddRe + im * oddIm
    }
    
    return result
}

function _computeMagnitude(fftResult) {
    const mag = []
    for (let i = 0; i < fftResult.length / 2; i++) {
        mag.push(Math.abs(fftResult[i]))
    }
    return mag
}

// ==================== FEATURE EXTRACTION ====================
function extractAudioFeatures(buffer) {
    const audioData = _getAudioData(buffer)
    const normalized = _normalizeAudio(audioData)
    const sampleRate = buffer.sampleRate
    const duration = buffer.duration
    
    const features = {
        duration: duration,
        sampleRate: sampleRate,
        samples: audioData.length,
        channels: buffer.numberOfChannels,
        
        // Statistical features
        mean: audioData.reduce(function(a, b) { return a + b }, 0) / audioData.length,
        variance: 0,
        stddev: 0,
        rms: 0,
        maxAmplitude: Math.max(...audioData.map(Math.abs)),
        minAmplitude: Math.min(...audioData.map(Math.abs)),
        
        // Zero crossing rate
        zeroCrossingRate: 0,
        
        // Energy
        energy: 0,
        energyPerSecond: 0,
        
        // Spectral features
        spectralCentroid: 0,
        spectralSpread: 0,
        spectralSkewness: 0,
        spectralKurtosis: 0,
        spectralRolloff: 0,
        spectralFlatness: 0,
        
        // MFCC-like features (simplified)
        mfcc: [],
        
        // Rhythm features
        tempo: 0,
        beats: 0,
        
        // Silence detection
        silenceRatio: 0,
        isSilent: false
    }
    
    // Calculate variance and RMS
    let varianceSum = 0
    let rmsSum = 0
    for (const val of audioData) {
        varianceSum += (val - features.mean) * (val - features.mean)
        rmsSum += val * val
    }
    features.variance = varianceSum / audioData.length
    features.stddev = Math.sqrt(features.variance)
    features.rms = Math.sqrt(rmsSum / audioData.length)
    
    // Zero crossing rate
    let zeroCrossings = 0
    for (let i = 1; i < audioData.length; i++) {
        if (audioData[i] * audioData[i-1] < 0) zeroCrossings++
    }
    features.zeroCrossingRate = zeroCrossings / audioData.length
    
    // Energy
    let energySum = 0
    for (const val of audioData) {
        energySum += val * val
    }
    features.energy = energySum
    features.energyPerSecond = energySum / duration
    
    // Silence detection
    let silentSamples = 0
    const silenceThreshold = 0.01
    for (const val of audioData) {
        if (Math.abs(val) < silenceThreshold) silentSamples++
    }
    features.silenceRatio = silentSamples / audioData.length
    features.isSilent = features.silenceRatio > 0.5
    
    // Spectral analysis using FFT
    const fftSize = Math.pow(2, Math.ceil(Math.log2(audioData.length)))
    const padded = new Array(fftSize).fill(0)
    for (let i = 0; i < Math.min(audioData.length, fftSize); i++) {
        padded[i] = audioData[i]
    }
    
    const fftResult = _fft(padded)
    const magnitude = _computeMagnitude(fftResult)
    const freqs = magnitude.map(function(_, i) {
        return (i * sampleRate) / fftSize
    })
    
    // Spectral centroid
    let weightedSum = 0
    let totalMag = 0
    for (let i = 0; i < magnitude.length; i++) {
        weightedSum += freqs[i] * magnitude[i]
        totalMag += magnitude[i]
    }
    features.spectralCentroid = totalMag > 0 ? weightedSum / totalMag : 0
    
    // Spectral spread
    let spreadSum = 0
    for (let i = 0; i < magnitude.length; i++) {
        spreadSum += (freqs[i] - features.spectralCentroid) * (freqs[i] - features.spectralCentroid) * magnitude[i]
    }
    features.spectralSpread = totalMag > 0 ? Math.sqrt(spreadSum / totalMag) : 0
    
    // Spectral skewness
    let skewnessSum = 0
    for (let i = 0; i < magnitude.length; i++) {
        skewnessSum += Math.pow((freqs[i] - features.spectralCentroid) / (features.spectralSpread || 1), 3) * magnitude[i]
    }
    features.spectralSkewness = totalMag > 0 ? skewnessSum / totalMag : 0
    
    // Spectral kurtosis
    let kurtosisSum = 0
    for (let i = 0; i < magnitude.length; i++) {
        kurtosisSum += Math.pow((freqs[i] - features.spectralCentroid) / (features.spectralSpread || 1), 4) * magnitude[i]
    }
    features.spectralKurtosis = totalMag > 0 ? kurtosisSum / totalMag : 0
    
    // Spectral rolloff (85% of energy)
    let cumEnergy = 0
    const totalEnergy = magnitude.reduce(function(a, b) { return a + b }, 0)
    for (let i = 0; i < magnitude.length; i++) {
        cumEnergy += magnitude[i]
        if (cumEnergy >= totalEnergy * 0.85) {
            features.spectralRolloff = freqs[i]
            break
        }
    }
    
    // Spectral flatness (geometric mean / arithmetic mean)
    let logSum = 0
    let arithMean = totalMag / magnitude.length
    for (let i = 0; i < magnitude.length; i++) {
        if (magnitude[i] > 0) logSum += Math.log(magnitude[i])
    }
    const geoMean = Math.exp(logSum / magnitude.length)
    features.spectralFlatness = arithMean > 0 ? geoMean / arithMean : 0
    
    // Simple MFCC-like features
    const melBands = 13
    const melFreqs = []
    for (let i = 0; i < melBands; i++) {
        const mel = i * (2595 * Math.log10(1 + (sampleRate/2) / 700) / melBands)
        const freq = 700 * (Math.pow(10, mel / 2595) - 1)
        melFreqs.push(freq)
    }
    
    const mfcc = []
    for (let i = 0; i < melBands; i++) {
        let sum = 0
        for (let j = 0; j < magnitude.length; j++) {
            const weight = Math.exp(-Math.pow((freqs[j] - melFreqs[i]) / (melFreqs[i] * 0.5), 2))
            sum += magnitude[j] * weight
        }
        mfcc.push(Math.log(sum + 1))
    }
    features.mfcc = mfcc
    
    // Simple tempo estimation (using autocorrelation)
    const maxLag = Math.min(Math.floor(sampleRate * 0.5), audioData.length)
    let maxCorr = 0
    let tempoLag = 0
    
    for (let lag = 1; lag < maxLag; lag++) {
        let corr = 0
        for (let i = 0; i < audioData.length - lag; i++) {
            corr += audioData[i] * audioData[i + lag]
        }
        corr /= (audioData.length - lag)
        if (corr > maxCorr) {
            maxCorr = corr
            tempoLag = lag
        }
    }
    
    if (tempoLag > 0) {
        features.tempo = 60 / (tempoLag / sampleRate)
        features.beats = duration * features.tempo / 60
    }
    
    return features
}

// ==================== AUDIO UNDERSTANDING ENGINE ====================
var AudioUnderstanding = {
    // Knowledge storage
    knowledge: {
        categories: {},
        patterns: {},
        templates: {}
    },
    
    // Settings
    settings: {
        sensitivity: 0.5,
        minConfidence: 0.3,
        sampleRate: 44100
    },
    
    // ==================== FEATURE EXTRACTION ====================
    extractFeatures: function(audioBase64) {
        return new Promise(function(resolve, reject) {
            _base64ToAudioContext(audioBase64).then(function(result) {
                try {
                    const features = extractAudioFeatures(result.buffer)
                    resolve({
                        success: true,
                        features: features,
                        duration: features.duration,
                        sampleRate: features.sampleRate,
                        isSilent: features.isSilent
                    })
                } catch (error) {
                    reject(error)
                }
            }).catch(reject)
        })
    },
    
    // ==================== LEARN ====================
    learn: function(input) {
        if (!_isObject(input)) {
            throw new Error('Input must be an object with audio-label pairs')
        }
        
        return new Promise(function(resolve, reject) {
            const promises = []
            const labels = Object.keys(input)
            
            for (const label of labels) {
                const base64 = input[label]
                if (!_isString(base64)) continue
                
                promises.push(
                    _base64ToAudioContext(base64).then(function(result) {
                        const features = extractAudioFeatures(result.buffer)
                        return { label: label, features: features, audio: base64 }
                    })
                )
            }
            
            Promise.all(promises).then(function(results) {
                for (const result of results) {
                    if (!AudioUnderstanding.knowledge.categories[result.label]) {
                        AudioUnderstanding.knowledge.categories[result.label] = []
                    }
                    AudioUnderstanding.knowledge.categories[result.label].push({
                        features: result.features,
                        audio: result.audio
                    })
                }
                
                // Extract patterns
                AudioUnderstanding._extractPatterns()
                
                resolve({
                    success: true,
                    learned: results.length,
                    total: labels.length,
                    knowledge: Object.keys(AudioUnderstanding.knowledge.categories).map(function(c) {
                        return c + ': ' + AudioUnderstanding.knowledge.categories[c].length + ' samples'
                    })
                })
            }).catch(reject)
        })
    },
    
    // ==================== PATTERN EXTRACTION ====================
    _extractPatterns: function() {
        const patterns = {}
        
        for (const [category, samples] of Object.entries(this.knowledge.categories)) {
            if (samples.length === 0) continue
            
            // Average features for this category
            const avgFeatures = {
                spectralCentroid: 0,
                spectralSpread: 0,
                spectralSkewness: 0,
                spectralKurtosis: 0,
                zeroCrossingRate: 0,
                rms: 0,
                energy: 0,
                tempo: 0,
                mfcc: new Array(13).fill(0)
            }
            
            for (const sample of samples) {
                const f = sample.features
                avgFeatures.spectralCentroid += f.spectralCentroid
                avgFeatures.spectralSpread += f.spectralSpread
                avgFeatures.spectralSkewness += f.spectralSkewness
                avgFeatures.spectralKurtosis += f.spectralKurtosis
                avgFeatures.zeroCrossingRate += f.zeroCrossingRate
                avgFeatures.rms += f.rms
                avgFeatures.energy += f.energy
                avgFeatures.tempo += f.tempo
                for (let i = 0; i < 13; i++) {
                    if (f.mfcc[i]) avgFeatures.mfcc[i] += f.mfcc[i]
                }
            }
            
            const count = samples.length
            for (const key of Object.keys(avgFeatures)) {
                if (key === 'mfcc') {
                    for (let i = 0; i < 13; i++) {
                        avgFeatures.mfcc[i] /= count
                    }
                } else {
                    avgFeatures[key] /= count
                }
            }
            
            patterns[category] = avgFeatures
        }
        
        this.knowledge.patterns = patterns
    },
    
    // ==================== UNDERSTAND ====================
    understand: function(audioBase64, options) {
        options = options || {}
        const sensitivity = options.sensitivity || this.settings.sensitivity
        
        if (!_isString(audioBase64)) {
            return Promise.resolve({ error: 'Audio must be a base64 string' })
        }
        
        return new Promise(function(resolve, reject) {
            _base64ToAudioContext(audioBase64).then(function(result) {
                try {
                    const features = extractAudioFeatures(result.buffer)
                    const recognition = AudioUnderstanding._recognize(features, sensitivity)
                    
                    resolve({
                        classification: recognition.classification,
                        confidence: recognition.confidence,
                        score: recognition.score,
                        features: features,
                        isSpeech: !features.isSilent && features.zeroCrossingRate > 0.01,
                        isMusic: features.spectralFlatness < 0.5 && features.zeroCrossingRate > 0.02,
                        isSilent: features.isSilent,
                        hasVoice: features.spectralCentroid > 100 && features.spectralCentroid < 3000,
                        tempo: features.tempo,
                        duration: features.duration,
                        categories: recognition.categories,
                        topMatches: recognition.topMatches
                    })
                } catch (error) {
                    reject(error)
                }
            }).catch(reject)
        })
    },
    
    // ==================== RECOGNIZE ====================
    _recognize: function(features, sensitivity) {
        const categories = {}
        let totalWeight = 0
        
        for (const [category, pattern] of Object.entries(this.knowledge.patterns)) {
            let similarity = 0
            let weights = 0
            
            // Compare spectral features
            const centroidDiff = Math.abs(features.spectralCentroid - pattern.spectralCentroid)
            similarity += 1 / (1 + centroidDiff / 1000)
            weights += 1
            
            const spreadDiff = Math.abs(features.spectralSpread - pattern.spectralSpread)
            similarity += 1 / (1 + spreadDiff / 500)
            weights += 1
            
            const skewnessDiff = Math.abs(features.spectralSkewness - pattern.spectralSkewness)
            similarity += 1 / (1 + Math.abs(skewnessDiff))
            weights += 1
            
            const zcrDiff = Math.abs(features.zeroCrossingRate - pattern.zeroCrossingRate)
            similarity += 1 / (1 + zcrDiff * 10)
            weights += 1
            
            const rmsDiff = Math.abs(features.rms - pattern.rms)
            similarity += 1 / (1 + rmsDiff * 10)
            weights += 1
            
            const tempoDiff = Math.abs(features.tempo - pattern.tempo) / 100
            similarity += 1 / (1 + tempoDiff)
            weights += 1
            
            // Compare MFCC
            if (features.mfcc.length > 0 && pattern.mfcc.length > 0) {
                let mfccSim = 0
                const n = Math.min(features.mfcc.length, pattern.mfcc.length)
                for (let i = 0; i < n; i++) {
                    const diff = Math.abs(features.mfcc[i] - pattern.mfcc[i])
                    mfccSim += 1 / (1 + diff)
                }
                similarity += mfccSim / n
                weights += 1
            }
            
            categories[category] = similarity / weights
            totalWeight += categories[category]
        }
        
        // Normalize
        if (totalWeight > 0) {
            for (const category of Object.keys(categories)) {
                categories[category] = categories[category] / totalWeight
            }
        }
        
        // Find best match
        let bestCategory = 'unknown'
        let bestScore = 0
        
        for (const [category, score] of Object.entries(categories)) {
            if (score > bestScore) {
                bestScore = score
                bestCategory = category
            }
        }
        
        // Check against sensitivity
        const isMatch = bestScore >= sensitivity
        
        // Top matches
        const topMatches = Object.entries(categories)
            .sort(function(a, b) { return b[1] - a[1] })
            .slice(0, 5)
            .map(function(item) {
                return { category: item[0], confidence: item[1] }
            })
        
        return {
            classification: isMatch ? bestCategory : 'unknown',
            confidence: bestScore,
            score: bestScore,
            categories: categories,
            topMatches: topMatches,
            isMatch: isMatch
        }
    },
    
    // ==================== BATCH PROCESSING ====================
    understandBatch: function(audios, options) {
        if (!_isArray(audios)) throw new Error('Input must be an array of audio base64 strings')
        
        return Promise.all(audios.map(function(audio) {
            return this.understand(audio, options)
        }.bind(this)))
    },
    
    // ==================== AUDIO PROCESSING ====================
    processAudio: function(audioBase64, operation) {
        return new Promise(function(resolve, reject) {
            _base64ToAudioContext(audioBase64).then(function(result) {
                try {
                    const buffer = result.buffer
                    const context = result.context
                    const audioData = _getAudioData(buffer)
                    
                    let processed = audioData
                    
                    switch(operation) {
                        case 'normalize':
                            processed = _normalizeAudio(audioData)
                            break
                        case 'amplify':
                            const maxAmp = Math.max(...audioData.map(Math.abs))
                            const gain = maxAmp > 0 ? 1 / maxAmp : 1
                            processed = audioData.map(function(v) { return v * gain * 0.9 })
                            break
                        case 'reduceNoise':
                            // Simple noise reduction (smooth)
                            processed = audioData.map(function(v, i) {
                                if (i === 0 || i === audioData.length - 1) return v
                                return (audioData[i-1] + audioData[i] + audioData[i+1]) / 3
                            })
                            break
                        case 'trimSilence':
                            let start = 0
                            let end = audioData.length - 1
                            const threshold = 0.01
                            while (start < audioData.length && Math.abs(audioData[start]) < threshold) start++
                            while (end > start && Math.abs(audioData[end]) < threshold) end--
                            processed = audioData.slice(start, end + 1)
                            break
                        default:
                            processed = audioData
                    }
                    
                    resolve({
                        success: true,
                        operation: operation,
                        originalLength: audioData.length,
                        processedLength: processed.length,
                        data: processed
                    })
                } catch (error) {
                    reject(error)
                }
            }).catch(reject)
        })
    },
    
    // ==================== SIMILARITY ====================
    similarity: function(audio1, audio2) {
        return new Promise(function(resolve, reject) {
            Promise.all([
                _base64ToAudioContext(audio1),
                _base64ToAudioContext(audio2)
            ]).then(function(results) {
                const features1 = extractAudioFeatures(results[0].buffer)
                const features2 = extractAudioFeatures(results[1].buffer)
                
                let similarity = 0
                let weights = 0
                
                // Compare RMS
                const rmsDiff = Math.abs(features1.rms - features2.rms)
                similarity += 1 / (1 + rmsDiff * 10)
                weights += 1
                
                // Compare spectral centroid
                const centroidDiff = Math.abs(features1.spectralCentroid - features2.spectralCentroid)
                similarity += 1 / (1 + centroidDiff / 1000)
                weights += 1
                
                // Compare zero crossing rate
                const zcrDiff = Math.abs(features1.zeroCrossingRate - features2.zeroCrossingRate)
                similarity += 1 / (1 + zcrDiff * 10)
                weights += 1
                
                // Compare MFCC
                if (features1.mfcc.length > 0 && features2.mfcc.length > 0) {
                    let mfccSim = 0
                    const n = Math.min(features1.mfcc.length, features2.mfcc.length)
                    for (let i = 0; i < n; i++) {
                        const diff = Math.abs(features1.mfcc[i] - features2.mfcc[i])
                        mfccSim += 1 / (1 + diff)
                    }
                    similarity += mfccSim / n
                    weights += 1
                }
                
                resolve({
                    similarity: similarity / weights,
                    features1: features1,
                    features2: features2
                })
            }).catch(reject)
        })
    },
    
    // ==================== GET KNOWLEDGE ====================
    getKnowledge: function() {
        return {
            categories: Object.keys(this.knowledge.categories).reduce(function(acc, key) {
                acc[key] = this.knowledge.categories[key].length
                return acc
            }.bind(this), {}),
            patterns: Object.keys(this.knowledge.patterns).length,
            totalSamples: Object.values(this.knowledge.categories)
                .reduce(function(a, b) { return a + b.length }, 0)
        }
    },
    
    // ==================== CLEAR KNOWLEDGE ====================
    clearKnowledge: function() {
        this.knowledge = {
            categories: {},
            patterns: {},
            templates: {}
        }
        return { success: true, message: 'Knowledge cleared' }
    },
    
    // ==================== SAVE/LOAD KNOWLEDGE ====================
    saveKnowledge: function() {
        return JSON.stringify(this.knowledge)
    },
    
    loadKnowledge: function(data) {
        if (!_isObject(data)) throw new Error('Knowledge must be an object')
        this.knowledge = data
        return { success: true, loaded: true }
    },
    
    // ==================== SETTINGS ====================
    setSensitivity: function(value) {
        if (!_isNumber(value) || value < 0 || value > 1) {
            throw new Error('Sensitivity must be between 0 and 1')
        }
        this.settings.sensitivity = value
        return { success: true, sensitivity: value }
    }
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.AudioUnderstanding = AudioUnderstanding
}

// ============================================================
// ADU.ML_NEW.JS v1.0.0
// Complete Audio Machine Learning Library
// 16+ Functions for Audio Analysis, Recognition & Generation
// ============================================================

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

function _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function _randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function _shuffleArray(arr) {
    const result = arr.slice()
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

// ==================== FFT ====================
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

// ==================== CORE CLASSES ====================

// Feature Extractor
class _AudioFeatureExtractor {
    constructor() {
        this.features = []
    }
    
    extract(buffer) {
        const audioData = _getAudioData(buffer)
        const normalized = _normalizeAudio(audioData)
        const sampleRate = buffer.sampleRate
        const duration = buffer.duration
        
        const features = {
            // Basic
            duration: duration,
            sampleRate: sampleRate,
            samples: audioData.length,
            channels: buffer.numberOfChannels,
            
            // Statistical
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
            
            // MFCC-like
            mfcc: [],
            
            // Rhythm
            tempo: 0,
            beats: 0,
            
            // Silence
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
        
        // Spectral analysis
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
        
        // Spectral rolloff
        let cumEnergy = 0
        const totalEnergy = magnitude.reduce(function(a, b) { return a + b }, 0)
        for (let i = 0; i < magnitude.length; i++) {
            cumEnergy += magnitude[i]
            if (cumEnergy >= totalEnergy * 0.85) {
                features.spectralRolloff = freqs[i]
                break
            }
        }
        
        // Spectral flatness
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
        
        // Simple tempo estimation
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
        
        this.features.push(features)
        return features
    }
}

// ==================== ADU.ML MAIN LIBRARY ====================
var ADUML = {
    version: '1.0.0',
    
    // Models
    featureExtractor: null,
    
    // Knowledge
    knowledge: {
        audio: [],
        features: [],
        categories: {},
        trained: false
    },
    
    // ==================== TRAINING FUNCTIONS ====================
    train: function(data, labels, type) {
        type = type || 'all'
        
        if (!_isArray(data)) data = [data]
        if (!_isArray(labels)) labels = [labels]
        if (data.length !== labels.length) {
            throw new Error('Data and labels must have same length')
        }
        
        if (!this.featureExtractor) this.featureExtractor = new _AudioFeatureExtractor()
        
        return new Promise(function(resolve, reject) {
            const promises = data.map(function(audio, index) {
                return _base64ToAudioContext(audio).then(function(result) {
                    const features = ADUML.featureExtractor.extract(result.buffer)
                    ADUML.knowledge.features.push({ features: features, label: labels[index] })
                    ADUML.knowledge.audio.push({ audio: audio, label: labels[index] })
                    
                    if (!ADUML.knowledge.categories[labels[index]]) {
                        ADUML.knowledge.categories[labels[index]] = []
                    }
                    ADUML.knowledge.categories[labels[index]].push(features)
                    
                    return { features: features, label: labels[index] }
                })
            })
            
            Promise.all(promises).then(function(results) {
                ADUML.knowledge.trained = true
                resolve({
                    success: true,
                    trained: results.length,
                    categories: Object.keys(ADUML.knowledge.categories),
                    totalAudio: ADUML.knowledge.audio.length
                })
            }).catch(reject)
        })
    },
    
    // ==================== RECOGNITION FUNCTIONS ====================
    recognize: function(audioBase64) {
        return new Promise(function(resolve, reject) {
            if (!ADUML.knowledge.trained) {
                resolve({ error: 'Model not trained. Use train() first.' })
                return
            }
            
            _base64ToAudioContext(audioBase64).then(function(result) {
                const features = ADUML.featureExtractor.extract(result.buffer)
                const matches = []
                
                for (const [category, samples] of Object.entries(ADUML.knowledge.categories)) {
                    let totalSimilarity = 0
                    for (const sample of samples) {
                        const similarity = ADUML._compareFeatures(features, sample)
                        totalSimilarity += similarity
                    }
                    const avgSimilarity = samples.length > 0 ? totalSimilarity / samples.length : 0
                    matches.push({ category: category, confidence: avgSimilarity })
                }
                
                matches.sort(function(a, b) { return b.confidence - a.confidence })
                const best = matches[0]
                
                resolve({
                    classification: best ? best.category : 'unknown',
                    confidence: best ? best.confidence : 0,
                    matches: matches,
                    features: features
                })
            }).catch(reject)
        })
    },
    
    _compareFeatures: function(features1, features2) {
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
        
        // Compare spectral spread
        const spreadDiff = Math.abs(features1.spectralSpread - features2.spectralSpread)
        similarity += 1 / (1 + spreadDiff / 500)
        weights += 1
        
        // Compare zero crossing rate
        const zcrDiff = Math.abs(features1.zeroCrossingRate - features2.zeroCrossingRate)
        similarity += 1 / (1 + zcrDiff * 10)
        weights += 1
        
        // Compare tempo
        const tempoDiff = Math.abs(features1.tempo - features2.tempo) / 100
        similarity += 1 / (1 + tempoDiff)
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
        
        return weights > 0 ? similarity / weights : 0
    },
    
    // ==================== AUDIO ANALYSIS ====================
    analyze: function(audioBase64) {
        return new Promise(function(resolve, reject) {
            _base64ToAudioContext(audioBase64).then(function(result) {
                const features = ADUML.featureExtractor.extract(result.buffer)
                
                resolve({
                    duration: features.duration,
                    sampleRate: features.sampleRate,
                    channels: features.channels,
                    rms: features.rms,
                    maxAmplitude: features.maxAmplitude,
                    zeroCrossingRate: features.zeroCrossingRate,
                    energy: features.energy,
                    energyPerSecond: features.energyPerSecond,
                    spectralCentroid: features.spectralCentroid,
                    spectralSpread: features.spectralSpread,
                    spectralFlatness: features.spectralFlatness,
                    tempo: features.tempo,
                    beats: features.beats,
                    isSilent: features.isSilent,
                    silenceRatio: features.silenceRatio,
                    mfcc: features.mfcc,
                    classification: features.isSilent ? 'silence' : 
                                  (features.zeroCrossingRate > 0.02 && features.spectralFlatness < 0.5 ? 'music' : 'speech')
                })
            }).catch(reject)
        })
    },
    
    // ==================== AUDIO PROCESSING ====================
    process: function(audioBase64, operation) {
        return new Promise(function(resolve, reject) {
            _base64ToAudioContext(audioBase64).then(function(result) {
                const buffer = result.buffer
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
                    case 'silence':
                        processed = audioData.map(function(v) { return Math.abs(v) < 0.01 ? 0 : v })
                        break
                    case 'reverse':
                        processed = audioData.slice().reverse()
                        break
                    case 'fadeIn':
                        processed = audioData.map(function(v, i) {
                            const factor = i / audioData.length
                            return v * factor
                        })
                        break
                    case 'fadeOut':
                        processed = audioData.map(function(v, i) {
                            const factor = 1 - i / audioData.length
                            return v * factor
                        })
                        break
                    case 'delay':
                        const delay = 0.2 * buffer.sampleRate
                        processed = audioData.slice()
                        for (let i = 0; i < audioData.length - delay; i++) {
                            processed[i + delay] += audioData[i] * 0.3
                        }
                        break
                    default:
                        break
                }
                
                resolve({
                    success: true,
                    operation: operation,
                    originalLength: audioData.length,
                    processedLength: processed.length,
                    samples: processed.slice(0, 1000) // Preview
                })
            }).catch(reject)
        })
    },
    
    // ==================== AUDIO GENERATION ====================
    generate: function(duration, type, frequency) {
        frequency = frequency || 440
        const sampleRate = 44100
        const samples = Math.floor(duration * sampleRate)
        const data = new Float32Array(samples)
        
        switch(type) {
            case 'sine':
                for (let i = 0; i < samples; i++) {
                    data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate)
                }
                break
            case 'square':
                for (let i = 0; i < samples; i++) {
                    data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) > 0 ? 1 : -1
                }
                break
            case 'sawtooth':
                for (let i = 0; i < samples; i++) {
                    data[i] = 2 * ((i * frequency / sampleRate) % 1) - 1
                }
                break
            case 'triangle':
                for (let i = 0; i < samples; i++) {
                    const val = (i * frequency / sampleRate) % 1
                    data[i] = 2 * (val < 0.5 ? val : 1 - val) - 1
                }
                break
            case 'noise':
                for (let i = 0; i < samples; i++) {
                    data[i] = (Math.random() * 2 - 1)
                }
                break
            case 'chord':
                const freqs = [frequency, frequency * 5/4, frequency * 3/2]
                for (let i = 0; i < samples; i++) {
                    let sum = 0
                    for (const f of freqs) {
                        sum += Math.sin(2 * Math.PI * f * i / sampleRate)
                    }
                    data[i] = sum / freqs.length
                }
                break
            default:
                for (let i = 0; i < samples; i++) {
                    data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate)
                }
        }
        
        return {
            duration: duration,
            sampleRate: sampleRate,
            samples: samples,
            type: type,
            data: data,
            preview: Array.from(data.slice(0, 1000))
        }
    },
    
    // ==================== AUDIO TO VISUAL ====================
    toWaveform: function(audioBase64, width, height) {
        width = width || 800
        height = height || 200
        
        return new Promise(function(resolve, reject) {
            _base64ToAudioContext(audioBase64).then(function(result) {
                const audioData = _getAudioData(result.buffer)
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                
                ctx.fillStyle = '#000'
                ctx.fillRect(0, 0, width, height)
                
                const step = Math.floor(audioData.length / width)
                ctx.strokeStyle = '#00ff00'
                ctx.lineWidth = 2
                ctx.beginPath()
                
                for (let x = 0; x < width; x++) {
                    let min = 1, max = -1
                    for (let i = 0; i < step; i++) {
                        const val = audioData[x * step + i] || 0
                        if (val < min) min = val
                        if (val > max) max = val
                    }
                    const y1 = height / 2 + min * height / 2
                    const y2 = height / 2 + max * height / 2
                    ctx.moveTo(x, y1)
                    ctx.lineTo(x, y2)
                }
                ctx.stroke()
                
                resolve(canvas.toDataURL())
            }).catch(reject)
        })
    },
    
    // ==================== BATCH PROCESSING ====================
    batchProcess: function(audios, operation) {
        if (!_isArray(audios)) audios = [audios]
        
        return Promise.all(audios.map(function(audio) {
            return ADUML.process(audio, operation)
        }))
    },
    
    batchRecognize: function(audios) {
        if (!_isArray(audios)) audios = [audios]
        
        return Promise.all(audios.map(function(audio) {
            return ADUML.recognize(audio)
        }))
    },
    
    // ==================== KNOWLEDGE MANAGEMENT ====================
    getKnowledge: function() {
        return {
            totalAudio: this.knowledge.audio.length,
            categories: Object.keys(this.knowledge.categories).reduce(function(acc, key) {
                acc[key] = this.knowledge.categories[key].length
                return acc
            }.bind(this), {}),
            trained: this.knowledge.trained
        }
    },
    
    reset: function() {
        this.featureExtractor = null
        this.knowledge = {
            audio: [],
            features: [],
            categories: {},
            trained: false
        }
        return { success: true }
    },
    
    // ==================== EXPORT/IMPORT ====================
    export: function() {
        return {
            version: this.version,
            knowledge: this.knowledge
        }
    },
    
    import: function(data) {
        if (!_isObject(data)) throw new Error('Invalid data')
        this.version = data.version || this.version
        this.knowledge = data.knowledge || this.knowledge
        this.knowledge.trained = true
        return { success: true }
    }
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.ADUML = ADUML
    window.adu = ADUML
}

console.log('ADU.ML v' + ADUML.version + ' loaded with ' + Object.keys(ADUML).length + ' functions')
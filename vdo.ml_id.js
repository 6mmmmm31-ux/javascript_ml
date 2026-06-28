// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isFunction(f) { return typeof f === 'function' }

function _base64ToVideo(base64) {
    return new Promise(function(resolve, reject) {
        const video = document.createElement('video')
        video.src = base64
        video.preload = 'auto'
        video.onloadedmetadata = function() {
            resolve({
                video: video,
                duration: video.duration,
                width: video.videoWidth,
                height: video.videoHeight
            })
        }
        video.onerror = function(e) { reject(e) }
    })
}

function _captureFrame(video, time) {
    return new Promise(function(resolve, reject) {
        if (time !== undefined) {
            video.currentTime = time
        }
        video.onseeked = function() {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            resolve({
                imageData: imageData,
                canvas: canvas,
                ctx: ctx,
                width: canvas.width,
                height: canvas.height,
                time: video.currentTime
            })
        }
        video.onerror = function(e) { reject(e) }
    })
}

function _getPixel(imageData, x, y, width) {
    const index = (y * width + x) * 4
    return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3]
    }
}

function _rgbToGray(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b
}

function _imageDataToGray(imageData, width, height) {
    const gray = new Float32Array(width * height)
    for (let i = 0; i < width * height; i++) {
        const idx = i * 4
        gray[i] = _rgbToGray(imageData.data[idx], imageData.data[idx + 1], imageData.data[idx + 2])
    }
    return gray
}

function _computeDifference(frame1, frame2) {
    const gray1 = _imageDataToGray(frame1.imageData, frame1.width, frame1.height)
    const gray2 = _imageDataToGray(frame2.imageData, frame2.width, frame2.height)
    
    const diff = new Float32Array(gray1.length)
    let totalDiff = 0
    
    for (let i = 0; i < gray1.length; i++) {
        diff[i] = Math.abs(gray1[i] - gray2[i])
        totalDiff += diff[i]
    }
    
    return {
        diff: diff,
        totalDiff: totalDiff,
        avgDiff: totalDiff / gray1.length,
        width: frame1.width,
        height: frame1.height
    }
}

function _computeMotionVectors(prev, curr, blockSize) {
    blockSize = blockSize || 16
    const width = prev.width
    const height = prev.height
    const vectors = []
    
    const prevGray = _imageDataToGray(prev.imageData, width, height)
    const currGray = _imageDataToGray(curr.imageData, width, height)
    
    for (let y = 0; y < height - blockSize; y += blockSize) {
        for (let x = 0; x < width - blockSize; x += blockSize) {
            let bestX = 0, bestY = 0
            let bestCost = Infinity
            const searchRange = 8
            
            for (let dy = -searchRange; dy <= searchRange; dy++) {
                for (let dx = -searchRange; dx <= searchRange; dx++) {
                    let cost = 0
                    for (let by = 0; by < blockSize; by++) {
                        for (let bx = 0; bx < blockSize; bx++) {
                            const px = x + bx
                            const py = y + by
                            const cx = x + bx + dx
                            const cy = y + by + dy
                            
                            if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
                                const pIdx = py * width + px
                                const cIdx = cy * width + cx
                                cost += Math.abs(prevGray[pIdx] - currGray[cIdx])
                            }
                        }
                    }
                    
                    if (cost < bestCost) {
                        bestCost = cost
                        bestX = dx
                        bestY = dy
                    }
                }
            }
            
            vectors.push({
                x: x,
                y: y,
                dx: bestX,
                dy: bestY,
                magnitude: Math.sqrt(bestX * bestX + bestY * bestY),
                angle: Math.atan2(bestY, bestX)
            })
        }
    }
    
    return vectors
}

function _extractMotionFeatures(vectors) {
    if (vectors.length === 0) return null
    
    let totalMagnitude = 0
    let totalAngle = 0
    let maxMagnitude = 0
    let minMagnitude = Infinity
    const angles = []
    const magnitudes = []
    
    for (const v of vectors) {
        totalMagnitude += v.magnitude
        totalAngle += v.angle
        if (v.magnitude > maxMagnitude) maxMagnitude = v.magnitude
        if (v.magnitude < minMagnitude) minMagnitude = v.magnitude
        angles.push(v.angle)
        magnitudes.push(v.magnitude)
    }
    
    const avgMagnitude = totalMagnitude / vectors.length
    const avgAngle = totalAngle / vectors.length
    
    // Direction distribution
    const directionBins = { up: 0, down: 0, left: 0, right: 0, diagonal: 0 }
    for (const v of vectors) {
        const angle = v.angle * 180 / Math.PI
        if (angle > -45 && angle <= 45) directionBins.right++
        else if (angle > 45 && angle <= 135) directionBins.down++
        else if (angle > -135 && angle <= -45) directionBins.up++
        else directionBins.left++
    }
    
    const totalVectors = vectors.length
    for (const key in directionBins) {
        directionBins[key] = directionBins[key] / totalVectors
    }
    
    // Complexity (variation of motion)
    let variance = 0
    for (const mag of magnitudes) {
        variance += (mag - avgMagnitude) * (mag - avgMagnitude)
    }
    variance /= vectors.length
    const complexity = Math.sqrt(variance)
    
    return {
        avgMagnitude: avgMagnitude,
        avgAngle: avgAngle,
        maxMagnitude: maxMagnitude,
        minMagnitude: minMagnitude,
        directionBins: directionBins,
        complexity: complexity,
        activeBlocks: vectors.filter(function(v) { return v.magnitude > 2 }).length / vectors.length,
        vectorCount: vectors.length
    }
}

// ==================== VIDEO UNDERSTANDING ENGINE ====================
var VideoUnderstanding = {
    // Knowledge storage
    knowledge: {
        activities: {},
        patterns: {},
        motionTemplates: {}
    },
    
    // Settings
    settings: {
        sensitivity: 0.5,
        minConfidence: 0.3,
        frameInterval: 0.5,
        blockSize: 16,
        motionThreshold: 2
    },
    
    // ==================== EXTRACT ACTIVITY FEATURES ====================
    extractActivityFeatures: function(videoBase64) {
        return new Promise(function(resolve, reject) {
            _base64ToVideo(videoBase64).then(function(videoInfo) {
                const video = videoInfo.video
                const duration = videoInfo.duration
                const width = videoInfo.width
                const height = videoInfo.height
                
                const frames = []
                const motionData = []
                const totalFrames = Math.min(Math.floor(duration / 0.5), 20)
                
                function captureNextFrame(index) {
                    if (index >= totalFrames) {
                        // All frames captured
                        const features = VideoUnderstanding._analyzeFrames(frames, motionData, duration, width, height)
                        resolve(features)
                        return
                    }
                    
                    const time = (index / totalFrames) * duration
                    _captureFrame(video, time).then(function(frame) {
                        frames.push(frame)
                        
                        if (frames.length > 1) {
                            const prev = frames[frames.length - 2]
                            const curr = frames[frames.length - 1]
                            const diff = _computeDifference(prev, curr)
                            const vectors = _computeMotionVectors(prev, curr, VideoUnderstanding.settings.blockSize)
                            const motionFeatures = _extractMotionFeatures(vectors)
                            
                            motionData.push({
                                time: curr.time,
                                diff: diff.avgDiff,
                                motion: motionFeatures,
                                vectors: vectors
                            })
                        }
                        
                        captureNextFrame(index + 1)
                    }).catch(reject)
                }
                
                captureNextFrame(0)
            }).catch(reject)
        })
    },
    
    _analyzeFrames: function(frames, motionData, duration, width, height) {
        // Global motion analysis
        let totalMotion = 0
        let maxMotion = 0
        let avgMotion = 0
        let motionVariance = 0
        
        for (const data of motionData) {
            totalMotion += data.diff
            if (data.diff > maxMotion) maxMotion = data.diff
        }
        avgMotion = motionData.length > 0 ? totalMotion / motionData.length : 0
        
        for (const data of motionData) {
            motionVariance += (data.diff - avgMotion) * (data.diff - avgMotion)
        }
        motionVariance = motionData.length > 0 ? motionVariance / motionData.length : 0
        
        // Activity classification
        const activity = this._classifyActivity(motionData, avgMotion, maxMotion, duration)
        
        // Motion patterns
        const motionPatterns = this._extractMotionPatterns(motionData)
        
        // Detect activities
        const activities = this._detectActivities(motionData)
        
        return {
            duration: duration,
            width: width,
            height: height,
            frames: frames.length,
            motionSamples: motionData.length,
            avgMotion: avgMotion,
            maxMotion: maxMotion,
            motionVariance: motionVariance,
            activity: activity,
            motionPatterns: motionPatterns,
            activities: activities,
            hasMotion: avgMotion > 5,
            isStatic: avgMotion < 5,
            isDynamic: avgMotion >= 5
        }
    },
    
    _classifyActivity: function(motionData, avgMotion, maxMotion, duration) {
        if (motionData.length === 0) {
            return { type: 'static', confidence: 0.9 }
        }
        
        // Analyze motion pattern
        let highMotionCount = 0
        let mediumMotionCount = 0
        let lowMotionCount = 0
        
        for (const data of motionData) {
            if (data.diff > 30) highMotionCount++
            else if (data.diff > 15) mediumMotionCount++
            else lowMotionCount++
        }
        
        const total = motionData.length
        
        if (highMotionCount / total > 0.5) {
            return { type: 'high_activity', confidence: 0.8 }
        } else if (mediumMotionCount / total > 0.5) {
            return { type: 'moderate_activity', confidence: 0.7 }
        } else if (lowMotionCount / total > 0.7) {
            return { type: 'low_activity', confidence: 0.8 }
        } else {
            return { type: 'mixed_activity', confidence: 0.5 }
        }
    },
    
    _extractMotionPatterns: function(motionData) {
        const patterns = {
            sudden: 0,
            gradual: 0,
            periodic: 0,
            random: 0
        }
        
        if (motionData.length < 3) return patterns
        
        // Analyze motion changes
        let suddenChanges = 0
        let gradualChanges = 0
        let periodicChanges = 0
        
        for (let i = 1; i < motionData.length; i++) {
            const diff = Math.abs(motionData[i].diff - motionData[i-1].diff)
            if (diff > 20) suddenChanges++
            else if (diff > 5) gradualChanges++
        }
        
        // Check for periodicity
        let periodicCount = 0
        if (motionData.length > 5) {
            for (let i = 0; i < motionData.length - 2; i++) {
                const val1 = motionData[i].diff
                const val2 = motionData[i+2].diff
                if (Math.abs(val1 - val2) < 5) periodicCount++
            }
        }
        
        patterns.sudden = suddenChanges / (motionData.length - 1)
        patterns.gradual = gradualChanges / (motionData.length - 1)
        patterns.periodic = periodicCount / (motionData.length - 2)
        patterns.random = 1 - (patterns.sudden + patterns.gradual + patterns.periodic) / 3
        
        return patterns
    },
    
    _detectActivities: function(motionData) {
        const activities = []
        
        if (motionData.length === 0) return activities
        
        // Detect walking/running (periodic motion)
        let periodicCount = 0
        for (let i = 0; i < motionData.length - 3; i++) {
            const val1 = motionData[i].diff
            const val2 = motionData[i+3].diff
            if (Math.abs(val1 - val2) < 10) periodicCount++
        }
        
        if (periodicCount > motionData.length * 0.3) {
            activities.push({
                type: 'walking',
                confidence: 0.6 + (periodicCount / motionData.length) * 0.3,
                description: 'Periodic motion detected'
            })
        }
        
        // Detect sudden movements
        let suddenCount = 0
        for (let i = 1; i < motionData.length; i++) {
            if (Math.abs(motionData[i].diff - motionData[i-1].diff) > 30) suddenCount++
        }
        
        if (suddenCount > motionData.length * 0.2) {
            activities.push({
                type: 'sudden_movement',
                confidence: 0.7 + (suddenCount / motionData.length) * 0.2,
                description: 'Sudden motion detected'
            })
        }
        
        // Detect continuous motion
        let continuousCount = 0
        for (const data of motionData) {
            if (data.diff > 10) continuousCount++
        }
        
        if (continuousCount > motionData.length * 0.6) {
            activities.push({
                type: 'continuous_motion',
                confidence: 0.7 + (continuousCount / motionData.length) * 0.2,
                description: 'Continuous motion detected'
            })
        }
        
        return activities
    },
    
    // ==================== LEARN ====================
    learn: function(input) {
        if (!_isObject(input)) {
            throw new Error('Input must be an object with video-label pairs')
        }
        
        return new Promise(function(resolve, reject) {
            const promises = []
            const labels = Object.keys(input)
            
            for (const label of labels) {
                const base64 = input[label]
                if (!_isString(base64)) continue
                
                promises.push(
                    VideoUnderstanding.extractActivityFeatures(base64).then(function(features) {
                        return { label: label, features: features, video: base64 }
                    })
                )
            }
            
            Promise.all(promises).then(function(results) {
                for (const result of results) {
                    if (!VideoUnderstanding.knowledge.activities[result.label]) {
                        VideoUnderstanding.knowledge.activities[result.label] = []
                    }
                    VideoUnderstanding.knowledge.activities[result.label].push({
                        features: result.features,
                        video: result.video
                    })
                }
                
                // Extract patterns
                VideoUnderstanding._extractPatterns()
                
                resolve({
                    success: true,
                    learned: results.length,
                    total: labels.length,
                    knowledge: Object.keys(VideoUnderstanding.knowledge.activities).map(function(c) {
                        return c + ': ' + VideoUnderstanding.knowledge.activities[c].length + ' samples'
                    })
                })
            }).catch(reject)
        })
    },
    
    _extractPatterns: function() {
        const patterns = {}
        
        for (const [activity, samples] of Object.entries(this.knowledge.activities)) {
            if (samples.length === 0) continue
            
            const avgFeatures = {
                avgMotion: 0,
                maxMotion: 0,
                motionVariance: 0,
                sudden: 0,
                gradual: 0,
                periodic: 0,
                random: 0
            }
            
            for (const sample of samples) {
                const f = sample.features
                avgFeatures.avgMotion += f.avgMotion
                avgFeatures.maxMotion += f.maxMotion
                avgFeatures.motionVariance += f.motionVariance
                avgFeatures.sudden += f.motionPatterns.sudden
                avgFeatures.gradual += f.motionPatterns.gradual
                avgFeatures.periodic += f.motionPatterns.periodic
                avgFeatures.random += f.motionPatterns.random
            }
            
            const count = samples.length
            for (const key in avgFeatures) {
                avgFeatures[key] /= count
            }
            
            patterns[activity] = avgFeatures
        }
        
        this.knowledge.patterns = patterns
    },
    
    // ==================== UNDERSTAND ====================
    understand: function(videoBase64, options) {
        options = options || {}
        const sensitivity = options.sensitivity || this.settings.sensitivity
        
        if (!_isString(videoBase64)) {
            return Promise.resolve({ error: 'Video must be a base64 string' })
        }
        
        return new Promise(function(resolve, reject) {
            VideoUnderstanding.extractActivityFeatures(videoBase64).then(function(features) {
                const recognition = VideoUnderstanding._recognize(features, sensitivity)
                
                resolve({
                    classification: recognition.classification,
                    confidence: recognition.confidence,
                    score: recognition.score,
                    features: features,
                    activity: features.activity,
                    activities: features.activities,
                    motionPatterns: features.motionPatterns,
                    hasMotion: features.hasMotion,
                    isStatic: features.isStatic,
                    isDynamic: features.isDynamic,
                    avgMotion: features.avgMotion,
                    maxMotion: features.maxMotion,
                    duration: features.duration,
                    categories: recognition.categories,
                    topMatches: recognition.topMatches
                })
            }).catch(reject)
        })
    },
    
    _recognize: function(features, sensitivity) {
        const categories = {}
        let totalWeight = 0
        
        for (const [activity, pattern] of Object.entries(this.knowledge.patterns)) {
            let similarity = 0
            let weights = 0
            
            // Compare avg motion
            const avgDiff = Math.abs(features.avgMotion - pattern.avgMotion)
            similarity += 1 / (1 + avgDiff / 10)
            weights += 1
            
            // Compare max motion
            const maxDiff = Math.abs(features.maxMotion - pattern.maxMotion)
            similarity += 1 / (1 + maxDiff / 10)
            weights += 1
            
            // Compare motion variance
            const varDiff = Math.abs(features.motionVariance - pattern.motionVariance)
            similarity += 1 / (1 + varDiff / 100)
            weights += 1
            
            // Compare patterns
            const suddenDiff = Math.abs(features.motionPatterns.sudden - pattern.sudden)
            similarity += 1 / (1 + suddenDiff)
            weights += 1
            
            const periodicDiff = Math.abs(features.motionPatterns.periodic - pattern.periodic)
            similarity += 1 / (1 + periodicDiff)
            weights += 1
            
            categories[activity] = similarity / weights
            totalWeight += categories[activity]
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
        
        const isMatch = bestScore >= sensitivity
        
        const topMatches = Object.entries(categories)
            .sort(function(a, b) { return b[1] - a[1] })
            .slice(0, 5)
            .map(function(item) {
                return { activity: item[0], confidence: item[1] }
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
    
    // ==================== DETECT MOTION EVENTS ====================
    detectMotionEvents: function(videoBase64, threshold) {
        threshold = threshold || 20
        
        return new Promise(function(resolve, reject) {
            _base64ToVideo(videoBase64).then(function(videoInfo) {
                const video = videoInfo.video
                const duration = videoInfo.duration
                const events = []
                let prevFrame = null
                
                const totalFrames = Math.min(Math.floor(duration / 0.2), 50)
                
                function captureNextFrame(index) {
                    if (index >= totalFrames) {
                        resolve({
                            events: events,
                            eventCount: events.length,
                            duration: duration
                        })
                        return
                    }
                    
                    const time = (index / totalFrames) * duration
                    _captureFrame(video, time).then(function(frame) {
                        if (prevFrame) {
                            const diff = _computeDifference(prevFrame, frame)
                            if (diff.avgDiff > threshold) {
                                events.push({
                                    time: time,
                                    intensity: diff.avgDiff,
                                    type: 'motion',
                                    description: 'Motion detected at ' + time.toFixed(2) + 's'
                                })
                            }
                        }
                        prevFrame = frame
                        captureNextFrame(index + 1)
                    }).catch(reject)
                }
                
                captureNextFrame(0)
            }).catch(reject)
        })
    },
    
    // ==================== BATCH PROCESSING ====================
    understandBatch: function(videos, options) {
        if (!_isArray(videos)) throw new Error('Input must be an array of video base64 strings')
        
        return Promise.all(videos.map(function(video) {
            return this.understand(video, options)
        }.bind(this)))
    },
    
    // ==================== GET KNOWLEDGE ====================
    getKnowledge: function() {
        return {
            activities: Object.keys(this.knowledge.activities).reduce(function(acc, key) {
                acc[key] = this.knowledge.activities[key].length
                return acc
            }.bind(this), {}),
            patterns: Object.keys(this.knowledge.patterns).length,
            totalSamples: Object.values(this.knowledge.activities)
                .reduce(function(a, b) { return a + b.length }, 0)
        }
    },
    
    // ==================== CLEAR KNOWLEDGE ====================
    clearKnowledge: function() {
        this.knowledge = {
            activities: {},
            patterns: {},
            motionTemplates: {}
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
    },
    
    setFrameInterval: function(value) {
        if (!_isNumber(value) || value < 0.1) {
            throw new Error('Frame interval must be >= 0.1')
        }
        this.settings.frameInterval = value
        return { success: true, frameInterval: value }
    }
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.VideoUnderstanding = VideoUnderstanding
}

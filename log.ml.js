// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isFunction(f) { return typeof f === 'function' }

function _clone(obj) { return JSON.parse(JSON.stringify(obj)) }

function _cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0
    let dot = 0, normA = 0, normB = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }
    if (normA === 0 || normB === 0) return 0
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function _euclideanDistance(a, b) {
    if (a.length !== b.length) return Infinity
    let sum = 0
    for (let i = 0; i < a.length; i++) {
        sum += (a[i] - b[i]) * (a[i] - b[i])
    }
    return Math.sqrt(sum)
}

function _normalizeVector(vec) {
    const max = Math.max(...vec.map(Math.abs))
    if (max === 0) return vec
    return vec.map(function(v) { return v / max })
}

function _extractPatternFeatures(data, type) {
    const features = {
        type: type,
        length: 0,
        values: [],
        stats: {},
        patterns: {},
        transitions: {},
        sequence: []
    }
    
    if (type === 'text') {
        const tokens = data.split(/\s+/)
        features.length = tokens.length
        features.values = tokens
        features.sequence = tokens
        
        // Word frequency patterns
        const freq = {}
        for (const token of tokens) {
            freq[token] = (freq[token] || 0) + 1
        }
        features.stats.frequency = freq
        features.stats.uniqueCount = Object.keys(freq).length
        features.stats.repetitionRate = 1 - (features.stats.uniqueCount / tokens.length)
        
        // N-gram patterns (bigrams)
        const bigrams = {}
        for (let i = 0; i < tokens.length - 1; i++) {
            const bigram = tokens[i] + ' ' + tokens[i+1]
            bigrams[bigram] = (bigrams[bigram] || 0) + 1
        }
        features.patterns.bigrams = bigrams
        
        // Sentiment transition
        const sentimentWords = {
            positive: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'love'],
            negative: ['bad', 'terrible', 'awful', 'horrible', 'sad', 'hate', 'worst']
        }
        let currentSentiment = 0
        const sentimentSequence = []
        for (const token of tokens) {
            if (sentimentWords.positive.indexOf(token) !== -1) currentSentiment += 1
            if (sentimentWords.negative.indexOf(token) !== -1) currentSentiment -= 1
            sentimentSequence.push(currentSentiment)
        }
        features.patterns.sentiment = sentimentSequence
        features.stats.sentimentTrend = sentimentSequence.length > 0 ? 
            sentimentSequence[sentimentSequence.length - 1] - sentimentSequence[0] : 0
        
    } else if (type === 'image') {
        features.length = data.length || 1
        features.values = data
        
        // Color distribution patterns
        if (data.length > 0) {
            const avg = data.reduce(function(a, b) { return a + b }, 0) / data.length
            const variance = data.reduce(function(a, b) { return a + (b - avg) * (b - avg) }, 0) / data.length
            features.stats.mean = avg
            features.stats.variance = variance
            features.stats.stddev = Math.sqrt(variance)
            features.stats.min = Math.min(...data)
            features.stats.max = Math.max(...data)
            
            // Pattern detection: edges, brightness changes
            let changes = 0
            for (let i = 1; i < data.length; i++) {
                if (Math.abs(data[i] - data[i-1]) > 20) changes++
            }
            features.patterns.changes = changes
            features.patterns.changeRate = changes / data.length
            features.patterns.direction = data[data.length - 1] > data[0] ? 'increasing' : 'decreasing'
        }
        
    } else if (type === 'audio') {
        features.length = data.length || 1
        features.values = data
        
        if (data.length > 0) {
            const avg = data.reduce(function(a, b) { return a + b }, 0) / data.length
            const variance = data.reduce(function(a, b) { return a + (b - avg) * (b - avg) }, 0) / data.length
            features.stats.mean = avg
            features.stats.variance = variance
            features.stats.stddev = Math.sqrt(variance)
            features.stats.energy = data.reduce(function(a, b) { return a + b * b }, 0)
            
            // Zero crossing pattern
            let zeroCrossings = 0
            for (let i = 1; i < data.length; i++) {
                if (data[i] * data[i-1] < 0) zeroCrossings++
            }
            features.patterns.zeroCrossings = zeroCrossings
            features.patterns.zeroCrossingRate = zeroCrossings / data.length
            
            // Amplitude pattern
            const peaks = []
            for (let i = 1; i < data.length - 1; i++) {
                if (data[i] > data[i-1] && data[i] > data[i+1]) {
                    peaks.push(data[i])
                }
            }
            features.patterns.peaks = peaks.length
            features.patterns.peakDensity = peaks.length / data.length
            features.patterns.direction = data[data.length - 1] > data[0] ? 'increasing' : 'decreasing'
        }
        
    } else if (type === 'video') {
        features.length = data.length || 1
        features.values = data
        
        if (data.length > 0) {
            const avg = data.reduce(function(a, b) { return a + b }, 0) / data.length
            const variance = data.reduce(function(a, b) { return a + (b - avg) * (b - avg) }, 0) / data.length
            features.stats.mean = avg
            features.stats.variance = variance
            features.stats.stddev = Math.sqrt(variance)
            
            // Motion pattern
            let motionEvents = 0
            let motionIntensity = 0
            for (const val of data) {
                if (val > 20) motionEvents++
                motionIntensity += val
            }
            features.patterns.motionEvents = motionEvents
            features.patterns.motionDensity = motionEvents / data.length
            features.patterns.motionIntensity = motionIntensity / data.length
            
            // Activity pattern
            const highMotion = data.filter(function(v) { return v > 30 }).length
            const mediumMotion = data.filter(function(v) { return v > 15 && v <= 30 }).length
            const lowMotion = data.filter(function(v) { return v <= 15 }).length
            
            features.patterns.highMotion = highMotion / data.length
            features.patterns.mediumMotion = mediumMotion / data.length
            features.patterns.lowMotion = lowMotion / data.length
            features.patterns.direction = data[data.length - 1] > data[0] ? 'increasing' : 'decreasing'
        }
    }
    
    return features
}

// ==================== PATTERN DETECTION ENGINE ====================
var PatternDetection = {
    // Knowledge storage
    knowledge: {
        sequences: [],
        patterns: {},
        transitions: {},
        learnedPatterns: {}
    },
    
    // Settings
    settings: {
        sensitivity: 0.5,
        minConfidence: 0.3,
        sequenceLength: 10
    },
    
    // ==================== DETECT PATTERN ====================
    detectPattern: function(input, type, options) {
        options = options || {}
        const sensitivity = options.sensitivity || this.settings.sensitivity
        
        if (!_isArray(input) && !_isString(input) && !_isObject(input)) {
            return { error: 'Input must be an array, string, or object' }
        }
        
        // Extract features based on type
        let features
        if (type === 'text' && _isString(input)) {
            features = _extractPatternFeatures(input, 'text')
        } else if (type === 'image' && _isArray(input)) {
            features = _extractPatternFeatures(input, 'image')
        } else if (type === 'audio' && _isArray(input)) {
            features = _extractPatternFeatures(input, 'audio')
        } else if (type === 'video' && _isArray(input)) {
            features = _extractPatternFeatures(input, 'video')
        } else if (type === 'sequence' && _isArray(input)) {
            features = _extractPatternFeatures(input, 'sequence')
        } else {
            return { error: 'Invalid type or input format' }
        }
        
        // Detect patterns in the features
        const patterns = this._detectPatternsInFeatures(features, sensitivity)
        
        // Compare with known sequences
        const matches = this._compareWithKnowledge(features, sensitivity)
        
        // Detect transitions
        const transitions = this._detectTransitions(features)
        
        return {
            success: true,
            type: type,
            features: features,
            patterns: patterns,
            transitions: transitions,
            matches: matches,
            isPattern: patterns.found,
            patternType: patterns.type,
            patternConfidence: patterns.confidence,
            sequence: features.sequence || features.values,
            direction: features.stats.direction || 'none'
        }
    },
    
    _detectPatternsInFeatures: function(features, sensitivity) {
        const patterns = {
            found: false,
            type: 'none',
            confidence: 0,
            details: {}
        }
        
        // Detect repetition pattern
        if (features.stats.repetitionRate && features.stats.repetitionRate > 0.3) {
            patterns.found = true
            patterns.type = 'repetition'
            patterns.confidence = Math.min(features.stats.repetitionRate, 1)
            patterns.details.repetitionRate = features.stats.repetitionRate
            patterns.details.uniqueCount = features.stats.uniqueCount
        }
        
        // Detect trend pattern
        if (features.stats.sentimentTrend !== undefined) {
            const trend = features.stats.sentimentTrend
            if (Math.abs(trend) > 2) {
                patterns.found = true
                patterns.type = trend > 0 ? 'positive_trend' : 'negative_trend'
                patterns.confidence = Math.min(Math.abs(trend) / 10, 1)
                patterns.details.trend = trend
            }
        }
        
        // Detect directional pattern
        if (features.patterns.direction) {
            patterns.found = true
            patterns.type = features.patterns.direction + '_pattern'
            patterns.confidence = Math.min(Math.abs(features.stats.max - features.stats.min) / 100, 1)
            patterns.details.direction = features.patterns.direction
            patterns.details.change = features.stats.max - features.stats.min
        }
        
        // Detect motion pattern (video)
        if (features.patterns.motionDensity !== undefined) {
            if (features.patterns.motionDensity > 0.5) {
                patterns.found = true
                patterns.type = 'high_motion'
                patterns.confidence = features.patterns.motionDensity
                patterns.details.motionDensity = features.patterns.motionDensity
            } else if (features.patterns.motionDensity > 0.2) {
                patterns.found = true
                patterns.type = 'medium_motion'
                patterns.confidence = features.patterns.motionDensity
                patterns.details.motionDensity = features.patterns.motionDensity
            }
        }
        
        // Detect audio pattern
        if (features.patterns.zeroCrossingRate !== undefined) {
            if (features.patterns.zeroCrossingRate > 0.1) {
                patterns.found = true
                patterns.type = 'high_frequency'
                patterns.confidence = Math.min(features.patterns.zeroCrossingRate * 10, 1)
                patterns.details.zeroCrossingRate = features.patterns.zeroCrossingRate
            } else if (features.patterns.peakDensity > 0.05) {
                patterns.found = true
                patterns.type = 'rhythmic'
                patterns.confidence = Math.min(features.patterns.peakDensity * 20, 1)
                patterns.details.peakDensity = features.patterns.peakDensity
            }
        }
        
        // Detect change pattern
        if (features.patterns.changeRate !== undefined && features.patterns.changeRate > 0.2) {
            patterns.found = true
            patterns.type = 'rapid_change'
            patterns.confidence = Math.min(features.patterns.changeRate * 2, 1)
            patterns.details.changeRate = features.patterns.changeRate
        }
        
        return patterns
    },
    
    _compareWithKnowledge: function(features, sensitivity) {
        const matches = []
        
        for (const sequence of this.knowledge.sequences) {
            let similarity = 0
            
            // Compare based on type
            if (sequence.type === features.type) {
                if (sequence.type === 'text') {
                    similarity = this._compareTextSequences(sequence.features, features)
                } else if (sequence.type === 'image' || sequence.type === 'audio' || sequence.type === 'video') {
                    similarity = this._compareNumericSequences(sequence.features, features)
                }
            }
            
            if (similarity > sensitivity) {
                matches.push({
                    pattern: sequence.label || 'pattern_' + matches.length,
                    similarity: similarity,
                    confidence: similarity,
                    features: sequence.features
                })
            }
        }
        
        // Sort by similarity
        matches.sort(function(a, b) { return b.similarity - a.similarity })
        
        return matches
    },
    
    _compareTextSequences: function(a, b) {
        const tokensA = a.values || []
        const tokensB = b.values || []
        
        if (tokensA.length === 0 || tokensB.length === 0) return 0
        
        // Jaccard similarity
        const setA = new Set(tokensA)
        const setB = new Set(tokensB)
        const intersection = new Set([...setA].filter(function(x) { return setB.has(x) }))
        const union = new Set([...setA, ...setB])
        return intersection.size / union.size
    },
    
    _compareNumericSequences: function(a, b) {
        const vecA = a.values || []
        const vecB = b.values || []
        
        if (vecA.length === 0 || vecB.length === 0) return 0
        
        // Normalize
        const normA = _normalizeVector(vecA)
        const normB = _normalizeVector(vecB)
        
        // Trim to same length
        const minLen = Math.min(normA.length, normB.length)
        const trimmedA = normA.slice(0, minLen)
        const trimmedB = normB.slice(0, minLen)
        
        // Cosine similarity
        return _cosineSimilarity(trimmedA, trimmedB)
    },
    
    _detectTransitions: function(features) {
        const transitions = {
            found: false,
            from: null,
            to: null,
            type: 'none',
            confidence: 0
        }
        
        const values = features.values || []
        if (values.length < 2) return transitions
        
        // Detect transition in values
        const first = values[0]
        const last = values[values.length - 1]
        
        if (typeof first === 'number' && typeof last === 'number') {
            const diff = last - first
            if (Math.abs(diff) > 0.1) {
                transitions.found = true
                transitions.from = first
                transitions.to = last
                transitions.type = diff > 0 ? 'increase' : 'decrease'
                transitions.confidence = Math.min(Math.abs(diff) / 100, 1)
                transitions.percentage = ((diff / first) * 100).toFixed(2) + '%'
            }
        } else if (typeof first === 'string' && typeof last === 'string') {
            if (first !== last) {
                transitions.found = true
                transitions.from = first
                transitions.to = last
                transitions.type = 'change'
                transitions.confidence = 0.8
            }
        }
        
        // Detect sentiment transition
        if (features.patterns.sentiment) {
            const sent = features.patterns.sentiment
            if (sent.length > 1) {
                const fromSent = sent[0]
                const toSent = sent[sent.length - 1]
                if (fromSent !== toSent) {
                    transitions.found = true
                    transitions.from = fromSent > 0 ? 'positive' : 'negative'
                    transitions.to = toSent > 0 ? 'positive' : 'negative'
                    transitions.type = 'sentiment_change'
                    transitions.confidence = Math.min(Math.abs(toSent - fromSent) / 10, 1)
                }
            }
        }
        
        return transitions
    },
    
    // ==================== LEARN PATTERN ====================
    learn: function(input, label, type) {
        if (!_isArray(input) && !_isString(input)) {
            throw new Error('Input must be an array or string')
        }
        
        if (!_isString(label)) {
            throw new Error('Label must be a string')
        }
        
        // Extract features based on type
        let features
        if (type === 'text' && _isString(input)) {
            features = _extractPatternFeatures(input, 'text')
        } else if (type === 'image' && _isArray(input)) {
            features = _extractPatternFeatures(input, 'image')
        } else if (type === 'audio' && _isArray(input)) {
            features = _extractPatternFeatures(input, 'audio')
        } else if (type === 'video' && _isArray(input)) {
            features = _extractPatternFeatures(input, 'video')
        } else if (type === 'sequence' && _isArray(input)) {
            features = _extractPatternFeatures(input, 'sequence')
        } else {
            throw new Error('Invalid type or input format')
        }
        
        // Store in knowledge
        this.knowledge.sequences.push({
            label: label,
            type: type,
            features: features,
            raw: input,
            timestamp: Date.now()
        })
        
        // Extract and store patterns
        const patterns = this._detectPatternsInFeatures(features, this.settings.sensitivity)
        if (patterns.found) {
            if (!this.knowledge.learnedPatterns[patterns.type]) {
                this.knowledge.learnedPatterns[patterns.type] = []
            }
            this.knowledge.learnedPatterns[patterns.type].push({
                label: label,
                confidence: patterns.confidence,
                details: patterns.details
            })
        }
        
        return {
            success: true,
            label: label,
            type: type,
            patterns: patterns,
            totalSequences: this.knowledge.sequences.length
        }
    },
    
    // ==================== LEARN SEQUENCE ====================
    learnSequence: function(sequence, label) {
        if (!_isArray(sequence)) {
            throw new Error('Sequence must be an array')
        }
        
        return this.learn(sequence, label, 'sequence')
    },
    
    learnText: function(text, label) {
        if (!_isString(text)) {
            throw new Error('Text must be a string')
        }
        return this.learn(text, label, 'text')
    },
    
    learnImage: function(data, label) {
        if (!_isArray(data)) {
            throw new Error('Image data must be an array')
        }
        return this.learn(data, label, 'image')
    },
    
    learnAudio: function(data, label) {
        if (!_isArray(data)) {
            throw new Error('Audio data must be an array')
        }
        return this.learn(data, label, 'audio')
    },
    
    learnVideo: function(data, label) {
        if (!_isArray(data)) {
            throw new Error('Video data must be an array')
        }
        return this.learn(data, label, 'video')
    },
    
    // ==================== DETECT SEQUENCE ====================
    detectSequence: function(input, type) {
        return this.detectPattern(input, type)
    },
    
    // ==================== COMPARE SEQUENCES ====================
    compareSequences: function(seq1, seq2, type) {
        let features1, features2
        
        if (type === 'text' && _isString(seq1) && _isString(seq2)) {
            features1 = _extractPatternFeatures(seq1, 'text')
            features2 = _extractPatternFeatures(seq2, 'text')
        } else if (_isArray(seq1) && _isArray(seq2)) {
            features1 = _extractPatternFeatures(seq1, type || 'sequence')
            features2 = _extractPatternFeatures(seq2, type || 'sequence')
        } else {
            return { error: 'Invalid input types' }
        }
        
        // Compare features
        const similarity = this._compareNumericSequences(features1, features2)
        const patternSim = this._comparePatterns(features1, features2)
        
        return {
            similarity: similarity,
            patternSimilarity: patternSim,
            overallSimilarity: (similarity + patternSim) / 2,
            features1: features1,
            features2: features2,
            isSimilar: similarity > 0.5
        }
    },
    
    _comparePatterns: function(a, b) {
        let score = 0
        let weights = 0
        
        // Compare stats
        if (a.stats && b.stats) {
            if (a.stats.mean !== undefined && b.stats.mean !== undefined) {
                const meanDiff = Math.abs(a.stats.mean - b.stats.mean)
                score += 1 / (1 + meanDiff)
                weights += 1
            }
            if (a.stats.variance !== undefined && b.stats.variance !== undefined) {
                const varDiff = Math.abs(a.stats.variance - b.stats.variance)
                score += 1 / (1 + varDiff / 100)
                weights += 1
            }
        }
        
        // Compare patterns
        if (a.patterns && b.patterns) {
            if (a.patterns.direction && b.patterns.direction) {
                score += a.patterns.direction === b.patterns.direction ? 1 : 0
                weights += 1
            }
            if (a.patterns.changeRate !== undefined && b.patterns.changeRate !== undefined) {
                const rateDiff = Math.abs(a.patterns.changeRate - b.patterns.changeRate)
                score += 1 / (1 + rateDiff)
                weights += 1
            }
        }
        
        return weights > 0 ? score / weights : 0
    },
    
    // ==================== DETECT TRANSITION ====================
    detectTransition: function(sequence1, sequence2, type) {
        // Analyze first sequence
        const feats1 = this.detectPattern(sequence1, type)
        const feats2 = this.detectPattern(sequence2, type)
        
        if (feats1.error || feats2.error) {
            return { error: 'Invalid sequences' }
        }
        
        const transitions = {
            from: {
                type: feats1.patternType || 'unknown',
                confidence: feats1.patternConfidence || 0,
                features: feats1.features
            },
            to: {
                type: feats2.patternType || 'unknown',
                confidence: feats2.patternConfidence || 0,
                features: feats2.features
            },
            transition: {
                type: 'change',
                confidence: 0,
                description: ''
            }
        }
        
        // Detect what changed
        const changes = []
        if (feats1.features && feats2.features) {
            const f1 = feats1.features
            const f2 = feats2.features
            
            if (f1.stats && f2.stats) {
                if (f1.stats.mean !== undefined && f2.stats.mean !== undefined) {
                    const diff = Math.abs(f1.stats.mean - f2.stats.mean)
                    if (diff > 0.1) {
                        changes.push('mean changed from ' + f1.stats.mean.toFixed(2) + ' to ' + f2.stats.mean.toFixed(2))
                        transitions.transition.confidence = Math.min(diff, 1)
                    }
                }
                if (f1.stats.variance !== undefined && f2.stats.variance !== undefined) {
                    const diff = Math.abs(f1.stats.variance - f2.stats.variance)
                    if (diff > 0.1) {
                        changes.push('variance changed from ' + f1.stats.variance.toFixed(2) + ' to ' + f2.stats.variance.toFixed(2))
                        transitions.transition.confidence = Math.max(transitions.transition.confidence, Math.min(diff / 100, 1))
                    }
                }
            }
            
            if (f1.patterns && f2.patterns) {
                if (f1.patterns.direction && f2.patterns.direction && f1.patterns.direction !== f2.patterns.direction) {
                    changes.push('direction changed from ' + f1.patterns.direction + ' to ' + f2.patterns.direction)
                    transitions.transition.confidence = Math.max(transitions.transition.confidence, 0.8)
                }
                if (f1.patterns.motionDensity !== undefined && f2.patterns.motionDensity !== undefined) {
                    const diff = Math.abs(f1.patterns.motionDensity - f2.patterns.motionDensity)
                    if (diff > 0.1) {
                        changes.push('motion density changed from ' + f1.patterns.motionDensity.toFixed(2) + ' to ' + f2.patterns.motionDensity.toFixed(2))
                        transitions.transition.confidence = Math.max(transitions.transition.confidence, Math.min(diff * 2, 1))
                    }
                }
            }
            
            // Pattern type change
            if (feats1.patternType !== feats2.patternType) {
                changes.push('pattern changed from ' + feats1.patternType + ' to ' + feats2.patternType)
                transitions.transition.confidence = Math.max(transitions.transition.confidence, 0.9)
            }
        }
        
        transitions.transition.description = changes.join('; ')
        transitions.transition.type = changes.length > 0 ? 'significant_change' : 'no_significant_change'
        
        return transitions
    },
    
    // ==================== GET KNOWLEDGE ====================
    getKnowledge: function() {
        return {
            totalSequences: this.knowledge.sequences.length,
            sequences: this.knowledge.sequences.map(function(s) {
                return { label: s.label, type: s.type, timestamp: s.timestamp }
            }),
            patterns: this.knowledge.learnedPatterns,
            patternTypes: Object.keys(this.knowledge.learnedPatterns)
        }
    },
    
    // ==================== CLEAR KNOWLEDGE ====================
    clearKnowledge: function() {
        this.knowledge = {
            sequences: [],
            patterns: {},
            transitions: {},
            learnedPatterns: {}
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
    
    // ==================== EXTRACT PATTERN FEATURES ====================
    extractFeatures: function(input, type) {
        return _extractPatternFeatures(input, type)
    }
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.PatternDetection = PatternDetection
}
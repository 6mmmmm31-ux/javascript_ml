// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }

function _cleanText(text) {
    if (!_isString(text)) return ''
    text = text.toLowerCase()
    text = text.replace(/[^a-zآ-ی0-9\s\.\,\!\?\-\:\;]/g, ' ')
    text = text.replace(/\s+/g, ' ').trim()
    return text
}

function _tokenize(text) {
    if (!_isString(text)) return []
    return _cleanText(text).split(/\s+/)
}

function _normalizeWord(word) {
    return word.toLowerCase().trim()
}

function _levenshteinDistance(a, b) {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length
    const matrix = []
    for (let i = 0; i <= b.length; i++) matrix[i] = [i]
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i-1] === a[j-1]) {
                matrix[i][j] = matrix[i-1][j-1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1
                )
            }
        }
    }
    return matrix[b.length][a.length]
}

// ==================== FEATURE EXTRACTION ====================
function extractTextFeatures(text) {
    const tokens = _tokenize(text)
    const features = {
        tokens: tokens,
        tokenCount: tokens.length,
        uniqueTokens: [...new Set(tokens)],
        uniqueCount: new Set(tokens).size,
        avgWordLength: tokens.length > 0 ? tokens.reduce((a, b) => a + b.length, 0) / tokens.length : 0,
        wordFrequency: {}
    }
    
    for (const token of tokens) {
        features.wordFrequency[token] = (features.wordFrequency[token] || 0) + 1
    }
    
    const textStr = text
    features.charCount = textStr.length
    features.digitCount = (textStr.match(/\d/g) || []).length
    features.punctuationCount = (textStr.match(/[\.\,\!\?\-\:\;\"\'\`\(\)\[\]\{\}]/g) || []).length
    features.upperCount = (textStr.match(/[A-Z]/g) || []).length
    features.lowerCount = (textStr.match(/[a-z]/g) || []).length
    features.spaceCount = (textStr.match(/\s/g) || []).length
    
    const persianChars = (textStr.match(/[آ-ی]/g) || []).length
    const englishChars = (textStr.match(/[a-zA-Z]/g) || []).length
    features.language = persianChars > englishChars ? 'persian' : 'english'
    features.persianRatio = persianChars / (textStr.length || 1)
    features.englishRatio = englishChars / (textStr.length || 1)
    
    features.exclamationCount = (textStr.match(/\!/g) || []).length
    features.questionCount = (textStr.match(/\?/g) || []).length
    
    return features
}

// ==================== TEXT UNDERSTANDING ENGINE ====================
var TextUnderstanding = {
    // Knowledge storage
    knowledge: {
        positive: [],
        negative: [],
        neutral: [],
        categories: {},
        patterns: {},
        rules: []
    },
    
    // Settings
    settings: {
        sensitivity: 0.5,
        learningRate: 0.1,
        minConfidence: 0.3
    },
    
    // ==================== LEARNING FUNCTIONS ====================
    learn: function(input) {
        if (!_isObject(input)) {
            throw new Error('Input must be an object with text-label pairs')
        }
        
        for (const [text, label] of Object.entries(input)) {
            if (!_isString(text) || !_isString(label)) continue
            
            const cleaned = _cleanText(text)
            const tokens = _tokenize(cleaned)
            
            // Store in knowledge
            if (label === 'positive') {
                this.knowledge.positive.push({ text: cleaned, tokens: tokens, original: text })
            } else if (label === 'negative') {
                this.knowledge.negative.push({ text: cleaned, tokens: tokens, original: text })
            } else if (label === 'neutral') {
                this.knowledge.neutral.push({ text: cleaned, tokens: tokens, original: text })
            } else {
                if (!this.knowledge.categories[label]) {
                    this.knowledge.categories[label] = []
                }
                this.knowledge.categories[label].push({ text: cleaned, tokens: tokens, original: text })
            }
        }
        
        // Extract patterns
        this._extractPatterns()
        
        return {
            success: true,
            learned: Object.keys(input).length,
            knowledge: {
                positive: this.knowledge.positive.length,
                negative: this.knowledge.negative.length,
                neutral: this.knowledge.neutral.length,
                categories: Object.keys(this.knowledge.categories).map(function(c) {
                    return c + ': ' + this.knowledge.categories[c].length
                }.bind(this))
            }
        }
    },
    
    // ==================== PATTERN EXTRACTION ====================
    _extractPatterns: function() {
        const allPatterns = {}
        
        // Extract patterns from positive texts
        for (const item of this.knowledge.positive) {
            const tokens = item.tokens
            for (let i = 0; i < tokens.length - 1; i++) {
                const pattern = tokens[i] + ' ' + tokens[i+1]
                allPatterns[pattern] = (allPatterns[pattern] || 0) + 1
            }
        }
        
        // Extract patterns from negative texts
        for (const item of this.knowledge.negative) {
            const tokens = item.tokens
            for (let i = 0; i < tokens.length - 1; i++) {
                const pattern = tokens[i] + ' ' + tokens[i+1]
                allPatterns[pattern] = (allPatterns[pattern] || 0) - 1
            }
        }
        
        this.knowledge.patterns = allPatterns
    },
    
    // ==================== UNDERSTAND FUNCTION ====================
    understand: function(text, options) {
        options = options || {}
        const sensitivity = options.sensitivity || this.settings.sensitivity
        
        if (!_isString(text)) {
            return { error: 'Text must be a string' }
        }
        
        const cleaned = _cleanText(text)
        const tokens = _tokenize(cleaned)
        
        // Extract features
        const features = extractTextFeatures(text)
        
        // Sentiment analysis
        const sentiment = this._analyzeSentiment(tokens)
        
        // Category detection
        const category = this._detectCategory(tokens)
        
        // Pattern matching
        const patterns = this._matchPatterns(tokens)
        
        // Calculate confidence
        const confidence = this._calculateConfidence(sentiment, category, patterns)
        
        // Intent detection
        const intent = this._detectIntent(tokens)
        
        // Extract entities
        const entities = this._extractEntities(tokens)
        
        // Main classification
        let classification = 'neutral'
        let score = 0
        
        if (sentiment.score > sensitivity) {
            classification = 'positive'
            score = sentiment.score
        } else if (sentiment.score < -sensitivity) {
            classification = 'negative'
            score = -sentiment.score
        } else if (category.category && category.confidence > sensitivity) {
            classification = category.category
            score = category.confidence
        }
        
        return {
            classification: classification,
            confidence: confidence,
            score: score,
            sentiment: sentiment,
            category: category,
            patterns: patterns,
            intent: intent,
            entities: entities,
            features: features,
            tokens: tokens,
            cleanedText: cleaned,
            originalText: text,
            isPositive: classification === 'positive',
            isNegative: classification === 'negative',
            isNeutral: classification === 'neutral'
        }
    },
    
    // ==================== SENTIMENT ANALYSIS ====================
    _analyzeSentiment: function(tokens) {
        let positiveScore = 0
        let negativeScore = 0
        let totalWeight = 0
        
        const positiveWords = new Set()
        const negativeWords = new Set()
        
        // Extract word scores from knowledge
        for (const item of this.knowledge.positive) {
            for (const token of item.tokens) {
                positiveWords.add(token)
            }
        }
        
        for (const item of this.knowledge.negative) {
            for (const token of item.tokens) {
                negativeWords.add(token)
            }
        }
        
        for (const token of tokens) {
            if (positiveWords.has(token)) {
                positiveScore += 1
                totalWeight += 1
            } else if (negativeWords.has(token)) {
                negativeScore += 1
                totalWeight += 1
            }
        }
        
        const score = totalWeight > 0 ? (positiveScore - negativeScore) / totalWeight : 0
        
        // Check negation
        let negationActive = false
        let adjustedScore = 0
        let adjustedWeight = 0
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i]
            if (token === 'not' || token === 'never' || token === 'no') {
                negationActive = !negationActive
                continue
            }
            
            let wordScore = 0
            if (positiveWords.has(token)) wordScore = 1
            else if (negativeWords.has(token)) wordScore = -1
            
            if (negationActive) wordScore = -wordScore
            
            adjustedScore += wordScore
            if (wordScore !== 0) adjustedWeight++
        }
        
        const finalScore = adjustedWeight > 0 ? adjustedScore / adjustedWeight : 0
        
        return {
            score: finalScore,
            normalizedScore: Math.max(-1, Math.min(1, finalScore)),
            positiveWords: tokens.filter(function(t) { return positiveWords.has(t) }),
            negativeWords: tokens.filter(function(t) { return negativeWords.has(t) }),
            positiveCount: tokens.filter(function(t) { return positiveWords.has(t) }).length,
            negativeCount: tokens.filter(function(t) { return negativeWords.has(t) }).length,
            sentiment: finalScore > 0.1 ? 'positive' : (finalScore < -0.1 ? 'negative' : 'neutral')
        }
    },
    
    // ==================== CATEGORY DETECTION ====================
    _detectCategory: function(tokens) {
        const categories = Object.keys(this.knowledge.categories)
        const scores = {}
        
        for (const category of categories) {
            let score = 0
            const samples = this.knowledge.categories[category]
            
            for (const sample of samples) {
                const sampleTokens = sample.tokens
                let matchCount = 0
                
                for (const token of tokens) {
                    if (sampleTokens.indexOf(token) !== -1) {
                        matchCount++
                    }
                }
                
                const similarity = matchCount / (tokens.length + sampleTokens.length - matchCount || 1)
                score = Math.max(score, similarity)
            }
            
            scores[category] = score
        }
        
        let bestCategory = 'unknown'
        let bestScore = 0
        
        for (const [category, score] of Object.entries(scores)) {
            if (score > bestScore) {
                bestScore = score
                bestCategory = category
            }
        }
        
        return {
            category: bestCategory,
            confidence: bestScore,
            allScores: scores
        }
    },
    
    // ==================== PATTERN MATCHING ====================
    _matchPatterns: function(tokens) {
        const matches = {}
        let totalWeight = 0
        
        for (let i = 0; i < tokens.length - 1; i++) {
            const pattern = tokens[i] + ' ' + tokens[i+1]
            if (pattern in this.knowledge.patterns) {
                const weight = this.knowledge.patterns[pattern]
                matches[pattern] = weight
                totalWeight += Math.abs(weight)
            }
        }
        
        const sentiment = totalWeight > 0 ? 
            Object.values(matches).reduce(function(a, b) { return a + b }, 0) / totalWeight : 0
        
        return {
            matches: matches,
            totalWeight: totalWeight,
            sentiment: sentiment,
            count: Object.keys(matches).length
        }
    },
    
    // ==================== CONFIDENCE CALCULATION ====================
    _calculateConfidence: function(sentiment, category, patterns) {
        let confidence = 0
        let weights = 0
        
        // Sentiment confidence
        const sentConf = Math.abs(sentiment.score)
        confidence += sentConf * 0.5
        weights += 0.5
        
        // Category confidence
        const catConf = category.confidence
        confidence += catConf * 0.3
        weights += 0.3
        
        // Pattern confidence
        const patConf = patterns.count > 0 ? Math.abs(patterns.sentiment) : 0
        confidence += patConf * 0.2
        weights += 0.2
        
        return weights > 0 ? confidence / weights : 0
    },
    
    // ==================== INTENT DETECTION ====================
    _detectIntent: function(tokens) {
        const intents = {
            question: ['what', 'who', 'where', 'when', 'why', 'how', 'چه', 'چرا', 'کی', 'کجا', 'چگونه'],
            command: ['please', 'do', 'make', 'create', 'help', 'لطفا', 'انجام', 'ساخت', 'کمک'],
            opinion: ['think', 'believe', 'feel', 'opinion', 'فکر', 'باور', 'احساس', 'نظر'],
            greeting: ['hello', 'hi', 'hey', 'سلام', 'درود', 'خوش'],
            farewell: ['bye', 'goodbye', 'farewell', 'خداحافظ', 'بدرود']
        }
        
        const scores = {}
        for (const [intent, words] of Object.entries(intents)) {
            let score = 0
            for (const word of words) {
                if (tokens.indexOf(word) !== -1) {
                    score += 1
                }
            }
            scores[intent] = tokens.length > 0 ? score / tokens.length : 0
        }
        
        let bestIntent = 'unknown'
        let bestScore = 0
        
        for (const [intent, score] of Object.entries(scores)) {
            if (score > bestScore) {
                bestScore = score
                bestIntent = intent
            }
        }
        
        return {
            intent: bestIntent,
            confidence: bestScore,
            scores: scores
        }
    },
    
    // ==================== ENTITY EXTRACTION ====================
    _extractEntities: function(tokens) {
        const entities = {
            numbers: [],
            emails: [],
            urls: [],
            hashtags: [],
            mentions: []
        }
        
        for (const token of tokens) {
            // Numbers
            if (!isNaN(parseFloat(token)) && isFinite(token)) {
                entities.numbers.push(parseFloat(token))
            }
            
            // Email
            if (token.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
                entities.emails.push(token)
            }
            
            // URL
            if (token.match(/https?:\/\/[^\s]+/)) {
                entities.urls.push(token)
            }
            
            // Hashtag
            if (token.startsWith('#')) {
                entities.hashtags.push(token)
            }
            
            // Mention
            if (token.startsWith('@')) {
                entities.mentions.push(token)
            }
        }
        
        return entities
    },
    
    // ==================== BATCH PROCESSING ====================
    understandBatch: function(texts, options) {
        if (!_isArray(texts)) throw new Error('Input must be an array of texts')
        return texts.map(function(text) {
            return this.understand(text, options)
        }.bind(this))
    },
    
    // ==================== SIMILARITY FUNCTIONS ====================
    similarity: function(text1, text2) {
        const tokens1 = _tokenize(text1)
        const tokens2 = _tokenize(text2)
        const set1 = new Set(tokens1)
        const set2 = new Set(tokens2)
        const intersection = new Set([...set1].filter(function(x) { return set2.has(x) }))
        const union = new Set([...set1, ...set2])
        return intersection.size / union.size
    },
    
    // ==================== KEYWORD EXTRACTION ====================
    extractKeywords: function(text, limit) {
        limit = limit || 5
        const tokens = _tokenize(text)
        const freq = {}
        const stopWords = new Set(['the', 'a', 'an', 'of', 'to', 'for', 'and', 'or', 'but', 'in', 'on', 'at', 
                                   'is', 'are', 'was', 'were', 'be', 'been', 'being'])
        
        for (const token of tokens) {
            if (!stopWords.has(token) && token.length > 2) {
                freq[token] = (freq[token] || 0) + 1
            }
        }
        
        const sorted = Object.entries(freq).sort(function(a, b) { return b[1] - a[1] })
        return sorted.slice(0, limit).map(function(item) { return { word: item[0], frequency: item[1] } })
    },
    
    // ==================== TEXT CLASSIFICATION ====================
    classify: function(text) {
        return this.understand(text)
    },
    
    // ==================== GET KNOWLEDGE ====================
    getKnowledge: function() {
        return {
            positive: this.knowledge.positive.length,
            negative: this.knowledge.negative.length,
            neutral: this.knowledge.neutral.length,
            categories: Object.keys(this.knowledge.categories).reduce(function(acc, key) {
                acc[key] = this.knowledge.categories[key].length
                return acc
            }.bind(this), {}),
            patterns: Object.keys(this.knowledge.patterns).length,
            totalSamples: this.knowledge.positive.length + this.knowledge.negative.length + 
                         this.knowledge.neutral.length + Object.values(this.knowledge.categories)
                         .reduce(function(a, b) { return a + b.length }, 0)
        }
    },
    
    // ==================== CLEAR KNOWLEDGE ====================
    clearKnowledge: function() {
        this.knowledge = {
            positive: [],
            negative: [],
            neutral: [],
            categories: {},
            patterns: {},
            rules: []
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
    
    // ==================== SENTENCE SIMILARITY ====================
    sentenceSimilarity: function(text1, text2) {
        const tokens1 = _tokenize(text1)
        const tokens2 = _tokenize(text2)
        
        // Cosine similarity
        const allWords = new Set([...tokens1, ...tokens2])
        const vector1 = {}
        const vector2 = {}
        
        for (const word of allWords) {
            vector1[word] = tokens1.filter(function(t) { return t === word }).length
            vector2[word] = tokens2.filter(function(t) { return t === word }).length
        }
        
        let dot = 0, norm1 = 0, norm2 = 0
        for (const word of allWords) {
            dot += vector1[word] * vector2[word]
            norm1 += vector1[word] * vector1[word]
            norm2 += vector2[word] * vector2[word]
        }
        
        if (norm1 === 0 || norm2 === 0) return 0
        return dot / (Math.sqrt(norm1) * Math.sqrt(norm2))
    },
    
    // ==================== TEXT SUMMARIZATION ====================
    summarize: function(text, sentences) {
        sentences = sentences || 3
        const lines = text.split(/[.!?]+/).filter(function(line) { return line.trim().length > 10 })
        const wordCount = {}
        const allWords = _tokenize(text)
        
        for (const word of allWords) {
            wordCount[word] = (wordCount[word] || 0) + 1
        }
        
        const scoredLines = lines.map(function(line) {
            const tokens = _tokenize(line)
            let score = 0
            for (const token of tokens) {
                score += wordCount[token] || 0
            }
            return { text: line.trim(), score: score / (tokens.length || 1) }
        })
        
        scoredLines.sort(function(a, b) { return b.score - a.score })
        return scoredLines.slice(0, sentences).map(function(item) { return item.text + '.' }).join(' ')
    },
    
    // ==================== LANGUAGE DETECTION ====================
    detectLanguage: function(text) {
        const cleaned = _cleanText(text)
        const persianChars = (cleaned.match(/[آ-ی]/g) || []).length
        const englishChars = (cleaned.match(/[a-zA-Z]/g) || []).length
        
        if (persianChars === 0 && englishChars === 0) return 'unknown'
        if (persianChars > englishChars) return 'persian'
        if (englishChars > persianChars) return 'english'
        return 'mixed'
    },
    
    // ==================== WORD FREQUENCY ====================
    wordFrequency: function(text) {
        const tokens = _tokenize(text)
        const freq = {}
        for (const token of tokens) {
            freq[token] = (freq[token] || 0) + 1
        }
        return Object.entries(freq).sort(function(a, b) { return b[1] - a[1] })
    }
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.TextUnderstanding = TextUnderstanding
}

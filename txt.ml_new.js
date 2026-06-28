// ============================================================
// TXT.ML_NEW.JS v1.0.0
// Complete Text Machine Learning Library
// 27+ Functions for Text Analysis, Understanding & Generation
// ============================================================

// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isFunction(f) { return typeof f === 'function' }

function _cleanText(text) {
    if (!_isString(text)) return ''
    text = text.toLowerCase()
    text = text.replace(/[^a-zآ-ی0-9\s\.\,\!\?\-\:\;\"\'\(\)\[\]\{\}]/g, ' ')
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

function _randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function _weightedRandom(weights) {
    const total = Object.values(weights).reduce(function(a, b) { return a + b }, 0)
    let rand = Math.random() * total
    for (const [key, weight] of Object.entries(weights)) {
        rand -= weight
        if (rand <= 0) return key
    }
    return Object.keys(weights)[0]
}

function _shuffleArray(arr) {
    const result = arr.slice()
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
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

// ==================== CORE CLASSES ====================

// Markov Chain
class _MarkovChain {
    constructor(order = 2) {
        this.order = order
        this.chain = {}
        this.starts = []
        this.ends = []
    }
    
    train(texts) {
        if (!_isArray(texts)) texts = [texts]
        
        for (const text of texts) {
            const tokens = _tokenize(text)
            if (tokens.length < this.order + 1) continue
            
            this.starts.push(tokens.slice(0, this.order).join(' '))
            this.ends.push(tokens[tokens.length - 1])
            
            for (let i = 0; i < tokens.length - this.order; i++) {
                const state = tokens.slice(i, i + this.order).join(' ')
                const next = tokens[i + this.order]
                
                if (!this.chain[state]) {
                    this.chain[state] = {}
                }
                this.chain[state][next] = (this.chain[state][next] || 0) + 1
            }
        }
        return this
    }
    
    generate(maxLength = 50) {
        if (this.starts.length === 0) return ''
        let current = _randomChoice(this.starts)
        const tokens = current.split(' ')
        let result = tokens.slice()
        
        for (let i = 0; i < maxLength; i++) {
            if (!this.chain[current]) break
            const next = _weightedRandom(this.chain[current])
            if (!next) break
            result.push(next)
            const nextTokens = result.slice(-this.order)
            current = nextTokens.join(' ')
            if (this.ends.indexOf(next) !== -1 && result.length > 10) break
        }
        return result.join(' ')
    }
    
    generateMultiple(count = 5, maxLength = 50) {
        const results = []
        for (let i = 0; i < count; i++) {
            results.push(this.generate(maxLength))
        }
        return results
    }
}

// N-Gram Model
class _NGramModel {
    constructor(n = 2) {
        this.n = n
        this.ngrams = {}
        this.starts = []
    }
    
    train(texts) {
        if (!_isArray(texts)) texts = [texts]
        for (const text of texts) {
            const tokens = _tokenize(text)
            if (tokens.length < this.n) continue
            for (let i = 0; i < tokens.length - this.n + 1; i++) {
                const ngram = tokens.slice(i, i + this.n).join(' ')
                this.ngrams[ngram] = (this.ngrams[ngram] || 0) + 1
            }
            for (let i = 0; i < tokens.length - 1; i++) {
                this.starts.push(tokens[i])
            }
        }
        return this
    }
    
    generate(maxLength = 20) {
        if (this.starts.length === 0) return ''
        let result = [_randomChoice(this.starts)]
        for (let i = 0; i < maxLength; i++) {
            const lastN = result.slice(-this.n + 1).join(' ')
            const candidates = {}
            for (const [ngram, count] of Object.entries(this.ngrams)) {
                const tokens = ngram.split(' ')
                const prefix = tokens.slice(0, -1).join(' ')
                if (prefix === lastN) {
                    const next = tokens[tokens.length - 1]
                    candidates[next] = (candidates[next] || 0) + count
                }
            }
            if (Object.keys(candidates).length === 0) break
            const next = _weightedRandom(candidates)
            result.push(next)
        }
        return result.join(' ')
    }
}

// Sentence Generator
class _SentenceGenerator {
    constructor() {
        this.templates = []
        this.words = {
            nouns: ['person', 'place', 'thing', 'idea', 'time', 'way', 'day', 'world', 'life', 'year'],
            verbs: ['run', 'think', 'speak', 'write', 'read', 'know', 'see', 'hear', 'feel', 'want'],
            adjectives: ['good', 'bad', 'big', 'small', 'new', 'old', 'young', 'beautiful', 'happy', 'sad'],
            adverbs: ['quickly', 'slowly', 'well', 'badly', 'very', 'really', 'quite', 'almost', 'just', 'now'],
            conjunctions: ['and', 'but', 'or', 'so', 'because', 'although', 'while', 'since', 'if', 'when'],
            prepositions: ['in', 'on', 'at', 'by', 'for', 'from', 'to', 'with', 'about', 'between'],
            determiners: ['the', 'a', 'an', 'this', 'that', 'these', 'those']
        }
        this.punctuation = ['.', '!', '?']
    }
    
    train(texts) {
        if (!_isArray(texts)) texts = [texts]
        for (const text of texts) {
            const sentences = text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 0 })
            for (const sentence of sentences) {
                const tokens = _tokenize(sentence)
                this.templates.push(tokens)
                for (const token of tokens) {
                    const word = token.toLowerCase()
                    if (this.words.nouns.indexOf(word) === -1 && word.length > 2) {
                        this.words.nouns.push(word)
                    }
                }
            }
        }
        return this
    }
    
    generate() {
        const templates = [
            function() {
                const noun1 = _randomChoice(this.words.nouns)
                const noun2 = _randomChoice(this.words.nouns)
                const adj = _randomChoice(this.words.adjectives)
                const verb = _randomChoice(this.words.verbs)
                return 'The ' + adj + ' ' + noun1 + ' ' + verb + ' the ' + noun2 + '.'
            }.bind(this),
            function() {
                const noun = _randomChoice(this.words.nouns)
                const verb = _randomChoice(this.words.verbs)
                const adv = _randomChoice(this.words.adverbs)
                return 'The ' + noun + ' ' + verb + ' ' + adv + '.'
            }.bind(this),
            function() {
                const noun1 = _randomChoice(this.words.nouns)
                const noun2 = _randomChoice(this.words.nouns)
                const adj1 = _randomChoice(this.words.adjectives)
                const adj2 = _randomChoice(this.words.adjectives)
                return 'The ' + adj1 + ' ' + noun1 + ' and the ' + adj2 + ' ' + noun2 + '.'
            }.bind(this)
        ]
        return _randomChoice(templates)()
    }
    
    generateMultiple(count = 5) {
        const results = []
        for (let i = 0; i < count; i++) {
            results.push(this.generate())
        }
        return results
    }
}

// ==================== MLTXT MAIN LIBRARY ====================
var MLTXT = {
    version: '1.0.0',
    
    // Models
    markov: null,
    ngram: null,
    sentenceGen: null,
    
    // Knowledge
    knowledge: {
        words: {},
        patterns: {},
        sentences: [],
        trained: false
    },
    
    // ==================== TRAINING FUNCTIONS ====================
    train: function(data, type) {
        if (_isString(data)) data = [data]
        if (!_isArray(data)) throw new Error('Data must be a string or array')
        
        type = type || 'all'
        
        // Initialize models
        if (!this.markov) this.markov = new _MarkovChain(2)
        if (!this.ngram) this.ngram = new _NGramModel(2)
        if (!this.sentenceGen) this.sentenceGen = new _SentenceGenerator()
        
        // Train
        if (type === 'markov' || type === 'all') {
            this.markov.train(data)
        }
        if (type === 'ngram' || type === 'all') {
            this.ngram.train(data)
        }
        if (type === 'sentence' || type === 'all') {
            this.sentenceGen.train(data)
        }
        
        // Store knowledge
        for (const text of data) {
            this.knowledge.sentences.push(text)
            const tokens = _tokenize(text)
            for (const token of tokens) {
                this.knowledge.words[token] = (this.knowledge.words[token] || 0) + 1
            }
        }
        this.knowledge.trained = true
        
        return {
            success: true,
            trained: data.length,
            type: type,
            totalWords: Object.keys(this.knowledge.words).length,
            totalSentences: this.knowledge.sentences.length
        }
    },
    
    // ==================== GENERATION FUNCTIONS ====================
    generate: function(options) {
        options = options || {}
        const method = options.method || 'markov'
        const count = options.count || 1
        const maxLength = options.maxLength || 50
        
        if (!this.knowledge.trained) {
            return { error: 'Model not trained. Use train() first.' }
        }
        
        let results = []
        
        if (method === 'markov' && this.markov) {
            if (count === 1) {
                return this.markov.generate(maxLength)
            }
            return this.markov.generateMultiple(count, maxLength)
        }
        
        if (method === 'ngram' && this.ngram) {
            results = []
            for (let i = 0; i < count; i++) {
                results.push(this.ngram.generate(maxLength))
            }
            return results
        }
        
        if (method === 'sentence' && this.sentenceGen) {
            if (count === 1) {
                return this.sentenceGen.generate()
            }
            return this.sentenceGen.generateMultiple(count)
        }
        
        if (method === 'random') {
            const methods = ['markov', 'ngram', 'sentence']
            const chosen = _randomChoice(methods)
            return this.generate({ method: chosen, count: count, maxLength: maxLength })
        }
        
        return { error: 'Invalid method. Use: markov, ngram, sentence, random' }
    },
    
    // ==================== TEXT ANALYSIS ====================
    analyze: function(text) {
        if (!_isString(text)) return { error: 'Text must be a string' }
        
        const cleaned = _cleanText(text)
        const tokens = _tokenize(cleaned)
        const words = tokens.filter(function(t) { return t.length > 0 })
        
        // Word frequency
        const freq = {}
        for (const word of words) {
            freq[word] = (freq[word] || 0) + 1
        }
        
        // Statistics
        const stats = {
            charCount: text.length,
            wordCount: words.length,
            uniqueWords: Object.keys(freq).length,
            sentences: text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 0 }).length,
            avgWordLength: words.length > 0 ? words.reduce(function(a, b) { return a + b.length }, 0) / words.length : 0,
            vocabularyRichness: words.length > 0 ? Object.keys(freq).length / words.length : 0,
            mostCommon: Object.entries(freq).sort(function(a, b) { return b[1] - a[1] }).slice(0, 10)
        }
        
        // Language detection
        const persian = (text.match(/[آ-ی]/g) || []).length
        const english = (text.match(/[a-zA-Z]/g) || []).length
        stats.language = persian > english ? 'persian' : (english > persian ? 'english' : 'mixed')
        stats.persianRatio = text.length > 0 ? persian / text.length : 0
        stats.englishRatio = text.length > 0 ? english / text.length : 0
        
        return {
            text: text,
            cleaned: cleaned,
            tokens: tokens,
            stats: stats,
            frequency: freq
        }
    },
    
    // ==================== SENTENCE ANALYSIS ====================
    sentenceAnalysis: function(text) {
        const tokens = _tokenize(text)
        const sentences = text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 0 })
        
        return {
            sentenceCount: sentences.length,
            avgSentenceLength: sentences.length > 0 ? 
                sentences.reduce(function(a, b) { return a + _tokenize(b).length }, 0) / sentences.length : 0,
            maxSentenceLength: sentences.length > 0 ? 
                Math.max.apply(null, sentences.map(function(s) { return _tokenize(s).length })) : 0,
            minSentenceLength: sentences.length > 0 ? 
                Math.min.apply(null, sentences.map(function(s) { return _tokenize(s).length })) : 0,
            sentences: sentences
        }
    },
    
    // ==================== SIMILARITY FUNCTIONS ====================
    similarity: function(text1, text2) {
        const t1 = _tokenize(text1)
        const t2 = _tokenize(text2)
        const set1 = new Set(t1)
        const set2 = new Set(t2)
        const intersection = new Set([...set1].filter(function(x) { return set2.has(x) }))
        const union = new Set([...set1, ...set2])
        return intersection.size / union.size
    },
    
    distance: function(text1, text2) {
        const t1 = _tokenize(text1)
        const t2 = _tokenize(text2)
        return _levenshteinDistance(t1.join(' '), t2.join(' '))
    },
    
    // ==================== KEYWORD EXTRACTION ====================
    keywords: function(text, limit) {
        limit = limit || 5
        const analysis = this.analyze(text)
        const stopWords = new Set(['the', 'a', 'an', 'of', 'to', 'for', 'and', 'or', 'but', 'in', 'on', 'at'])
        
        const filtered = Object.entries(analysis.frequency)
            .filter(function(item) { return !stopWords.has(item[0]) && item[0].length > 2 })
            .sort(function(a, b) { return b[1] - a[1] })
            .slice(0, limit)
        
        return filtered.map(function(item) {
            return { word: item[0], frequency: item[1] }
        })
    },
    
    // ==================== SENTIMENT ANALYSIS ====================
    sentiment: function(text) {
        const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'love', 'best', 'nice', 'awesome']
        const negative = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'hate', 'worst', 'poor', 'ugly', 'disgusting']
        
        const tokens = _tokenize(text)
        let score = 0
        let positiveCount = 0
        let negativeCount = 0
        
        for (const token of tokens) {
            if (positive.indexOf(token) !== -1) {
                score += 1
                positiveCount++
            }
            if (negative.indexOf(token) !== -1) {
                score -= 1
                negativeCount++
            }
        }
        
        const total = positiveCount + negativeCount
        const normalized = total > 0 ? score / total : 0
        const sentiment = normalized > 0.3 ? 'positive' : (normalized < -0.3 ? 'negative' : 'neutral')
        
        return {
            sentiment: sentiment,
            score: normalized,
            positiveCount: positiveCount,
            negativeCount: negativeCount,
            totalSentimentWords: total
        }
    },
    
    // ==================== TEXT CLASSIFICATION ====================
    classify: function(text, categories) {
        categories = categories || ['positive', 'negative', 'neutral']
        const results = {}
        
        for (const category of categories) {
            const similarity = this._categorySimilarity(text, category)
            results[category] = similarity
        }
        
        const best = Object.keys(results).reduce(function(a, b) {
            return results[a] > results[b] ? a : b
        })
        
        return {
            classification: best,
            confidence: results[best],
            scores: results
        }
    },
    
    _categorySimilarity: function(text, category) {
        // Simple category similarity based on known words
        const categoryWords = {
            positive: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'love', 'best', 'nice', 'awesome'],
            negative: ['bad', 'terrible', 'awful', 'horrible', 'sad', 'hate', 'worst', 'poor', 'ugly', 'disgusting'],
            neutral: ['okay', 'fine', 'alright', 'normal', 'regular', 'standard', 'common', 'usual', 'typical', 'ordinary']
        }
        
        const tokens = _tokenize(text)
        const words = categoryWords[category] || []
        let matches = 0
        for (const token of tokens) {
            if (words.indexOf(token) !== -1) matches++
        }
        return tokens.length > 0 ? matches / tokens.length : 0
    },
    
    // ==================== TEXT SUMMARIZATION ====================
    summarize: function(text, sentences) {
        sentences = sentences || 3
        const analysis = this.analyze(text)
        const sentenceList = text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 10 })
        
        const scored = sentenceList.map(function(s) {
            const tokens = _tokenize(s)
            let score = 0
            for (const token of tokens) {
                score += analysis.frequency[token] || 0
            }
            return { text: s.trim(), score: score / (tokens.length || 1) }
        })
        
        scored.sort(function(a, b) { return b.score - a.score })
        return scored.slice(0, sentences).map(function(item) { return item.text + '.' }).join(' ')
    },
    
    // ==================== TEXT COMPLETION ====================
    complete: function(text, maxLength) {
        maxLength = maxLength || 20
        if (!this.knowledge.trained) {
            return { error: 'Model not trained. Use train() first.' }
        }
        
        // Try to complete using Markov chain
        const tokens = _tokenize(text)
        if (tokens.length === 0) return { error: 'Empty text' }
        
        let result = text
        let current = tokens.slice(-2).join(' ')
        
        if (this.markov && this.markov.chain[current]) {
            for (let i = 0; i < maxLength; i++) {
                if (!this.markov.chain[current]) break
                const next = _weightedRandom(this.markov.chain[current])
                if (!next) break
                result += ' ' + next
                const newTokens = _tokenize(result)
                current = newTokens.slice(-2).join(' ')
                if (this.markov.ends.indexOf(next) !== -1 && newTokens.length > 5) break
            }
        }
        
        return result
    },
    
    // ==================== RANDOM TEXT ====================
    randomText: function(minLength, maxLength) {
        minLength = minLength || 5
        maxLength = maxLength || 20
        
        if (!this.knowledge.trained) {
            // Generate from scratch
            const words = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with']
            const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
            const result = []
            for (let i = 0; i < length; i++) {
                result.push(_randomChoice(words))
            }
            return result.join(' ')
        }
        
        return this.generate({ method: 'markov', count: 1, maxLength: maxLength })
    },
    
    // ==================== ENHANCE TEXT ====================
    enhance: function(text) {
        const synonyms = {
            good: ['excellent', 'great', 'wonderful', 'amazing', 'fantastic'],
            bad: ['terrible', 'awful', 'horrible', 'dreadful', 'appalling'],
            big: ['large', 'huge', 'enormous', 'gigantic', 'massive'],
            small: ['tiny', 'miniature', 'minute', 'minuscule', 'little'],
            happy: ['joyful', 'delighted', 'pleased', 'content', 'cheerful'],
            sad: ['unhappy', 'sorrowful', 'gloomy', 'melancholy', 'depressed']
        }
        
        const tokens = _tokenize(text)
        const enhanced = []
        
        for (const token of tokens) {
            let word = token
            if (synonyms[token] && Math.random() > 0.5) {
                word = _randomChoice(synonyms[token])
            }
            enhanced.push(word)
        }
        
        return enhanced.join(' ')
    },
    
    // ==================== WORD CLOUD ====================
    wordCloud: function(text, limit) {
        limit = limit || 20
        const analysis = this.analyze(text)
        return Object.entries(analysis.frequency)
            .filter(function(item) { return item[0].length > 2 })
            .sort(function(a, b) { return b[1] - a[1] })
            .slice(0, limit)
            .map(function(item) {
                return { word: item[0], frequency: item[1], size: 10 + item[1] * 5 }
            })
    },
    
    // ==================== GRAMMAR CHECK ====================
    grammar: function(text) {
        const issues = []
        const tokens = _tokenize(text)
        
        // Check for repeated words
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i] === tokens[i+1]) {
                issues.push('Repeated word: "' + tokens[i] + '"')
            }
        }
        
        // Check for missing periods
        if (!text.match(/[.!?]$/)) {
            issues.push('Sentence missing ending punctuation')
        }
        
        // Check for double spaces
        if (text.indexOf('  ') !== -1) {
            issues.push('Double spaces found')
        }
        
        return {
            valid: issues.length === 0,
            issues: issues,
            issueCount: issues.length
        }
    },
    
    // ==================== READABILITY ====================
    readability: function(text) {
        const analysis = this.analyze(text)
        const sentences = text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 0 }).length
        
        // Flesch Reading Ease (simplified)
        const syllables = this._countSyllables(text)
        const words = analysis.stats.wordCount
        
        if (words === 0 || sentences === 0) {
            return { score: 0, level: 'unknown' }
        }
        
        const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
        let level = 'unknown'
        if (score > 80) level = 'very easy'
        else if (score > 60) level = 'easy'
        else if (score > 40) level = 'moderate'
        else if (score > 20) level = 'difficult'
        else level = 'very difficult'
        
        return {
            score: Math.round(score),
            level: level,
            words: words,
            sentences: sentences,
            syllables: syllables
        }
    },
    
    _countSyllables: function(text) {
        const words = _tokenize(text)
        let count = 0
        for (const word of words) {
            const vowels = word.match(/[aeiouy]/g)
            if (vowels) count += vowels.length
            if (word.match(/[e]$/)) count--
            if (word.match(/[^aeiouy]e$/)) count++
        }
        return Math.max(count, 1)
    },
    
    // ==================== PLAGIARISM CHECK ====================
    plagiarism: function(text1, text2) {
        const t1 = _tokenize(text1)
        const t2 = _tokenize(text2)
        
        const set1 = new Set(t1)
        const set2 = new Set(t2)
        const intersection = new Set([...set1].filter(function(x) { return set2.has(x) }))
        const union = new Set([...set1, ...set2])
        
        const similarity = intersection.size / union.size
        
        return {
            similarity: similarity * 100,
            level: similarity > 0.5 ? 'high' : (similarity > 0.2 ? 'medium' : 'low'),
            isPlagiarized: similarity > 0.5
        }
    },
    
    // ==================== EXPORT ====================
    export: function() {
        return {
            version: this.version,
            knowledge: this.knowledge,
            markov: this.markov,
            ngram: this.ngram,
            sentenceGen: this.sentenceGen
        }
    },
    
    import: function(data) {
        if (!_isObject(data)) throw new Error('Invalid data')
        this.version = data.version || this.version
        this.knowledge = data.knowledge || this.knowledge
        this.markov = data.markov || this.markov
        this.ngram = data.ngram || this.ngram
        this.sentenceGen = data.sentenceGen || this.sentenceGen
        return { success: true }
    },
    
    reset: function() {
        this.markov = null
        this.ngram = null
        this.sentenceGen = null
        this.knowledge = {
            words: {},
            patterns: {},
            sentences: [],
            trained: false
        }
        return { success: true }
    }
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.MLTXT = MLTXT
}

// ==================== VERSION ====================
MLTXT.version = '1.0.0'

console.log('MLTXT v' + MLTXT.version + ' loaded with ' + Object.keys(MLTXT).length + ' functions')
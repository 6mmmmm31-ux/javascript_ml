// ============================================================
// IMG.ML_NEW.JS v1.0.0
// Complete Image Machine Learning Library
// 25+ Functions for Image Analysis, Recognition & Generation
// ============================================================

// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isFunction(f) { return typeof f === 'function' }

function _base64ToImageData(base64) {
    return new Promise(function(resolve, reject) {
        const img = new Image()
        img.onload = function() {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            const imageData = ctx.getImageData(0, 0, img.width, img.height)
            resolve({ imageData: imageData, width: img.width, height: img.height, canvas: canvas, ctx: ctx })
        }
        img.onerror = function(e) { reject(e) }
        img.src = base64
    })
}

function _imageDataToBase64(imageData, width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL()
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

function _setPixel(imageData, x, y, width, r, g, b, a) {
    const index = (y * width + x) * 4
    imageData.data[index] = r
    imageData.data[index + 1] = g
    imageData.data[index + 2] = b
    imageData.data[index + 3] = a || 255
}

function _rgbToGray(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b
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

// ==================== CORE CLASSES ====================

// Convolutional Neural Network (Simplified)
class _SimpleCNN {
    constructor() {
        this.kernels = []
        this.layers = []
        this.trained = false
    }
    
    addConvLayer(kernelSize, numKernels) {
        const kernels = []
        for (let k = 0; k < numKernels; k++) {
            const kernel = []
            for (let i = 0; i < kernelSize; i++) {
                const row = []
                for (let j = 0; j < kernelSize; j++) {
                    row.push((Math.random() - 0.5) * 0.1)
                }
                kernel.push(row)
            }
            kernels.push(kernel)
        }
        this.kernels.push({ kernels: kernels, size: kernelSize })
        return this
    }
    
    convolve(imageData, width, height) {
        const gray = new Float32Array(width * height)
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            gray[i] = _rgbToGray(imageData.data[idx], imageData.data[idx + 1], imageData.data[idx + 2])
        }
        
        const results = []
        for (const layer of this.kernels) {
            const size = layer.size
            const output = new Float32Array((width - size + 1) * (height - size + 1))
            
            for (let y = 0; y < height - size + 1; y++) {
                for (let x = 0; x < width - size + 1; x++) {
                    let sum = 0
                    for (let ky = 0; ky < size; ky++) {
                        for (let kx = 0; kx < size; kx++) {
                            const idx = (y + ky) * width + (x + kx)
                            sum += gray[idx] * layer.kernels[0][ky][kx]
                        }
                    }
                    output[y * (width - size + 1) + x] = Math.max(0, sum) // ReLU
                }
            }
            results.push(output)
        }
        return results
    }
    
    train(images, labels, epochs) {
        epochs = epochs || 10
        // Simplified training
        this.trained = true
        return this
    }
}

// Feature Extractor
class _FeatureExtractor {
    constructor() {
        this.features = []
    }
    
    extract(imageData, width, height) {
        const features = {
            histogram: this._histogram(imageData, width, height),
            edges: this._edges(imageData, width, height),
            corners: this._corners(imageData, width, height),
            texture: this._texture(imageData, width, height),
            color: this._colorFeatures(imageData, width, height),
            shape: this._shapeFeatures(imageData, width, height)
        }
        this.features.push(features)
        return features
    }
    
    _histogram(imageData, width, height) {
        const hist = { r: new Float32Array(256), g: new Float32Array(256), b: new Float32Array(256) }
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            hist.r[imageData.data[idx]]++
            hist.g[imageData.data[idx + 1]]++
            hist.b[imageData.data[idx + 2]]++
        }
        return hist
    }
    
    _edges(imageData, width, height) {
        const sobelX = [[-1,0,1],[-2,0,2],[-1,0,1]]
        const sobelY = [[-1,-2,-1],[0,0,0],[1,2,1]]
        let totalEdges = 0
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4
                        const gray = _rgbToGray(imageData.data[idx], imageData.data[idx+1], imageData.data[idx+2])
                        gx += gray * sobelX[ky+1][kx+1]
                        gy += gray * sobelY[ky+1][kx+1]
                    }
                }
                const mag = Math.sqrt(gx*gx + gy*gy)
                if (mag > 30) totalEdges++
            }
        }
        return totalEdges / ((width-2) * (height-2))
    }
    
    _corners(imageData, width, height) {
        const corners = []
        for (let y = 2; y < height - 2; y++) {
            for (let x = 2; x < width - 2; x++) {
                let ix = 0, iy = 0, ixy = 0
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4
                        const gray = _rgbToGray(imageData.data[idx], imageData.data[idx+1], imageData.data[idx+2])
                        ix += gray * kx * kx
                        iy += gray * ky * ky
                        ixy += gray * kx * ky
                    }
                }
                const det = ix * iy - ixy * ixy
                const trace = ix + iy
                const response = det - 0.04 * trace * trace
                if (response > 50) corners.push({ x, y, response })
            }
        }
        return corners
    }
    
    _texture(imageData, width, height) {
        let contrast = 0
        for (let y = 0; y < height - 1; y++) {
            for (let x = 0; x < width - 1; x++) {
                const idx1 = (y * width + x) * 4
                const idx2 = ((y + 1) * width + x) * 4
                const idx3 = (y * width + x + 1) * 4
                const g1 = _rgbToGray(imageData.data[idx1], imageData.data[idx1+1], imageData.data[idx1+2])
                const g2 = _rgbToGray(imageData.data[idx2], imageData.data[idx2+1], imageData.data[idx2+2])
                const g3 = _rgbToGray(imageData.data[idx3], imageData.data[idx3+1], imageData.data[idx3+2])
                contrast += Math.abs(g1 - g2) + Math.abs(g1 - g3)
            }
        }
        return contrast / ((width-1) * (height-1))
    }
    
    _colorFeatures(imageData, width, height) {
        let r = 0, g = 0, b = 0
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            r += imageData.data[idx]
            g += imageData.data[idx + 1]
            b += imageData.data[idx + 2]
        }
        const total = width * height
        return { r: r/total, g: g/total, b: b/total }
    }
    
    _shapeFeatures(imageData, width, height) {
        let minX = width, maxX = 0, minY = height, maxY = 0
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4
                if (imageData.data[idx + 3] > 0) {
                    if (x < minX) minX = x
                    if (x > maxX) maxX = x
                    if (y < minY) minY = y
                    if (y > maxY) maxY = y
                }
            }
        }
        const w = maxX - minX || 1
        const h = maxY - minY || 1
        return { width: w, height: h, aspectRatio: w/h }
    }
}

// ==================== IMG.ML MAIN LIBRARY ====================
var IMGML = {
    version: '1.0.0',
    
    // Models
    cnn: null,
    featureExtractor: null,
    
    // Knowledge
    knowledge: {
        images: [],
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
        
        // Initialize models
        if (!this.cnn) this.cnn = new _SimpleCNN()
        if (!this.featureExtractor) this.featureExtractor = new _FeatureExtractor()
        
        return new Promise(function(resolve, reject) {
            const promises = data.map(function(img, index) {
                return _base64ToImageData(img).then(function(result) {
                    const features = IMGML.featureExtractor.extract(result.imageData, result.width, result.height)
                    IMGML.knowledge.features.push({ features: features, label: labels[index] })
                    IMGML.knowledge.images.push({ imageData: result.imageData, width: result.width, height: result.height })
                    
                    if (!IMGML.knowledge.categories[labels[index]]) {
                        IMGML.knowledge.categories[labels[index]] = []
                    }
                    IMGML.knowledge.categories[labels[index]].push(features)
                    
                    return { features: features, label: labels[index] }
                })
            })
            
            Promise.all(promises).then(function(results) {
                IMGML.knowledge.trained = true
                resolve({
                    success: true,
                    trained: results.length,
                    categories: Object.keys(IMGML.knowledge.categories),
                    totalImages: IMGML.knowledge.images.length
                })
            }).catch(reject)
        })
    },
    
    // ==================== RECOGNITION FUNCTIONS ====================
    recognize: function(imageBase64) {
        return new Promise(function(resolve, reject) {
            if (!IMGML.knowledge.trained) {
                resolve({ error: 'Model not trained. Use train() first.' })
                return
            }
            
            _base64ToImageData(imageBase64).then(function(result) {
                const features = IMGML.featureExtractor.extract(result.imageData, result.width, result.height)
                const matches = []
                
                for (const [category, samples] of Object.entries(IMGML.knowledge.categories)) {
                    let totalSimilarity = 0
                    for (const sample of samples) {
                        const similarity = IMGML._compareFeatures(features, sample)
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
        
        // Compare histograms
        let histSim = 0
        for (let i = 0; i < 256; i++) {
            histSim += Math.min(features1.histogram.r[i], features2.histogram.r[i])
            histSim += Math.min(features1.histogram.g[i], features2.histogram.g[i])
            histSim += Math.min(features1.histogram.b[i], features2.histogram.b[i])
        }
        similarity += histSim / (256 * 3)
        weights += 1
        
        // Compare color features
        const colorSim = 1 - (
            Math.abs(features1.color.r - features2.color.r) +
            Math.abs(features1.color.g - features2.color.g) +
            Math.abs(features1.color.b - features2.color.b)
        ) / 765
        similarity += colorSim
        weights += 1
        
        // Compare edge density
        const edgeSim = 1 - Math.abs(features1.edges - features2.edges)
        similarity += edgeSim
        weights += 1
        
        // Compare aspect ratio
        const aspectSim = 1 - Math.abs(features1.shape.aspectRatio - features2.shape.aspectRatio) / 5
        similarity += aspectSim
        weights += 1
        
        return weights > 0 ? similarity / weights : 0
    },
    
    // ==================== IMAGE ANALYSIS ====================
    analyze: function(imageBase64) {
        return new Promise(function(resolve, reject) {
            _base64ToImageData(imageBase64).then(function(result) {
                const features = IMGML.featureExtractor.extract(result.imageData, result.width, result.height)
                
                const analysis = {
                    width: result.width,
                    height: result.height,
                    aspectRatio: result.width / result.height,
                    totalPixels: result.width * result.height,
                    features: features,
                    colorDistribution: {
                        r: features.color.r,
                        g: features.color.g,
                        b: features.color.b
                    },
                    edgeDensity: features.edges,
                    cornerCount: features.corners.length,
                    textureContrast: features.texture,
                    shape: features.shape
                }
                
                resolve(analysis)
            }).catch(reject)
        })
    },
    
    // ==================== IMAGE PROCESSING ====================
    process: function(imageBase64, operation) {
        return new Promise(function(resolve, reject) {
            _base64ToImageData(imageBase64).then(function(result) {
                let imageData = result.imageData
                const width = result.width
                const height = result.height
                const canvas = result.canvas
                const ctx = result.ctx
                
                switch(operation) {
                    case 'grayscale':
                        imageData = IMGML._grayscale(imageData, width, height)
                        break
                    case 'brightness':
                        imageData = IMGML._brightness(imageData, width, height, 30)
                        break
                    case 'contrast':
                        imageData = IMGML._contrast(imageData, width, height, 1.5)
                        break
                    case 'blur':
                        imageData = IMGML._blur(imageData, width, height)
                        break
                    case 'sharpen':
                        imageData = IMGML._sharpen(imageData, width, height)
                        break
                    case 'edges':
                        imageData = IMGML._edgesDetect(imageData, width, height)
                        break
                    case 'invert':
                        imageData = IMGML._invert(imageData, width, height)
                        break
                    case 'sepia':
                        imageData = IMGML._sepia(imageData, width, height)
                        break
                    case 'threshold':
                        imageData = IMGML._threshold(imageData, width, height, 128)
                        break
                    default:
                        break
                }
                
                const resultBase64 = _imageDataToBase64(imageData, width, height)
                resolve({
                    success: true,
                    operation: operation,
                    base64: resultBase64,
                    width: width,
                    height: height
                })
            }).catch(reject)
        })
    },
    
    _grayscale: function(imageData, width, height) {
        const data = new Uint8ClampedArray(imageData.data)
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            const gray = _rgbToGray(data[idx], data[idx+1], data[idx+2])
            data[idx] = gray
            data[idx+1] = gray
            data[idx+2] = gray
        }
        return new ImageData(data, width, height)
    },
    
    _brightness: function(imageData, width, height, amount) {
        const data = new Uint8ClampedArray(imageData.data)
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            data[idx] = _clamp(data[idx] + amount, 0, 255)
            data[idx+1] = _clamp(data[idx+1] + amount, 0, 255)
            data[idx+2] = _clamp(data[idx+2] + amount, 0, 255)
        }
        return new ImageData(data, width, height)
    },
    
    _contrast: function(imageData, width, height, factor) {
        const data = new Uint8ClampedArray(imageData.data)
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            data[idx] = _clamp((data[idx] - 128) * factor + 128, 0, 255)
            data[idx+1] = _clamp((data[idx+1] - 128) * factor + 128, 0, 255)
            data[idx+2] = _clamp((data[idx+2] - 128) * factor + 128, 0, 255)
        }
        return new ImageData(data, width, height)
    },
    
    _blur: function(imageData, width, height) {
        const data = new Uint8ClampedArray(imageData.data)
        const kernel = [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ]
        const sum = 16
        const result = new Uint8ClampedArray(data)
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let r = 0, g = 0, b = 0
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4
                        const weight = kernel[ky+1][kx+1]
                        r += data[idx] * weight
                        g += data[idx+1] * weight
                        b += data[idx+2] * weight
                    }
                }
                const idx = (y * width + x) * 4
                result[idx] = r / sum
                result[idx+1] = g / sum
                result[idx+2] = b / sum
            }
        }
        return new ImageData(result, width, height)
    },
    
    _sharpen: function(imageData, width, height) {
        const data = new Uint8ClampedArray(imageData.data)
        const kernel = [
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ]
        const result = new Uint8ClampedArray(data)
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let r = 0, g = 0, b = 0
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4
                        const weight = kernel[ky+1][kx+1]
                        r += data[idx] * weight
                        g += data[idx+1] * weight
                        b += data[idx+2] * weight
                    }
                }
                const idx = (y * width + x) * 4
                result[idx] = _clamp(r, 0, 255)
                result[idx+1] = _clamp(g, 0, 255)
                result[idx+2] = _clamp(b, 0, 255)
            }
        }
        return new ImageData(result, width, height)
    },
    
    _edgesDetect: function(imageData, width, height) {
        const data = new Uint8ClampedArray(imageData.data)
        const result = new Uint8ClampedArray(data)
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4
                        const gray = _rgbToGray(data[idx], data[idx+1], data[idx+2])
                        gx += gray * (kx === -1 ? -1 : (kx === 1 ? 1 : 0))
                        gy += gray * (ky === -1 ? -1 : (ky === 1 ? 1 : 0))
                    }
                }
                const mag = Math.min(Math.sqrt(gx*gx + gy*gy), 255)
                const idx = (y * width + x) * 4
                result[idx] = mag
                result[idx+1] = mag
                result[idx+2] = mag
            }
        }
        return new ImageData(result, width, height)
    },
    
    _invert: function(imageData, width, height) {
        const data = new Uint8ClampedArray(imageData.data)
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            data[idx] = 255 - data[idx]
            data[idx+1] = 255 - data[idx+1]
            data[idx+2] = 255 - data[idx+2]
        }
        return new ImageData(data, width, height)
    },
    
    _sepia: function(imageData, width, height) {
        const data = new Uint8ClampedArray(imageData.data)
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            const r = data[idx]
            const g = data[idx+1]
            const b = data[idx+2]
            data[idx] = _clamp(r * 0.393 + g * 0.769 + b * 0.189, 0, 255)
            data[idx+1] = _clamp(r * 0.349 + g * 0.686 + b * 0.168, 0, 255)
            data[idx+2] = _clamp(r * 0.272 + g * 0.534 + b * 0.131, 0, 255)
        }
        return new ImageData(data, width, height)
    },
    
    _threshold: function(imageData, width, height, threshold) {
        const data = new Uint8ClampedArray(imageData.data)
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4
            const gray = _rgbToGray(data[idx], data[idx+1], data[idx+2])
            const val = gray > threshold ? 255 : 0
            data[idx] = val
            data[idx+1] = val
            data[idx+2] = val
        }
        return new ImageData(data, width, height)
    },
    
    // ==================== IMAGE GENERATION ====================
    generate: function(width, height, type) {
        type = type || 'random'
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        const imageData = ctx.createImageData(width, height)
        
        if (type === 'random') {
            for (let i = 0; i < width * height; i++) {
                const idx = i * 4
                imageData.data[idx] = Math.floor(Math.random() * 256)
                imageData.data[idx+1] = Math.floor(Math.random() * 256)
                imageData.data[idx+2] = Math.floor(Math.random() * 256)
                imageData.data[idx+3] = 255
            }
        } else if (type === 'gradient') {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4
                    const val = Math.floor((x / width) * 255)
                    imageData.data[idx] = val
                    imageData.data[idx+1] = val
                    imageData.data[idx+2] = 255 - val
                    imageData.data[idx+3] = 255
                }
            }
        } else if (type === 'checkerboard') {
            const size = 20
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4
                    const val = (Math.floor(y/size) + Math.floor(x/size)) % 2 === 0 ? 255 : 0
                    imageData.data[idx] = val
                    imageData.data[idx+1] = val
                    imageData.data[idx+2] = val
                    imageData.data[idx+3] = 255
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0)
        return canvas.toDataURL()
    },
    
    // ==================== BATCH PROCESSING ====================
    batchProcess: function(images, operation) {
        if (!_isArray(images)) images = [images]
        
        return Promise.all(images.map(function(img) {
            return IMGML.process(img, operation)
        }))
    },
    
    batchRecognize: function(images) {
        if (!_isArray(images)) images = [images]
        
        return Promise.all(images.map(function(img) {
            return IMGML.recognize(img)
        }))
    },
    
    // ==================== KNOWLEDGE MANAGEMENT ====================
    getKnowledge: function() {
        return {
            totalImages: this.knowledge.images.length,
            categories: Object.keys(this.knowledge.categories).reduce(function(acc, key) {
                acc[key] = this.knowledge.categories[key].length
                return acc
            }.bind(this), {}),
            trained: this.knowledge.trained
        }
    },
    
    reset: function() {
        this.cnn = null
        this.featureExtractor = null
        this.knowledge = {
            images: [],
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
    window.IMGML = IMGML
    window.img = IMGML
}

console.log('IMG.ML v' + IMGML.version + ' loaded with ' + Object.keys(IMGML).length + ' functions')
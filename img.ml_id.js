// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isArray(a) { return Array.isArray(a) }

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
    imageData.data[index + 3] = a
}

function _colorDistance(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    )
}

function _isBackground(pixel, threshold) {
    threshold = threshold || 30
    return pixel.r < threshold && pixel.g < threshold && pixel.b < threshold
}

// ==================== FLOOD FILL ====================
function floodFill(imageData, width, height, startX, startY, threshold) {
    threshold = threshold || 30
    const data = new Uint8ClampedArray(imageData.data)
    const visited = new Uint8Array(width * height)
    const queue = []
    const startColor = _getPixel({ data: data }, startX, startY, width)
    const result = { data: data, mask: new Uint8Array(width * height) }
    
    queue.push({ x: startX, y: startY })
    visited[startY * width + startX] = 1
    
    while (queue.length > 0) {
        const current = queue.shift()
        const x = current.x
        const y = current.y
        result.mask[y * width + x] = 1
        
        const neighbors = [
            { x: x - 1, y: y }, { x: x + 1, y: y },
            { x: x, y: y - 1 }, { x: x, y: y + 1 },
            { x: x - 1, y: y - 1 }, { x: x + 1, y: y - 1 },
            { x: x - 1, y: y + 1 }, { x: x + 1, y: y + 1 }
        ]
        
        for (const n of neighbors) {
            if (n.x < 0 || n.x >= width || n.y < 0 || n.y >= height) continue
            const idx = n.y * width + n.x
            if (visited[idx]) continue
            
            const color = _getPixel({ data: data }, n.x, n.y, width)
            const dist = _colorDistance(color, startColor)
            if (dist < threshold) {
                visited[idx] = 1
                queue.push({ x: n.x, y: n.y })
            }
        }
    }
    
    return result
}

function removeBackground(imageData, width, height, threshold) {
    threshold = threshold || 30
    const corners = [
        { x: 0, y: 0 }, { x: width - 1, y: 0 },
        { x: 0, y: height - 1 }, { x: width - 1, y: height - 1 }
    ]
    
    const combinedMask = new Uint8Array(width * height)
    
    for (const corner of corners) {
        const result = floodFill(imageData, width, height, corner.x, corner.y, threshold)
        for (let i = 0; i < width * height; i++) {
            if (result.mask[i]) {
                combinedMask[i] = 1
            }
        }
    }
    
    const newData = new Uint8ClampedArray(imageData.data)
    for (let i = 0; i < width * height; i++) {
        if (combinedMask[i]) {
            newData[i * 4] = 255
            newData[i * 4 + 1] = 255
            newData[i * 4 + 2] = 255
            newData[i * 4 + 3] = 0
        }
    }
    
    return { data: newData, mask: combinedMask }
}

// ==================== FEATURE EXTRACTION ====================
function extractFeatures(imageData, width, height) {
    const features = {}
    
    // 1. Histogram (256 bins per channel)
    const histR = new Float32Array(256)
    const histG = new Float32Array(256)
    const histB = new Float32Array(256)
    
    let totalPixels = 0
    for (let i = 0; i < width * height; i++) {
        const idx = i * 4
        if (imageData.data[idx + 3] === 0) continue
        totalPixels++
        histR[imageData.data[idx]]++
        histG[imageData.data[idx + 1]]++
        histB[imageData.data[idx + 2]]++
    }
    
    features.histogram = { r: histR, g: histG, b: histB }
    features.totalPixels = totalPixels
    
    // 2. Statistical moments (mean, std, skewness, kurtosis)
    let meanR = 0, meanG = 0, meanB = 0
    for (let i = 0; i < width * height; i++) {
        const idx = i * 4
        if (imageData.data[idx + 3] === 0) continue
        meanR += imageData.data[idx]
        meanG += imageData.data[idx + 1]
        meanB += imageData.data[idx + 2]
    }
    meanR /= totalPixels
    meanG /= totalPixels
    meanB /= totalPixels
    
    features.mean = { r: meanR, g: meanG, b: meanB }
    
    let stdR = 0, stdG = 0, stdB = 0
    let skewR = 0, skewG = 0, skewB = 0
    let kurtR = 0, kurtG = 0, kurtB = 0
    
    for (let i = 0; i < width * height; i++) {
        const idx = i * 4
        if (imageData.data[idx + 3] === 0) continue
        const dr = imageData.data[idx] - meanR
        const dg = imageData.data[idx + 1] - meanG
        const db = imageData.data[idx + 2] - meanB
        stdR += dr * dr
        stdG += dg * dg
        stdB += db * db
        skewR += dr * dr * dr
        skewG += dg * dg * dg
        skewB += db * db * db
        kurtR += dr * dr * dr * dr
        kurtG += dg * dg * dg * dg
        kurtB += db * db * db * db
    }
    
    stdR = Math.sqrt(stdR / totalPixels)
    stdG = Math.sqrt(stdG / totalPixels)
    stdB = Math.sqrt(stdB / totalPixels)
    skewR = (skewR / totalPixels) / (stdR * stdR * stdR)
    skewG = (skewG / totalPixels) / (stdG * stdG * stdG)
    skewB = (skewB / totalPixels) / (stdB * stdB * stdB)
    kurtR = (kurtR / totalPixels) / (stdR * stdR * stdR * stdR) - 3
    kurtG = (kurtG / totalPixels) / (stdG * stdG * stdG * stdG) - 3
    kurtB = (kurtB / totalPixels) / (stdB * stdB * stdB * stdB) - 3
    
    features.std = { r: stdR, g: stdG, b: stdB }
    features.skewness = { r: skewR, g: skewG, b: skewB }
    features.kurtosis = { r: kurtR, g: kurtG, b: kurtB }
    
    // 3. Edge detection with derivative (Sobel)
    const sobelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ]
    const sobelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ]
    
    let edgeMagnitude = 0
    let edgeCount = 0
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4
                    if (imageData.data[idx + 3] === 0) continue
                    const val = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3
                    gx += val * sobelX[ky + 1][kx + 1]
                    gy += val * sobelY[ky + 1][kx + 1]
                }
            }
            const mag = Math.sqrt(gx * gx + gy * gy)
            edgeMagnitude += mag
            if (mag > 50) edgeCount++
        }
    }
    
    features.edgeMagnitude = edgeMagnitude / ((width - 2) * (height - 2))
    features.edgeDensity = edgeCount / ((width - 2) * (height - 2))
    
    // 4. Corner detection (Harris corner response)
    features.corners = []
    for (let y = 2; y < height - 2; y++) {
        for (let x = 2; x < width - 2; x++) {
            let ix = 0, iy = 0, ixy = 0
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4
                    if (imageData.data[idx + 3] === 0) continue
                    const val = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3
                    const dx = val * kx
                    const dy = val * ky
                    ix += dx * dx
                    iy += dy * dy
                    ixy += dx * dy
                }
            }
            const det = ix * iy - ixy * ixy
            const trace = ix + iy
            const response = det - 0.04 * trace * trace
            if (response > 100) {
                features.corners.push({ x: x, y: y, response: response })
            }
        }
    }
    
    // 5. Shape descriptors (using sine and cosine transforms)
    features.fourierDescriptor = []
    const contour = extractContour(imageData, width, height)
    if (contour.length > 10) {
        const n = Math.min(contour.length, 64)
        const re = new Float32Array(n)
        const im = new Float32Array(n)
        
        for (let k = 0; k < n; k++) {
            let sumRe = 0, sumIm = 0
            for (let t = 0; t < contour.length; t++) {
                const angle = (2 * Math.PI * k * t) / contour.length
                sumRe += contour[t].x * Math.cos(angle) + contour[t].y * Math.sin(angle)
                sumIm += -contour[t].x * Math.sin(angle) + contour[t].y * Math.cos(angle)
            }
            re[k] = sumRe / contour.length
            im[k] = sumIm / contour.length
        }
        
        const mag = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            mag[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i])
        }
        features.fourierDescriptor = mag
    }
    
    // 6. Texture features using cosine transform
    features.dctCoefficients = []
    const size = Math.min(width, height, 32)
    const block = []
    for (let y = 0; y < size && y < height; y++) {
        for (let x = 0; x < size && x < width; x++) {
            const idx = (y * width + x) * 4
            if (imageData.data[idx + 3] === 0) continue
            block.push((imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3)
        }
    }
    
    if (block.length > 0) {
        const dct = []
        for (let u = 0; u < 8; u++) {
            for (let v = 0; v < 8; v++) {
                let sum = 0
                const cu = u === 0 ? 1 / Math.sqrt(2) : 1
                const cv = v === 0 ? 1 / Math.sqrt(2) : 1
                for (let y = 0; y < 8 && y < block.length / size; y++) {
                    for (let x = 0; x < 8 && x < size; x++) {
                        const idx = y * size + x
                        if (idx < block.length) {
                            sum += block[idx] * Math.cos((2 * x + 1) * u * Math.PI / 16) *
                                   Math.cos((2 * y + 1) * v * Math.PI / 16)
                        }
                    }
                }
                dct.push(cu * cv * sum / 64)
            }
        }
        features.dctCoefficients = dct
    }
    
    // 7. Aspect ratio and bounding box
    let minX = width, maxX = 0, minY = height, maxY = 0
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4
            if (imageData.data[idx + 3] !== 0) {
                if (x < minX) minX = x
                if (x > maxX) maxX = x
                if (y < minY) minY = y
                if (y > maxY) maxY = y
            }
        }
    }
    
    features.bbox = {
        x: minX, y: minY,
        width: maxX - minX,
        height: maxY - minY,
        aspectRatio: (maxX - minX) / (maxY - minY)
    }
    
    return features
}

// ==================== CONTOUR EXTRACTION ====================
function extractContour(imageData, width, height) {
    const contour = []
    const visited = new Uint8Array(width * height)
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4
            if (imageData.data[idx + 3] === 0) continue
            if (visited[y * width + x]) continue
            
            let isEdge = false
            const neighbors = [
                { x: x - 1, y: y }, { x: x + 1, y: y },
                { x: x, y: y - 1 }, { x: x, y: y + 1 }
            ]
            for (const n of neighbors) {
                const nIdx = (n.y * width + n.x) * 4
                if (n.x < 0 || n.x >= width || n.y < 0 || n.y >= height || 
                    imageData.data[nIdx + 3] === 0) {
                    isEdge = true
                    break
                }
            }
            
            if (isEdge) {
                contour.push({ x: x, y: y })
                visited[y * width + x] = 1
            }
        }
    }
    
    return contour
}

// ==================== SIMILARITY COMPUTATION ====================
function computeSimilarity(features1, features2) {
    let score = 0
    let weights = 0
    
    // Compare histograms using cosine similarity
    let histSim = 0
    let histNorm1 = 0, histNorm2 = 0
    for (let i = 0; i < 256; i++) {
        histSim += features1.histogram.r[i] * features2.histogram.r[i]
        histSim += features1.histogram.g[i] * features2.histogram.g[i]
        histSim += features1.histogram.b[i] * features2.histogram.b[i]
        histNorm1 += features1.histogram.r[i] * features1.histogram.r[i]
        histNorm1 += features1.histogram.g[i] * features1.histogram.g[i]
        histNorm1 += features1.histogram.b[i] * features1.histogram.b[i]
        histNorm2 += features2.histogram.r[i] * features2.histogram.r[i]
        histNorm2 += features2.histogram.g[i] * features2.histogram.g[i]
        histNorm2 += features2.histogram.b[i] * features2.histogram.b[i]
    }
    histSim = histSim / (Math.sqrt(histNorm1) * Math.sqrt(histNorm2))
    score += histSim * 0.25
    weights += 0.25
    
    // Compare statistical moments
    const meanSim = 1 - (
        Math.abs(features1.mean.r - features2.mean.r) / 255 +
        Math.abs(features1.mean.g - features2.mean.g) / 255 +
        Math.abs(features1.mean.b - features2.mean.b) / 255
    ) / 3
    score += meanSim * 0.15
    weights += 0.15
    
    const stdSim = 1 - (
        Math.abs(features1.std.r - features2.std.r) / 50 +
        Math.abs(features1.std.g - features2.std.g) / 50 +
        Math.abs(features1.std.b - features2.std.b) / 50
    ) / 3
    score += stdSim * 0.15
    weights += 0.15
    
    // Compare edge density
    const edgeSim = 1 - Math.abs(features1.edgeDensity - features2.edgeDensity)
    score += edgeSim * 0.15
    weights += 0.15
    
    // Compare aspect ratio
    const aspectSim = 1 - Math.abs(features1.bbox.aspectRatio - features2.bbox.aspectRatio) / 5
    score += aspectSim * 0.15
    weights += 0.15
    
    // Compare Fourier descriptors (if available)
    if (features1.fourierDescriptor.length > 0 && features2.fourierDescriptor.length > 0) {
        let fourierSim = 0
        const n = Math.min(features1.fourierDescriptor.length, features2.fourierDescriptor.length)
        for (let i = 0; i < n; i++) {
            const d = Math.abs(features1.fourierDescriptor[i] - features2.fourierDescriptor[i])
            fourierSim += 1 / (1 + d)
        }
        fourierSim /= n
        score += fourierSim * 0.15
        weights += 0.15
    }
    
    return score / weights
}

// ==================== MAIN LIBRARY ====================
const Vision = {
    knowledge: {},
    threshold: 30,
    
    // ==================== LEARN ====================
    learn: function(input) {
        if (!_isObject(input)) {
            throw new Error('Input must be an object { "imageBase64": "name", ... }')
        }
        
        return new Promise(async function(resolve, reject) {
            try {
                const entries = Object.entries(input)
                let processed = 0
                
                for (const [base64, name] of entries) {
                    if (!_isString(base64) || !_isString(name)) {
                        console.warn('Skipping invalid entry:', base64, name)
                        continue
                    }
                    
                    try {
                        const result = await _base64ToImageData(base64)
                        const { imageData, width, height, canvas, ctx } = result
                        
                        // Remove background
                        const cleaned = removeBackground(imageData, width, height, Vision.threshold)
                        const cleanedImageData = new ImageData(cleaned.data, width, height)
                        
                        // Extract features
                        const features = extractFeatures(cleanedImageData, width, height)
                        
                        // Store in knowledge
                        if (!Vision.knowledge[name]) {
                            Vision.knowledge[name] = []
                        }
                        Vision.knowledge[name].push({
                            features: features,
                            width: width,
                            height: height,
                            imageData: cleanedImageData,
                            base64: _imageDataToBase64(cleanedImageData, width, height)
                        })
                        
                        processed++
                    } catch (e) {
                        console.warn('Failed to process image:', name, e)
                    }
                }
                
                resolve({
                    success: true,
                    learned: processed,
                    total: entries.length,
                    knowledge: Object.keys(Vision.knowledge)
                })
            } catch (error) {
                reject(error)
            }
        })
    },
    
    // ==================== IDENTIFY ====================
    identify: function(imageBase64, sensitivity) {
        sensitivity = sensitivity || 0.5
        
        return new Promise(async function(resolve, reject) {
            try {
                if (!_isString(imageBase64)) {
                    throw new Error('Image must be a base64 string')
                }
                
                if (Object.keys(Vision.knowledge).length === 0) {
                    resolve({ error: 'No knowledge available. Please learn first.' })
                    return
                }
                
                // Process input image
                const result = await _base64ToImageData(imageBase64)
                const { imageData, width, height, canvas, ctx } = result
                
                // Remove background
                const cleaned = removeBackground(imageData, width, height, Vision.threshold)
                const cleanedImageData = new ImageData(cleaned.data, width, height)
                
                // Extract features
                const features = extractFeatures(cleanedImageData, width, height)
                
                // Compare with knowledge
                let bestMatch = null
                let bestScore = 0
                const results = {}
                
                for (const [name, samples] of Object.entries(Vision.knowledge)) {
                    let maxScore = 0
                    
                    for (const sample of samples) {
                        const similarity = computeSimilarity(features, sample.features)
                        if (similarity > maxScore) {
                            maxScore = similarity
                        }
                    }
                    
                    results[name] = maxScore
                    
                    if (maxScore > bestScore) {
                        bestScore = maxScore
                        bestMatch = name
                    }
                }
                
                // Apply sensitivity threshold
                const confidence = Math.max(0, Math.min(1, bestScore))
                const isMatch = confidence >= sensitivity
                
                resolve({
                    object: isMatch ? bestMatch : 'unknown',
                    confidence: confidence,
                    sensitivity: sensitivity,
                    allResults: results,
                    isMatch: isMatch,
                    imageData: {
                        original: imageBase64,
                        processed: _imageDataToBase64(cleanedImageData, width, height)
                    }
                })
                
            } catch (error) {
                reject(error)
            }
        })
    },
    
    // ==================== IDENTIFY BATCH ====================
    identifyBatch: function(images, sensitivity) {
        sensitivity = sensitivity || 0.5
        
        return new Promise(async function(resolve, reject) {
            try {
                if (!_isArray(images)) {
                    throw new Error('Images must be an array of base64 strings')
                }
                
                const results = []
                for (const image of images) {
                    try {
                        const result = await Vision.identify(image, sensitivity)
                        results.push(result)
                    } catch (e) {
                        results.push({ error: e.message, image: image.slice(0, 50) + '...' })
                    }
                }
                
                resolve(results)
            } catch (error) {
                reject(error)
            }
        })
    },
    
    // ==================== GET KNOWLEDGE ====================
    getKnowledge: function() {
        const result = {}
        for (const [name, samples] of Object.entries(Vision.knowledge)) {
            result[name] = samples.length
        }
        return {
            objects: result,
            totalObjects: Object.keys(Vision.knowledge).length,
            totalSamples: Object.values(Vision.knowledge).reduce((a, b) => a + b.length, 0)
        }
    },
    
    // ==================== CLEAR KNOWLEDGE ====================
    clearKnowledge: function() {
        Vision.knowledge = {}
        return { success: true, message: 'Knowledge cleared' }
    },
    
    // ==================== SET THRESHOLD ====================
    setThreshold: function(value) {
        if (!_isNumber(value) || value < 0 || value > 255) {
            throw new Error('Threshold must be a number between 0 and 255')
        }
        Vision.threshold = value
        return { success: true, threshold: value }
    },
    
    // ==================== UTILITY ====================
    loadKnowledge: function(data) {
        if (!_isObject(data)) {
            throw new Error('Knowledge must be an object')
        }
        Vision.knowledge = data
        return { success: true, loaded: Object.keys(data).length }
    },
    
    saveKnowledge: function() {
        return JSON.stringify(Vision.knowledge)
    },
    
    // ==================== PREPROCESS IMAGE ====================
    preprocess: function(imageBase64) {
        return new Promise(async function(resolve, reject) {
            try {
                const result = await _base64ToImageData(imageBase64)
                const { imageData, width, height, canvas, ctx } = result
                
                // Remove background
                const cleaned = removeBackground(imageData, width, height, Vision.threshold)
                const cleanedImageData = new ImageData(cleaned.data, width, height)
                
                // Extract features
                const features = extractFeatures(cleanedImageData, width, height)
                
                resolve({
                    features: features,
                    image: _imageDataToBase64(cleanedImageData, width, height),
                    width: width,
                    height: height
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.Vision = Vision
}

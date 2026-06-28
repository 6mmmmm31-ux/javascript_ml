function _isString(s) { return typeof s === 'string' }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isFunction(f) { return typeof f === 'function' }

function _getBlobURL(blob) {
    return URL.createObjectURL(blob)
}

function _revokeBlobURL(url) {
    URL.revokeObjectURL(url)
}

function _base64ToBlob(base64, mimeType) {
    const byteString = atob(base64.split(',')[1] || base64)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeType || 'image/png' })
}

function _blobToBase64(blob) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        reader.onload = function(e) { resolve(e.target.result) }
        reader.onerror = function(e) { reject(e) }
        reader.readAsDataURL(blob)
    })
}

function _validateSVG(svg) {
    if (!_isString(svg)) return { valid: false, error: 'SVG must be a string' }
    if (!svg.includes('<svg') && !svg.includes('<?xml')) {
        return { valid: false, error: 'Invalid SVG format' }
    }
    return { valid: true }
}

function _fixSVG(svg, width, height) {
    let fixed = svg
    if (!fixed.includes('<?xml')) {
        fixed = '<?xml version="1.0" encoding="UTF-8"?>\n' + fixed
    }
    if (!fixed.includes('viewBox')) {
        fixed = fixed.replace('<svg', '<svg viewBox="0 0 ' + (width || 100) + ' ' + (height || 100) + '"')
    }
    if (width && height) {
        if (!fixed.includes('width="')) {
            fixed = fixed.replace('<svg', '<svg width="' + width + '" height="' + height + '"')
        }
    }
    
    return fixed
}
var SVGToPNG = {
    settings: {
        defaultWidth: 800,
        defaultHeight: 600,
        backgroundColor: 'transparent',
        quality: 1,
        scale: 1
    },
    convert: function(svg, options) {
        options = options || {}
        const width = options.width || this.settings.defaultWidth
        const height = options.height || this.settings.defaultHeight
        const scale = options.scale || this.settings.scale || 1
        const backgroundColor = options.backgroundColor || this.settings.backgroundColor
        const quality = options.quality || this.settings.quality || 1
        const validation = _validateSVG(svg)
        if (!validation.valid) {
            return Promise.reject(new Error(validation.error))
        }
        
        return new Promise(function(resolve, reject) {
            try {
                const fixedSVG = _fixSVG(svg, width, height)
                const blob = new Blob([fixedSVG], { type: 'image/svg+xml' })
                const url = _getBlobURL(blob)
                const img = new Image()
                img.onload = function() {
                    try {
                        const finalWidth = Math.round(width * scale)
                        const finalHeight = Math.round(height * scale)
                        const canvas = document.createElement('canvas')
                        canvas.width = finalWidth
                        canvas.height = finalHeight
                        const ctx = canvas.getContext('2d')
                        if (backgroundColor !== 'transparent') {
                            ctx.fillStyle = backgroundColor
                            ctx.fillRect(0, 0, finalWidth, finalHeight)
                        }
                        ctx.drawImage(img, 0, 0, finalWidth, finalHeight)
                        const pngDataUrl = canvas.toDataURL('image/png', quality)
                        _revokeBlobURL(url)
                        
                        resolve({
                            success: true,
                            dataUrl: pngDataUrl,
                            width: finalWidth,
                            height: finalHeight,
                            scale: scale,
                            svg: fixedSVG
                        })
                    } catch (error) {
                        reject(error)
                    }
                }
                
                img.onerror = function() {
                    _revokeBlobURL(url)
                    reject(new Error('Failed to load SVG'))
                }
                
                img.src = url
            } catch (error) {
                reject(error)
            }
        })
    },
    convertToBlob: function(svg, options) {
        return this.convert(svg, options).then(function(result) {
            return _base64ToBlob(result.dataUrl, 'image/png')
        })
    },
    convertToBase64: function(svg, options) {
        return this.convert(svg, options).then(function(result) {
            return result.dataUrl
        })
    },
    download: function(svg, filename, options) {
        filename = filename || 'image.png'
        options = options || {}
        
        return this.convert(svg, options).then(function(result) {
            const link = document.createElement('a')
            link.href = result.dataUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return {
                success: true,
                filename: filename,
                width: result.width,
                height: result.height
            }
        })
    },
    convertFile: function(svgFile, options) {
        return new Promise(function(resolve, reject) {
            const reader = new FileReader()
            reader.onload = function(e) {
                const svg = e.target.result
                SVGToPNG.convert(svg, options).then(resolve).catch(reject)
            }
            reader.onerror = function(e) { reject(e) }
            reader.readAsText(svgFile)
        })
    },
    convertFromURL: function(url, options) {
        return new Promise(function(resolve, reject) {
            fetch(url)
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch SVG')
                    return response.text()
                })
                .then(function(svg) {
                    return SVGToPNG.convert(svg, options)
                })
                .then(resolve)
                .catch(reject)
        })
    },
    batchConvert: function(svgs, options) {
        if (!_isArray(svgs)) {
            return Promise.reject(new Error('SVGs must be an array'))
        }
        
        const promises = svgs.map(function(svg, index) {
            return SVGToPNG.convert(svg, options).then(function(result) {
                return {
                    index: index,
                    success: true,
                    dataUrl: result.dataUrl,
                    width: result.width,
                    height: result.height
                }
            }).catch(function(error) {
                return {
                    index: index,
                    success: false,
                    error: error.message
                }
            })
        })
        
        return Promise.all(promises)
    },
    batchDownload: function(svgs, options) {
        if (!_isArray(svgs)) {
            return Promise.reject(new Error('SVGs must be an array'))
        }
        
        options = options || {}
        const baseFilename = options.filename || 'image'
        
        return this.batchConvert(svgs, options).then(function(results) {
            const successful = results.filter(function(r) { return r.success })
            
            for (const result of successful) {
                const link = document.createElement('a')
                link.href = result.dataUrl
                link.download = baseFilename + '_' + (result.index + 1) + '.png'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
            
            return {
                success: true,
                total: results.length,
                successful: successful.length,
                failed: results.length - successful.length
            }
        })
    },
    convertWithBackground: function(svg, backgroundColor, options) {
        options = options || {}
        options.backgroundColor = backgroundColor
        return this.convert(svg, options)
    },
    convertWithScale: function(svg, scale, options) {
        options = options || {}
        options.scale = scale
        return this.convert(svg, options)
    },
    convertResponsive: function(svg, maxWidth, maxHeight, options) {
        options = options || {}
        let svgWidth = 0, svgHeight = 0
        const widthMatch = svg.match(/width="([^"]+)"/)
        const heightMatch = svg.match(/height="([^"]+)"/)
        const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)
        
        if (viewBoxMatch) {
            const parts = viewBoxMatch[1].split(/\s+/)
            svgWidth = parseFloat(parts[2])
            svgHeight = parseFloat(parts[3])
        } else if (widthMatch && heightMatch) {
            svgWidth = parseFloat(widthMatch[1])
            svgHeight = parseFloat(heightMatch[1])
        } else {
            svgWidth = this.settings.defaultWidth
            svgHeight = this.settings.defaultHeight
        }
        let finalWidth = svgWidth
        let finalHeight = svgHeight
        const aspectRatio = svgWidth / svgHeight
        
        if (maxWidth && svgWidth > maxWidth) {
            finalWidth = maxWidth
            finalHeight = maxWidth / aspectRatio
        }
        
        if (maxHeight && finalHeight > maxHeight) {
            finalHeight = maxHeight
            finalWidth = maxHeight * aspectRatio
        }
        
        options.width = Math.round(finalWidth)
        options.height = Math.round(finalHeight)
        
        return this.convert(svg, options)
    },
    getInfo: function(svg) {
        const validation = _validateSVG(svg)
        if (!validation.valid) {
            return { error: validation.error }
        }
        
        let width = 0, height = 0
        let viewBox = null
        let hasViewBox = false
        
        const widthMatch = svg.match(/width="([^"]+)"/)
        const heightMatch = svg.match(/height="([^"]+)"/)
        const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)
        
        if (viewBoxMatch) {
            hasViewBox = true
            const parts = viewBoxMatch[1].split(/\s+/)
            viewBox = {
                x: parseFloat(parts[0]),
                y: parseFloat(parts[1]),
                width: parseFloat(parts[2]),
                height: parseFloat(parts[3])
            }
            width = viewBox.width
            height = viewBox.height
        }
        
        if (widthMatch) width = parseFloat(widthMatch[1])
        if (heightMatch) height = parseFloat(heightMatch[1])
        const hasCSS = svg.includes('<style')
        const hasScripts = svg.includes('<script')
        const hasExternal = svg.includes('http://') || svg.includes('https://')
        
        return {
            width: width || 0,
            height: height || 0,
            aspectRatio: height > 0 ? width / height : 0,
            viewBox: viewBox,
            hasViewBox: hasViewBox,
            hasCSS: hasCSS,
            hasScripts: hasScripts,
            hasExternal: hasExternal,
            length: svg.length
        }
    },
    validate: function(svg) {
        return _validateSVG(svg)
    },
    minify: function(svg) {
        let minified = svg.replace(/<!--[\s\S]*?-->/g, '')
        minified = minified.replace(/\s+/g, ' ')
        minified = minified.replace(/>\s+</g, '><')
        minified = minified.replace(/<\?xml[^>]*\?>/, '')
        
        return minified.trim()
    },
    prettify: function(svg) {
        let indent = 0
        let result = ''
        const lines = svg.split('>')
        
        for (const line of lines) {
            if (line.includes('</')) {
                indent--
            }
            const trimmed = line.trim() + '>'
            if (trimmed !== '>') {
                result += '  '.repeat(Math.max(0, indent)) + trimmed + '\n'
            }
            if (line.includes('<') && !line.includes('/>') && !line.includes('</')) {
                indent++
            }
        }
        
        return result.trim()
    },
    setDefaultWidth: function(width) {
        if (!_isNumber(width) || width < 1) {
            throw new Error('Width must be a positive number')
        }
        this.settings.defaultWidth = width
        return this
    },
    
    setDefaultHeight: function(height) {
        if (!_isNumber(height) || height < 1) {
            throw new Error('Height must be a positive number')
        }
        this.settings.defaultHeight = height
        return this
    },
    
    setBackgroundColor: function(color) {
        if (!_isString(color)) {
            throw new Error('Background color must be a string')
        }
        this.settings.backgroundColor = color
        return this
    },
    
    setQuality: function(quality) {
        if (!_isNumber(quality) || quality < 0 || quality > 1) {
            throw new Error('Quality must be between 0 and 1')
        }
        this.settings.quality = quality
        return this
    },
    
    setScale: function(scale) {
        if (!_isNumber(scale) || scale < 0.1) {
            throw new Error('Scale must be >= 0.1')
        }
        this.settings.scale = scale
        return this
    }
}
if (typeof window !== 'undefined') {
    window.SVGToPNG = SVGToPNG
}
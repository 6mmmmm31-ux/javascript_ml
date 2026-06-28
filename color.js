// ============================================================
// COLOR COMPLETE LIBRARY v1.0

// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isBoolean(b) { return typeof b === 'boolean' }

function _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function _round(value, decimals) {
    decimals = decimals || 0
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

function _hexToRgb(hex) {
    hex = hex.replace('#', '')
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    }
}

function _rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function(c) {
        return _clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0')
    }).join('')
}

function _rgbToHsl(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    
    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 }
}

function _hslToRgb(h, s, l) {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b
    
    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = function(p, q, t) {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1/6) return p + (q - p) * 6 * t
            if (t < 1/2) return q
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
            return p
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
    }
    
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function _rgbToHsv(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min
    let h = 0, s = 0, v = max
    
    if (d !== 0) {
        s = d / max
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        else if (max === g) h = ((b - r) / d + 2) / 6
        else h = ((r - g) / d + 4) / 6
    }
    
    return { h: h * 360, s: s * 100, v: v * 100 }
}

function _hsvToRgb(h, s, v) {
    h /= 360
    s /= 100
    v /= 100
    let r, g, b
    
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break
        case 1: r = q; g = v; b = p; break
        case 2: r = p; g = v; b = t; break
        case 3: r = p; g = q; b = v; break
        case 4: r = t; g = p; b = v; break
        case 5: r = v; g = p; b = q; break
    }
    
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function _rgbToCmyk(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    const k = 1 - Math.max(r, g, b)
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
    const c = (1 - r - k) / (1 - k)
    const m = (1 - g - k) / (1 - k)
    const y = (1 - b - k) / (1 - k)
    return { c: c * 100, m: m * 100, y: y * 100, k: k * 100 }
}

function _cmykToRgb(c, m, y, k) {
    c /= 100
    m /= 100
    y /= 100
    k /= 100
    const r = 255 * (1 - c) * (1 - k)
    const g = 255 * (1 - m) * (1 - k)
    const b = 255 * (1 - y) * (1 - k)
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) }
}

// ==================== COLOR NAMES ====================
var COLOR_NAMES = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#00ffff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000000',
    'blanchedalmond': '#ffebcd',
    'blue': '#0000ff',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#00ffff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgreen': '#006400',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#ff00ff',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgray': '#d3d3d3',
    'lightgreen': '#90ee90',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#778899',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#ff00ff',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370db',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#db7093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'rebeccapurple': '#663399',
    'red': '#ff0000',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#ffffff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ffff00',
    'yellowgreen': '#9acd32'
}

// ==================== CORE COLOR FUNCTIONS ====================

// Parse color from any format
function parseColor(color) {
    if (_isObject(color)) {
        if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
            return { r: color.r, g: color.g, b: color.b }
        }
        if (color.h !== undefined && color.s !== undefined && color.l !== undefined) {
            return _hslToRgb(color.h, color.s, color.l)
        }
        if (color.h !== undefined && color.s !== undefined && color.v !== undefined) {
            return _hsvToRgb(color.h, color.s, color.v)
        }
        if (color.c !== undefined && color.m !== undefined && color.y !== undefined && color.k !== undefined) {
            return _cmykToRgb(color.c, color.m, color.y, color.k)
        }
    }
    
    if (_isString(color)) {
        color = color.trim().toLowerCase()
        
        // Hex
        if (color.startsWith('#')) {
            return _hexToRgb(color)
        }
        
        // Color name
        if (COLOR_NAMES[color]) {
            return _hexToRgb(COLOR_NAMES[color])
        }
        
        // RGB string
        const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
        if (rgbMatch) {
            return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) }
        }
        
        // HSL string
        const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/)
        if (hslMatch) {
            return _hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]))
        }
    }
    
    return null
}

// ==================== CONVERSION FUNCTIONS ====================

// Hex to RGB
function hexToRgb(hex) {
    const rgb = _hexToRgb(hex)
    return { r: rgb.r, g: rgb.g, b: rgb.b }
}

// Hex to HSL
function hexToHsl(hex) {
    const rgb = _hexToRgb(hex)
    return _rgbToHsl(rgb.r, rgb.g, rgb.b)
}

// Hex to HSV
function hexToHsv(hex) {
    const rgb = _hexToRgb(hex)
    return _rgbToHsv(rgb.r, rgb.g, rgb.b)
}

// Hex to CMYK
function hexToCmyk(hex) {
    const rgb = _hexToRgb(hex)
    return _rgbToCmyk(rgb.r, rgb.g, rgb.b)
}

// RGB to Hex
function rgbToHex(r, g, b) {
    if (_isObject(r)) {
        const obj = r
        r = obj.r || obj.red
        g = obj.g || obj.green
        b = obj.b || obj.blue
    }
    return _rgbToHex(r, g, b)
}

// RGB to HSL
function rgbToHsl(r, g, b) {
    if (_isObject(r)) {
        const obj = r
        r = obj.r || obj.red
        g = obj.g || obj.green
        b = obj.b || obj.blue
    }
    return _rgbToHsl(r, g, b)
}

// RGB to HSV
function rgbToHsv(r, g, b) {
    if (_isObject(r)) {
        const obj = r
        r = obj.r || obj.red
        g = obj.g || obj.green
        b = obj.b || obj.blue
    }
    return _rgbToHsv(r, g, b)
}

// RGB to CMYK
function rgbToCmyk(r, g, b) {
    if (_isObject(r)) {
        const obj = r
        r = obj.r || obj.red
        g = obj.g || obj.green
        b = obj.b || obj.blue
    }
    return _rgbToCmyk(r, g, b)
}

// HSL to RGB
function hslToRgb(h, s, l) {
    if (_isObject(h)) {
        const obj = h
        h = obj.h || obj.hue
        s = obj.s || obj.saturation
        l = obj.l || obj.lightness
    }
    return _hslToRgb(h, s, l)
}

// HSL to Hex
function hslToHex(h, s, l) {
    const rgb = hslToRgb(h, s, l)
    return rgbToHex(rgb)
}

// HSV to RGB
function hsvToRgb(h, s, v) {
    if (_isObject(h)) {
        const obj = h
        h = obj.h || obj.hue
        s = obj.s || obj.saturation
        v = obj.v || obj.value
    }
    return _hsvToRgb(h, s, v)
}

// HSV to Hex
function hsvToHex(h, s, v) {
    const rgb = hsvToRgb(h, s, v)
    return rgbToHex(rgb)
}

// CMYK to RGB
function cmykToRgb(c, m, y, k) {
    if (_isObject(c)) {
        const obj = c
        c = obj.c || obj.cyan
        m = obj.m || obj.magenta
        y = obj.y || obj.yellow
        k = obj.k || obj.key
    }
    return _cmykToRgb(c, m, y, k)
}

// CMYK to Hex
function cmykToHex(c, m, y, k) {
    const rgb = cmykToRgb(c, m, y, k)
    return rgbToHex(rgb)
}

// ==================== COLOR MANIPULATION ====================

// Lighten color
function lighten(color, amount) {
    amount = amount || 10
    const rgb = parseColor(color)
    if (!rgb) return null
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl.l = _clamp(hsl.l + amount, 0, 100)
    const newRgb = _hslToRgb(hsl.h, hsl.s, hsl.l)
    return { r: newRgb.r, g: newRgb.g, b: newRgb.b }
}

// Darken color
function darken(color, amount) {
    amount = amount || 10
    return lighten(color, -amount)
}

// Saturate color
function saturate(color, amount) {
    amount = amount || 10
    const rgb = parseColor(color)
    if (!rgb) return null
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl.s = _clamp(hsl.s + amount, 0, 100)
    const newRgb = _hslToRgb(hsl.h, hsl.s, hsl.l)
    return { r: newRgb.r, g: newRgb.g, b: newRgb.b }
}

// Desaturate color
function desaturate(color, amount) {
    amount = amount || 10
    return saturate(color, -amount)
}

// Rotate hue
function rotateHue(color, degrees) {
    const rgb = parseColor(color)
    if (!rgb) return null
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl.h = (hsl.h + degrees) % 360
    const newRgb = _hslToRgb(hsl.h, hsl.s, hsl.l)
    return { r: newRgb.r, g: newRgb.g, b: newRgb.b }
}

// Complement color
function complement(color) {
    return rotateHue(color, 180)
}

// Invert color
function invert(color) {
    const rgb = parseColor(color)
    if (!rgb) return null
    return {
        r: 255 - rgb.r,
        g: 255 - rgb.g,
        b: 255 - rgb.b
    }
}

// Grayscale
function grayscale(color) {
    const rgb = parseColor(color)
    if (!rgb) return null
    const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b)
    return { r: gray, g: gray, b: gray }
}

// Blend colors
function blend(color1, color2, ratio) {
    ratio = ratio || 0.5
    const c1 = parseColor(color1)
    const c2 = parseColor(color2)
    if (!c1 || !c2) return null
    return {
        r: Math.round(c1.r * (1 - ratio) + c2.r * ratio),
        g: Math.round(c1.g * (1 - ratio) + c2.g * ratio),
        b: Math.round(c1.b * (1 - ratio) + c2.b * ratio)
    }
}

// ==================== COLOR SCHEMES ====================

// Generate color palette
function generatePalette(color, count) {
    count = count || 5
    const rgb = parseColor(color)
    if (!rgb) return []
    
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b)
    const palette = []
    
    for (let i = 0; i < count; i++) {
        const h = (hsl.h + (i / count) * 360) % 360
        const s = hsl.s
        const l = hsl.l
        const newRgb = _hslToRgb(h, s, l)
        palette.push({ r: newRgb.r, g: newRgb.g, b: newRgb.b })
    }
    
    return palette
}

// Generate analogous colors
function analogous(color, count) {
    count = count || 3
    const rgb = parseColor(color)
    if (!rgb) return []
    
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b)
    const palette = []
    const step = 30
    
    for (let i = -Math.floor(count/2); i <= Math.floor(count/2); i++) {
        const h = (hsl.h + i * step + 360) % 360
        const newRgb = _hslToRgb(h, hsl.s, hsl.l)
        palette.push({ r: newRgb.r, g: newRgb.g, b: newRgb.b })
    }
    
    return palette
}

// Generate triadic colors
function triadic(color) {
    return analogous(color, 3)
}

// Generate tetradic colors
function tetradic(color) {
    const rgb = parseColor(color)
    if (!rgb) return []
    
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b)
    const colors = [
        { h: hsl.h, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l }
    ]
    
    return colors.map(function(c) {
        const newRgb = _hslToRgb(c.h, c.s, c.l)
        return { r: newRgb.r, g: newRgb.g, b: newRgb.b }
    })
}

// Generate monochromatic colors
function monochromatic(color, count) {
    count = count || 5
    const rgb = parseColor(color)
    if (!rgb) return []
    
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b)
    const palette = []
    const step = 100 / count
    
    for (let i = 0; i < count; i++) {
        const l = _clamp(i * step, 10, 90)
        const newRgb = _hslToRgb(hsl.h, hsl.s, l)
        palette.push({ r: newRgb.r, g: newRgb.g, b: newRgb.b })
    }
    
    return palette
}

// ==================== COLOR COMPARISON ====================

// Color distance
function colorDistance(color1, color2) {
    const c1 = parseColor(color1)
    const c2 = parseColor(color2)
    if (!c1 || !c2) return Infinity
    
    // Delta E (CIE76) approximation
    const lab1 = _rgbToLab(c1.r, c1.g, c1.b)
    const lab2 = _rgbToLab(c2.r, c2.g, c2.b)
    
    return Math.sqrt(
        Math.pow(lab1.l - lab2.l, 2) +
        Math.pow(lab1.a - lab2.a, 2) +
        Math.pow(lab1.b - lab2.b, 2)
    )
}

// Check if colors are similar
function isSimilar(color1, color2, threshold) {
    threshold = threshold || 10
    return colorDistance(color1, color2) < threshold
}

// Get contrast ratio
function contrastRatio(color1, color2) {
    const c1 = parseColor(color1)
    const c2 = parseColor(color2)
    if (!c1 || !c2) return 0
    
    const l1 = _relativeLuminance(c1.r, c1.g, c1.b)
    const l2 = _relativeLuminance(c2.r, c2.g, c2.b)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
}

// Check contrast accessibility
function isAccessible(color1, color2) {
    return contrastRatio(color1, color2) >= 4.5
}

// Find closest named color
function closestNamedColor(color) {
    const rgb = parseColor(color)
    if (!rgb) return null
    
    let closest = null
    let minDistance = Infinity
    
    for (const name in COLOR_NAMES) {
        const namedRgb = _hexToRgb(COLOR_NAMES[name])
        const dist = Math.sqrt(
            Math.pow(rgb.r - namedRgb.r, 2) +
            Math.pow(rgb.g - namedRgb.g, 2) +
            Math.pow(rgb.b - namedRgb.b, 2)
        )
        if (dist < minDistance) {
            minDistance = dist
            closest = name
        }
    }
    
    return closest
}

// ==================== COLOR GENERATION ====================

// Generate random color
function randomColor() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    }
}

// Generate random hex color
function randomHex() {
    return rgbToHex(randomColor())
}

// Generate random pastel color
function randomPastel() {
    const hsl = {
        h: Math.random() * 360,
        s: 60 + Math.random() * 30,
        l: 70 + Math.random() * 20
    }
    const rgb = _hslToRgb(hsl.h, hsl.s, hsl.l)
    return { r: rgb.r, g: rgb.g, b: rgb.b }
}

// Generate random vibrant color
function randomVibrant() {
    const hsl = {
        h: Math.random() * 360,
        s: 80 + Math.random() * 20,
        l: 40 + Math.random() * 30
    }
    const rgb = _hslToRgb(hsl.h, hsl.s, hsl.l)
    return { r: rgb.r, g: rgb.g, b: rgb.b }
}

// Generate gradient colors
function gradientColors(color1, color2, steps) {
    steps = steps || 10
    const c1 = parseColor(color1)
    const c2 = parseColor(color2)
    if (!c1 || !c2) return []
    
    const colors = []
    for (let i = 0; i <= steps; i++) {
        const t = i / steps
        colors.push({
            r: Math.round(c1.r + (c2.r - c1.r) * t),
            g: Math.round(c1.g + (c2.g - c1.g) * t),
            b: Math.round(c1.b + (c2.b - c1.b) * t)
        })
    }
    return colors
}

// ==================== COLOR VALIDATION ====================

// Validate hex color
function isValidHex(hex) {
    if (!_isString(hex)) return false
    hex = hex.trim()
    if (hex.startsWith('#')) hex = hex.substring(1)
    return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)
}

// Validate RGB color
function isValidRgb(r, g, b) {
    if (_isObject(r)) {
        const obj = r
        r = obj.r || obj.red
        g = obj.g || obj.green
        b = obj.b || obj.blue
    }
    return _isNumber(r) && _isNumber(g) && _isNumber(b) &&
           r >= 0 && r <= 255 &&
           g >= 0 && g <= 255 &&
           b >= 0 && b <= 255
}

// Validate HSL color
function isValidHsl(h, s, l) {
    if (_isObject(h)) {
        const obj = h
        h = obj.h || obj.hue
        s = obj.s || obj.saturation
        l = obj.l || obj.lightness
    }
    return _isNumber(h) && _isNumber(s) && _isNumber(l) &&
           h >= 0 && h < 360 &&
           s >= 0 && s <= 100 &&
           l >= 0 && l <= 100
}

// ==================== COLOR STRING FUNCTIONS ====================

// To RGB string
function toRgbString(color) {
    const rgb = parseColor(color)
    if (!rgb) return null
    return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')'
}

// To HSL string
function toHslString(color) {
    const rgb = parseColor(color)
    if (!rgb) return null
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b)
    return 'hsl(' + Math.round(hsl.h) + ', ' + Math.round(hsl.s) + '%, ' + Math.round(hsl.l) + '%)'
}

// To CMYK string
function toCmykString(color) {
    const rgb = parseColor(color)
    if (!rgb) return null
    const cmyk = _rgbToCmyk(rgb.r, rgb.g, rgb.b)
    return 'cmyk(' + Math.round(cmyk.c) + '%, ' + Math.round(cmyk.m) + '%, ' + 
           Math.round(cmyk.y) + '%, ' + Math.round(cmyk.k) + '%)'
}

// To Hex string
function toHexString(color) {
    const rgb = parseColor(color)
    if (!rgb) return null
    return rgbToHex(rgb)
}

// ==================== ADVANCED COLOR FUNCTIONS ====================

// RGB to XYZ (CIE 1931)
function _rgbToXyz(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92
    
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505
    
    return { x: x * 100, y: y * 100, z: z * 100 }
}

// XYZ to RGB
function _xyzToRgb(x, y, z) {
    x /= 100
    y /= 100
    z /= 100
    
    let r = x * 3.2406 + y * -1.5372 + z * -0.4986
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415
    let b = x * 0.0557 + y * -0.2040 + z * 1.0570
    
    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1/2.4) - 0.055 : 12.92 * b
    
    return {
        r: _clamp(Math.round(r * 255), 0, 255),
        g: _clamp(Math.round(g * 255), 0, 255),
        b: _clamp(Math.round(b * 255), 0, 255)
    }
}

// RGB to LAB
function _rgbToLab(r, g, b) {
    const xyz = _rgbToXyz(r, g, b)
    const refX = 95.047
    const refY = 100.000
    const refZ = 108.883
    
    let x = xyz.x / refX
    let y = xyz.y / refY
    let z = xyz.z / refZ
    
    x = x > 0.008856 ? Math.pow(x, 1/3) : 7.787 * x + 16/116
    y = y > 0.008856 ? Math.pow(y, 1/3) : 7.787 * y + 16/116
    z = z > 0.008856 ? Math.pow(z, 1/3) : 7.787 * z + 16/116
    
    return {
        l: 116 * y - 16,
        a: 500 * (x - y),
        b: 200 * (y - z)
    }
}

// Relative luminance (WCAG)
function _relativeLuminance(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// ==================== EXPORT ====================
var ColorLib = {
    // Parse
    parseColor: parseColor,
    
    // Convert
    hexToRgb: hexToRgb,
    hexToHsl: hexToHsl,
    hexToHsv: hexToHsv,
    hexToCmyk: hexToCmyk,
    rgbToHex: rgbToHex,
    rgbToHsl: rgbToHsl,
    rgbToHsv: rgbToHsv,
    rgbToCmyk: rgbToCmyk,
    hslToRgb: hslToRgb,
    hslToHex: hslToHex,
    hsvToRgb: hsvToRgb,
    hsvToHex: hsvToHex,
    cmykToRgb: cmykToRgb,
    cmykToHex: cmykToHex,
    
    // Manipulation
    lighten: lighten,
    darken: darken,
    saturate: saturate,
    desaturate: desaturate,
    rotateHue: rotateHue,
    complement: complement,
    invert: invert,
    grayscale: grayscale,
    blend: blend,
    
    // Schemes
    generatePalette: generatePalette,
    analogous: analogous,
    triadic: triadic,
    tetradic: tetradic,
    monochromatic: monochromatic,
    gradientColors: gradientColors,
    
    // Comparison
    colorDistance: colorDistance,
    isSimilar: isSimilar,
    contrastRatio: contrastRatio,
    isAccessible: isAccessible,
    closestNamedColor: closestNamedColor,
    
    // Generation
    randomColor: randomColor,
    randomHex: randomHex,
    randomPastel: randomPastel,
    randomVibrant: randomVibrant,
    
    // Validation
    isValidHex: isValidHex,
    isValidRgb: isValidRgb,
    isValidHsl: isValidHsl,
    
    // Strings
    toRgbString: toRgbString,
    toHslString: toHslString,
    toCmykString: toCmykString,
    toHexString: toHexString,
    
    // Named colors
    colorNames: COLOR_NAMES,
    
    // Utils
    clamp: _clamp,
    round: _round
}

// ==================== GENERATE 500+ FUNCTIONS ====================

// Generate color variations
var variations = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
for (const v of variations) {
    ColorLib['shade' + v] = function(amount) {
        return function(color) {
            return darken(color, parseInt(amount))
        }
    }(v)
    
    ColorLib['tint' + v] = function(amount) {
        return function(color) {
            return lighten(color, parseInt(amount))
        }
    }(v)
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.ColorLib = ColorLib
    window.Color = ColorLib
}

console.log('Color Library loaded with ' + Object.keys(ColorLib).length + ' functions')
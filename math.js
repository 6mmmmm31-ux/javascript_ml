// ==================== CONSTANTS ====================
const E = 2.71828182845904523536
const PI = 3.14159265358979323846
const PHI = 1.61803398874989484820
const SQRT2 = 1.41421356237309504880
const SQRT3 = 1.73205080756887729352
const SQRT5 = 2.23606797749978969640
const LN2 = 0.69314718055994530942
const LN10 = 2.30258509299404568402
const LOG2E = 1.44269504088896340736
const LOG10E = 0.43429448190325182765
const TAU = 6.28318530717958647692
const HALF_PI = 1.57079632679489661923
const QUARTER_PI = 0.78539816339744830962
const EULER = 0.57721566490153286060
const CATALAN = 0.91596559417721901505
const APERY = 1.20205690315959428539
const GOLDEN_ANGLE = 2.39996322972865332223
const SQRT_PI = 1.77245385090551602729
const INV_PI = 0.31830988618379067154
const INV_TAU = 0.15915494309189533577
const INV_SQRT2 = 0.70710678118654752440
const INV_SQRT3 = 0.57735026918962576450
const INV_PHI = 0.61803398874989484820
const LN_PHI = 0.48121182505960344749
const DEG2RAD = 0.01745329251994329577
const RAD2DEG = 57.2957795130823208768

// ==================== HELPERS ====================
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) && isFinite(n) }
function _toArray(args) { return Array.isArray(args[0]) ? args[0] : args }
function _validateNumber(n, name = 'value') {
    if (!_isNumber(n)) throw new Error(`${name} must be a number`)
    return n
}
function _validateArray(arr, name = 'array') {
    if (!Array.isArray(arr)) throw new Error(`${name} must be an array`)
    if (arr.length === 0) throw new Error(`${name} cannot be empty`)
    arr.forEach((v, i) => { if (!_isNumber(v)) throw new Error(`${name}[${i}] must be a number`) })
    return arr
}

// ==================== BASIC ARITHMETIC ====================
function add(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'add')
    return arr.reduce((a, b) => a + b, 0)
}

function sub(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'sub')
    if (arr.length === 1) return -arr[0]
    return arr.reduce((a, b) => a - b)
}

function mul(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'mul')
    return arr.reduce((a, b) => a * b, 1)
}

function div(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'div')
    if (arr.length === 1) return 1 / arr[0]
    return arr.reduce((a, b) => { if (b === 0) throw new Error('Division by zero'); return a / b })
}

function mod(a, b) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b')
    if (b === 0) throw new Error('Modulo by zero')
    return a % b
}

function pow(a, b) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b')
    return Math.pow(a, b)
}

function sqrt(a) {
    _validateNumber(a, 'a')
    if (a < 0) throw new Error('Square root of negative number')
    return Math.sqrt(a)
}

function cbrt(a) {
    _validateNumber(a, 'a')
    return Math.cbrt(a)
}

function abs(a) {
    _validateNumber(a, 'a')
    return Math.abs(a)
}

function neg(a) {
    _validateNumber(a, 'a')
    return -a
}

function inv(a) {
    _validateNumber(a, 'a')
    if (a === 0) throw new Error('Division by zero')
    return 1 / a
}

function inc(a) {
    _validateNumber(a, 'a')
    return a + 1
}

function dec(a) {
    _validateNumber(a, 'a')
    return a - 1
}

function sq(a) {
    _validateNumber(a, 'a')
    return a * a
}

function cube(a) {
    _validateNumber(a, 'a')
    return a * a * a
}

function pow2(a) { return sq(a) }
function pow3(a) { return cube(a) }
function pow4(a) { const s = sq(a); return s * s }
function pow5(a) { const s = sq(a); return s * s * a }
function pow6(a) { const s = sq(a); return s * s * s }
function pow7(a) { const s = sq(a); return s * s * s * a }
function pow8(a) { const s = sq(a); const s2 = s * s; return s2 * s2 }
function pow9(a) { const s = sq(a); const s2 = s * s; return s2 * s2 * a }
function pow10(a) { const s = sq(a); const s2 = s * s; return s2 * s2 * s }

function hypot(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'hypot')
    return Math.hypot(...arr)
}

function fma(a, b, c) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b'); _validateNumber(c, 'c')
    return Math.fma ? Math.fma(a, b, c) : a * b + c
}

function fmod(a, b) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b')
    return a % b
}

function remainder(a, b) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b')
    return a - Math.round(a / b) * b
}

function copysign(a, b) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b')
    return Math.abs(a) * (b < 0 ? -1 : 1)
}

function nextafter(a, b) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b')
    if (a === b) return a
    if (a < b) {
        const eps = Math.ulp ? Math.ulp(a) : 1e-15
        return a + eps
    }
    const eps = Math.ulp ? Math.ulp(a) : 1e-15
    return a - eps
}

function ulp(a) {
    _validateNumber(a, 'a')
    return Math.ulp ? Math.ulp(a) : 1e-15
}

// ==================== TRIGONOMETRY ====================
function sin(a) {
    _validateNumber(a, 'a')
    return Math.sin(a)
}

function cos(a) {
    _validateNumber(a, 'a')
    return Math.cos(a)
}

function tan(a) {
    _validateNumber(a, 'a')
    return Math.tan(a)
}

function cot(a) {
    _validateNumber(a, 'a')
    const t = Math.tan(a)
    if (t === 0) throw new Error('Cotangent undefined')
    return 1 / t
}

function sec(a) {
    _validateNumber(a, 'a')
    const c = Math.cos(a)
    if (c === 0) throw new Error('Secant undefined')
    return 1 / c
}

function csc(a) {
    _validateNumber(a, 'a')
    const s = Math.sin(a)
    if (s === 0) throw new Error('Cosecant undefined')
    return 1 / s
}

function asin(a) {
    _validateNumber(a, 'a')
    if (a < -1 || a > 1) throw new Error('Domain error')
    return Math.asin(a)
}

function acos(a) {
    _validateNumber(a, 'a')
    if (a < -1 || a > 1) throw new Error('Domain error')
    return Math.acos(a)
}

function atan(a) {
    _validateNumber(a, 'a')
    return Math.atan(a)
}

function atan2(y, x) {
    _validateNumber(y, 'y'); _validateNumber(x, 'x')
    return Math.atan2(y, x)
}

function asec(a) {
    _validateNumber(a, 'a')
    if (Math.abs(a) < 1) throw new Error('Domain error')
    return Math.acos(1 / a)
}

function acsc(a) {
    _validateNumber(a, 'a')
    if (Math.abs(a) < 1) throw new Error('Domain error')
    return Math.asin(1 / a)
}

function acot(a) {
    _validateNumber(a, 'a')
    return Math.atan(1 / a)
}

function versin(a) {
    _validateNumber(a, 'a')
    return 1 - Math.cos(a)
}

function coversin(a) {
    _validateNumber(a, 'a')
    return 1 - Math.sin(a)
}

function haversin(a) {
    _validateNumber(a, 'a')
    return (1 - Math.cos(a)) / 2
}

function exsec(a) {
    _validateNumber(a, 'a')
    const s = Math.cos(a)
    if (s === 0) throw new Error('Exsecant undefined')
    return 1 / s - 1
}

function excsc(a) {
    _validateNumber(a, 'a')
    const s = Math.sin(a)
    if (s === 0) throw new Error('Excosecant undefined')
    return 1 / s - 1
}

// ==================== HYPERBOLIC ====================
function sinh(a) {
    _validateNumber(a, 'a')
    return Math.sinh(a)
}

function cosh(a) {
    _validateNumber(a, 'a')
    return Math.cosh(a)
}

function tanh(a) {
    _validateNumber(a, 'a')
    return Math.tanh(a)
}

function coth(a) {
    _validateNumber(a, 'a')
    const t = Math.tanh(a)
    if (t === 0) throw new Error('Coth undefined')
    return 1 / t
}

function sech(a) {
    _validateNumber(a, 'a')
    const c = Math.cosh(a)
    return 1 / c
}

function csch(a) {
    _validateNumber(a, 'a')
    const s = Math.sinh(a)
    if (s === 0) throw new Error('Csch undefined')
    return 1 / s
}

function asinh(a) {
    _validateNumber(a, 'a')
    return Math.asinh(a)
}

function acosh(a) {
    _validateNumber(a, 'a')
    if (a < 1) throw new Error('Domain error')
    return Math.acosh(a)
}

function atanh(a) {
    _validateNumber(a, 'a')
    if (Math.abs(a) >= 1) throw new Error('Domain error')
    return Math.atanh(a)
}

function acoth(a) {
    _validateNumber(a, 'a')
    if (Math.abs(a) <= 1) throw new Error('Domain error')
    return 0.5 * Math.log((a + 1) / (a - 1))
}

function asech(a) {
    _validateNumber(a, 'a')
    if (a <= 0 || a > 1) throw new Error('Domain error')
    return Math.acosh(1 / a)
}

function acsch(a) {
    _validateNumber(a, 'a')
    if (a === 0) throw new Error('Domain error')
    return Math.asinh(1 / a)
}

// ==================== LOGARITHMS & EXPONENTIALS ====================
function exp(a) {
    _validateNumber(a, 'a')
    return Math.exp(a)
}

function expm1(a) {
    _validateNumber(a, 'a')
    return Math.expm1(a)
}

function log(a) {
    _validateNumber(a, 'a')
    if (a <= 0) throw new Error('Domain error')
    return Math.log(a)
}

function log10(a) {
    _validateNumber(a, 'a')
    if (a <= 0) throw new Error('Domain error')
    return Math.log10(a)
}

function log2(a) {
    _validateNumber(a, 'a')
    if (a <= 0) throw new Error('Domain error')
    return Math.log2(a)
}

function log1p(a) {
    _validateNumber(a, 'a')
    if (a <= -1) throw new Error('Domain error')
    return Math.log1p(a)
}

function logb(a, base) {
    _validateNumber(a, 'a'); _validateNumber(base, 'base')
    if (a <= 0) throw new Error('Domain error')
    if (base <= 0 || base === 1) throw new Error('Invalid base')
    return Math.log(a) / Math.log(base)
}

function ln(a) { return log(a) }
function lg(a) { return log10(a) }
function lb(a) { return log2(a) }

function exp2(a) {
    _validateNumber(a, 'a')
    return Math.pow(2, a)
}

function exp10(a) {
    _validateNumber(a, 'a')
    return Math.pow(10, a)
}

// ==================== ROUNDING ====================
function floor(a) {
    _validateNumber(a, 'a')
    return Math.floor(a)
}

function ceil(a) {
    _validateNumber(a, 'a')
    return Math.ceil(a)
}

function round(a) {
    _validateNumber(a, 'a')
    return Math.round(a)
}

function trunc(a) {
    _validateNumber(a, 'a')
    return Math.trunc(a)
}

function fix(a) { return trunc(a) }

function frac(a) {
    _validateNumber(a, 'a')
    return a - Math.floor(a)
}

function modf(a) {
    _validateNumber(a, 'a')
    const int = Math.trunc(a)
    return { int, frac: a - int }
}

function roundTo(a, digits = 0) {
    _validateNumber(a, 'a'); _validateNumber(digits, 'digits')
    const factor = Math.pow(10, digits)
    return Math.round(a * factor) / factor
}

function floorTo(a, digits = 0) {
    _validateNumber(a, 'a'); _validateNumber(digits, 'digits')
    const factor = Math.pow(10, digits)
    return Math.floor(a * factor) / factor
}

function ceilTo(a, digits = 0) {
    _validateNumber(a, 'a'); _validateNumber(digits, 'digits')
    const factor = Math.pow(10, digits)
    return Math.ceil(a * factor) / factor
}

function nearest(a, step = 1) {
    _validateNumber(a, 'a'); _validateNumber(step, 'step')
    return Math.round(a / step) * step
}

// ==================== SIGN & COMPARISON ====================
function sign(a) {
    _validateNumber(a, 'a')
    return Math.sign(a)
}

function signbit(a) {
    _validateNumber(a, 'a')
    return Object.is(a, -0) || (a < 0)
}

function isFiniteNumber(a) {
    return _isNumber(a) && isFinite(a)
}

function isNaNValue(a) {
    return typeof a === 'number' && isNaN(a)
}

function isInteger(a) {
    return _isNumber(a) && Number.isInteger(a)
}

function isFloat(a) {
    return _isNumber(a) && !Number.isInteger(a)
}

function isPositive(a) {
    return _isNumber(a) && a > 0
}

function isNegative(a) {
    return _isNumber(a) && a < 0
}

function isZero(a) {
    return _isNumber(a) && a === 0
}

function isEven(a) {
    _validateNumber(a, 'a')
    return Number.isInteger(a) && a % 2 === 0
}

function isOdd(a) {
    _validateNumber(a, 'a')
    return Number.isInteger(a) && a % 2 !== 0
}

function isPrime(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 2) return false
    for (let i = 2; i * i <= a; i++) {
        if (a % i === 0) return false
    }
    return true
}

function isPerfect(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 1) return false
    let sum = 0
    for (let i = 1; i < a; i++) {
        if (a % i === 0) sum += i
    }
    return sum === a
}

function isArmstrong(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 0) return false
    const str = String(a)
    const n = str.length
    let sum = 0
    for (const digit of str) {
        sum += Math.pow(parseInt(digit), n)
    }
    return sum === a
}

function clamp(a, min, max) {
    _validateNumber(a, 'a'); _validateNumber(min, 'min'); _validateNumber(max, 'max')
    if (min > max) throw new Error('min must be <= max')
    return Math.min(Math.max(a, min), max)
}

function clamp01(a) {
    _validateNumber(a, 'a')
    return clamp(a, 0, 1)
}

function clampNeg1_1(a) {
    _validateNumber(a, 'a')
    return clamp(a, -1, 1)
}

function max(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'max')
    return Math.max(...arr)
}

function min(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'min')
    return Math.min(...arr)
}

function max2(a, b) { return a > b ? a : b }
function min2(a, b) { return a < b ? a : b }

function between(a, low, high) {
    _validateNumber(a, 'a'); _validateNumber(low, 'low'); _validateNumber(high, 'high')
    return a >= low && a <= high
}

function approxEqual(a, b, epsilon = 1e-10) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b'); _validateNumber(epsilon, 'epsilon')
    return Math.abs(a - b) < epsilon
}

// ==================== STATISTICS ====================
function sum(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'sum')
    return arr.reduce((a, b) => a + b, 0)
}

function product(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'product')
    return arr.reduce((a, b) => a * b, 1)
}

function mean(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'mean')
    return sum(arr) / arr.length
}

function avg(...args) { return mean(...args) }

function median(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'median')
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2
    }
    return sorted[mid]
}

function mode(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'mode')
    const freq = {}
    let maxFreq = 0
    let modes = []
    for (const val of arr) {
        freq[val] = (freq[val] || 0) + 1
        if (freq[val] > maxFreq) {
            maxFreq = freq[val]
            modes = [val]
        } else if (freq[val] === maxFreq) {
            modes.push(val)
        }
    }
    return modes.length === 1 ? modes[0] : modes
}

function variance(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'variance')
    if (arr.length < 2) return 0
    const m = mean(arr)
    return arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length
}

function varianceSample(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'varianceSample')
    if (arr.length < 2) return 0
    const m = mean(arr)
    return arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length - 1)
}

function stddev(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'stddev')
    return Math.sqrt(variance(arr))
}

function stddevSample(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'stddevSample')
    return Math.sqrt(varianceSample(arr))
}

function range(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'range')
    return Math.max(...arr) - Math.min(...arr)
}

function iqr(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'iqr')
    const sorted = [...arr].sort((a, b) => a - b)
    const q1 = quantile(sorted, 0.25)
    const q3 = quantile(sorted, 0.75)
    return q3 - q1
}

function quantile(data, q) {
    _validateArray(data, 'data')
    _validateNumber(q, 'q')
    if (q < 0 || q > 1) throw new Error('q must be between 0 and 1')
    const sorted = [...data].sort((a, b) => a - b)
    const pos = q * (sorted.length - 1)
    const base = Math.floor(pos)
    const frac = pos - base
    if (base + 1 >= sorted.length) return sorted[base]
    return sorted[base] + frac * (sorted[base + 1] - sorted[base])
}

function percentile(data, p) {
    _validateArray(data, 'data')
    _validateNumber(p, 'p')
    return quantile(data, p / 100)
}

function skewness(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'skewness')
    if (arr.length < 3) return 0
    const m = mean(arr)
    const s = stddev(arr)
    if (s === 0) return 0
    return arr.reduce((a, b) => a + ((b - m) / s) ** 3, 0) / arr.length
}

function kurtosis(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'kurtosis')
    if (arr.length < 4) return 0
    const m = mean(arr)
    const s = stddev(arr)
    if (s === 0) return 0
    return arr.reduce((a, b) => a + ((b - m) / s) ** 4, 0) / arr.length - 3
}

function covariance(x, y) {
    _validateArray(x, 'x'); _validateArray(y, 'y')
    if (x.length !== y.length) throw new Error('Arrays must have same length')
    if (x.length < 2) return 0
    const mx = mean(x)
    const my = mean(y)
    return x.reduce((a, b, i) => a + (b - mx) * (y[i] - my), 0) / x.length
}

function correlation(x, y) {
    _validateArray(x, 'x'); _validateArray(y, 'y')
    if (x.length !== y.length) throw new Error('Arrays must have same length')
    const cov = covariance(x, y)
    const sx = stddev(x)
    const sy = stddev(y)
    if (sx === 0 || sy === 0) return 0
    return cov / (sx * sy)
}

function count(...args) {
    const arr = _toArray(args)
    return arr.length
}

function unique(...args) {
    const arr = _toArray(args)
    return [...new Set(arr)]
}

function frequency(...args) {
    const arr = _toArray(args)
    const freq = {}
    for (const val of arr) {
        freq[val] = (freq[val] || 0) + 1
    }
    return freq
}

// ==================== SORTING & SEARCHING ====================
function sortAsc(...args) {
    const arr = _toArray(args)
    return [...arr].sort((a, b) => a - b)
}

function sortDesc(...args) {
    const arr = _toArray(args)
    return [...arr].sort((a, b) => b - a)
}

function minIndex(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'minIndex')
    let min = arr[0]
    let idx = 0
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) { min = arr[i]; idx = i }
    }
    return idx
}

function maxIndex(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'maxIndex')
    let max = arr[0]
    let idx = 0
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) { max = arr[i]; idx = i }
    }
    return idx
}

function argSort(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'argSort')
    return arr.map((_, i) => i).sort((a, b) => arr[a] - arr[b])
}

function argMax(...args) {
    const arr = _toArray(args)
    return maxIndex(arr)
}

function argMin(...args) {
    const arr = _toArray(args)
    return minIndex(arr)
}

// ==================== COMBINATORICS ====================
function factorial(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 0) throw new Error('Must be non-negative integer')
    if (a === 0 || a === 1) return 1
    let result = 1
    for (let i = 2; i <= a; i++) result *= i
    return result
}

function doubleFactorial(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 0) throw new Error('Must be non-negative integer')
    let result = 1
    for (let i = a; i > 0; i -= 2) result *= i
    return result
}

function factorial2(a) { return doubleFactorial(a) }

function binomial(n, k) {
    _validateNumber(n, 'n'); _validateNumber(k, 'k')
    if (!Number.isInteger(n) || !Number.isInteger(k)) throw new Error('Must be integers')
    if (k < 0 || k > n) return 0
    return factorial(n) / (factorial(k) * factorial(n - k))
}

function permutations(n, k) {
    _validateNumber(n, 'n'); _validateNumber(k, 'k')
    if (!Number.isInteger(n) || !Number.isInteger(k)) throw new Error('Must be integers')
    if (k < 0 || k > n) return 0
    return factorial(n) / factorial(n - k)
}

function combinations(n, k) { return binomial(n, k) }

function multinomial(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'multinomial')
    const n = arr.reduce((a, b) => a + b, 0)
    let result = factorial(n)
    for (const k of arr) {
        result /= factorial(k)
    }
    return result
}

function catalanNumber(n) {
    _validateNumber(n, 'n')
    if (!Number.isInteger(n) || n < 0) throw new Error('Must be non-negative integer')
    return binomial(2 * n, n) / (n + 1)
}

function bellNumber(n) {
    _validateNumber(n, 'n')
    if (!Number.isInteger(n) || n < 0) throw new Error('Must be non-negative integer')
    if (n === 0) return 1
    const bell = [1]
    for (let i = 1; i <= n; i++) {
        let sum = 0
        for (let j = 0; j < i; j++) {
            sum += binomial(i - 1, j) * bell[j]
        }
        bell.push(sum)
    }
    return bell[n]
}

function stirling2(n, k) {
    _validateNumber(n, 'n'); _validateNumber(k, 'k')
    if (!Number.isInteger(n) || !Number.isInteger(k)) throw new Error('Must be integers')
    if (k < 0 || k > n) return 0
    if (k === 0) return n === 0 ? 1 : 0
    if (k === 1 || k === n) return 1
    return k * stirling2(n - 1, k) + stirling2(n - 1, k - 1)
}

// ==================== NUMBER THEORY ====================
function gcd(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'gcd')
    const gcd2 = (a, b) => {
        a = Math.abs(a); b = Math.abs(b)
        while (b) { [a, b] = [b, a % b] }
        return a
    }
    return arr.reduce((a, b) => gcd2(a, b))
}

function lcm(...args) {
    const arr = _toArray(args)
    _validateArray(arr, 'lcm')
    const lcm2 = (a, b) => {
        if (a === 0 || b === 0) return 0
        return Math.abs(a * b) / gcd(a, b)
    }
    return arr.reduce((a, b) => lcm2(a, b))
}

function factors(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer')
    const result = []
    for (let i = 1; i <= a; i++) {
        if (a % i === 0) result.push(i)
    }
    return result
}

function primeFactors(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 2) throw new Error('Must be integer >= 2')
    let n = a
    const result = []
    for (let i = 2; i * i <= n; i++) {
        while (n % i === 0) {
            result.push(i)
            n /= i
        }
    }
    if (n > 1) result.push(n)
    return result
}

function divisors(a) { return factors(a) }

function properDivisors(a) {
    const f = factors(a)
    return f.slice(0, -1)
}

function eulerPhi(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer')
    let result = a
    let n = a
    for (let p = 2; p * p <= n; p++) {
        if (n % p === 0) {
            while (n % p === 0) n /= p
            result -= result / p
        }
    }
    if (n > 1) result -= result / n
    return result
}

function mobius(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer')
    if (a === 1) return 1
    const pf = primeFactors(a)
    const unique = [...new Set(pf)]
    if (unique.length !== pf.length) return 0
    return unique.length % 2 === 0 ? 1 : -1
}

function tau(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer')
    let result = 1
    let n = a
    for (let p = 2; p * p <= n; p++) {
        let count = 0
        while (n % p === 0) { n /= p; count++ }
        result *= (count + 1)
    }
    if (n > 1) result *= 2
    return result
}

function sigma(a) {
    _validateNumber(a, 'a')
    if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer')
    let result = 1
    let n = a
    for (let p = 2; p * p <= n; p++) {
        let sum = 1
        let term = 1
        while (n % p === 0) {
            n /= p
            term *= p
            sum += term
        }
        result *= sum
    }
    if (n > 1) result *= (1 + n)
    return result
}

function fibonacci(n) {
    _validateNumber(n, 'n')
    if (!Number.isInteger(n) || n < 0) throw new Error('Must be non-negative integer')
    if (n === 0) return 0
    if (n === 1) return 1
    let a = 0, b = 1
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b]
    }
    return b
}

function lucas(n) {
    _validateNumber(n, 'n')
    if (!Number.isInteger(n) || n < 0) throw new Error('Must be non-negative integer')
    if (n === 0) return 2
    if (n === 1) return 1
    let a = 2, b = 1
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b]
    }
    return b
}

// ==================== INTERPOLATION ====================
function lerp(a, b, t) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b'); _validateNumber(t, 't')
    return a + (b - a) * t
}

function inverseLerp(a, b, v) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b'); _validateNumber(v, 'v')
    if (a === b) return 0
    return (v - a) / (b - a)
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    _validateNumber(value, 'value'); _validateNumber(inMin, 'inMin')
    _validateNumber(inMax, 'inMax'); _validateNumber(outMin, 'outMin')
    _validateNumber(outMax, 'outMax')
    if (inMin === inMax) throw new Error('Input range cannot be zero')
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}

function smoothstep(edge0, edge1, x) {
    _validateNumber(edge0, 'edge0'); _validateNumber(edge1, 'edge1'); _validateNumber(x, 'x')
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
}

function smootherstep(edge0, edge1, x) {
    _validateNumber(edge0, 'edge0'); _validateNumber(edge1, 'edge1'); _validateNumber(x, 'x')
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * t * (t * (t * 6 - 15) + 10)
}

function mix(a, b, t) { return lerp(a, b, t) }

function step(edge, x) {
    _validateNumber(edge, 'edge'); _validateNumber(x, 'x')
    return x < edge ? 0 : 1
}

function pulse(center, width, x) {
    _validateNumber(center, 'center'); _validateNumber(width, 'width'); _validateNumber(x, 'x')
    return x >= center - width / 2 && x <= center + width / 2 ? 1 : 0
}

// ==================== ACTIVATION FUNCTIONS ====================
function sigmoid(x) {
    _validateNumber(x, 'x')
    return 1 / (1 + Math.exp(-x))
}

function logistic(x) { return sigmoid(x) }

function tanhActivation(x) {
    _validateNumber(x, 'x')
    return Math.tanh(x)
}

function relu(x) {
    _validateNumber(x, 'x')
    return Math.max(0, x)
}

function leakyRelu(x, alpha = 0.01) {
    _validateNumber(x, 'x'); _validateNumber(alpha, 'alpha')
    return x > 0 ? x : alpha * x
}

function elu(x, alpha = 1) {
    _validateNumber(x, 'x'); _validateNumber(alpha, 'alpha')
    return x > 0 ? x : alpha * (Math.exp(x) - 1)
}

function selu(x) {
    _validateNumber(x, 'x')
    const alpha = 1.6732632423543772848170429916717
    const scale = 1.0507009873554804934193349852946
    return scale * (x > 0 ? x : alpha * (Math.exp(x) - 1))
}

function gelu(x) {
    _validateNumber(x, 'x')
    return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)))
}

function softmax(arr) {
    _validateArray(arr, 'softmax')
    const maxVal = Math.max(...arr)
    const expVals = arr.map(x => Math.exp(x - maxVal))
    const sumExp = expVals.reduce((a, b) => a + b, 0)
    return expVals.map(x => x / sumExp)
}

function logSoftmax(arr) {
    _validateArray(arr, 'logSoftmax')
    const sm = softmax(arr)
    return sm.map(x => Math.log(x))
}

// ==================== MATRIX OPERATIONS ====================
function matrixAdd(A, B) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be matrices')
    if (A.length !== B.length || A[0].length !== B[0].length) {
        throw new Error('Matrices must have same dimensions')
    }
    return A.map((row, i) => row.map((val, j) => val + B[i][j]))
}

function matrixSub(A, B) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be matrices')
    if (A.length !== B.length || A[0].length !== B[0].length) {
        throw new Error('Matrices must have same dimensions')
    }
    return A.map((row, i) => row.map((val, j) => val - B[i][j]))
}

function matrixMul(A, B) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be matrices')
    const rows = A.length
    const cols = B[0].length
    const inner = B.length
    if (A[0].length !== inner) throw new Error('Invalid matrix dimensions')
    const result = Array(rows).fill(0).map(() => Array(cols).fill(0))
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < inner; k++) {
                result[i][j] += A[i][k] * B[k][j]
            }
        }
    }
    return result
}

function matrixTranspose(A) {
    if (!Array.isArray(A)) throw new Error('Input must be a matrix')
    return A[0].map((_, i) => A.map(row => row[i]))
}

function matrixScalarMul(A, scalar) {
    _validateNumber(scalar, 'scalar')
    if (!Array.isArray(A)) throw new Error('Input must be a matrix')
    return A.map(row => row.map(val => val * scalar))
}

function matrixIdentity(n) {
    _validateNumber(n, 'n')
    if (!Number.isInteger(n) || n < 1) throw new Error('Must be positive integer')
    return Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0))
}

function matrixZeros(rows, cols) {
    _validateNumber(rows, 'rows'); _validateNumber(cols, 'cols')
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1) {
        throw new Error('Rows and columns must be positive integers')
    }
    return Array(rows).fill(0).map(() => Array(cols).fill(0))
}

function matrixOnes(rows, cols) {
    _validateNumber(rows, 'rows'); _validateNumber(cols, 'cols')
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1) {
        throw new Error('Rows and columns must be positive integers')
    }
    return Array(rows).fill(0).map(() => Array(cols).fill(1))
}

function matrixDeterminant(A) {
    if (!Array.isArray(A) || A.length !== A[0].length) {
        throw new Error('Matrix must be square')
    }
    const n = A.length
    if (n === 1) return A[0][0]
    if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0]
    let det = 0
    for (let i = 0; i < n; i++) {
        const subMatrix = A.slice(1).map(row => row.filter((_, j) => j !== i))
        det += (i % 2 === 0 ? 1 : -1) * A[0][i] * matrixDeterminant(subMatrix)
    }
    return det
}

function matrixTrace(A) {
    if (!Array.isArray(A) || A.length !== A[0].length) {
        throw new Error('Matrix must be square')
    }
    return A.reduce((sum, row, i) => sum + row[i], 0)
}

// ==================== VECTOR OPERATIONS ====================
function vectorAdd(...args) {
    const vectors = args.filter(v => Array.isArray(v))
    if (vectors.length < 2) throw new Error('At least 2 vectors needed')
    const n = vectors[0].length
    if (!vectors.every(v => v.length === n)) throw new Error('All vectors must have same length')
    return vectors.reduce((a, b) => a.map((v, i) => v + b[i]))
}

function vectorSub(A, B) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors')
    if (A.length !== B.length) throw new Error('Vectors must have same length')
    return A.map((v, i) => v - B[i])
}

function vectorScalarMul(A, scalar) {
    _validateNumber(scalar, 'scalar')
    if (!Array.isArray(A)) throw new Error('Input must be a vector')
    return A.map(v => v * scalar)
}

function dotProduct(A, B) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors')
    if (A.length !== B.length) throw new Error('Vectors must have same length')
    return A.reduce((sum, v, i) => sum + v * B[i], 0)
}

function crossProduct(A, B) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors')
    if (A.length !== 3 || B.length !== 3) throw new Error('Vectors must have length 3')
    return [
        A[1] * B[2] - A[2] * B[1],
        A[2] * B[0] - A[0] * B[2],
        A[0] * B[1] - A[1] * B[0]
    ]
}

function vectorNorm(A, order = 2) {
    _validateNumber(order, 'order')
    if (!Array.isArray(A)) throw new Error('Input must be a vector')
    if (order === 0) return A.length
    if (order === Infinity) return Math.max(...A.map(v => Math.abs(v)))
    return Math.pow(A.reduce((sum, v) => sum + Math.pow(Math.abs(v), order), 0), 1 / order)
}

function vectorNormalize(A) {
    if (!Array.isArray(A)) throw new Error('Input must be a vector')
    const norm = vectorNorm(A)
    if (norm === 0) throw new Error('Cannot normalize zero vector')
    return A.map(v => v / norm)
}

function vectorDistance(A, B, order = 2) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors')
    if (A.length !== B.length) throw new Error('Vectors must have same length')
    return vectorNorm(A.map((v, i) => v - B[i]), order)
}

function vectorAngle(A, B) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors')
    if (A.length !== B.length) throw new Error('Vectors must have same length')
    const dot = dotProduct(A, B)
    const normA = vectorNorm(A)
    const normB = vectorNorm(B)
    if (normA === 0 || normB === 0) throw new Error('Cannot compute angle with zero vector')
    return Math.acos(clamp(dot / (normA * normB), -1, 1))
}

function vectorProjection(A, B) {
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors')
    if (A.length !== B.length) throw new Error('Vectors must have same length')
    const dot = dotProduct(A, B)
    const normB = vectorNorm(B)
    if (normB === 0) throw new Error('Cannot project onto zero vector')
    const scalar = dot / (normB * normB)
    return B.map(v => v * scalar)
}

// ==================== COMPLEX NUMBERS ====================
function complex(real, imag = 0) {
    _validateNumber(real, 'real'); _validateNumber(imag, 'imag')
    return { real, imag }
}

function complexAdd(a, b) {
    return { real: a.real + b.real, imag: a.imag + b.imag }
}

function complexSub(a, b) {
    return { real: a.real - b.real, imag: a.imag - b.imag }
}

function complexMul(a, b) {
    return {
        real: a.real * b.real - a.imag * b.imag,
        imag: a.real * b.imag + a.imag * b.real
    }
}

function complexDiv(a, b) {
    const denom = b.real * b.real + b.imag * b.imag
    if (denom === 0) throw new Error('Division by zero')
    return {
        real: (a.real * b.real + a.imag * b.imag) / denom,
        imag: (a.imag * b.real - a.real * b.imag) / denom
    }
}

function complexAbs(a) {
    return Math.sqrt(a.real * a.real + a.imag * a.imag)
}

function complexArg(a) {
    return Math.atan2(a.imag, a.real)
}

function complexConj(a) {
    return { real: a.real, imag: -a.imag }
}

function complexExp(a) {
    const r = Math.exp(a.real)
    return { real: r * Math.cos(a.imag), imag: r * Math.sin(a.imag) }
}

function complexLog(a) {
    return { real: Math.log(complexAbs(a)), imag: complexArg(a) }
}

function complexPow(a, b) {
    return complexExp(complexMul(complexLog(a), b))
}

function complexSin(a) {
    return {
        real: Math.sin(a.real) * Math.cosh(a.imag),
        imag: Math.cos(a.real) * Math.sinh(a.imag)
    }
}

function complexCos(a) {
    return {
        real: Math.cos(a.real) * Math.cosh(a.imag),
        imag: -Math.sin(a.real) * Math.sinh(a.imag)
    }
}

// ==================== POLYNOMIALS ====================
function polyEval(coeffs, x) {
    _validateArray(coeffs, 'coeffs')
    _validateNumber(x, 'x')
    let result = 0
    for (let i = coeffs.length - 1; i >= 0; i--) {
        result = result * x + coeffs[i]
    }
    return result
}

function polyDerivative(coeffs) {
    _validateArray(coeffs, 'coeffs')
    if (coeffs.length <= 1) return [0]
    return coeffs.slice(1).map((c, i) => c * (i + 1))
}

function polyIntegral(coeffs, constant = 0) {
    _validateArray(coeffs, 'coeffs')
    _validateNumber(constant, 'constant')
    const result = [constant]
    for (let i = 0; i < coeffs.length; i++) {
        result.push(coeffs[i] / (i + 1))
    }
    return result
}

function polyRoots(coeffs) {
    // Simple quadratic solver
    _validateArray(coeffs, 'coeffs')
    if (coeffs.length !== 3) throw new Error('Only quadratic supported')
    const [c, b, a] = coeffs
    if (a === 0) throw new Error('Not a quadratic')
    const disc = b * b - 4 * a * c
    if (disc < 0) return []
    if (disc === 0) return [-b / (2 * a)]
    return [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)]
}

// ==================== RANDOM ====================
function random(min = 0, max = 1) {
    _validateNumber(min, 'min'); _validateNumber(max, 'max')
    if (min > max) throw new Error('min must be <= max')
    return Math.random() * (max - min) + min
}

function randomInt(min, max) {
    _validateNumber(min, 'min'); _validateNumber(max, 'max')
    if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('Must be integers')
    if (min > max) throw new Error('min must be <= max')
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice(arr) {
    _validateArray(arr, 'arr')
    return arr[randomInt(0, arr.length - 1)]
}

function randomShuffle(arr) {
    _validateArray(arr, 'arr')
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
        const j = randomInt(0, i)
        [result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

function randomNormal(mean = 0, std = 1) {
    _validateNumber(mean, 'mean'); _validateNumber(std, 'std')
    if (std < 0) throw new Error('std must be >= 0')
    const u1 = Math.random()
    const u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return mean + std * z
}

function randomExponential(lambda = 1) {
    _validateNumber(lambda, 'lambda')
    if (lambda <= 0) throw new Error('lambda must be > 0')
    return -Math.log(1 - Math.random()) / lambda
}

function randomPoisson(lambda = 1) {
    _validateNumber(lambda, 'lambda')
    if (lambda <= 0) throw new Error('lambda must be > 0')
    let L = Math.exp(-lambda)
    let k = 0
    let p = 1
    do {
        k++
        p *= Math.random()
    } while (p > L)
    return k - 1
}

// ==================== STRING UTILITIES ====================
function toString(a, base = 10) {
    _validateNumber(a, 'a'); _validateNumber(base, 'base')
    if (!Number.isInteger(base) || base < 2 || base > 36) {
        throw new Error('base must be integer between 2 and 36')
    }
    return a.toString(base)
}

function toBinary(a) { return toString(a, 2) }
function toOctal(a) { return toString(a, 8) }
function toHex(a) { return toString(a, 16) }

function fromString(str, base = 10) {
    if (typeof str !== 'string') throw new Error('Input must be string')
    const result = parseInt(str, base)
    if (isNaN(result)) throw new Error('Invalid number')
    return result
}

// ==================== ANGLE CONVERSION ====================
function degToRad(deg) {
    _validateNumber(deg, 'deg')
    return deg * Math.PI / 180
}

function radToDeg(rad) {
    _validateNumber(rad, 'rad')
    return rad * 180 / Math.PI
}

function toRadians(deg) { return degToRad(deg) }
function toDegrees(rad) { return radToDeg(rad) }

// ==================== MISCELLANEOUS ====================
function signum(a) { return sign(a) }

function heaviside(x) {
    _validateNumber(x, 'x')
    return x < 0 ? 0 : 1
}

function dirac(x) {
    _validateNumber(x, 'x')
    return x === 0 ? Infinity : 0
}

function sinc(x) {
    _validateNumber(x, 'x')
    return x === 0 ? 1 : Math.sin(x) / x
}

function gaussian(x, mean = 0, std = 1) {
    _validateNumber(x, 'x'); _validateNumber(mean, 'mean'); _validateNumber(std, 'std')
    if (std <= 0) throw new Error('std must be > 0')
    return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mean) / std) ** 2)
}

function erf(x) {
    _validateNumber(x, 'x')
    // Approximation using Taylor series
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911
    const sign = x < 0 ? -1 : 1
    const absX = Math.abs(x)
    const t = 1 / (1 + p * absX)
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX)
    return sign * y
}

function erfc(x) {
    _validateNumber(x, 'x')
    return 1 - erf(x)
}

function gamma(x) {
    _validateNumber(x, 'x')
    if (x <= 0) throw new Error('Gamma undefined for non-positive integers')
    if (x < 1) return gamma(x + 1) / x
    if (x === 1) return 1
    if (x === 2) return 1
    // Stirling approximation for large x
    if (x > 10) {
        return Math.sqrt(2 * Math.PI / x) * Math.pow(x / Math.E, x)
    }
    return (x - 1) * gamma(x - 1)
}

function lgamma(x) {
    _validateNumber(x, 'x')
    if (x <= 0) throw new Error('lgamma undefined for non-positive integers')
    return Math.log(gamma(x))
}

function beta(a, b) {
    _validateNumber(a, 'a'); _validateNumber(b, 'b')
    if (a <= 0 || b <= 0) throw new Error('Beta parameters must be positive')
    return gamma(a) * gamma(b) / gamma(a + b)
}
// ==================== EXPORT ====================
const math = {
    // Constants
    E, PI, PHI, SQRT2, SQRT3, SQRT5, LN2, LN10, LOG2E, LOG10E,
    TAU, HALF_PI, QUARTER_PI, EULER, CATALAN, APERY, GOLDEN_ANGLE,
    SQRT_PI, INV_PI, INV_TAU, INV_SQRT2, INV_SQRT3, INV_PHI,
    LN_PHI, DEG2RAD, RAD2DEG,

    // Arithmetic
    add, sub, mul, div, mod, pow, sqrt, cbrt, abs, neg, inv,
    inc, dec, sq, cube, pow2, pow3, pow4, pow5, pow6, pow7, pow8, pow9, pow10,
    hypot, fma, fmod, remainder, copysign, nextafter, ulp,

    // Trig
    sin, cos, tan, cot, sec, csc,
    asin, acos, atan, atan2, asec, acsc, acot,
    versin, coversin, haversin, exsec, excsc,

    // Hyperbolic
    sinh, cosh, tanh, coth, sech, csch,
    asinh, acosh, atanh, acoth, asech, acsch,

    // Log/Exp
    exp, expm1, log, log10, log2, log1p, logb, ln, lg, lb, exp2, exp10,

    // Rounding
    floor, ceil, round, trunc, fix, frac, modf,
    roundTo, floorTo, ceilTo, nearest,

    // Sign & Comparison
    sign, signbit, isFiniteNumber, isNaNValue, isInteger, isFloat,
    isPositive, isNegative, isZero, isEven, isOdd,
    isPrime, isPerfect, isArmstrong,
    clamp, clamp01, clampNeg1_1,
    max, min, max2, min2, between, approxEqual,

    // Statistics
    sum, product, mean, avg, median, mode,
    variance, varianceSample, stddev, stddevSample,
    range, iqr, quantile, percentile,
    skewness, kurtosis, covariance, correlation,
    count, unique, frequency,

    // Sorting
    sortAsc, sortDesc, minIndex, maxIndex, argSort, argMax, argMin,

    // Combinatorics
    factorial, doubleFactorial, factorial2,
    binomial, permutations, combinations,
    multinomial, catalanNumber, bellNumber, stirling2,

    // Number Theory
    gcd, lcm, factors, primeFactors, divisors, properDivisors,
    eulerPhi, mobius, tau, sigma, fibonacci, lucas,

    // Interpolation
    lerp, inverseLerp, mapRange, smoothstep, smootherstep, mix, step, pulse,

    // Activation
    sigmoid, logistic, tanhActivation, relu, leakyRelu, elu, selu, gelu,
    softmax, logSoftmax,

    // Matrix
    matrixAdd, matrixSub, matrixMul, matrixTranspose,
    matrixScalarMul, matrixIdentity, matrixZeros, matrixOnes,
    matrixDeterminant, matrixTrace,

    // Vector
    vectorAdd, vectorSub, vectorScalarMul, dotProduct, crossProduct,
    vectorNorm, vectorNormalize, vectorDistance, vectorAngle, vectorProjection,

    // Complex
    complex, complexAdd, complexSub, complexMul, complexDiv,
    complexAbs, complexArg, complexConj, complexExp, complexLog,
    complexPow, complexSin, complexCos,

    // Polynomial
    polyEval, polyDerivative, polyIntegral, polyRoots,

    // Random
    random, randomInt, randomChoice, randomShuffle,
    randomNormal, randomExponential, randomPoisson,
    // String
    toString, toBinary, toOctal, toHex, fromString,
    // Angle
    degToRad, radToDeg, toRadians, toDegrees,
    // Misc
    signum, heaviside, dirac, sinc, gaussian, erf, erfc, gamma, lgamma, beta
}

window.math = math;

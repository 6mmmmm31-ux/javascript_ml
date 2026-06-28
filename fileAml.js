// ============================================================
// fileAml.js - Complete Machine Learning & Utility Library
// Includes: Audio, Video, Image, Text, Pattern, CSV, Datetime,
// File, SVG, String, Math functions
// ============================================================

// ====================================================================
// MATH LIBRARY
// ====================================================================

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
function _validateNumber(n, name = 'value') { if (!_isNumber(n)) throw new Error(name + ' must be a number'); return n }
function _validateArray(arr, name = 'array') { if (!Array.isArray(arr)) throw new Error(name + ' must be an array'); if (arr.length === 0) throw new Error(name + ' cannot be empty'); arr.forEach(function(v, i) { if (!_isNumber(v)) throw new Error(name + '[' + i + '] must be a number') }); return arr }

// ==================== BASIC ARITHMETIC ====================
function add() { var args = _toArray(arguments); _validateArray(args, 'add'); return args.reduce(function(a, b) { return a + b }, 0) }
function sub() { var args = _toArray(arguments); _validateArray(args, 'sub'); if (args.length === 1) return -args[0]; return args.reduce(function(a, b) { return a - b }) }
function mul() { var args = _toArray(arguments); _validateArray(args, 'mul'); return args.reduce(function(a, b) { return a * b }, 1) }
function div() { var args = _toArray(arguments); _validateArray(args, 'div'); if (args.length === 1) return 1 / args[0]; return args.reduce(function(a, b) { if (b === 0) throw new Error('Division by zero'); return a / b }) }
function mod(a, b) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); if (b === 0) throw new Error('Modulo by zero'); return a % b }
function pow(a, b) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); return Math.pow(a, b) }
function sqrt(a) { _validateNumber(a, 'a'); if (a < 0) throw new Error('Square root of negative number'); return Math.sqrt(a) }
function cbrt(a) { _validateNumber(a, 'a'); return Math.cbrt(a) }
function abs(a) { _validateNumber(a, 'a'); return Math.abs(a) }
function neg(a) { _validateNumber(a, 'a'); return -a }
function inv(a) { _validateNumber(a, 'a'); if (a === 0) throw new Error('Division by zero'); return 1 / a }
function inc(a) { _validateNumber(a, 'a'); return a + 1 }
function dec(a) { _validateNumber(a, 'a'); return a - 1 }
function sq(a) { _validateNumber(a, 'a'); return a * a }
function cube(a) { _validateNumber(a, 'a'); return a * a * a }
function pow2(a) { return sq(a) }
function pow3(a) { return cube(a) }
function pow4(a) { var s = sq(a); return s * s }
function pow5(a) { var s = sq(a); return s * s * a }
function pow6(a) { var s = sq(a); return s * s * s }
function pow7(a) { var s = sq(a); return s * s * s * a }
function pow8(a) { var s = sq(a); var s2 = s * s; return s2 * s2 }
function pow9(a) { var s = sq(a); var s2 = s * s; return s2 * s2 * a }
function pow10(a) { var s = sq(a); var s2 = s * s; return s2 * s2 * s }
function hypot() { var args = _toArray(arguments); _validateArray(args, 'hypot'); return Math.hypot.apply(Math, args) }
function fma(a, b, c) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); _validateNumber(c, 'c'); return Math.fma ? Math.fma(a, b, c) : a * b + c }
function fmod(a, b) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); return a % b }
function remainder(a, b) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); return a - Math.round(a / b) * b }
function copysign(a, b) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); return Math.abs(a) * (b < 0 ? -1 : 1) }
function nextafter(a, b) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); if (a === b) return a; var eps = Math.ulp ? Math.ulp(a) : 1e-15; return a < b ? a + eps : a - eps }
function ulp(a) { _validateNumber(a, 'a'); return Math.ulp ? Math.ulp(a) : 1e-15 }

// ==================== TRIGONOMETRY ====================
function sin(a) { _validateNumber(a, 'a'); return Math.sin(a) }
function cos(a) { _validateNumber(a, 'a'); return Math.cos(a) }
function tan(a) { _validateNumber(a, 'a'); return Math.tan(a) }
function cot(a) { _validateNumber(a, 'a'); var t = Math.tan(a); if (t === 0) throw new Error('Cotangent undefined'); return 1 / t }
function sec(a) { _validateNumber(a, 'a'); var c = Math.cos(a); if (c === 0) throw new Error('Secant undefined'); return 1 / c }
function csc(a) { _validateNumber(a, 'a'); var s = Math.sin(a); if (s === 0) throw new Error('Cosecant undefined'); return 1 / s }
function asin(a) { _validateNumber(a, 'a'); if (a < -1 || a > 1) throw new Error('Domain error'); return Math.asin(a) }
function acos(a) { _validateNumber(a, 'a'); if (a < -1 || a > 1) throw new Error('Domain error'); return Math.acos(a) }
function atan(a) { _validateNumber(a, 'a'); return Math.atan(a) }
function atan2(y, x) { _validateNumber(y, 'y'); _validateNumber(x, 'x'); return Math.atan2(y, x) }
function asec(a) { _validateNumber(a, 'a'); if (Math.abs(a) < 1) throw new Error('Domain error'); return Math.acos(1 / a) }
function acsc(a) { _validateNumber(a, 'a'); if (Math.abs(a) < 1) throw new Error('Domain error'); return Math.asin(1 / a) }
function acot(a) { _validateNumber(a, 'a'); return Math.atan(1 / a) }
function versin(a) { _validateNumber(a, 'a'); return 1 - Math.cos(a) }
function coversin(a) { _validateNumber(a, 'a'); return 1 - Math.sin(a) }
function haversin(a) { _validateNumber(a, 'a'); return (1 - Math.cos(a)) / 2 }
function exsec(a) { _validateNumber(a, 'a'); var s = Math.cos(a); if (s === 0) throw new Error('Exsecant undefined'); return 1 / s - 1 }
function excsc(a) { _validateNumber(a, 'a'); var s = Math.sin(a); if (s === 0) throw new Error('Excosecant undefined'); return 1 / s - 1 }

// ==================== HYPERBOLIC ====================
function sinh(a) { _validateNumber(a, 'a'); return Math.sinh(a) }
function cosh(a) { _validateNumber(a, 'a'); return Math.cosh(a) }
function tanh(a) { _validateNumber(a, 'a'); return Math.tanh(a) }
function coth(a) { _validateNumber(a, 'a'); var t = Math.tanh(a); if (t === 0) throw new Error('Coth undefined'); return 1 / t }
function sech(a) { _validateNumber(a, 'a'); var c = Math.cosh(a); return 1 / c }
function csch(a) { _validateNumber(a, 'a'); var s = Math.sinh(a); if (s === 0) throw new Error('Csch undefined'); return 1 / s }
function asinh(a) { _validateNumber(a, 'a'); return Math.asinh(a) }
function acosh(a) { _validateNumber(a, 'a'); if (a < 1) throw new Error('Domain error'); return Math.acosh(a) }
function atanh(a) { _validateNumber(a, 'a'); if (Math.abs(a) >= 1) throw new Error('Domain error'); return Math.atanh(a) }
function acoth(a) { _validateNumber(a, 'a'); if (Math.abs(a) <= 1) throw new Error('Domain error'); return 0.5 * Math.log((a + 1) / (a - 1)) }
function asech(a) { _validateNumber(a, 'a'); if (a <= 0 || a > 1) throw new Error('Domain error'); return Math.acosh(1 / a) }
function acsch(a) { _validateNumber(a, 'a'); if (a === 0) throw new Error('Domain error'); return Math.asinh(1 / a) }

// ==================== LOGARITHMS & EXPONENTIALS ====================
function exp(a) { _validateNumber(a, 'a'); return Math.exp(a) }
function expm1(a) { _validateNumber(a, 'a'); return Math.expm1(a) }
function log(a) { _validateNumber(a, 'a'); if (a <= 0) throw new Error('Domain error'); return Math.log(a) }
function log10(a) { _validateNumber(a, 'a'); if (a <= 0) throw new Error('Domain error'); return Math.log10(a) }
function log2(a) { _validateNumber(a, 'a'); if (a <= 0) throw new Error('Domain error'); return Math.log2(a) }
function log1p(a) { _validateNumber(a, 'a'); if (a <= -1) throw new Error('Domain error'); return Math.log1p(a) }
function logb(a, base) { _validateNumber(a, 'a'); _validateNumber(base, 'base'); if (a <= 0) throw new Error('Domain error'); if (base <= 0 || base === 1) throw new Error('Invalid base'); return Math.log(a) / Math.log(base) }
function ln(a) { return log(a) }
function lg(a) { return log10(a) }
function lb(a) { return log2(a) }
function exp2(a) { _validateNumber(a, 'a'); return Math.pow(2, a) }
function exp10(a) { _validateNumber(a, 'a'); return Math.pow(10, a) }

// ==================== ROUNDING ====================
function floor(a) { _validateNumber(a, 'a'); return Math.floor(a) }
function ceil(a) { _validateNumber(a, 'a'); return Math.ceil(a) }
function round(a) { _validateNumber(a, 'a'); return Math.round(a) }
function trunc(a) { _validateNumber(a, 'a'); return Math.trunc(a) }
function fix(a) { return trunc(a) }
function frac(a) { _validateNumber(a, 'a'); return a - Math.floor(a) }
function modf(a) { _validateNumber(a, 'a'); var int = Math.trunc(a); return { int: int, frac: a - int } }
function roundTo(a, digits) { digits = digits || 0; _validateNumber(a, 'a'); _validateNumber(digits, 'digits'); var factor = Math.pow(10, digits); return Math.round(a * factor) / factor }
function floorTo(a, digits) { digits = digits || 0; _validateNumber(a, 'a'); _validateNumber(digits, 'digits'); var factor = Math.pow(10, digits); return Math.floor(a * factor) / factor }
function ceilTo(a, digits) { digits = digits || 0; _validateNumber(a, 'a'); _validateNumber(digits, 'digits'); var factor = Math.pow(10, digits); return Math.ceil(a * factor) / factor }
function nearest(a, step) { step = step || 1; _validateNumber(a, 'a'); _validateNumber(step, 'step'); return Math.round(a / step) * step }

// ==================== SIGN & COMPARISON ====================
function sign(a) { _validateNumber(a, 'a'); return Math.sign(a) }
function signbit(a) { _validateNumber(a, 'a'); return Object.is(a, -0) || (a < 0) }
function isFiniteNumber(a) { return _isNumber(a) && isFinite(a) }
function isNaNValue(a) { return typeof a === 'number' && isNaN(a) }
function isInteger(a) { return _isNumber(a) && Number.isInteger(a) }
function isFloat(a) { return _isNumber(a) && !Number.isInteger(a) }
function isPositive(a) { return _isNumber(a) && a > 0 }
function isNegative(a) { return _isNumber(a) && a < 0 }
function isZero(a) { return _isNumber(a) && a === 0 }
function isEven(a) { _validateNumber(a, 'a'); return Number.isInteger(a) && a % 2 === 0 }
function isOdd(a) { _validateNumber(a, 'a'); return Number.isInteger(a) && a % 2 !== 0 }
function isPrime(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 2) return false; for (var i = 2; i * i <= a; i++) { if (a % i === 0) return false } return true }
function isPerfect(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 1) return false; var sum = 0; for (var i = 1; i < a; i++) { if (a % i === 0) sum += i } return sum === a }
function isArmstrong(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 0) return false; var str = String(a); var n = str.length; var sum = 0; for (var i = 0; i < str.length; i++) { sum += Math.pow(parseInt(str[i]), n) } return sum === a }
function clamp(a, min, max) { _validateNumber(a, 'a'); _validateNumber(min, 'min'); _validateNumber(max, 'max'); if (min > max) throw new Error('min must be <= max'); return Math.min(Math.max(a, min), max) }
function clamp01(a) { _validateNumber(a, 'a'); return clamp(a, 0, 1) }
function clampNeg1_1(a) { _validateNumber(a, 'a'); return clamp(a, -1, 1) }
function max() { var args = _toArray(arguments); _validateArray(args, 'max'); return Math.max.apply(Math, args) }
function min() { var args = _toArray(arguments); _validateArray(args, 'min'); return Math.min.apply(Math, args) }
function max2(a, b) { return a > b ? a : b }
function min2(a, b) { return a < b ? a : b }
function between(a, low, high) { _validateNumber(a, 'a'); _validateNumber(low, 'low'); _validateNumber(high, 'high'); return a >= low && a <= high }
function approxEqual(a, b, epsilon) { epsilon = epsilon || 1e-10; _validateNumber(a, 'a'); _validateNumber(b, 'b'); _validateNumber(epsilon, 'epsilon'); return Math.abs(a - b) < epsilon }

// ==================== STATISTICS ====================
function sum() { var args = _toArray(arguments); _validateArray(args, 'sum'); return args.reduce(function(a, b) { return a + b }, 0) }
function product() { var args = _toArray(arguments); _validateArray(args, 'product'); return args.reduce(function(a, b) { return a * b }, 1) }
function mean() { var args = _toArray(arguments); _validateArray(args, 'mean'); return sum.apply(null, args) / args.length }
function avg() { return mean.apply(null, arguments) }
function median() { var args = _toArray(arguments); _validateArray(args, 'median'); var sorted = args.slice().sort(function(a, b) { return a - b }); var mid = Math.floor(sorted.length / 2); if (sorted.length % 2 === 0) { return (sorted[mid - 1] + sorted[mid]) / 2 } return sorted[mid] }
function mode() { var args = _toArray(arguments); _validateArray(args, 'mode'); var freq = {}; var maxFreq = 0; var modes = []; for (var i = 0; i < args.length; i++) { var val = args[i]; freq[val] = (freq[val] || 0) + 1; if (freq[val] > maxFreq) { maxFreq = freq[val]; modes = [val] } else if (freq[val] === maxFreq) { modes.push(val) } } return modes.length === 1 ? modes[0] : modes }
function variance() { var args = _toArray(arguments); _validateArray(args, 'variance'); if (args.length < 2) return 0; var m = mean.apply(null, args); return args.reduce(function(a, b) { return a + (b - m) * (b - m) }, 0) / args.length }
function varianceSample() { var args = _toArray(arguments); _validateArray(args, 'varianceSample'); if (args.length < 2) return 0; var m = mean.apply(null, args); return args.reduce(function(a, b) { return a + (b - m) * (b - m) }, 0) / (args.length - 1) }
function stddev() { var args = _toArray(arguments); _validateArray(args, 'stddev'); return Math.sqrt(variance.apply(null, args)) }
function stddevSample() { var args = _toArray(arguments); _validateArray(args, 'stddevSample'); return Math.sqrt(varianceSample.apply(null, args)) }
function range() { var args = _toArray(arguments); _validateArray(args, 'range'); return Math.max.apply(Math, args) - Math.min.apply(Math, args) }
function iqr() { var args = _toArray(arguments); _validateArray(args, 'iqr'); var sorted = args.slice().sort(function(a, b) { return a - b }); var q1 = quantile(sorted, 0.25); var q3 = quantile(sorted, 0.75); return q3 - q1 }
function quantile(data, q) { _validateArray(data, 'data'); _validateNumber(q, 'q'); if (q < 0 || q > 1) throw new Error('q must be between 0 and 1'); var sorted = data.slice().sort(function(a, b) { return a - b }); var pos = q * (sorted.length - 1); var base = Math.floor(pos); var frac = pos - base; if (base + 1 >= sorted.length) return sorted[base]; return sorted[base] + frac * (sorted[base + 1] - sorted[base]) }
function percentile(data, p) { _validateArray(data, 'data'); _validateNumber(p, 'p'); return quantile(data, p / 100) }
function skewness() { var args = _toArray(arguments); _validateArray(args, 'skewness'); if (args.length < 3) return 0; var m = mean.apply(null, args); var s = stddev.apply(null, args); if (s === 0) return 0; return args.reduce(function(a, b) { return a + Math.pow((b - m) / s, 3) }, 0) / args.length }
function kurtosis() { var args = _toArray(arguments); _validateArray(args, 'kurtosis'); if (args.length < 4) return 0; var m = mean.apply(null, args); var s = stddev.apply(null, args); if (s === 0) return 0; return args.reduce(function(a, b) { return a + Math.pow((b - m) / s, 4) }, 0) / args.length - 3 }
function covariance(x, y) { _validateArray(x, 'x'); _validateArray(y, 'y'); if (x.length !== y.length) throw new Error('Arrays must have same length'); if (x.length < 2) return 0; var mx = mean.apply(null, x); var my = mean.apply(null, y); return x.reduce(function(a, b, i) { return a + (b - mx) * (y[i] - my) }, 0) / x.length }
function correlation(x, y) { _validateArray(x, 'x'); _validateArray(y, 'y'); if (x.length !== y.length) throw new Error('Arrays must have same length'); var cov = covariance(x, y); var sx = stddev.apply(null, x); var sy = stddev.apply(null, y); if (sx === 0 || sy === 0) return 0; return cov / (sx * sy) }
function count() { var args = _toArray(arguments); return args.length }
function unique() { var args = _toArray(arguments); return Array.from(new Set(args)) }
function frequency() { var args = _toArray(arguments); var freq = {}; for (var i = 0; i < args.length; i++) { var val = args[i]; freq[val] = (freq[val] || 0) + 1 } return freq }

// ==================== SORTING & SEARCHING ====================
function sortAsc() { var args = _toArray(arguments); return args.slice().sort(function(a, b) { return a - b }) }
function sortDesc() { var args = _toArray(arguments); return args.slice().sort(function(a, b) { return b - a }) }
function minIndex() { var args = _toArray(arguments); _validateArray(args, 'minIndex'); var min = args[0]; var idx = 0; for (var i = 1; i < args.length; i++) { if (args[i] < min) { min = args[i]; idx = i } } return idx }
function maxIndex() { var args = _toArray(arguments); _validateArray(args, 'maxIndex'); var max = args[0]; var idx = 0; for (var i = 1; i < args.length; i++) { if (args[i] > max) { max = args[i]; idx = i } } return idx }
function argSort() { var args = _toArray(arguments); _validateArray(args, 'argSort'); return args.map(function(_, i) { return i }).sort(function(a, b) { return args[a] - args[b] }) }
function argMax() { var args = _toArray(arguments); return maxIndex.apply(null, args) }
function argMin() { var args = _toArray(arguments); return minIndex.apply(null, args) }

// ==================== COMBINATORICS ====================
function factorial(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 0) throw new Error('Must be non-negative integer'); if (a === 0 || a === 1) return 1; var result = 1; for (var i = 2; i <= a; i++) result *= i; return result }
function doubleFactorial(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 0) throw new Error('Must be non-negative integer'); var result = 1; for (var i = a; i > 0; i -= 2) result *= i; return result }
function factorial2(a) { return doubleFactorial(a) }
function binomial(n, k) { _validateNumber(n, 'n'); _validateNumber(k, 'k'); if (!Number.isInteger(n) || !Number.isInteger(k)) throw new Error('Must be integers'); if (k < 0 || k > n) return 0; return factorial(n) / (factorial(k) * factorial(n - k)) }
function permutations(n, k) { _validateNumber(n, 'n'); _validateNumber(k, 'k'); if (!Number.isInteger(n) || !Number.isInteger(k)) throw new Error('Must be integers'); if (k < 0 || k > n) return 0; return factorial(n) / factorial(n - k) }
function combinations(n, k) { return binomial(n, k) }
function multinomial() { var args = _toArray(arguments); _validateArray(args, 'multinomial'); var n = args.reduce(function(a, b) { return a + b }, 0); var result = factorial(n); for (var i = 0; i < args.length; i++) { result /= factorial(args[i]) } return result }
function catalanNumber(n) { _validateNumber(n, 'n'); if (!Number.isInteger(n) || n < 0) throw new Error('Must be non-negative integer'); return binomial(2 * n, n) / (n + 1) }
function bellNumber(n) { _validateNumber(n, 'n'); if (!Number.isInteger(n) || n < 0) throw new Error('Must be non-negative integer'); if (n === 0) return 1; var bell = [1]; for (var i = 1; i <= n; i++) { var sum = 0; for (var j = 0; j < i; j++) { sum += binomial(i - 1, j) * bell[j] } bell.push(sum) } return bell[n] }
function stirling2(n, k) { _validateNumber(n, 'n'); _validateNumber(k, 'k'); if (!Number.isInteger(n) || !Number.isInteger(k)) throw new Error('Must be integers'); if (k < 0 || k > n) return 0; if (k === 0) return n === 0 ? 1 : 0; if (k === 1 || k === n) return 1; return k * stirling2(n - 1, k) + stirling2(n - 1, k - 1) }

// ==================== NUMBER THEORY ====================
function gcd() { var args = _toArray(arguments); _validateArray(args, 'gcd'); var gcd2 = function(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t } return a }; return args.reduce(function(a, b) { return gcd2(a, b) }) }
function lcm() { var args = _toArray(arguments); _validateArray(args, 'lcm'); var lcm2 = function(a, b) { if (a === 0 || b === 0) return 0; return Math.abs(a * b) / gcd(a, b) }; return args.reduce(function(a, b) { return lcm2(a, b) }) }
function factors(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer'); var result = []; for (var i = 1; i <= a; i++) { if (a % i === 0) result.push(i) } return result }
function primeFactors(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 2) throw new Error('Must be integer >= 2'); var n = a; var result = []; for (var i = 2; i * i <= n; i++) { while (n % i === 0) { result.push(i); n /= i } } if (n > 1) result.push(n); return result }
function divisors(a) { return factors(a) }
function properDivisors(a) { var f = factors(a); return f.slice(0, -1) }
function eulerPhi(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer'); var result = a; var n = a; for (var p = 2; p * p <= n; p++) { if (n % p === 0) { while (n % p === 0) n /= p; result -= result / p } } if (n > 1) result -= result / n; return result }
function mobius(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer'); if (a === 1) return 1; var pf = primeFactors(a); var unique = Array.from(new Set(pf)); if (unique.length !== pf.length) return 0; return unique.length % 2 === 0 ? 1 : -1 }
function tau(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer'); var result = 1; var n = a; for (var p = 2; p * p <= n; p++) { var count = 0; while (n % p === 0) { n /= p; count++ } result *= (count + 1) } if (n > 1) result *= 2; return result }
function sigma(a) { _validateNumber(a, 'a'); if (!Number.isInteger(a) || a < 1) throw new Error('Must be positive integer'); var result = 1; var n = a; for (var p = 2; p * p <= n; p++) { var sum = 1; var term = 1; while (n % p === 0) { n /= p; term *= p; sum += term } result *= sum } if (n > 1) result *= (1 + n); return result }
function fibonacci(n) { _validateNumber(n, 'n'); if (!Number.isInteger(n) || n < 0) throw new Error('Must be non-negative integer'); if (n === 0) return 0; if (n === 1) return 1; var a = 0, b = 1; for (var i = 2; i <= n; i++) { var t = a + b; a = b; b = t } return b }
function lucas(n) { _validateNumber(n, 'n'); if (!Number.isInteger(n) || n < 0) throw new Error('Must be non-negative integer'); if (n === 0) return 2; if (n === 1) return 1; var a = 2, b = 1; for (var i = 2; i <= n; i++) { var t = a + b; a = b; b = t } return b }

// ==================== INTERPOLATION ====================
function lerp(a, b, t) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); _validateNumber(t, 't'); return a + (b - a) * t }
function inverseLerp(a, b, v) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); _validateNumber(v, 'v'); if (a === b) return 0; return (v - a) / (b - a) }
function mapRange(value, inMin, inMax, outMin, outMax) { _validateNumber(value, 'value'); _validateNumber(inMin, 'inMin'); _validateNumber(inMax, 'inMax'); _validateNumber(outMin, 'outMin'); _validateNumber(outMax, 'outMax'); if (inMin === inMax) throw new Error('Input range cannot be zero'); return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin) }
function smoothstep(edge0, edge1, x) { _validateNumber(edge0, 'edge0'); _validateNumber(edge1, 'edge1'); _validateNumber(x, 'x'); var t = clamp((x - edge0) / (edge1 - edge0), 0, 1); return t * t * (3 - 2 * t) }
function smootherstep(edge0, edge1, x) { _validateNumber(edge0, 'edge0'); _validateNumber(edge1, 'edge1'); _validateNumber(x, 'x'); var t = clamp((x - edge0) / (edge1 - edge0), 0, 1); return t * t * t * (t * (t * 6 - 15) + 10) }
function mix(a, b, t) { return lerp(a, b, t) }
function step(edge, x) { _validateNumber(edge, 'edge'); _validateNumber(x, 'x'); return x < edge ? 0 : 1 }
function pulse(center, width, x) { _validateNumber(center, 'center'); _validateNumber(width, 'width'); _validateNumber(x, 'x'); return x >= center - width / 2 && x <= center + width / 2 ? 1 : 0 }

// ==================== ACTIVATION FUNCTIONS ====================
function sigmoid(x) { _validateNumber(x, 'x'); return 1 / (1 + Math.exp(-x)) }
function logistic(x) { return sigmoid(x) }
function tanhActivation(x) { _validateNumber(x, 'x'); return Math.tanh(x) }
function relu(x) { _validateNumber(x, 'x'); return Math.max(0, x) }
function leakyRelu(x, alpha) { alpha = alpha || 0.01; _validateNumber(x, 'x'); _validateNumber(alpha, 'alpha'); return x > 0 ? x : alpha * x }
function elu(x, alpha) { alpha = alpha || 1; _validateNumber(x, 'x'); _validateNumber(alpha, 'alpha'); return x > 0 ? x : alpha * (Math.exp(x) - 1) }
function selu(x) { _validateNumber(x, 'x'); var alpha = 1.6732632423543772848170429916717; var scale = 1.0507009873554804934193349852946; return scale * (x > 0 ? x : alpha * (Math.exp(x) - 1)) }
function gelu(x) { _validateNumber(x, 'x'); return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x))) }
function softmax(arr) { _validateArray(arr, 'softmax'); var maxVal = Math.max.apply(Math, arr); var expVals = arr.map(function(x) { return Math.exp(x - maxVal) }); var sumExp = expVals.reduce(function(a, b) { return a + b }, 0); return expVals.map(function(x) { return x / sumExp }) }
function logSoftmax(arr) { _validateArray(arr, 'logSoftmax'); var sm = softmax(arr); return sm.map(function(x) { return Math.log(x) }) }

// ==================== MATRIX OPERATIONS ====================
function matrixAdd(A, B) { if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be matrices'); if (A.length !== B.length || A[0].length !== B[0].length) { throw new Error('Matrices must have same dimensions') } return A.map(function(row, i) { return row.map(function(val, j) { return val + B[i][j] }) }) }
function matrixSub(A, B) { if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be matrices'); if (A.length !== B.length || A[0].length !== B[0].length) { throw new Error('Matrices must have same dimensions') } return A.map(function(row, i) { return row.map(function(val, j) { return val - B[i][j] }) }) }
function matrixMul(A, B) { if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be matrices'); var rows = A.length; var cols = B[0].length; var inner = B.length; if (A[0].length !== inner) throw new Error('Invalid matrix dimensions'); var result = Array(rows).fill(0).map(function() { return Array(cols).fill(0) }); for (var i = 0; i < rows; i++) { for (var j = 0; j < cols; j++) { for (var k = 0; k < inner; k++) { result[i][j] += A[i][k] * B[k][j] } } } return result }
function matrixTranspose(A) { if (!Array.isArray(A)) throw new Error('Input must be a matrix'); return A[0].map(function(_, i) { return A.map(function(row) { return row[i] }) }) }
function matrixScalarMul(A, scalar) { _validateNumber(scalar, 'scalar'); if (!Array.isArray(A)) throw new Error('Input must be a matrix'); return A.map(function(row) { return row.map(function(val) { return val * scalar }) }) }
function matrixIdentity(n) { _validateNumber(n, 'n'); if (!Number.isInteger(n) || n < 1) throw new Error('Must be positive integer'); return Array(n).fill(0).map(function(_, i) { return Array(n).fill(0).map(function(_, j) { return i === j ? 1 : 0 }) }) }
function matrixZeros(rows, cols) { _validateNumber(rows, 'rows'); _validateNumber(cols, 'cols'); if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1) { throw new Error('Rows and columns must be positive integers') } return Array(rows).fill(0).map(function() { return Array(cols).fill(0) }) }
function matrixOnes(rows, cols) { _validateNumber(rows, 'rows'); _validateNumber(cols, 'cols'); if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1) { throw new Error('Rows and columns must be positive integers') } return Array(rows).fill(0).map(function() { return Array(cols).fill(1) }) }
function matrixDeterminant(A) { if (!Array.isArray(A) || A.length !== A[0].length) { throw new Error('Matrix must be square') } var n = A.length; if (n === 1) return A[0][0]; if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0]; var det = 0; for (var i = 0; i < n; i++) { var subMatrix = A.slice(1).map(function(row) { return row.filter(function(_, j) { return j !== i }) }); det += (i % 2 === 0 ? 1 : -1) * A[0][i] * matrixDeterminant(subMatrix) } return det }
function matrixTrace(A) { if (!Array.isArray(A) || A.length !== A[0].length) { throw new Error('Matrix must be square') } return A.reduce(function(sum, row, i) { return sum + row[i] }, 0) }

// ==================== VECTOR OPERATIONS ====================
function vectorAdd() { var vectors = Array.prototype.slice.call(arguments).filter(function(v) { return Array.isArray(v) }); if (vectors.length < 2) throw new Error('At least 2 vectors needed'); var n = vectors[0].length; if (!vectors.every(function(v) { return v.length === n })) throw new Error('All vectors must have same length'); return vectors.reduce(function(a, b) { return a.map(function(v, i) { return v + b[i] }) }) }
function vectorSub(A, B) { if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors'); if (A.length !== B.length) throw new Error('Vectors must have same length'); return A.map(function(v, i) { return v - B[i] }) }
function vectorScalarMul(A, scalar) { _validateNumber(scalar, 'scalar'); if (!Array.isArray(A)) throw new Error('Input must be a vector'); return A.map(function(v) { return v * scalar }) }
function dotProduct(A, B) { if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors'); if (A.length !== B.length) throw new Error('Vectors must have same length'); return A.reduce(function(sum, v, i) { return sum + v * B[i] }, 0) }
function crossProduct(A, B) { if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors'); if (A.length !== 3 || B.length !== 3) throw new Error('Vectors must have length 3'); return [A[1] * B[2] - A[2] * B[1], A[2] * B[0] - A[0] * B[2], A[0] * B[1] - A[1] * B[0]] }
function vectorNorm(A, order) { order = order || 2; _validateNumber(order, 'order'); if (!Array.isArray(A)) throw new Error('Input must be a vector'); if (order === 0) return A.length; if (order === Infinity) return Math.max.apply(Math, A.map(function(v) { return Math.abs(v) })); return Math.pow(A.reduce(function(sum, v) { return sum + Math.pow(Math.abs(v), order) }, 0), 1 / order) }
function vectorNormalize(A) { if (!Array.isArray(A)) throw new Error('Input must be a vector'); var norm = vectorNorm(A); if (norm === 0) throw new Error('Cannot normalize zero vector'); return A.map(function(v) { return v / norm }) }
function vectorDistance(A, B, order) { order = order || 2; if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors'); if (A.length !== B.length) throw new Error('Vectors must have same length'); return vectorNorm(A.map(function(v, i) { return v - B[i] }), order) }
function vectorAngle(A, B) { if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors'); if (A.length !== B.length) throw new Error('Vectors must have same length'); var dot = dotProduct(A, B); var normA = vectorNorm(A); var normB = vectorNorm(B); if (normA === 0 || normB === 0) throw new Error('Cannot compute angle with zero vector'); return Math.acos(clamp(dot / (normA * normB), -1, 1)) }
function vectorProjection(A, B) { if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('Inputs must be vectors'); if (A.length !== B.length) throw new Error('Vectors must have same length'); var dot = dotProduct(A, B); var normB = vectorNorm(B); if (normB === 0) throw new Error('Cannot project onto zero vector'); var scalar = dot / (normB * normB); return B.map(function(v) { return v * scalar }) }

// ==================== COMPLEX NUMBERS ====================
function complex(real, imag) { imag = imag || 0; _validateNumber(real, 'real'); _validateNumber(imag, 'imag'); return { real: real, imag: imag } }
function complexAdd(a, b) { return { real: a.real + b.real, imag: a.imag + b.imag } }
function complexSub(a, b) { return { real: a.real - b.real, imag: a.imag - b.imag } }
function complexMul(a, b) { return { real: a.real * b.real - a.imag * b.imag, imag: a.real * b.imag + a.imag * b.real } }
function complexDiv(a, b) { var denom = b.real * b.real + b.imag * b.imag; if (denom === 0) throw new Error('Division by zero'); return { real: (a.real * b.real + a.imag * b.imag) / denom, imag: (a.imag * b.real - a.real * b.imag) / denom } }
function complexAbs(a) { return Math.sqrt(a.real * a.real + a.imag * a.imag) }
function complexArg(a) { return Math.atan2(a.imag, a.real) }
function complexConj(a) { return { real: a.real, imag: -a.imag } }
function complexExp(a) { var r = Math.exp(a.real); return { real: r * Math.cos(a.imag), imag: r * Math.sin(a.imag) } }
function complexLog(a) { return { real: Math.log(complexAbs(a)), imag: complexArg(a) } }
function complexPow(a, b) { return complexExp(complexMul(complexLog(a), b)) }
function complexSin(a) { return { real: Math.sin(a.real) * Math.cosh(a.imag), imag: Math.cos(a.real) * Math.sinh(a.imag) } }
function complexCos(a) { return { real: Math.cos(a.real) * Math.cosh(a.imag), imag: -Math.sin(a.real) * Math.sinh(a.imag) } }

// ==================== POLYNOMIALS ====================
function polyEval(coeffs, x) { _validateArray(coeffs, 'coeffs'); _validateNumber(x, 'x'); var result = 0; for (var i = coeffs.length - 1; i >= 0; i--) { result = result * x + coeffs[i] } return result }
function polyDerivative(coeffs) { _validateArray(coeffs, 'coeffs'); if (coeffs.length <= 1) return [0]; return coeffs.slice(1).map(function(c, i) { return c * (i + 1) }) }
function polyIntegral(coeffs, constant) { constant = constant || 0; _validateArray(coeffs, 'coeffs'); _validateNumber(constant, 'constant'); var result = [constant]; for (var i = 0; i < coeffs.length; i++) { result.push(coeffs[i] / (i + 1)) } return result }
function polyRoots(coeffs) { _validateArray(coeffs, 'coeffs'); if (coeffs.length !== 3) throw new Error('Only quadratic supported'); var c = coeffs[0]; var b = coeffs[1]; var a = coeffs[2]; if (a === 0) throw new Error('Not a quadratic'); var disc = b * b - 4 * a * c; if (disc < 0) return []; if (disc === 0) return [-b / (2 * a)]; return [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)] }

// ==================== RANDOM ====================
function random(min, max) { min = min || 0; max = max || 1; _validateNumber(min, 'min'); _validateNumber(max, 'max'); if (min > max) throw new Error('min must be <= max'); return Math.random() * (max - min) + min }
function randomInt(min, max) { _validateNumber(min, 'min'); _validateNumber(max, 'max'); if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('Must be integers'); if (min > max) throw new Error('min must be <= max'); return Math.floor(Math.random() * (max - min + 1)) + min }
function randomChoice(arr) { _validateArray(arr, 'arr'); return arr[randomInt(0, arr.length - 1)] }
function randomShuffle(arr) { _validateArray(arr, 'arr'); var result = arr.slice(); for (var i = result.length - 1; i > 0; i--) { var j = randomInt(0, i); var t = result[i]; result[i] = result[j]; result[j] = t } return result }
function randomNormal(mean, std) { mean = mean || 0; std = std || 1; _validateNumber(mean, 'mean'); _validateNumber(std, 'std'); if (std < 0) throw new Error('std must be >= 0'); var u1 = Math.random(); var u2 = Math.random(); var z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); return mean + std * z }
function randomExponential(lambda) { lambda = lambda || 1; _validateNumber(lambda, 'lambda'); if (lambda <= 0) throw new Error('lambda must be > 0'); return -Math.log(1 - Math.random()) / lambda }
function randomPoisson(lambda) { lambda = lambda || 1; _validateNumber(lambda, 'lambda'); if (lambda <= 0) throw new Error('lambda must be > 0'); var L = Math.exp(-lambda); var k = 0; var p = 1; do { k++; p *= Math.random() } while (p > L); return k - 1 }

// ==================== STRING UTILITIES ====================
function toString(a, base) { base = base || 10; _validateNumber(a, 'a'); _validateNumber(base, 'base'); if (!Number.isInteger(base) || base < 2 || base > 36) { throw new Error('base must be integer between 2 and 36') } return a.toString(base) }
function toBinary(a) { return toString(a, 2) }
function toOctal(a) { return toString(a, 8) }
function toHex(a) { return toString(a, 16) }
function fromString(str, base) { base = base || 10; if (typeof str !== 'string') throw new Error('Input must be string'); var result = parseInt(str, base); if (isNaN(result)) throw new Error('Invalid number'); return result }

// ==================== ANGLE CONVERSION ====================
function degToRad(deg) { _validateNumber(deg, 'deg'); return deg * Math.PI / 180 }
function radToDeg(rad) { _validateNumber(rad, 'rad'); return rad * 180 / Math.PI }
function toRadians(deg) { return degToRad(deg) }
function toDegrees(rad) { return radToDeg(rad) }

// ==================== MISCELLANEOUS ====================
function signum(a) { return sign(a) }
function heaviside(x) { _validateNumber(x, 'x'); return x < 0 ? 0 : 1 }
function dirac(x) { _validateNumber(x, 'x'); return x === 0 ? Infinity : 0 }
function sinc(x) { _validateNumber(x, 'x'); return x === 0 ? 1 : Math.sin(x) / x }
function gaussian(x, mean, std) { mean = mean || 0; std = std || 1; _validateNumber(x, 'x'); _validateNumber(mean, 'mean'); _validateNumber(std, 'std'); if (std <= 0) throw new Error('std must be > 0'); return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mean) / std) * ((x - mean) / std)) }
function erf(x) { _validateNumber(x, 'x'); var a1 = 0.254829592; var a2 = -0.284496736; var a3 = 1.421413741; var a4 = -1.453152027; var a5 = 1.061405429; var p = 0.3275911; var sign = x < 0 ? -1 : 1; var absX = Math.abs(x); var t = 1 / (1 + p * absX); var y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX); return sign * y }
function erfc(x) { _validateNumber(x, 'x'); return 1 - erf(x) }
function gamma(x) { _validateNumber(x, 'x'); if (x <= 0) throw new Error('Gamma undefined for non-positive integers'); if (x < 1) return gamma(x + 1) / x; if (x === 1) return 1; if (x === 2) return 1; if (x > 10) { return Math.sqrt(2 * Math.PI / x) * Math.pow(x / Math.E, x) } return (x - 1) * gamma(x - 1) }
function lgamma(x) { _validateNumber(x, 'x'); if (x <= 0) throw new Error('lgamma undefined for non-positive integers'); return Math.log(gamma(x)) }
function beta(a, b) { _validateNumber(a, 'a'); _validateNumber(b, 'b'); if (a <= 0 || b <= 0) throw new Error('Beta parameters must be positive'); return gamma(a) * gamma(b) / gamma(a + b) }

// ====================================================================
// STRING LIBRARY
// ====================================================================

var space = ' '
var empty = ''
var newline = '\n'
var tab = '\t'

function len(a) { var b = 0; while (a[b] !== undefined) b = add(b, 1); return b }
function char_at(a, b) { return a[b] || '' }
function concat(a, b) { return a + b }
function to_upper(a) { var b = ''; for (var c = 0; c < len(a); c++) { var d = a[c]; var e = d.charCodeAt(0); if (e >= 97 && e <= 122) { e = e - 32 } b = b + String.fromCharCode(e) } return b }
function to_lower(a) { var b = ''; for (var c = 0; c < len(a); c++) { var d = a[c]; var e = d.charCodeAt(0); if (e >= 65 && e <= 90) { e = e + 32 } b = b + String.fromCharCode(e) } return b }
function trim(a) { var b = 0, c = len(a) - 1; while (a[b] === ' ' || a[b] === '\n' || a[b] === '\t') b = add(b, 1); while (a[c] === ' ' || a[c] === '\n' || a[c] === '\t') c = sub(c, 1); var d = ''; for (var e = b; e <= c; e++) d = d + a[e]; return d }
function trim_start(a) { var b = 0; while (a[b] === ' ' || a[b] === '\n' || a[b] === '\t') b = add(b, 1); var c = ''; for (var d = b; d < len(a); d++) c = c + a[d]; return c }
function trim_end(a) { var b = len(a) - 1; while (a[b] === ' ' || a[b] === '\n' || a[b] === '\t') b = sub(b, 1); var c = ''; for (var d = 0; d <= b; d++) c = c + a[d]; return c }
function substring(a, b, c) { var d = ''; var e = c || len(a); for (var f = b; f < e; f++) d = d + a[f]; return d }
function split(a, b) { var c = [], d = ''; for (var e = 0; e < len(a); e++) { if (a[e] === b) { c.push(d); d = '' } else { d = d + a[e] } } c.push(d); return c }
function join(a, b) { var c = ''; for (var d = 0; d < len(a); d++) { c = c + a[d]; if (d < len(a) - 1) c = c + b } return c }
function replace(a, b, c) { var d = ''; for (var e = 0; e < len(a); e++) { if (a[e] === b) { d = d + c } else { d = d + a[e] } } return d }
function replace_all(a, b, c) { var d = ''; for (var e = 0; e < len(a); e++) { if (a[e] === b) { d = d + c } else { d = d + a[e] } } return d }
function index_of(a, b) { for (var c = 0; c < len(a); c++) { if (a[c] === b) return c } return -1 }
function last_index_of(a, b) { for (var c = len(a) - 1; c >= 0; c--) { if (a[c] === b) return c } return -1 }
function includes(a, b) { for (var c = 0; c < len(a); c++) { if (a[c] === b) return true } return false }
function starts_with(a, b) { for (var c = 0; c < len(b); c++) { if (a[c] !== b[c]) return false } return true }
function ends_with(a, b) { var c = len(b); for (var d = 0; d < c; d++) { if (a[len(a) - c + d] !== b[d]) return false } return true }
function repeat(a, b) { var c = ''; for (var d = 0; d < b; d++) c = c + a; return c }
function pad_start(a, b, c) { var d = ''; var e = b - len(a); for (var f = 0; f < e; f++) d = d + c; return d + a }
function pad_end(a, b, c) { var d = ''; var e = b - len(a); for (var f = 0; f < e; f++) d = d + c; return a + d }
function char_code(a, b) { return a.charCodeAt(b) }
function from_char_code(a) { return String.fromCharCode(a) }
function reverse(a) { var b = ''; for (var c = len(a) - 1; c >= 0; c--) b = b + a[c]; return b }
function count_char(a, b) { var c = 0; for (var d = 0; d < len(a); d++) { if (a[d] === b) c = add(c, 1) } return c }
function count_word(a) { var b = trim(a); var c = 0; for (var d = 0; d < len(b); d++) { if (b[d] === ' ' && b[d + 1] !== ' ') c = add(c, 1) } return add(c, 1) }
function is_empty(a) { return len(a) === 0 }
function is_whitespace(a) { for (var b = 0; b < len(a); b++) { if (a[b] !== ' ' && a[b] !== '\n' && a[b] !== '\t') return false } return true }
function first(a) { return a[0] || '' }
function last(a) { return a[len(a) - 1] || '' }
function take(a, b) { var c = ''; for (var d = 0; d < b; d++) c = c + a[d]; return c }
function drop(a, b) { var c = ''; for (var d = b; d < len(a); d++) c = c + a[d]; return c }
function slice(a, b, c) { var d = ''; var e = c || len(a); for (var f = b; f < e; f++) d = d + a[f]; return d }
function to_array(a) { var b = []; for (var c = 0; c < len(a); c++) b.push(a[c]); return b }
function from_array(a) { var b = ''; for (var c = 0; c < len(a); c++) b = b + a[c]; return b }
function compare(a, b) { if (a === b) return 0; return a > b ? 1 : -1 }
function equal(a, b) { return a === b }
function random_char() { var a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; return a[randomInt(0, len(a) - 1)] }
function random_string(a) { var b = ''; for (var c = 0; c < a; c++) b = b + random_char(); return b }
function escape_html(a) { var b = ''; for (var c = 0; c < len(a); c++) { var d = a[c]; if (d === '<') b = b + '&lt;'; else if (d === '>') b = b + '&gt;'; else if (d === '&') b = b + '&amp;'; else if (d === '"') b = b + '&quot;'; else if (d === "'") b = b + '&#39;'; else b = b + d } return b }
function unescape_html(a) { var b = a; b = replace_all(b, '&lt;', '<'); b = replace_all(b, '&gt;', '>'); b = replace_all(b, '&amp;', '&'); b = replace_all(b, '&quot;', '"'); b = replace_all(b, '&#39;', "'"); return b }
function to_slug(a) { var b = to_lower(a); var c = ''; for (var d = 0; d < len(b); d++) { var e = b[d]; if (e >= 'a' && e <= 'z') c = c + e; else if (e >= '0' && e <= '9') c = c + e; else if (e === ' ') c = c + '-'; else c = c + '' } return c }
function to_camel(a) { var b = to_lower(a); var c = ''; var d = false; for (var e = 0; e < len(b); e++) { if (b[e] === ' ') { d = true } else if (d) { c = c + to_upper(b[e]); d = false } else { c = c + b[e] } } return c }
function to_snake(a) { var b = to_lower(a); var c = ''; for (var d = 0; d < len(b); d++) { if (b[d] === ' ') c = c + '_'; else c = c + b[d] } return c }
function to_kebab(a) { var b = to_lower(a); var c = ''; for (var d = 0; d < len(b); d++) { if (b[d] === ' ') c = c + '-'; else c = c + b[d] } return c }
function mask(a, b, c) { b = b || 4; c = c || '*'; var d = len(a); if (d <= b) return a; var e = ''; for (var f = 0; f < d - b; f++) e = e + c; return e + substring(a, d - b, d) }
function truncate(a, b) { if (len(a) <= b) return a; return substring(a, 0, b) + '...' }
function swap_case(a) { var b = ''; for (var c = 0; c < len(a); c++) { var d = a[c]; if (d === to_upper(d)) b = b + to_lower(d); else b = b + to_upper(d) } return b }
function count_lines(a) { var b = split(a, '\n'); return len(b) }
function extract_numbers(a) { var b = ''; for (var c = 0; c < len(a); c++) { if (a[c] >= '0' && a[c] <= '9') b = b + a[c] } return b }
function extract_letters(a) { var b = ''; for (var c = 0; c < len(a); c++) { if ((a[c] >= 'a' && a[c] <= 'z') || (a[c] >= 'A' && a[c] <= 'Z')) b = b + a[c] } return b }
function is_alpha(a) { for (var b = 0; b < len(a); b++) { var c = a[b]; if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) return false } return true }
function is_digit(a) { for (var b = 0; b < len(a); b++) { var c = a[b]; if (!(c >= '0' && c <= '9')) return false } return true }
function is_alphanumeric(a) { for (var b = 0; b < len(a); b++) { var c = a[b]; if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'))) return false } return true }
function is_lower(a) { for (var b = 0; b < len(a); b++) { var c = a[b]; if (c >= 'A' && c <= 'Z') return false } return true }
function is_upper(a) { for (var b = 0; b < len(a); b++) { var c = a[b]; if (c >= 'a' && c <= 'z') return false } return true }
function to_title(a) { var b = to_lower(a); var c = ''; var d = true; for (var e = 0; e < len(b); e++) { if (b[e] === ' ') { d = true; c = c + ' ' } else if (d) { c = c + to_upper(b[e]); d = false } else { c = c + b[e] } } return c }
function surround(a, b, c) { return b + a + c }
function quote(a) { return '"' + a + '"' }
function unquote(a) { if (starts_with(a, '"') && ends_with(a, '"')) return substring(a, 1, len(a) - 1); return a }
function center(a, b, c) { c = c || ' '; var d = b - len(a); var e = floor(div(d, 2)); var f = ''; for (var g = 0; g < e; g++) f = f + c; return f + a + f }

// ====================================================================
// DATETIME LIBRARY - FIXED
// ====================================================================

function _isDate(d) { return d instanceof Date && !isNaN(d.getTime()) }
function _validateDate(d, name) { name = name || 'date'; if (!_isDate(d)) throw new Error(name + ' must be a valid Date object'); return d }
function _validateString(s, name) { name = name || 'string'; if (typeof s !== 'string') throw new Error(name + ' must be a string'); return s }
function _padZero(n, length) { length = length || 2; return String(n).padStart(length, '0') }

function now() { return new Date() }
function createDate(year, month, day, hour, minute, second, ms) { month = month || 0; day = day || 1; hour = hour || 0; minute = minute || 0; second = second || 0; ms = ms || 0; _validateNumber(year, 'year'); _validateNumber(month, 'month'); _validateNumber(day, 'day'); _validateNumber(hour, 'hour'); _validateNumber(minute, 'minute'); _validateNumber(second, 'second'); _validateNumber(ms, 'ms'); return new Date(year, month, day, hour, minute, second, ms) }
function parseDate(str, format) { format = format || 'auto'; _validateString(str, 'str'); if (format === 'auto') { var d = new Date(str); if (_isDate(d)) return d; throw new Error('Cannot parse date: ' + str) } var parts = format.split(/[-\/\\:. ]+/); var values = str.split(/[-\/\\:. ]+/); if (parts.length !== values.length) throw new Error('Format and value mismatch'); var year, month, day, hour = 0, minute = 0, second = 0; for (var i = 0; i < parts.length; i++) { var part = parts[i]; var val = parseInt(values[i]); if (isNaN(val)) throw new Error('Invalid value: ' + values[i]); if (part === 'YYYY' || part === 'yyyy') year = val; else if (part === 'YY' || part === 'yy') year = 2000 + val; else if (part === 'MM') month = val - 1; else if (part === 'DD') day = val; else if (part === 'HH') hour = val; else if (part === 'mm') minute = val; else if (part === 'ss') second = val } if (year === undefined) throw new Error('Year not found in format'); return new Date(year, month || 0, day || 1, hour, minute, second) }
function parseISO(str) { _validateString(str, 'str'); var d = new Date(str); if (!_isDate(d)) throw new Error('Invalid ISO string: ' + str); return d }
function fromUnix(timestamp, ms) { ms = ms || false; _validateNumber(timestamp, 'timestamp'); return ms ? new Date(timestamp) : new Date(timestamp * 1000) }
function fromMillis(ms) { _validateNumber(ms, 'ms'); return new Date(ms) }

function getYear(date) { _validateDate(date); return date.getFullYear() }
function getMonth(date) { _validateDate(date); return date.getMonth() + 1 }
function getDay(date) { _validateDate(date); return date.getDate() }
function getHour(date) { _validateDate(date); return date.getHours() }
function getMinute(date) { _validateDate(date); return date.getMinutes() }
function getSecond(date) { _validateDate(date); return date.getSeconds() }
function getMillisecond(date) { _validateDate(date); return date.getMilliseconds() }
function getDayOfWeek(date) { _validateDate(date); return date.getDay() }
function getDayOfYear(date) { _validateDate(date); var start = new Date(date.getFullYear(), 0, 0); return Math.floor((date - start) / (24 * 60 * 60 * 1000)) }
function getWeekOfYear(date) { _validateDate(date); var d = new Date(date); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7); var week1 = new Date(d.getFullYear(), 0, 4); return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7) }
function getQuarter(date) { _validateDate(date); return Math.floor((date.getMonth()) / 3) + 1 }
function getEpoch(date) { _validateDate(date); return Math.floor(date.getTime() / 1000) }
function getMillis(date) { _validateDate(date); return date.getTime() }
function getTimezoneOffset(date) { _validateDate(date); return date.getTimezoneOffset() }
function getTimezoneName(date) { _validateDate(date); var m = date.toString().match(/\(([^)]+)\)/); return m ? m[1] : 'UTC' }

function isEqual(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return date1.getTime() === date2.getTime() }
function isBefore(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return date1.getTime() < date2.getTime() }
function isAfter(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return date1.getTime() > date2.getTime() }
function isBetween(date, start, end) { _validateDate(date, 'date'); _validateDate(start, 'start'); _validateDate(end, 'end'); var t = date.getTime(); return t >= start.getTime() && t <= end.getTime() }
function isSameDay(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate() }
function isSameMonth(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() }
function isSameYear(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return date1.getFullYear() === date2.getFullYear() }
function isWeekend(date) { _validateDate(date); var day = date.getDay(); return day === 0 || day === 6 }
function isWeekday(date) { return !isWeekend(date) }
function isLeapYear(year) { _validateNumber(year, 'year'); return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 }
function isToday(date) { _validateDate(date); return isSameDay(date, new Date()) }
function isFuture(date) { _validateDate(date); return isAfter(date, new Date()) }
function isPast(date) { _validateDate(date); return isBefore(date, new Date()) }

function addYears(date, years) { _validateDate(date); _validateNumber(years, 'years'); var d = new Date(date); d.setFullYear(d.getFullYear() + years); return d }
function addMonths(date, months) { _validateDate(date); _validateNumber(months, 'months'); var d = new Date(date); d.setMonth(d.getMonth() + months); return d }
function addDays(date, days) { _validateDate(date); _validateNumber(days, 'days'); var d = new Date(date); d.setDate(d.getDate() + days); return d }
function addHours(date, hours) { _validateDate(date); _validateNumber(hours, 'hours'); var d = new Date(date); d.setHours(d.getHours() + hours); return d }
function addMinutes(date, minutes) { _validateDate(date); _validateNumber(minutes, 'minutes'); var d = new Date(date); d.setMinutes(d.getMinutes() + minutes); return d }
function addSeconds(date, seconds) { _validateDate(date); _validateNumber(seconds, 'seconds'); var d = new Date(date); d.setSeconds(d.getSeconds() + seconds); return d }
function addMilliseconds(date, ms) { _validateDate(date); _validateNumber(ms, 'ms'); var d = new Date(date); d.setMilliseconds(d.getMilliseconds() + ms); return d }
function subYears(date, years) { return addYears(date, -years) }
function subMonths(date, months) { return addMonths(date, -months) }
function subDays(date, days) { return addDays(date, -days) }
function subHours(date, hours) { return addHours(date, -hours) }
function subMinutes(date, minutes) { return addMinutes(date, -minutes) }
function subSeconds(date, seconds) { return addSeconds(date, -seconds) }

function diffYears(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return (date1.getFullYear() - date2.getFullYear()) + (date1.getMonth() - date2.getMonth()) / 12 }
function diffMonths(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return (date1.getFullYear() - date2.getFullYear()) * 12 + date1.getMonth() - date2.getMonth() }
function diffDays(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); var d1 = new Date(date1); var d2 = new Date(date2); d1.setHours(0, 0, 0, 0); d2.setHours(0, 0, 0, 0); return Math.floor((d1 - d2) / (24 * 60 * 60 * 1000)) }
function diffHours(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return (date1 - date2) / (60 * 60 * 1000) }
function diffMinutes(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return (date1 - date2) / (60 * 1000) }
function diffSeconds(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return (date1 - date2) / 1000 }
function diffMilliseconds(date1, date2) { _validateDate(date1, 'date1'); _validateDate(date2, 'date2'); return date1 - date2 }

function startOfDay(date) { _validateDate(date); var d = new Date(date); d.setHours(0, 0, 0, 0); return d }
function endOfDay(date) { _validateDate(date); var d = new Date(date); d.setHours(23, 59, 59, 999); return d }
function startOfWeek(date, weekStartsOn) { weekStartsOn = weekStartsOn || 0; _validateDate(date); _validateNumber(weekStartsOn, 'weekStartsOn'); var d = new Date(date); var day = d.getDay(); d.setDate(d.getDate() - ((day - weekStartsOn + 7) % 7)); d.setHours(0, 0, 0, 0); return d }
function endOfWeek(date, weekStartsOn) { weekStartsOn = weekStartsOn || 0; _validateDate(date); _validateNumber(weekStartsOn, 'weekStartsOn'); var d = startOfWeek(date, weekStartsOn); d.setDate(d.getDate() + 6); d.setHours(23, 59, 59, 999); return d }
function startOfMonth(date) { _validateDate(date); var d = new Date(date); d.setDate(1); d.setHours(0, 0, 0, 0); return d }
function endOfMonth(date) { _validateDate(date); var d = new Date(date); d.setMonth(d.getMonth() + 1); d.setDate(0); d.setHours(23, 59, 59, 999); return d }
function startOfYear(date) { _validateDate(date); var d = new Date(date); d.setMonth(0, 1); d.setHours(0, 0, 0, 0); return d }
function endOfYear(date) { _validateDate(date); var d = new Date(date); d.setMonth(11, 31); d.setHours(23, 59, 59, 999); return d }
function startOfQuarter(date) { _validateDate(date); var q = getQuarter(date); var d = new Date(date); d.setMonth((q - 1) * 3, 1); d.setHours(0, 0, 0, 0); return d }
function endOfQuarter(date) { _validateDate(date); var q = getQuarter(date); var d = new Date(date); d.setMonth(q * 3, 0); d.setHours(23, 59, 59, 999); return d }

function formatDate(date, format) { format = format || 'YYYY-MM-DD'; _validateDate(date); var map = { 'YYYY': date.getFullYear(), 'YY': String(date.getFullYear()).slice(-2), 'MM': _padZero(date.getMonth() + 1), 'M': date.getMonth() + 1, 'DD': _padZero(date.getDate()), 'D': date.getDate(), 'HH': _padZero(date.getHours()), 'H': date.getHours(), 'hh': _padZero(date.getHours() % 12 || 12), 'h': date.getHours() % 12 || 12, 'mm': _padZero(date.getMinutes()), 'm': date.getMinutes(), 'ss': _padZero(date.getSeconds()), 's': date.getSeconds(), 'SSS': _padZero(date.getMilliseconds(), 3), 'A': date.getHours() >= 12 ? 'PM' : 'AM', 'a': date.getHours() >= 12 ? 'pm' : 'am', 'dddd': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()], 'ddd': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()], 'dd': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()], 'MMMM': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()], 'MMM': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()], 'Q': getQuarter(date), 'Do': ['th', 'st', 'nd', 'rd'][date.getDate() % 10] || 'th' }; var result = format; for (var key in map) { if (map.hasOwnProperty(key)) { result = result.replace(new RegExp(key, 'g'), map[key]) } } return result }
function toISO(date) { _validateDate(date); return date.toISOString() }
function toLocaleString(date, locale, options) { locale = locale || 'en-US'; options = options || {}; _validateDate(date); return date.toLocaleString(locale, options) }
function toDateString(date) { _validateDate(date); return date.toDateString() }
function toTimeString(date) { _validateDate(date); return date.toTimeString() }
function toUTCString(date) { _validateDate(date); return date.toUTCString() }

function toRelative(date, baseDate) { baseDate = baseDate || new Date(); _validateDate(date); _validateDate(baseDate, 'baseDate'); var diff = diffSeconds(date, baseDate); var absDiff = Math.abs(diff); if (absDiff < 60) return diff < 0 ? 'just now' : 'in a moment'; if (absDiff < 3600) { var m = Math.floor(absDiff / 60); return diff < 0 ? m + ' min ago' : 'in ' + m + ' min' } if (absDiff < 86400) { var h = Math.floor(absDiff / 3600); return diff < 0 ? h + ' hour' + (h > 1 ? 's' : '') + ' ago' : 'in ' + h + ' hour' + (h > 1 ? 's' : '') } if (absDiff < 604800) { var d = Math.floor(absDiff / 86400); return diff < 0 ? d + ' day' + (d > 1 ? 's' : '') + ' ago' : 'in ' + d + ' day' + (d > 1 ? 's' : '') } if (absDiff < 2592000) { var w = Math.floor(absDiff / 604800); return diff < 0 ? w + ' week' + (w > 1 ? 's' : '') + ' ago' : 'in ' + w + ' week' + (w > 1 ? 's' : '') } if (absDiff < 31536000) { var mo = Math.floor(absDiff / 2592000); return diff < 0 ? mo + ' month' + (mo > 1 ? 's' : '') + ' ago' : 'in ' + mo + ' month' + (mo > 1 ? 's' : '') } var y = Math.floor(absDiff / 31536000); return diff < 0 ? y + ' year' + (y > 1 ? 's' : '') + ' ago' : 'in ' + y + ' year' + (y > 1 ? 's' : '') }

function daysInMonth(date) { _validateDate(date); var d = new Date(date); d.setMonth(d.getMonth() + 1); d.setDate(0); return d.getDate() }
function daysInYear(date) { _validateDate(date); return isLeapYear(date.getFullYear()) ? 366 : 365 }
function dayOfYear(date) { _validateDate(date); return getDayOfYear(date) }
function weekNumber(date) { _validateDate(date); return getWeekOfYear(date) }
function monthName(date, short) { short = short || false; _validateDate(date); var names = short ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; return names[date.getMonth()] }
function dayName(date, short) { short = short || false; _validateDate(date); var names = short ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; return names[date.getDay()] }

function age(birthDate, date) { date = date || new Date(); _validateDate(birthDate, 'birthDate'); _validateDate(date, 'date'); var age = date.getFullYear() - birthDate.getFullYear(); var m = date.getMonth() - birthDate.getMonth(); if (m < 0 || (m === 0 && date.getDate() < birthDate.getDate())) { age-- } return age }
function ageInMonths(birthDate, date) { date = date || new Date(); _validateDate(birthDate, 'birthDate'); _validateDate(date, 'date'); return diffMonths(date, birthDate) }
function ageInDays(birthDate, date) { date = date || new Date(); _validateDate(birthDate, 'birthDate'); _validateDate(date, 'date'); return diffDays(date, birthDate) }

function rangeOfDates(start, end, step, unit) { step = step || 1; unit = unit || 'days'; _validateDate(start, 'start'); _validateDate(end, 'end'); _validateNumber(step, 'step'); _validateString(unit, 'unit'); var dates = []; var d = new Date(start); var addFn = { 'days': addDays, 'weeks': addDays, 'months': addMonths, 'years': addYears }[unit]; if (!addFn) throw new Error('Unit must be days, weeks, months, or years'); var stepMultiplier = unit === 'weeks' ? step * 7 : step; while (isBefore(d, end) || isEqual(d, end)) { dates.push(new Date(d)); var next = unit === 'weeks' ? addDays(d, stepMultiplier) : addFn(d, stepMultiplier); d.setTime(next.getTime()) } return dates }
function getAge(birthDate) { return age(birthDate) }
function getTimeRemaining(date) { _validateDate(date); var diff = date - new Date(); if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 }; var ms = diff; var seconds = Math.floor(ms / 1000); var minutes = Math.floor(seconds / 60); var hours = Math.floor(minutes / 60); var days = Math.floor(hours / 24); return { days: days, hours: hours % 24, minutes: minutes % 60, seconds: seconds % 60, ms: ms % 1000 } }

// ====================================================================
// CSV LIBRARY - FIXED
// ====================================================================

function _isString_CSV(s) { return typeof s === 'string' }
function _isArray_CSV(a) { return Array.isArray(a) }
function _isObject_CSV(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _escapeCSV(str) { if (str === null || str === undefined) return ''; str = String(str); if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) { return '"' + str.replace(/"/g, '""') + '"' } return str }

function csvToArray(csv, delimiter, hasHeader) { delimiter = delimiter || ','; hasHeader = hasHeader !== undefined ? hasHeader : true; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var lines = csv.split(/\r?\n/).filter(function(line) { return line.trim() !== '' }); if (lines.length === 0) return []; var parsedLines = []; for (var i = 0; i < lines.length; i++) { var line = lines[i]; var parsed = []; var current = ''; var inQuotes = false; for (var j = 0; j < line.length; j++) { var char = line[j]; if (inQuotes) { if (char === '"' && j + 1 < line.length && line[j + 1] === '"') { current += '"'; j++ } else if (char === '"') { inQuotes = false } else { current += char } } else { if (char === '"') { inQuotes = true } else if (char === delimiter) { parsed.push(current.trim()); current = '' } else { current += char } } } parsed.push(current.trim()); parsedLines.push(parsed) } var rowLength = parsedLines[0].length; for (var i = 0; i < parsedLines.length; i++) { if (parsedLines[i].length !== rowLength) { throw new Error('Row ' + (i + 1) + ' has ' + parsedLines[i].length + ' columns, expected ' + rowLength) } } if (hasHeader && parsedLines.length > 0) { var result = []; var headers = parsedLines[0]; for (var i = 1; i < parsedLines.length; i++) { var row = {}; for (var j = 0; j < headers.length; j++) { row[headers[j]] = parsedLines[i][j] || '' } result.push(row) } return result } return parsedLines }

function arrayToCsv_CSV(data, delimiter) { delimiter = delimiter || ','; if (!_isArray_CSV(data)) throw new Error('Data must be an array'); if (data.length === 0) return ''; return data.map(function(row) { if (!_isArray_CSV(row)) throw new Error('Each row must be an array'); return row.map(function(cell) { return _escapeCSV(cell) }).join(delimiter) }).join('\n') }
function jsonToCsv_CSV(data, delimiter, headers) { delimiter = delimiter || ','; headers = headers || null; if (!_isArray_CSV(data)) throw new Error('Data must be an array'); if (data.length === 0) return ''; var h = headers || Object.keys(data[0]); var rows = [h]; for (var i = 0; i < data.length; i++) { var item = data[i]; var row = h.map(function(key) { var value = item[key]; return value === null || value === undefined ? '' : value }); rows.push(row) } return arrayToCsv_CSV(rows, delimiter) }
function csvToJson_CSV(csv, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); return csvToArray(csv, delimiter, true) }
function csvToTable(csv, delimiter, hasHeader) { delimiter = delimiter || ','; hasHeader = hasHeader !== undefined ? hasHeader : true; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, hasHeader); if (!_isArray_CSV(data) || data.length === 0) return ''; var html = '<table>\n'; if (hasHeader) { html += '  <thead>\n    <tr>\n'; var header = data[0]; for (var key in header) { if (header.hasOwnProperty(key)) { html += '      <th>' + key + '</th>\n' } } html += '    </tr>\n  </thead>\n  <tbody>\n'; for (var i = 0; i < data.length; i++) { var row = data[i]; html += '    <tr>\n'; for (var key in row) { if (row.hasOwnProperty(key)) { html += '      <td>' + (row[key] || '') + '</td>\n' } } html += '    </tr>\n' } html += '  </tbody>\n' } else { for (var i = 0; i < data.length; i++) { var row = data[i]; html += '  <tr>\n'; for (var j = 0; j < row.length; j++) { html += '    <td>' + row[j] + '</td>\n' } html += '  </tr>\n' } } html += '</table>'; return html }
function tableToCsv_CSV(tableHtml, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(tableHtml)) throw new Error('Table HTML must be a string'); var parser = new DOMParser(); var doc = parser.parseFromString(tableHtml, 'text/html'); var rows = doc.querySelectorAll('tr'); if (rows.length === 0) throw new Error('No rows found in table'); var data = []; for (var i = 0; i < rows.length; i++) { var row = rows[i]; var cells = row.querySelectorAll('td, th'); var rowData = []; for (var j = 0; j < cells.length; j++) { rowData.push(cells[j].textContent.trim()) } data.push(rowData) } return arrayToCsv_CSV(data, delimiter) }
function validateCsv(csv, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) return { valid: false, error: 'CSV must be a string' }; try { var data = csvToArray(csv, delimiter, false); if (!_isArray_CSV(data) || data.length === 0) return { valid: false, error: 'Empty CSV data' }; var cols = data[0].length; for (var i = 0; i < data.length; i++) { if (data[i].length !== cols) { return { valid: false, error: 'Row ' + (i + 1) + ' has ' + data[i].length + ' columns, expected ' + cols } } } return { valid: true } } catch (error) { return { valid: false, error: error.message } } }
function getColumnNames(csv, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data) || data.length === 0) return []; return Object.keys(data[0]) }
function getRowCount(csv, delimiter, hasHeader) { delimiter = delimiter || ','; hasHeader = hasHeader !== undefined ? hasHeader : true; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, hasHeader); if (!_isArray_CSV(data)) return 0; return data.length }
function getColumnCount(csv, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, false); if (!_isArray_CSV(data) || data.length === 0) return 0; return data[0].length }
function addColumn_CSV(csv, columnName, defaultValue, delimiter) { defaultValue = defaultValue || ''; delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data) || data.length === 0) return csv; for (var i = 0; i < data.length; i++) { data[i][columnName] = defaultValue } return jsonToCsv_CSV(data, delimiter) }
function removeColumn_CSV(csv, columnName, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data) || data.length === 0) return csv; for (var i = 0; i < data.length; i++) { delete data[i][columnName] } var headers = Object.keys(data[0]); var result = data.map(function(row) { var newRow = {}; for (var j = 0; j < headers.length; j++) { newRow[headers[j]] = row[headers[j]] } return newRow }); return jsonToCsv_CSV(result, delimiter) }
function renameColumn(csv, oldName, newName, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data) || data.length === 0) return csv; for (var i = 0; i < data.length; i++) { if (oldName in data[i]) { data[i][newName] = data[i][oldName]; delete data[i][oldName] } } return jsonToCsv_CSV(data, delimiter) }
function filterRows(csv, predicate, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data) || data.length === 0) return csv; var filtered = data.filter(predicate); return jsonToCsv_CSV(filtered, delimiter) }
function sortRows(csv, column, ascending, delimiter) { ascending = ascending !== undefined ? ascending : true; delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data) || data.length === 0) return csv; var sorted = data.slice().sort(function(a, b) { var valA = a[column] || ''; var valB = b[column] || ''; if (ascending) return valA > valB ? 1 : -1; return valA < valB ? 1 : -1 }); return jsonToCsv_CSV(sorted, delimiter) }
function getColumn_CSV(csv, column, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data) || data.length === 0) return []; return data.map(function(row) { return row[column] }) }
function getUniqueValues(csv, column, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var values = getColumn_CSV(csv, column, delimiter); return Array.from(new Set(values)) }
function getColumnStats(csv, column, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var values = getColumn_CSV(csv, column, delimiter); if (values.length === 0) return null; var nums = values.map(function(v) { return parseFloat(v) }).filter(function(v) { return !isNaN(v) }); if (nums.length === 0) { return { min: null, max: null, sum: null, avg: null, count: values.length } } var sum = nums.reduce(function(a, b) { return a + b }, 0); var avg = sum / nums.length; var min = Math.min.apply(Math, nums); var max = Math.max.apply(Math, nums); return { min: min, max: max, sum: sum, avg: avg, count: nums.length } }
function csvToMarkdown(csv, delimiter) { delimiter = delimiter || ','; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data) || data.length === 0) return ''; var headers = Object.keys(data[0]); var result = '| ' + headers.join(' | ') + ' |\n'; result += '|' + headers.map(function() { return ' --- ' }).join('|') + '|\n'; for (var i = 0; i < data.length; i++) { var row = data[i]; result += '| ' + headers.map(function(h) { return row[h] || '' }).join(' | ') + ' |\n' } return result }
function csvToHtml_CSV(csv, delimiter) { return csvToTable(csv, delimiter) }
function htmlToCsv_CSV(html, delimiter) { return tableToCsv_CSV(html, delimiter) }
function csvToDsv(csv, delimiter, newDelimiter) { delimiter = delimiter || ','; newDelimiter = newDelimiter || ';'; if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var data = csvToArray(csv, delimiter, false); if (!_isArray_CSV(data)) return ''; return arrayToCsv_CSV(data, newDelimiter) }
function dsvToCsv(dsv, delimiter, newDelimiter) { delimiter = delimiter || ';'; newDelimiter = newDelimiter || ','; return csvToDsv(dsv, delimiter, newDelimiter) }
function downloadCsv(csv, filename) { if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); filename = filename || 'data.csv'; var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); var link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href) }
function uploadCsv(callback) { if (typeof callback !== 'function') throw new Error('Callback must be a function'); var input = document.createElement('input'); input.type = 'file'; input.accept = '.csv'; input.onchange = function(event) { var file = event.target.files[0]; if (!file) return; var reader = new FileReader(); reader.onload = function(e) { callback(e.target.result) }; reader.readAsText(file) }; input.click() }
function readCsvFile(file) { return new Promise(function(resolve, reject) { var reader = new FileReader(); reader.onload = function(e) { resolve(e.target.result) }; reader.onerror = function(e) { reject(e) }; reader.readAsText(file) }) }
function parseCsvWithOptions(csv, options) { if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); options = options || {}; var delimiter = options.delimiter || ','; var hasHeader = options.hasHeader !== undefined ? options.hasHeader : true; var trim = options.trim !== undefined ? options.trim : true; var quoteChar = options.quoteChar || '"'; var escapeChar = options.escapeChar || '"'; var lines = csv.split(/\r?\n/).filter(function(line) { return line.trim() !== '' }); if (lines.length === 0) return { data: [], headers: [] }; var parsedLines = []; for (var i = 0; i < lines.length; i++) { var line = lines[i]; var parsed = []; var current = ''; var inQuotes = false; for (var j = 0; j < line.length; j++) { var char = line[j]; if (inQuotes) { if (char === quoteChar && j + 1 < line.length && line[j + 1] === escapeChar) { current += quoteChar; j++ } else if (char === quoteChar) { inQuotes = false } else { current += char } } else { if (char === quoteChar) { inQuotes = true } else if (char === delimiter) { parsed.push(trim ? current.trim() : current); current = '' } else { current += char } } } parsed.push(trim ? current.trim() : current); parsedLines.push(parsed) } var headers = []; var data = []; if (hasHeader && parsedLines.length > 0) { headers = parsedLines[0]; for (var i = 1; i < parsedLines.length; i++) { var row = {}; for (var j = 0; j < headers.length; j++) { row[headers[j]] = parsedLines[i][j] || '' } data.push(row) } } else { data = parsedLines } return { data: data, headers: headers } }
function* csvGenerator(csv, delimiter, chunkSize) { if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); delimiter = delimiter || ','; chunkSize = chunkSize || 1000; var data = csvToArray(csv, delimiter, true); if (!_isArray_CSV(data)) return; for (var i = 0; i < data.length; i += chunkSize) { yield data.slice(i, i + chunkSize) } }
function processCsvStream(csv, processor, delimiter, chunkSize) { if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); if (typeof processor !== 'function') throw new Error('Processor must be a function'); delimiter = delimiter || ','; chunkSize = chunkSize || 1000; var generator = csvGenerator(csv, delimiter, chunkSize); var results = []; for (var chunk of generator) { var processed = processor(chunk); if (processed !== undefined) { results.push(processed) } } return results }
function detectDelimiter(csv) { if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var line = csv.split('\n')[0]; var delimiters = [',', ';', '\t', '|']; var best = ','; var maxCount = 0; for (var i = 0; i < delimiters.length; i++) { var d = delimiters[i]; var regex = new RegExp(d, 'g'); var matches = line.match(regex); var count = matches ? matches.length : 0; if (count > maxCount) { maxCount = count; best = d } } return best }
function getCSVInfo(csv) { if (!_isString_CSV(csv)) throw new Error('CSV must be a string'); var delimiter = detectDelimiter(csv); var rows = csv.split(/\r?\n/).filter(function(line) { return line.trim() !== '' }); var headers = rows.length > 0 ? rows[0].split(delimiter) : []; return { delimiter: delimiter, rowCount: rows.length, columnCount: headers.length, hasHeader: true, fileSize: csv.length, headers: headers } }

var CSV = { csvToArray: csvToArray, arrayToCsv: arrayToCsv_CSV, jsonToCsv: jsonToCsv_CSV, csvToJson: csvToJson_CSV, csvToTable: csvToTable, tableToCsv: tableToCsv_CSV, validateCsv: validateCsv, getColumnNames: getColumnNames, getRowCount: getRowCount, getColumnCount: getColumnCount, addColumn: addColumn_CSV, removeColumn: removeColumn_CSV, renameColumn: renameColumn, filterRows: filterRows, sortRows: sortRows, getColumn: getColumn_CSV, getUniqueValues: getUniqueValues, getColumnStats: getColumnStats, csvToMarkdown: csvToMarkdown, csvToHtml: csvToHtml_CSV, htmlToCsv: htmlToCsv_CSV, csvToDsv: csvToDsv, dsvToCsv: dsvToCsv, downloadCsv: downloadCsv, uploadCsv: uploadCsv, readCsvFile: readCsvFile, parseCsvWithOptions: parseCsvWithOptions, csvGenerator: csvGenerator, processCsvStream: processCsvStream, detectDelimiter: detectDelimiter, getCSVInfo: getCSVInfo }

// ====================================================================
// AUDIO UNDERSTANDING LIBRARY - FIXED (no WebAudio dependency fallback)
// ====================================================================

function _isString_Audio(s) { return typeof s === 'string' }
function _isArray_Audio(a) { return Array.isArray(a) }
function _isObject_Audio(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber_Audio(n) { return typeof n === 'number' && !isNaN(n) }

function _base64ToAudioBuffer(base64) { return new Promise(function(resolve, reject) { try { var audioContext = new (window.AudioContext || window.webkitAudioContext)(); var binaryString = atob(base64.split(',')[1] || base64); var bytes = new Uint8Array(binaryString.length); for (var i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i) } var arrayBuffer = bytes.buffer; audioContext.decodeAudioData(arrayBuffer, function(buffer) { resolve({ context: audioContext, buffer: buffer }) }, function(error) { reject(error) }) } catch(e) { reject(e) } }) }
function _getAudioData(buffer) { var channelData = buffer.getChannelData(0); var data = []; for (var i = 0; i < channelData.length; i++) { data.push(channelData[i]) } return data }
function _normalizeAudio(data) { var max = Math.max.apply(Math, data.map(Math.abs)); if (max === 0) return data; return data.map(function(v) { return v / max }) }
function _fft(data) { var n = data.length; if (n <= 1) return data; var even = [], odd = []; for (var i = 0; i < n; i++) { if (i % 2 === 0) even.push(data[i]); else odd.push(data[i]) } var fftEven = _fft(even); var fftOdd = _fft(odd); var result = new Array(n); for (var k = 0; k < n / 2; k++) { var angle = -2 * Math.PI * k / n; var re = Math.cos(angle); var im = Math.sin(angle); var oddRe = fftOdd[k]; var oddIm = 0; result[k] = fftEven[k] + re * oddRe - im * oddIm; result[k + n/2] = fftEven[k] - re * oddRe + im * oddIm } return result }
function _computeMagnitude(fftResult) { var mag = []; for (var i = 0; i < fftResult.length / 2; i++) { mag.push(Math.abs(fftResult[i])) } return mag }

function extractAudioFeatures(buffer) { var audioData = _getAudioData(buffer); var normalized = _normalizeAudio(audioData); var sampleRate = buffer.sampleRate; var duration = buffer.duration; var features = { duration: duration, sampleRate: sampleRate, samples: audioData.length, channels: buffer.numberOfChannels, mean: audioData.reduce(function(a, b) { return a + b }, 0) / audioData.length, variance: 0, stddev: 0, rms: 0, maxAmplitude: Math.max.apply(Math, audioData.map(Math.abs)), minAmplitude: Math.min.apply(Math, audioData.map(Math.abs)), zeroCrossingRate: 0, energy: 0, energyPerSecond: 0, spectralCentroid: 0, spectralSpread: 0, spectralSkewness: 0, spectralKurtosis: 0, spectralRolloff: 0, spectralFlatness: 0, mfcc: [], tempo: 0, beats: 0, silenceRatio: 0, isSilent: false }; var varianceSum = 0, rmsSum = 0; for (var i = 0; i < audioData.length; i++) { var val = audioData[i]; varianceSum += (val - features.mean) * (val - features.mean); rmsSum += val * val } features.variance = varianceSum / audioData.length; features.stddev = Math.sqrt(features.variance); features.rms = Math.sqrt(rmsSum / audioData.length); var zeroCrossings = 0; for (var i = 1; i < audioData.length; i++) { if (audioData[i] * audioData[i-1] < 0) zeroCrossings++ } features.zeroCrossingRate = zeroCrossings / audioData.length; var energySum = 0; for (var i = 0; i < audioData.length; i++) { energySum += audioData[i] * audioData[i] } features.energy = energySum; features.energyPerSecond = energySum / duration; var silentSamples = 0; var silenceThreshold = 0.01; for (var i = 0; i < audioData.length; i++) { if (Math.abs(audioData[i]) < silenceThreshold) silentSamples++ } features.silenceRatio = silentSamples / audioData.length; features.isSilent = features.silenceRatio > 0.5; var fftSize = Math.pow(2, Math.ceil(Math.log2(audioData.length))); var padded = new Array(fftSize).fill(0); for (var i = 0; i < Math.min(audioData.length, fftSize); i++) { padded[i] = audioData[i] } var fftResult = _fft(padded); var magnitude = _computeMagnitude(fftResult); var freqs = magnitude.map(function(_, i) { return (i * sampleRate) / fftSize }); var weightedSum = 0, totalMag = 0; for (var i = 0; i < magnitude.length; i++) { weightedSum += freqs[i] * magnitude[i]; totalMag += magnitude[i] } features.spectralCentroid = totalMag > 0 ? weightedSum / totalMag : 0; var spreadSum = 0; for (var i = 0; i < magnitude.length; i++) { spreadSum += (freqs[i] - features.spectralCentroid) * (freqs[i] - features.spectralCentroid) * magnitude[i] } features.spectralSpread = totalMag > 0 ? Math.sqrt(spreadSum / totalMag) : 0; var skewnessSum = 0; for (var i = 0; i < magnitude.length; i++) { skewnessSum += Math.pow((freqs[i] - features.spectralCentroid) / (features.spectralSpread || 1), 3) * magnitude[i] } features.spectralSkewness = totalMag > 0 ? skewnessSum / totalMag : 0; var kurtosisSum = 0; for (var i = 0; i < magnitude.length; i++) { kurtosisSum += Math.pow((freqs[i] - features.spectralCentroid) / (features.spectralSpread || 1), 4) * magnitude[i] } features.spectralKurtosis = totalMag > 0 ? kurtosisSum / totalMag : 0; var cumEnergy = 0; var totalEnergy = magnitude.reduce(function(a, b) { return a + b }, 0); for (var i = 0; i < magnitude.length; i++) { cumEnergy += magnitude[i]; if (cumEnergy >= totalEnergy * 0.85) { features.spectralRolloff = freqs[i]; break } } var logSum = 0; var arithMean = totalMag / magnitude.length; for (var i = 0; i < magnitude.length; i++) { if (magnitude[i] > 0) logSum += Math.log(magnitude[i]) } var geoMean = Math.exp(logSum / magnitude.length); features.spectralFlatness = arithMean > 0 ? geoMean / arithMean : 0; var melBands = 13; var melFreqs = []; for (var i = 0; i < melBands; i++) { var mel = i * (2595 * Math.log10(1 + (sampleRate/2) / 700) / melBands); var freq = 700 * (Math.pow(10, mel / 2595) - 1); melFreqs.push(freq) } var mfcc = []; for (var i = 0; i < melBands; i++) { var sum = 0; for (var j = 0; j < magnitude.length; j++) { var weight = Math.exp(-Math.pow((freqs[j] - melFreqs[i]) / (melFreqs[i] * 0.5), 2)); sum += magnitude[j] * weight } mfcc.push(Math.log(sum + 1)) } features.mfcc = mfcc; var maxLag = Math.min(Math.floor(sampleRate * 0.5), audioData.length); var maxCorr = 0, tempoLag = 0; for (var lag = 1; lag < maxLag; lag++) { var corr = 0; for (var i = 0; i < audioData.length - lag; i++) { corr += audioData[i] * audioData[i + lag] } corr /= (audioData.length - lag); if (corr > maxCorr) { maxCorr = corr; tempoLag = lag } } if (tempoLag > 0) { features.tempo = 60 / (tempoLag / sampleRate); features.beats = duration * features.tempo / 60 } return features }

var AudioUnderstanding = { knowledge: { categories: {}, patterns: {}, templates: {} }, settings: { sensitivity: 0.5, minConfidence: 0.3, sampleRate: 44100 }, extractFeatures: function(audioBase64) { return new Promise(function(resolve, reject) { _base64ToAudioBuffer(audioBase64).then(function(result) { try { var features = extractAudioFeatures(result.buffer); resolve({ success: true, features: features, duration: features.duration, sampleRate: features.sampleRate, isSilent: features.isSilent }) } catch (error) { reject(error) } }).catch(reject) }) }, learn: function(input) { if (!_isObject_Audio(input)) { throw new Error('Input must be an object with audio-label pairs') } return new Promise(function(resolve, reject) { var promises = []; var labels = Object.keys(input); for (var i = 0; i < labels.length; i++) { var label = labels[i]; var base64 = input[label]; if (!_isString_Audio(base64)) continue; promises.push(_base64ToAudioBuffer(base64).then(function(result) { var features = extractAudioFeatures(result.buffer); return { label: label, features: features, audio: base64 } })) } Promise.all(promises).then(function(results) { for (var i = 0; i < results.length; i++) { var result = results[i]; if (!AudioUnderstanding.knowledge.categories[result.label]) { AudioUnderstanding.knowledge.categories[result.label] = [] } AudioUnderstanding.knowledge.categories[result.label].push({ features: result.features, audio: result.audio }) } AudioUnderstanding._extractPatterns_Audio(); resolve({ success: true, learned: results.length, total: labels.length, knowledge: Object.keys(AudioUnderstanding.knowledge.categories).map(function(c) { return c + ': ' + AudioUnderstanding.knowledge.categories[c].length + ' samples' }) }) }).catch(reject) }) }, _extractPatterns_Audio: function() { var patterns = {}; for (var category in this.knowledge.categories) { if (!this.knowledge.categories.hasOwnProperty(category)) continue; var samples = this.knowledge.categories[category]; if (samples.length === 0) continue; var avgFeatures = { spectralCentroid: 0, spectralSpread: 0, spectralSkewness: 0, spectralKurtosis: 0, zeroCrossingRate: 0, rms: 0, energy: 0, tempo: 0, mfcc: new Array(13).fill(0) }; for (var i = 0; i < samples.length; i++) { var f = samples[i].features; avgFeatures.spectralCentroid += f.spectralCentroid; avgFeatures.spectralSpread += f.spectralSpread; avgFeatures.spectralSkewness += f.spectralSkewness; avgFeatures.spectralKurtosis += f.spectralKurtosis; avgFeatures.zeroCrossingRate += f.zeroCrossingRate; avgFeatures.rms += f.rms; avgFeatures.energy += f.energy; avgFeatures.tempo += f.tempo; for (var j = 0; j < 13; j++) { if (f.mfcc[j]) avgFeatures.mfcc[j] += f.mfcc[j] } } var count = samples.length; for (var key in avgFeatures) { if (key === 'mfcc') { for (var j = 0; j < 13; j++) { avgFeatures.mfcc[j] /= count } } else { avgFeatures[key] /= count } } patterns[category] = avgFeatures } this.knowledge.patterns = patterns }, understand: function(audioBase64, options) { options = options || {}; var sensitivity = options.sensitivity || this.settings.sensitivity; if (!_isString_Audio(audioBase64)) { return Promise.resolve({ error: 'Audio must be a base64 string' }) } return new Promise(function(resolve, reject) { _base64ToAudioBuffer(audioBase64).then(function(result) { try { var features = extractAudioFeatures(result.buffer); var recognition = AudioUnderstanding._recognize_Audio(features, sensitivity); resolve({ classification: recognition.classification, confidence: recognition.confidence, score: recognition.score, features: features, isSpeech: !features.isSilent && features.zeroCrossingRate > 0.01, isMusic: features.spectralFlatness < 0.5 && features.zeroCrossingRate > 0.02, isSilent: features.isSilent, hasVoice: features.spectralCentroid > 100 && features.spectralCentroid < 3000, tempo: features.tempo, duration: features.duration, categories: recognition.categories, topMatches: recognition.topMatches }) } catch (error) { reject(error) } }).catch(reject) }) }, _recognize_Audio: function(features, sensitivity) { var categories = {}; var totalWeight = 0; for (var category in this.knowledge.patterns) { if (!this.knowledge.patterns.hasOwnProperty(category)) continue; var pattern = this.knowledge.patterns[category]; var similarity = 0, weights = 0; var centroidDiff = Math.abs(features.spectralCentroid - pattern.spectralCentroid); similarity += 1 / (1 + centroidDiff / 1000); weights += 1; var spreadDiff = Math.abs(features.spectralSpread - pattern.spectralSpread); similarity += 1 / (1 + spreadDiff / 500); weights += 1; var skewnessDiff = Math.abs(features.spectralSkewness - pattern.spectralSkewness); similarity += 1 / (1 + Math.abs(skewnessDiff)); weights += 1; var zcrDiff = Math.abs(features.zeroCrossingRate - pattern.zeroCrossingRate); similarity += 1 / (1 + zcrDiff * 10); weights += 1; var rmsDiff = Math.abs(features.rms - pattern.rms); similarity += 1 / (1 + rmsDiff * 10); weights += 1; var tempoDiff = Math.abs(features.tempo - pattern.tempo) / 100; similarity += 1 / (1 + tempoDiff); weights += 1; if (features.mfcc.length > 0 && pattern.mfcc.length > 0) { var mfccSim = 0; var n = Math.min(features.mfcc.length, pattern.mfcc.length); for (var i = 0; i < n; i++) { var diff = Math.abs(features.mfcc[i] - pattern.mfcc[i]); mfccSim += 1 / (1 + diff) } similarity += mfccSim / n; weights += 1 } categories[category] = similarity / weights; totalWeight += categories[category] } if (totalWeight > 0) { for (var category in categories) { if (categories.hasOwnProperty(category)) { categories[category] = categories[category] / totalWeight } } } var bestCategory = 'unknown', bestScore = 0; for (var category in categories) { if (categories.hasOwnProperty(category)) { var score = categories[category]; if (score > bestScore) { bestScore = score; bestCategory = category } } } var isMatch = bestScore >= sensitivity; var topMatches = Object.keys(categories).map(function(c) { return { category: c, confidence: categories[c] } }).sort(function(a, b) { return b.confidence - a.confidence }).slice(0, 5); return { classification: isMatch ? bestCategory : 'unknown', confidence: bestScore, score: bestScore, categories: categories, topMatches: topMatches, isMatch: isMatch } }, understandBatch: function(audios, options) { if (!_isArray_Audio(audios)) throw new Error('Input must be an array of audio base64 strings'); var self = this; return Promise.all(audios.map(function(audio) { return self.understand(audio, options) })) }, processAudio: function(audioBase64, operation) { return new Promise(function(resolve, reject) { _base64ToAudioBuffer(audioBase64).then(function(result) { try { var buffer = result.buffer; var audioData = _getAudioData(buffer); var processed = audioData; switch(operation) { case 'normalize': processed = _normalizeAudio(audioData); break; case 'amplify': var maxAmp = Math.max.apply(Math, audioData.map(Math.abs)); var gain = maxAmp > 0 ? 1 / maxAmp : 1; processed = audioData.map(function(v) { return v * gain * 0.9 }); break; case 'reduceNoise': processed = audioData.map(function(v, i) { if (i === 0 || i === audioData.length - 1) return v; return (audioData[i-1] + audioData[i] + audioData[i+1]) / 3 }); break; case 'trimSilence': var start = 0, end = audioData.length - 1; var threshold = 0.01; while (start < audioData.length && Math.abs(audioData[start]) < threshold) start++; while (end > start && Math.abs(audioData[end]) < threshold) end--; processed = audioData.slice(start, end + 1); break; default: processed = audioData } resolve({ success: true, operation: operation, originalLength: audioData.length, processedLength: processed.length, data: processed }) } catch (error) { reject(error) } }).catch(reject) }) }, similarity: function(audio1, audio2) { return new Promise(function(resolve, reject) { Promise.all([_base64ToAudioBuffer(audio1), _base64ToAudioBuffer(audio2)]).then(function(results) { var features1 = extractAudioFeatures(results[0].buffer); var features2 = extractAudioFeatures(results[1].buffer); var similarity = 0, weights = 0; var rmsDiff = Math.abs(features1.rms - features2.rms); similarity += 1 / (1 + rmsDiff * 10); weights += 1; var centroidDiff = Math.abs(features1.spectralCentroid - features2.spectralCentroid); similarity += 1 / (1 + centroidDiff / 1000); weights += 1; var zcrDiff = Math.abs(features1.zeroCrossingRate - features2.zeroCrossingRate); similarity += 1 / (1 + zcrDiff * 10); weights += 1; if (features1.mfcc.length > 0 && features2.mfcc.length > 0) { var mfccSim = 0; var n = Math.min(features1.mfcc.length, features2.mfcc.length); for (var i = 0; i < n; i++) { var diff = Math.abs(features1.mfcc[i] - features2.mfcc[i]); mfccSim += 1 / (1 + diff) } similarity += mfccSim / n; weights += 1 } resolve({ similarity: similarity / weights, features1: features1, features2: features2 }) }).catch(reject) }) }, getKnowledge: function() { var result = {}; for (var key in this.knowledge.categories) { if (this.knowledge.categories.hasOwnProperty(key)) { result[key] = this.knowledge.categories[key].length } } return { categories: result, patterns: Object.keys(this.knowledge.patterns).length, totalSamples: Object.values(this.knowledge.categories).reduce(function(a, b) { return a + b.length }, 0) } }, clearKnowledge: function() { this.knowledge = { categories: {}, patterns: {}, templates: {} }; return { success: true, message: 'Knowledge cleared' } }, saveKnowledge: function() { return JSON.stringify(this.knowledge) }, loadKnowledge: function(data) { if (!_isObject_Audio(data)) throw new Error('Knowledge must be an object'); this.knowledge = data; return { success: true, loaded: true } }, setSensitivity: function(value) { if (!_isNumber_Audio(value) || value < 0 || value > 1) { throw new Error('Sensitivity must be between 0 and 1') } this.settings.sensitivity = value; return { success: true, sensitivity: value } } }

// ====================================================================
// IMAGE RECOGNITION LIBRARY - FIXED (no external dependencies)
// ====================================================================

function _isString_Image(s) { return typeof s === 'string' }
function _isObject_Image(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber_Image(n) { return typeof n === 'number' && !isNaN(n) }
function _isArray_Image(a) { return Array.isArray(a) }

function _base64ToImageData(base64) { return new Promise(function(resolve, reject) { var img = new Image(); img.onload = function() { var canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; var ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); var imageData = ctx.getImageData(0, 0, img.width, img.height); resolve({ imageData: imageData, width: img.width, height: img.height, canvas: canvas, ctx: ctx }) }; img.onerror = function(e) { reject(e) }; img.src = base64 }) }
function _imageDataToBase64(imageData, width, height) { var canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; var ctx = canvas.getContext('2d'); ctx.putImageData(imageData, 0, 0); return canvas.toDataURL() }
function _getPixel_Image(imageData, x, y, width) { var index = (y * width + x) * 4; return { r: imageData.data[index], g: imageData.data[index + 1], b: imageData.data[index + 2], a: imageData.data[index + 3] } }
function _colorDistance(c1, c2) { return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2)) }

function floodFill(imageData, width, height, startX, startY, threshold) { threshold = threshold || 30; var data = new Uint8ClampedArray(imageData.data); var visited = new Uint8Array(width * height); var queue = []; var startColor = _getPixel_Image({ data: data }, startX, startY, width); var result = { data: data, mask: new Uint8Array(width * height) }; queue.push({ x: startX, y: startY }); visited[startY * width + startX] = 1; while (queue.length > 0) { var current = queue.shift(); var x = current.x, y = current.y; result.mask[y * width + x] = 1; var neighbors = [{ x: x - 1, y: y }, { x: x + 1, y: y }, { x: x, y: y - 1 }, { x: x, y: y + 1 }, { x: x - 1, y: y - 1 }, { x: x + 1, y: y - 1 }, { x: x - 1, y: y + 1 }, { x: x + 1, y: y + 1 }]; for (var i = 0; i < neighbors.length; i++) { var n = neighbors[i]; if (n.x < 0 || n.x >= width || n.y < 0 || n.y >= height) continue; var idx = n.y * width + n.x; if (visited[idx]) continue; var color = _getPixel_Image({ data: data }, n.x, n.y, width); var dist = _colorDistance(color, startColor); if (dist < threshold) { visited[idx] = 1; queue.push({ x: n.x, y: n.y }) } } } return result }

function removeBackground_Image(imageData, width, height, threshold) { threshold = threshold || 30; var corners = [{ x: 0, y: 0 }, { x: width - 1, y: 0 }, { x: 0, y: height - 1 }, { x: width - 1, y: height - 1 }]; var combinedMask = new Uint8Array(width * height); for (var i = 0; i < corners.length; i++) { var corner = corners[i]; var result = floodFill(imageData, width, height, corner.x, corner.y, threshold); for (var j = 0; j < width * height; j++) { if (result.mask[j]) { combinedMask[j] = 1 } } } var newData = new Uint8ClampedArray(imageData.data); for (var i = 0; i < width * height; i++) { if (combinedMask[i]) { newData[i * 4] = 255; newData[i * 4 + 1] = 255; newData[i * 4 + 2] = 255; newData[i * 4 + 3] = 0 } } return { data: newData, mask: combinedMask } }

function extractImageFeatures(imageData, width, height) { var features = {}; var histR = new Float32Array(256), histG = new Float32Array(256), histB = new Float32Array(256); var totalPixels = 0; for (var i = 0; i < width * height; i++) { var idx = i * 4; if (imageData.data[idx + 3] === 0) continue; totalPixels++; histR[imageData.data[idx]]++; histG[imageData.data[idx + 1]]++; histB[imageData.data[idx + 2]]++ } features.histogram = { r: histR, g: histG, b: histB }; features.totalPixels = totalPixels; var meanR = 0, meanG = 0, meanB = 0; for (var i = 0; i < width * height; i++) { var idx = i * 4; if (imageData.data[idx + 3] === 0) continue; meanR += imageData.data[idx]; meanG += imageData.data[idx + 1]; meanB += imageData.data[idx + 2] } meanR /= totalPixels; meanG /= totalPixels; meanB /= totalPixels; features.mean = { r: meanR, g: meanG, b: meanB }; var stdR = 0, stdG = 0, stdB = 0, skewR = 0, skewG = 0, skewB = 0; var kurtR = 0, kurtG = 0, kurtB = 0; for (var i = 0; i < width * height; i++) { var idx = i * 4; if (imageData.data[idx + 3] === 0) continue; var dr = imageData.data[idx] - meanR, dg = imageData.data[idx + 1] - meanG, db = imageData.data[idx + 2] - meanB; stdR += dr * dr; stdG += dg * dg; stdB += db * db; skewR += dr * dr * dr; skewG += dg * dg * dg; skewB += db * db * db; kurtR += dr * dr * dr * dr; kurtG += dg * dg * dg * dg; kurtB += db * db * db * db } stdR = Math.sqrt(stdR / totalPixels); stdG = Math.sqrt(stdG / totalPixels); stdB = Math.sqrt(stdB / totalPixels); skewR = (skewR / totalPixels) / (stdR * stdR * stdR); skewG = (skewG / totalPixels) / (stdG * stdG * stdG); skewB = (skewB / totalPixels) / (stdB * stdB * stdB); kurtR = (kurtR / totalPixels) / (stdR * stdR * stdR * stdR) - 3; kurtG = (kurtG / totalPixels) / (stdG * stdG * stdG * stdG) - 3; kurtB = (kurtB / totalPixels) / (stdB * stdB * stdB * stdB) - 3; features.std = { r: stdR, g: stdG, b: stdB }; features.skewness = { r: skewR, g: skewG, b: skewB }; features.kurtosis = { r: kurtR, g: kurtG, b: kurtB }; var sobelX = [[-1,0,1],[-2,0,2],[-1,0,1]]; var sobelY = [[-1,-2,-1],[0,0,0],[1,2,1]]; var edgeMagnitude = 0, edgeCount = 0; for (var y = 1; y < height - 1; y++) { for (var x = 1; x < width - 1; x++) { var gx = 0, gy = 0; for (var ky = -1; ky <= 1; ky++) { for (var kx = -1; kx <= 1; kx++) { var idx = ((y + ky) * width + (x + kx)) * 4; if (imageData.data[idx + 3] === 0) continue; var val = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3; gx += val * sobelX[ky + 1][kx + 1]; gy += val * sobelY[ky + 1][kx + 1] } } var mag = Math.sqrt(gx * gx + gy * gy); edgeMagnitude += mag; if (mag > 50) edgeCount++ } } features.edgeMagnitude = edgeMagnitude / ((width - 2) * (height - 2)); features.edgeDensity = edgeCount / ((width - 2) * (height - 2)); features.corners = []; for (var y = 2; y < height - 2; y++) { for (var x = 2; x < width - 2; x++) { var ix = 0, iy = 0, ixy = 0; for (var ky = -1; ky <= 1; ky++) { for (var kx = -1; kx <= 1; kx++) { var idx = ((y + ky) * width + (x + kx)) * 4; if (imageData.data[idx + 3] === 0) continue; var val = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3; var dx = val * kx, dy = val * ky; ix += dx * dx; iy += dy * dy; ixy += dx * dy } } var det = ix * iy - ixy * ixy; var trace = ix + iy; var response = det - 0.04 * trace * trace; if (response > 100) { features.corners.push({ x: x, y: y, response: response }) } } } var minX = width, maxX = 0, minY = height, maxY = 0; for (var y = 0; y < height; y++) { for (var x = 0; x < width; x++) { var idx = (y * width + x) * 4; if (imageData.data[idx + 3] !== 0) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y } } } features.bbox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY, aspectRatio: (maxX - minX) / (maxY - minY) }; return features }

function computeSimilarity_Image(features1, features2) { var score = 0, weights = 0; var histSim = 0, histNorm1 = 0, histNorm2 = 0; for (var i = 0; i < 256; i++) { histSim += features1.histogram.r[i] * features2.histogram.r[i]; histSim += features1.histogram.g[i] * features2.histogram.g[i]; histSim += features1.histogram.b[i] * features2.histogram.b[i]; histNorm1 += features1.histogram.r[i] * features1.histogram.r[i]; histNorm1 += features1.histogram.g[i] * features1.histogram.g[i]; histNorm1 += features1.histogram.b[i] * features1.histogram.b[i]; histNorm2 += features2.histogram.r[i] * features2.histogram.r[i]; histNorm2 += features2.histogram.g[i] * features2.histogram.g[i]; histNorm2 += features2.histogram.b[i] * features2.histogram.b[i] } histSim = histSim / (Math.sqrt(histNorm1) * Math.sqrt(histNorm2)); score += histSim * 0.25; weights += 0.25; var meanSim = 1 - (Math.abs(features1.mean.r - features2.mean.r) / 255 + Math.abs(features1.mean.g - features2.mean.g) / 255 + Math.abs(features1.mean.b - features2.mean.b) / 255) / 3; score += meanSim * 0.15; weights += 0.15; var stdSim = 1 - (Math.abs(features1.std.r - features2.std.r) / 50 + Math.abs(features1.std.g - features2.std.g) / 50 + Math.abs(features1.std.b - features2.std.b) / 50) / 3; score += stdSim * 0.15; weights += 0.15; var edgeSim = 1 - Math.abs(features1.edgeDensity - features2.edgeDensity); score += edgeSim * 0.15; weights += 0.15; var aspectSim = 1 - Math.abs(features1.bbox.aspectRatio - features2.bbox.aspectRatio) / 5; score += aspectSim * 0.15; weights += 0.15; return score / weights }

var Vision = { knowledge: {}, threshold: 30, learn: function(input) { if (!_isObject_Image(input)) { throw new Error('Input must be an object { "imageBase64": "name", ... }') } var self = this; return new Promise(function(resolve, reject) { var entries = Object.entries(input); var processed = 0; var promises = []; for (var i = 0; i < entries.length; i++) { var entry = entries[i]; var base64 = entry[0]; var name = entry[1]; if (!_isString_Image(base64) || !_isString_Image(name)) continue; promises.push(_base64ToImageData(base64).then(function(result) { var imageData = result.imageData; var width = result.width; var height = result.height; var cleaned = removeBackground_Image(imageData, width, height, self.threshold); var cleanedImageData = new ImageData(cleaned.data, width, height); var features = extractImageFeatures(cleanedImageData, width, height); if (!self.knowledge[name]) { self.knowledge[name] = [] } self.knowledge[name].push({ features: features, width: width, height: height, imageData: cleanedImageData, base64: _imageDataToBase64(cleanedImageData, width, height) }); processed++ }).catch(function(e) { console.warn('Failed to process image:', name, e) })) } Promise.all(promises).then(function() { resolve({ success: true, learned: processed, total: entries.length, knowledge: Object.keys(self.knowledge) }) }).catch(reject) }) }, identify: function(imageBase64, sensitivity) { sensitivity = sensitivity || 0.5; var self = this; return new Promise(function(resolve, reject) { if (!_isString_Image(imageBase64)) { resolve({ error: 'Image must be a base64 string' }); return } if (Object.keys(self.knowledge).length === 0) { resolve({ error: 'No knowledge available. Please learn first.' }); return } _base64ToImageData(imageBase64).then(function(result) { var imageData = result.imageData; var width = result.width; var height = result.height; var cleaned = removeBackground_Image(imageData, width, height, self.threshold); var cleanedImageData = new ImageData(cleaned.data, width, height); var features = extractImageFeatures(cleanedImageData, width, height); var bestMatch = null, bestScore = 0; var results = {}; for (var name in self.knowledge) { if (!self.knowledge.hasOwnProperty(name)) continue; var samples = self.knowledge[name]; var maxScore = 0; for (var j = 0; j < samples.length; j++) { var similarity = computeSimilarity_Image(features, samples[j].features); if (similarity > maxScore) { maxScore = similarity } } results[name] = maxScore; if (maxScore > bestScore) { bestScore = maxScore; bestMatch = name } } var confidence = Math.max(0, Math.min(1, bestScore)); var isMatch = confidence >= sensitivity; resolve({ object: isMatch ? bestMatch : 'unknown', confidence: confidence, sensitivity: sensitivity, allResults: results, isMatch: isMatch, imageData: { original: imageBase64, processed: _imageDataToBase64(cleanedImageData, width, height) } }) }).catch(reject) }) }, identifyBatch: function(images, sensitivity) { sensitivity = sensitivity || 0.5; if (!_isArray_Image(images)) { return Promise.resolve({ error: 'Images must be an array of base64 strings' }) } var self = this; return Promise.all(images.map(function(image) { return self.identify(image, sensitivity).catch(function(e) { return { error: e.message, image: image.slice(0, 50) + '...' } }) })) }, getKnowledge: function() { var result = {}; for (var name in this.knowledge) { if (this.knowledge.hasOwnProperty(name)) { result[name] = this.knowledge[name].length } } return { objects: result, totalObjects: Object.keys(this.knowledge).length, totalSamples: Object.values(this.knowledge).reduce(function(a, b) { return a + b.length }, 0) } }, clearKnowledge: function() { this.knowledge = {}; return { success: true, message: 'Knowledge cleared' } }, setThreshold: function(value) { if (!_isNumber_Image(value) || value < 0 || value > 255) { throw new Error('Threshold must be a number between 0 and 255') } this.threshold = value; return { success: true, threshold: value } }, loadKnowledge: function(data) { if (!_isObject_Image(data)) { throw new Error('Knowledge must be an object') } this.knowledge = data; return { success: true, loaded: Object.keys(data).length } }, saveKnowledge: function() { return JSON.stringify(this.knowledge) }, preprocess: function(imageBase64) { var self = this; return new Promise(function(resolve, reject) { _base64ToImageData(imageBase64).then(function(result) { var imageData = result.imageData; var width = result.width; var height = result.height; var cleaned = removeBackground_Image(imageData, width, height, self.threshold); var cleanedImageData = new ImageData(cleaned.data, width, height); var features = extractImageFeatures(cleanedImageData, width, height); resolve({ features: features, image: _imageDataToBase64(cleanedImageData, width, height), width: width, height: height }) }).catch(reject) }) } }

// ====================================================================
// TEXT UNDERSTANDING - FIXED (simplified, no external dependencies)
// ====================================================================

function _isString_Text(s) { return typeof s === 'string' }
function _isArray_Text(a) { return Array.isArray(a) }
function _isObject_Text(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber_Text(n) { return typeof n === 'number' && !isNaN(n) }

function _cleanText(text) { if (!_isString_Text(text)) return ''; text = text.toLowerCase(); text = text.replace(/[^a-zآ-ی0-9\s\.\,\!\?\-\:\;]/g, ' '); text = text.replace(/\s+/g, ' ').trim(); return text }
function _tokenize_Text(text) { if (!_isString_Text(text)) return []; return _cleanText(text).split(/\s+/) }

function extractTextFeatures(text) { var tokens = _tokenize_Text(text); var features = { tokens: tokens, tokenCount: tokens.length, uniqueTokens: Array.from(new Set(tokens)), uniqueCount: new Set(tokens).size, avgWordLength: tokens.length > 0 ? tokens.reduce(function(a, b) { return a + b.length }, 0) / tokens.length : 0, wordFrequency: {} }; for (var i = 0; i < tokens.length; i++) { var token = tokens[i]; features.wordFrequency[token] = (features.wordFrequency[token] || 0) + 1 } var textStr = text; features.charCount = textStr.length; features.digitCount = (textStr.match(/\d/g) || []).length; features.punctuationCount = (textStr.match(/[\.\,\!\?\-\:\;\"\'\`\(\)\[\]\{\}]/g) || []).length; features.upperCount = (textStr.match(/[A-Z]/g) || []).length; features.lowerCount = (textStr.match(/[a-z]/g) || []).length; features.spaceCount = (textStr.match(/\s/g) || []).length; var persianChars = (textStr.match(/[آ-ی]/g) || []).length; var englishChars = (textStr.match(/[a-zA-Z]/g) || []).length; features.language = persianChars > englishChars ? 'persian' : 'english'; features.persianRatio = persianChars / (textStr.length || 1); features.englishRatio = englishChars / (textStr.length || 1); features.exclamationCount = (textStr.match(/\!/g) || []).length; features.questionCount = (textStr.match(/\?/g) || []).length; return features }

var TextUnderstanding = { knowledge: { positive: [], negative: [], neutral: [], categories: {}, patterns: {}, rules: [] }, settings: { sensitivity: 0.5, learningRate: 0.1, minConfidence: 0.3 }, learnText: function(input) { if (!_isObject_Text(input)) { throw new Error('Input must be an object with text-label pairs') } for (var text in input) { if (!input.hasOwnProperty(text)) continue; var label = input[text]; if (!_isString_Text(text) || !_isString_Text(label)) continue; var cleaned = _cleanText(text); var tokens = _tokenize_Text(cleaned); if (label === 'positive') { this.knowledge.positive.push({ text: cleaned, tokens: tokens, original: text }) } else if (label === 'negative') { this.knowledge.negative.push({ text: cleaned, tokens: tokens, original: text }) } else if (label === 'neutral') { this.knowledge.neutral.push({ text: cleaned, tokens: tokens, original: text }) } else { if (!this.knowledge.categories[label]) { this.knowledge.categories[label] = [] } this.knowledge.categories[label].push({ text: cleaned, tokens: tokens, original: text }) } } this._extractPatterns_Text(); return { success: true, learned: Object.keys(input).length, knowledge: { positive: this.knowledge.positive.length, negative: this.knowledge.negative.length, neutral: this.knowledge.neutral.length, categories: Object.keys(this.knowledge.categories).map(function(c) { return c + ': ' + this.knowledge.categories[c].length }.bind(this)) } } }, _extractPatterns_Text: function() { var allPatterns = {}; for (var i = 0; i < this.knowledge.positive.length; i++) { var tokens = this.knowledge.positive[i].tokens; for (var j = 0; j < tokens.length - 1; j++) { var pattern = tokens[j] + ' ' + tokens[j+1]; allPatterns[pattern] = (allPatterns[pattern] || 0) + 1 } } for (var i = 0; i < this.knowledge.negative.length; i++) { var tokens = this.knowledge.negative[i].tokens; for (var j = 0; j < tokens.length - 1; j++) { var pattern = tokens[j] + ' ' + tokens[j+1]; allPatterns[pattern] = (allPatterns[pattern] || 0) - 1 } } this.knowledge.patterns = allPatterns }, understandText: function(text, options) { options = options || {}; var sensitivity = options.sensitivity || this.settings.sensitivity; if (!_isString_Text(text)) { return { error: 'Text must be a string' } } var cleaned = _cleanText(text); var tokens = _tokenize_Text(cleaned); var features = extractTextFeatures(text); var sentiment = this._analyzeSentiment(tokens); var category = this._detectCategory(tokens); var patterns = this._matchPatterns(tokens); var confidence = this._calculateConfidence_Text(sentiment, category, patterns); var intent = this._detectIntent(tokens); var entities = this._extractEntities(tokens); var classification = 'neutral', score = 0; if (sentiment.score > sensitivity) { classification = 'positive'; score = sentiment.score } else if (sentiment.score < -sensitivity) { classification = 'negative'; score = -sentiment.score } else if (category.category && category.confidence > sensitivity) { classification = category.category; score = category.confidence } return { classification: classification, confidence: confidence, score: score, sentiment: sentiment, category: category, patterns: patterns, intent: intent, entities: entities, features: features, tokens: tokens, cleanedText: cleaned, originalText: text, isPositive: classification === 'positive', isNegative: classification === 'negative', isNeutral: classification === 'neutral' } }, _analyzeSentiment: function(tokens) { var positiveWords = new Set(), negativeWords = new Set(); for (var i = 0; i < this.knowledge.positive.length; i++) { var pt = this.knowledge.positive[i].tokens; for (var j = 0; j < pt.length; j++) { positiveWords.add(pt[j]) } } for (var i = 0; i < this.knowledge.negative.length; i++) { var nt = this.knowledge.negative[i].tokens; for (var j = 0; j < nt.length; j++) { negativeWords.add(nt[j]) } } var positiveScore = 0, negativeScore = 0, totalWeight = 0; for (var i = 0; i < tokens.length; i++) { var token = tokens[i]; if (positiveWords.has(token)) { positiveScore += 1; totalWeight += 1 } else if (negativeWords.has(token)) { negativeScore += 1; totalWeight += 1 } } var score = totalWeight > 0 ? (positiveScore - negativeScore) / totalWeight : 0; var adjustedScore = 0, adjustedWeight = 0, negationActive = false; for (var i = 0; i < tokens.length; i++) { var token = tokens[i]; if (token === 'not' || token === 'never' || token === 'no') { negationActive = !negationActive; continue } var wordScore = 0; if (positiveWords.has(token)) wordScore = 1; else if (negativeWords.has(token)) wordScore = -1; if (negationActive) wordScore = -wordScore; adjustedScore += wordScore; if (wordScore !== 0) adjustedWeight++ } var finalScore = adjustedWeight > 0 ? adjustedScore / adjustedWeight : 0; return { score: finalScore, normalizedScore: Math.max(-1, Math.min(1, finalScore)), positiveWords: tokens.filter(function(t) { return positiveWords.has(t) }), negativeWords: tokens.filter(function(t) { return negativeWords.has(t) }), positiveCount: tokens.filter(function(t) { return positiveWords.has(t) }).length, negativeCount: tokens.filter(function(t) { return negativeWords.has(t) }).length, sentiment: finalScore > 0.1 ? 'positive' : (finalScore < -0.1 ? 'negative' : 'neutral') } }, _detectCategory: function(tokens) { var categories = Object.keys(this.knowledge.categories); var scores = {}; for (var i = 0; i < categories.length; i++) { var category = categories[i]; var score = 0; var samples = this.knowledge.categories[category]; for (var j = 0; j < samples.length; j++) { var sampleTokens = samples[j].tokens; var matchCount = 0; for (var k = 0; k < tokens.length; k++) { if (sampleTokens.indexOf(tokens[k]) !== -1) { matchCount++ } } var similarity = matchCount / (tokens.length + sampleTokens.length - matchCount || 1); if (similarity > score) { score = similarity } } scores[category] = score } var bestCategory = 'unknown', bestScore = 0; for (var category in scores) { if (scores.hasOwnProperty(category)) { if (scores[category] > bestScore) { bestScore = scores[category]; bestCategory = category } } } return { category: bestCategory, confidence: bestScore, allScores: scores } }, _matchPatterns: function(tokens) { var matches = {}; var totalWeight = 0; for (var i = 0; i < tokens.length - 1; i++) { var pattern = tokens[i] + ' ' + tokens[i+1]; if (pattern in this.knowledge.patterns) { var weight = this.knowledge.patterns[pattern]; matches[pattern] = weight; totalWeight += Math.abs(weight) } } var sentiment = totalWeight > 0 ? Object.values(matches).reduce(function(a, b) { return a + b }, 0) / totalWeight : 0; return { matches: matches, totalWeight: totalWeight, sentiment: sentiment, count: Object.keys(matches).length } }, _calculateConfidence_Text: function(sentiment, category, patterns) { var confidence = 0, weights = 0; var sentConf = Math.abs(sentiment.score); confidence += sentConf * 0.5; weights += 0.5; var catConf = category.confidence; confidence += catConf * 0.3; weights += 0.3; var patConf = patterns.count > 0 ? Math.abs(patterns.sentiment) : 0; confidence += patConf * 0.2; weights += 0.2; return weights > 0 ? confidence / weights : 0 }, _detectIntent: function(tokens) { var intents = { question: ['what', 'who', 'where', 'when', 'why', 'how', 'چه', 'چرا', 'کی', 'کجا', 'چگونه'], command: ['please', 'do', 'make', 'create', 'help', 'لطفا', 'انجام', 'ساخت', 'کمک'], opinion: ['think', 'believe', 'feel', 'opinion', 'فکر', 'باور', 'احساس', 'نظر'], greeting: ['hello', 'hi', 'hey', 'سلام', 'درود', 'خوش'], farewell: ['bye', 'goodbye', 'farewell', 'خداحافظ', 'بدرود'] }; var scores = {}; for (var intent in intents) { if (!intents.hasOwnProperty(intent)) continue; var words = intents[intent]; var score = 0; for (var i = 0; i < words.length; i++) { if (tokens.indexOf(words[i]) !== -1) { score += 1 } } scores[intent] = tokens.length > 0 ? score / tokens.length : 0 } var bestIntent = 'unknown', bestScore = 0; for (var intent in scores) { if (scores.hasOwnProperty(intent)) { if (scores[intent] > bestScore) { bestScore = scores[intent]; bestIntent = intent } } } return { intent: bestIntent, confidence: bestScore, scores: scores } }, _extractEntities: function(tokens) { var entities = { numbers: [], emails: [], urls: [], hashtags: [], mentions: [] }; for (var i = 0; i < tokens.length; i++) { var token = tokens[i]; if (!isNaN(parseFloat(token)) && isFinite(token)) { entities.numbers.push(parseFloat(token)) } if (token.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) { entities.emails.push(token) } if (token.match(/https?:\/\/[^\s]+/)) { entities.urls.push(token) } if (token.startsWith('#')) { entities.hashtags.push(token) } if (token.startsWith('@')) { entities.mentions.push(token) } } return entities }, understandBatchText: function(texts, options) { if (!_isArray_Text(texts)) throw new Error('Input must be an array of texts'); var self = this; return texts.map(function(text) { return self.understandText(text, options) }) }, similarityText: function(text1, text2) { var tokens1 = _tokenize_Text(text1), tokens2 = _tokenize_Text(text2); var set1 = new Set(tokens1), set2 = new Set(tokens2); var intersection = new Set(Array.from(set1).filter(function(x) { return set2.has(x) })); var union = new Set(Array.from(set1).concat(Array.from(set2))); return intersection.size / union.size }, extractKeywords: function(text, limit) { limit = limit || 5; var tokens = _tokenize_Text(text); var freq = {}; var stopWords = new Set(['the','a','an','of','to','for','and','or','but','in','on','at','is','are','was','were','be','been','being']); for (var i = 0; i < tokens.length; i++) { var token = tokens[i]; if (!stopWords.has(token) && token.length > 2) { freq[token] = (freq[token] || 0) + 1 } } var sorted = Object.entries(freq).sort(function(a, b) { return b[1] - a[1] }); return sorted.slice(0, limit).map(function(item) { return { word: item[0], frequency: item[1] } }) }, classify: function(text) { return this.understandText(text) }, getKnowledge: function() { var catResult = {}; for (var key in this.knowledge.categories) { if (this.knowledge.categories.hasOwnProperty(key)) { catResult[key] = this.knowledge.categories[key].length } } return { positive: this.knowledge.positive.length, negative: this.knowledge.negative.length, neutral: this.knowledge.neutral.length, categories: catResult, patterns: Object.keys(this.knowledge.patterns).length, totalSamples: this.knowledge.positive.length + this.knowledge.negative.length + this.knowledge.neutral.length + Object.values(this.knowledge.categories).reduce(function(a, b) { return a + b.length }, 0) } }, clearKnowledge: function() { this.knowledge = { positive: [], negative: [], neutral: [], categories: {}, patterns: {}, rules: [] }; return { success: true, message: 'Knowledge cleared' } }, saveKnowledge: function() { return JSON.stringify(this.knowledge) }, loadKnowledge: function(data) { if (!_isObject_Text(data)) throw new Error('Knowledge must be an object'); this.knowledge = data; return { success: true, loaded: true } }, setSensitivity: function(value) { if (!_isNumber_Text(value) || value < 0 || value > 1) { throw new Error('Sensitivity must be between 0 and 1') } this.settings.sensitivity = value; return { success: true, sensitivity: value } }, sentenceSimilarity: function(text1, text2) { var tokens1 = _tokenize_Text(text1), tokens2 = _tokenize_Text(text2); var allWords = new Set(Array.from(tokens1).concat(Array.from(tokens2))); var vector1 = {}, vector2 = {}; for (var word of allWords) { vector1[word] = tokens1.filter(function(t) { return t === word }).length; vector2[word] = tokens2.filter(function(t) { return t === word }).length } var dot = 0, norm1 = 0, norm2 = 0; for (var word of allWords) { dot += vector1[word] * vector2[word]; norm1 += vector1[word] * vector1[word]; norm2 += vector2[word] * vector2[word] } if (norm1 === 0 || norm2 === 0) return 0; return dot / (Math.sqrt(norm1) * Math.sqrt(norm2)) }, summarize: function(text, sentences) { sentences = sentences || 3; var lines = text.split(/[.!?]+/).filter(function(line) { return line.trim().length > 10 }); var wordCount = {}; var allWords = _tokenize_Text(text); for (var i = 0; i < allWords.length; i++) { wordCount[allWords[i]] = (wordCount[allWords[i]] || 0) + 1 } var scoredLines = lines.map(function(line) { var tokens = _tokenize_Text(line); var score = 0; for (var i = 0; i < tokens.length; i++) { score += wordCount[tokens[i]] || 0 } return { text: line.trim(), score: score / (tokens.length || 1) } }); scoredLines.sort(function(a, b) { return b.score - a.score }); return scoredLines.slice(0, sentences).map(function(item) { return item.text + '.' }).join(' ') }, detectLanguage: function(text) { var cleaned = _cleanText(text); var persianChars = (cleaned.match(/[آ-ی]/g) || []).length; var englishChars = (cleaned.match(/[a-zA-Z]/g) || []).length; if (persianChars === 0 && englishChars === 0) return 'unknown'; if (persianChars > englishChars) return 'persian'; if (englishChars > persianChars) return 'english'; return 'mixed' }, wordFrequency: function(text) { var tokens = _tokenize_Text(text); var freq = {}; for (var i = 0; i < tokens.length; i++) { freq[tokens[i]] = (freq[tokens[i]] || 0) + 1 } return Object.entries(freq).sort(function(a, b) { return b[1] - a[1] }) } }

// ====================================================================
// FILE LIBRARY - FIXED (simplified)
// ====================================================================

function _isString_File(s) { return typeof s === 'string' }
function _isArray_File(a) { return Array.isArray(a) }
function _isObject_File(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber_File(n) { return typeof n === 'number' && !isNaN(n) }
function _isFunction_File(f) { return typeof f === 'function' }

function _escapeCSV_File(str) { if (str === null || str === undefined) return ''; str = String(str); if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) { return '"' + str.replace(/"/g, '""') + '"' } return str }
function _unescapeCSV_File(str) { if (str === null || str === undefined) return ''; str = String(str); if (str.startsWith('"') && str.endsWith('"')) { str = str.slice(1, -1); str = str.replace(/""/g, '"') } return str }
function _toBase64_File(str) { try { return btoa(unescape(encodeURIComponent(str))) } catch(e) { return btoa(str) } }
function _fromBase64_File(str) { try { return decodeURIComponent(escape(atob(str))) } catch(e) { return atob(str) } }
function _downloadFile(content, filename, mimeType) { try { var blob = new Blob([content], { type: mimeType }); var link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); setTimeout(function() { URL.revokeObjectURL(link.href) }, 100) } catch(e) { console.error('Download error:', e) } }
function _readFileAsText(file) { return new Promise(function(resolve, reject) { try { var reader = new FileReader(); reader.onload = function(e) { resolve(e.target.result) }; reader.onerror = function(e) { reject(e) }; reader.readAsText(file) } catch(e) { reject(e) } }) }
function _readFileAsDataURL(file) { return new Promise(function(resolve, reject) { try { var reader = new FileReader(); reader.onload = function(e) { resolve(e.target.result) }; reader.onerror = function(e) { reject(e) }; reader.readAsDataURL(file) } catch(e) { reject(e) } }) }

// JSON Converters
function jsonToCsv_File(json, delimiter, headers) { if (!_isArray_File(json)) throw new Error('Input must be an array'); if (json.length === 0) return ''; delimiter = delimiter || ','; var h = headers || Object.keys(json[0]); var rows = [h]; for (var i = 0; i < json.length; i++) { var item = json[i]; rows.push(h.map(function(key) { var val = item[key]; return val === null || val === undefined ? '' : _escapeCSV_File(String(val)) })) } return rows.map(function(row) { return row.join(delimiter) }).join('\n') }
function jsonToXml_File(json, rootName) { rootName = rootName || 'root'; function _toXml(obj, tag) { if (obj === null || obj === undefined) return ''; if (typeof obj !== 'object') { return '<' + tag + '>' + String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</' + tag + '>' } if (Array.isArray(obj)) { return obj.map(function(item) { return _toXml(item, tag === 'root' ? 'item' : tag) }).join('') } var result = ''; for (var key in obj) { if (obj.hasOwnProperty(key)) { result += _toXml(obj[key], key) } } return result } return '<' + rootName + '>' + _toXml(json, rootName) + '</' + rootName + '>' }
function jsonToYaml_File(json, indent) { indent = indent || 0; var spaces = '  '.repeat(indent); if (json === null || json === undefined) return 'null'; if (typeof json === 'string') return '"' + json.replace(/"/g, '\\"') + '"'; if (typeof json === 'number' || typeof json === 'boolean') return String(json); if (Array.isArray(json)) { if (json.length === 0) return '[]'; return json.map(function(item) { return spaces + '- ' + jsonToYaml_File(item, indent + 1) }).join('\n') } if (typeof json === 'object') { var keys = Object.keys(json); if (keys.length === 0) return '{}'; return keys.map(function(key) { var val = jsonToYaml_File(json[key], indent + 1); return spaces + key + ': ' + val }).join('\n') } return String(json) }
function jsonToHtml_File(json) { if (!_isArray_File(json) || json.length === 0) return ''; var headers = Object.keys(json[0]); var html = '<table><thead><tr>'; for (var i = 0; i < headers.length; i++) { html += '<th>' + headers[i] + '</th>' } html += '</tr></thead><tbody>'; for (var i = 0; i < json.length; i++) { var row = json[i]; html += '<tr>'; for (var j = 0; j < headers.length; j++) { html += '<td>' + (row[headers[j]] || '') + '</td>' } html += '</tr>' } html += '</tbody></table>'; return html }
function jsonToMarkdown_File(json) { if (!_isArray_File(json) || json.length === 0) return ''; var headers = Object.keys(json[0]); var result = '| ' + headers.join(' | ') + ' |\n'; result += '|' + headers.map(function() { return ' --- ' }).join('|') + '|\n'; for (var i = 0; i < json.length; i++) { var row = json[i]; result += '| ' + headers.map(function(h) { return row[h] || '' }).join(' | ') + ' |\n' } return result }

// CSV Converters
function csvToJson_File(csv, delimiter) { delimiter = delimiter || ','; var lines = csv.split(/\r?\n/).filter(function(line) { return line.trim() !== '' }); if (lines.length < 2) return []; var headers = lines[0].split(delimiter).map(function(h) { return h.trim() }); var result = []; for (var i = 1; i < lines.length; i++) { var values = lines[i].split(delimiter).map(function(v) { return _unescapeCSV_File(v.trim()) }); var row = {}; for (var j = 0; j < headers.length; j++) { row[headers[j]] = values[j] || '' } result.push(row) } return result }
function csvToXml_File(csv, delimiter, rootName) { delimiter = delimiter || ','; rootName = rootName || 'root'; var json = csvToJson_File(csv, delimiter); return jsonToXml_File(json, rootName) }
function csvToHtml_File(csv, delimiter) { delimiter = delimiter || ','; var json = csvToJson_File(csv, delimiter); return jsonToHtml_File(json) }
function csvToMarkdown_File(csv, delimiter) { delimiter = delimiter || ','; var json = csvToJson_File(csv, delimiter); return jsonToMarkdown_File(json) }
function csvToArray_File(csv, delimiter) { delimiter = delimiter || ','; var lines = csv.split(/\r?\n/).filter(function(line) { return line.trim() !== '' }); return lines.map(function(line) { return line.split(delimiter).map(function(v) { return _unescapeCSV_File(v.trim()) }) }) }
function csvToTsv_File(csv, delimiter) { delimiter = delimiter || ','; var array = csvToArray_File(csv, delimiter); return array.map(function(row) { return row.join('\t') }).join('\n') }
function csvToDsv_File(csv, oldDelimiter, newDelimiter) { oldDelimiter = oldDelimiter || ','; newDelimiter = newDelimiter || ';'; var array = csvToArray_File(csv, oldDelimiter); return array.map(function(row) { return row.join(newDelimiter) }).join('\n') }

// XML Converters
function xmlToJson_File(xml) { var parser = new DOMParser(); var doc = parser.parseFromString(xml, 'text/xml'); function _toJson(node) { if (node.nodeType === 3) return node.nodeValue.trim(); if (node.nodeType === 1) { var obj = {}; var children = node.childNodes; if (children.length === 1 && children[0].nodeType === 3) { return children[0].nodeValue.trim() } for (var i = 0; i < children.length; i++) { var child = children[i]; if (child.nodeType === 3) continue; var name = child.nodeName; var val = _toJson(child); if (obj[name] === undefined) { obj[name] = val } else if (Array.isArray(obj[name])) { obj[name].push(val) } else { obj[name] = [obj[name], val] } } if (node.attributes && node.attributes.length > 0) { obj._attributes = {}; for (var i = 0; i < node.attributes.length; i++) { var attr = node.attributes[i]; obj._attributes[attr.name] = attr.value } } return obj } return '' } return _toJson(doc.documentElement) }
function xmlToCsv_File(xml, delimiter) { delimiter = delimiter || ','; var json = xmlToJson_File(xml); var data = Array.isArray(json) ? json : [json]; return jsonToCsv_File(data, delimiter) }
function xmlToHtml_File(xml) { var parser = new DOMParser(); var doc = parser.parseFromString(xml, 'text/xml'); return new XMLSerializer().serializeToString(doc) }
function xmlToText_File(xml) { var parser = new DOMParser(); var doc = parser.parseFromString(xml, 'text/xml'); return doc.textContent }

// HTML Converters
function htmlToJson_File(html) { var parser = new DOMParser(); var doc = parser.parseFromString(html, 'text/html'); var tables = doc.querySelectorAll('table'); if (tables.length === 0) return []; var table = tables[0]; var headers = []; var headerCells = table.querySelectorAll('th'); if (headerCells.length > 0) { for (var i = 0; i < headerCells.length; i++) { headers.push(headerCells[i].textContent.trim()) } } else { var firstRow = table.querySelector('tr'); if (firstRow) { var cells = firstRow.querySelectorAll('td'); for (var i = 0; i < cells.length; i++) { headers.push('col_' + (i + 1)) } } } var rows = table.querySelectorAll('tr'); var result = []; var startIdx = headerCells.length > 0 ? 1 : 0; for (var i = startIdx; i < rows.length; i++) { var cells = rows[i].querySelectorAll('td'); var row = {}; for (var j = 0; j < headers.length && j < cells.length; j++) { row[headers[j]] = cells[j].textContent.trim() } result.push(row) } return result }
function htmlToCsv_File(html, delimiter) { delimiter = delimiter || ','; var json = htmlToJson_File(html); return jsonToCsv_File(json, delimiter) }
function htmlToText_File(html) { var parser = new DOMParser(); var doc = parser.parseFromString(html, 'text/html'); return doc.body.textContent }
function htmlToMarkdown_File(html) { var parser = new DOMParser(); var doc = parser.parseFromString(html, 'text/html'); var text = doc.body.textContent; var headings = doc.querySelectorAll('h1,h2,h3,h4,h5,h6'); for (var i = 0; i < headings.length; i++) { var h = headings[i]; var level = parseInt(h.tagName[1]); var prefix = '#'.repeat(level); text = text.replace(h.textContent, prefix + ' ' + h.textContent) } var lists = doc.querySelectorAll('ul,ol'); for (var i = 0; i < lists.length; i++) { var list = lists[i]; var items = list.querySelectorAll('li'); for (var j = 0; j < items.length; j++) { text = text.replace(items[j].textContent, '- ' + items[j].textContent) } } return text }

// Text Converters
function textToJson_File(text) { var lines = text.split(/\r?\n/).filter(function(line) { return line.trim() !== '' }); return lines.map(function(line, index) { return { line: index + 1, content: line } }) }
function textToCsv_File(text) { var lines = text.split(/\r?\n/).filter(function(line) { return line.trim() !== '' }); return lines.map(function(line) { return _escapeCSV_File(line) }).join('\n') }
function textToHtml_File(text) { return text.split(/\r?\n/).map(function(line) { return line.trim() ? '<p>' + line + '</p>' : '<br>' }).join('') }
function textToXml_File(text, rootName) { rootName = rootName || 'text'; var lines = text.split(/\r?\n/).filter(function(line) { return line.trim() !== '' }); var xml = '<' + rootName + '>'; for (var i = 0; i < lines.length; i++) { xml += '<line>' + lines[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</line>' } xml += '</' + rootName + '>'; return xml }
function textToBase64_File(text) { return _toBase64_File(text) }
function base64ToText_File(base64) { return _fromBase64_File(base64) }

// Array Converters
function arrayToCsv_File(array, delimiter) { delimiter = delimiter || ','; if (!_isArray_File(array)) throw new Error('Input must be an array'); return array.map(function(row) { if (!_isArray_File(row)) return _escapeCSV_File(String(row)); return row.map(function(cell) { return _escapeCSV_File(String(cell)) }).join(delimiter) }).join('\n') }
function arrayToJson_File(array) { return JSON.stringify(array, null, 2) }
function arrayToXml_File(array, rootName, itemName) { rootName = rootName || 'root'; itemName = itemName || 'item'; var xml = '<' + rootName + '>'; for (var i = 0; i < array.length; i++) { var item = array[i]; if (_isArray_File(item) || _isObject_File(item)) { xml += '<' + itemName + '>' + JSON.stringify(item) + '</' + itemName + '>' } else { xml += '<' + itemName + '>' + String(item).replace(/&/g, '&amp;') + '</' + itemName + '>' } } xml += '</' + rootName + '>'; return xml }
function arrayToHtml_File(array) { var html = '<ul>'; for (var i = 0; i < array.length; i++) { html += '<li>' + array[i] + '</li>' } html += '</ul>'; return html }

// Download functions
function downloadJson_File(data, filename) { filename = filename || 'data.json'; _downloadFile(JSON.stringify(data, null, 2), filename, 'application/json') }
function downloadCsv_File(data, filename) { filename = filename || 'data.csv'; if (_isArray_File(data) && data.length > 0 && _isObject_File(data[0])) { data = jsonToCsv_File(data) }; _downloadFile(data, filename, 'text/csv') }
function downloadXml_File(data, filename) { filename = filename || 'data.xml'; if (_isArray_File(data) || _isObject_File(data)) { data = jsonToXml_File(data) }; _downloadFile(data, filename, 'application/xml') }
function downloadHtml_File(data, filename) { filename = filename || 'data.html'; _downloadFile(data, filename, 'text/html') }
function downloadText_File(data, filename) { filename = filename || 'data.txt'; _downloadFile(data, filename, 'text/plain') }
function downloadMarkdown_File(data, filename) { filename = filename || 'data.md'; _downloadFile(data, filename, 'text/markdown') }
function downloadYaml_File(data, filename) { filename = filename || 'data.yaml'; if (_isArray_File(data) || _isObject_File(data)) { data = jsonToYaml_File(data) }; _downloadFile(data, filename, 'text/yaml') }
function downloadBase64_File(data, filename) { filename = filename || 'data.base64'; if (!_isString_File(data)) { data = JSON.stringify(data) }; if (!data.match(/^[A-Za-z0-9+/=]+$/)) { data = _toBase64_File(data) }; _downloadFile(data, filename, 'text/plain') }

var File = {
    jsonToCsv: jsonToCsv_File, jsonToXml: jsonToXml_File, jsonToYaml: jsonToYaml_File,
    jsonToHtml: jsonToHtml_File, jsonToMarkdown: jsonToMarkdown_File,
    csvToJson: csvToJson_File, csvToXml: csvToXml_File, csvToHtml: csvToHtml_File,
    csvToMarkdown: csvToMarkdown_File, csvToArray: csvToArray_File, csvToTsv: csvToTsv_File,
    csvToDsv: csvToDsv_File, xmlToJson: xmlToJson_File, xmlToCsv: xmlToCsv_File,
    xmlToHtml: xmlToHtml_File, xmlToText: xmlToText_File,
    htmlToJson: htmlToJson_File, htmlToCsv: htmlToCsv_File, htmlToText: htmlToText_File,
    htmlToMarkdown: htmlToMarkdown_File, textToJson: textToJson_File, textToCsv: textToCsv_File,
    textToHtml: textToHtml_File, textToXml: textToXml_File, textToBase64: textToBase64_File,
    base64ToText: base64ToText_File, arrayToCsv: arrayToCsv_File, arrayToJson: arrayToJson_File,
    arrayToXml: arrayToXml_File, arrayToHtml: arrayToHtml_File,
    downloadJson: downloadJson_File, downloadCsv: downloadCsv_File, downloadXml: downloadXml_File,
    downloadHtml: downloadHtml_File, downloadText: downloadText_File, downloadMarkdown: downloadMarkdown_File,
    downloadYaml: downloadYaml_File, downloadBase64: downloadBase64_File,
    uploadFile: function(callback, accept) { accept = accept || '*/*'; var input = document.createElement('input'); input.type = 'file'; input.accept = accept; input.onchange = function(e) { var file = e.target.files[0]; if (!file) return; _readFileAsText(file).then(function(content) { callback(file.name, content) }) }; input.click() },
    uploadMultiple: function(callback, accept) { accept = accept || '*/*'; var input = document.createElement('input'); input.type = 'file'; input.multiple = true; input.accept = accept; input.onchange = function(e) { var files = e.target.files; if (!files || files.length === 0) return; var promises = []; for (var i = 0; i < files.length; i++) { promises.push(_readFileAsText(files[i]).then(function(content) { return { name: files[i].name, content: content } })) } Promise.all(promises).then(callback) }; input.click() },
    detectFormat: function(content) { try { JSON.parse(content); return 'json' } catch(e) {}; if (content.trim().startsWith('<')) return 'xml'; if (content.includes('\n') && content.includes(',')) { var lines = content.split('\n'); if (lines.length > 1 && lines[0].includes(',')) return 'csv' } if (content.includes('<table') || content.includes('<div')) return 'html'; return 'text' }
}

// ====================================================================
// EXPORT - All functions and libraries
// ====================================================================

var fileAml = {
    math: {
        E: E, PI: PI, PHI: PHI, SQRT2: SQRT2, SQRT3: SQRT3, SQRT5: SQRT5,
        LN2: LN2, LN10: LN10, LOG2E: LOG2E, LOG10E: LOG10E, TAU: TAU,
        HALF_PI: HALF_PI, QUARTER_PI: QUARTER_PI, EULER: EULER, CATALAN: CATALAN,
        APERY: APERY, GOLDEN_ANGLE: GOLDEN_ANGLE, SQRT_PI: SQRT_PI,
        INV_PI: INV_PI, INV_TAU: INV_TAU, INV_SQRT2: INV_SQRT2,
        INV_SQRT3: INV_SQRT3, INV_PHI: INV_PHI, LN_PHI: LN_PHI,
        DEG2RAD: DEG2RAD, RAD2DEG: RAD2DEG,
        add: add, sub: sub, mul: mul, div: div, mod: mod, pow: pow,
        sqrt: sqrt, cbrt: cbrt, abs: abs, neg: neg, inv: inv,
        inc: inc, dec: dec, sq: sq, cube: cube, pow2: pow2, pow3: pow3,
        pow4: pow4, pow5: pow5, pow6: pow6, pow7: pow7, pow8: pow8,
        pow9: pow9, pow10: pow10, hypot: hypot, fma: fma, fmod: fmod,
        remainder: remainder, copysign: copysign, nextafter: nextafter, ulp: ulp,
        sin: sin, cos: cos, tan: tan, cot: cot, sec: sec, csc: csc,
        asin: asin, acos: acos, atan: atan, atan2: atan2, asec: asec,
        acsc: acsc, acot: acot, versin: versin, coversin: coversin,
        haversin: haversin, exsec: exsec, excsc: excsc,
        sinh: sinh, cosh: cosh, tanh: tanh, coth: coth, sech: sech,
        csch: csch, asinh: asinh, acosh: acosh, atanh: atanh, acoth: acoth,
        asech: asech, acsch: acsch,
        exp: exp, expm1: expm1, log: log, log10: log10, log2: log2,
        log1p: log1p, logb: logb, ln: ln, lg: lg, lb: lb, exp2: exp2, exp10: exp10,
        floor: floor, ceil: ceil, round: round, trunc: trunc, fix: fix,
        frac: frac, modf: modf, roundTo: roundTo, floorTo: floorTo,
        ceilTo: ceilTo, nearest: nearest,
        sign: sign, signbit: signbit, isFiniteNumber: isFiniteNumber,
        isNaNValue: isNaNValue, isInteger: isInteger, isFloat: isFloat,
        isPositive: isPositive, isNegative: isNegative, isZero: isZero,
        isEven: isEven, isOdd: isOdd, isPrime: isPrime, isPerfect: isPerfect,
        isArmstrong: isArmstrong, clamp: clamp, clamp01: clamp01,
        clampNeg1_1: clampNeg1_1, max: max, min: min, max2: max2, min2: min2,
        between: between, approxEqual: approxEqual,
        sum: sum, product: product, mean: mean, avg: avg, median: median,
        mode: mode, variance: variance, varianceSample: varianceSample,
        stddev: stddev, stddevSample: stddevSample, range: range, iqr: iqr,
        quantile: quantile, percentile: percentile, skewness: skewness,
        kurtosis: kurtosis, covariance: covariance, correlation: correlation,
        count: count, unique: unique, frequency: frequency,
        sortAsc: sortAsc, sortDesc: sortDesc, minIndex: minIndex,
        maxIndex: maxIndex, argSort: argSort, argMax: argMax, argMin: argMin,
        factorial: factorial, doubleFactorial: doubleFactorial, factorial2: factorial2,
        binomial: binomial, permutations: permutations, combinations: combinations,
        multinomial: multinomial, catalanNumber: catalanNumber,
        bellNumber: bellNumber, stirling2: stirling2,
        gcd: gcd, lcm: lcm, factors: factors, primeFactors: primeFactors,
        divisors: divisors, properDivisors: properDivisors, eulerPhi: eulerPhi,
        mobius: mobius, tau: tau, sigma: sigma, fibonacci: fibonacci, lucas: lucas,
        lerp: lerp, inverseLerp: inverseLerp, mapRange: mapRange,
        smoothstep: smoothstep, smootherstep: smootherstep, mix: mix,
        step: step, pulse: pulse,
        sigmoid: sigmoid, logistic: logistic, tanhActivation: tanhActivation,
        relu: relu, leakyRelu: leakyRelu, elu: elu, selu: selu, gelu: gelu,
        softmax: softmax, logSoftmax: logSoftmax,
        matrixAdd: matrixAdd, matrixSub: matrixSub, matrixMul: matrixMul,
        matrixTranspose: matrixTranspose, matrixScalarMul: matrixScalarMul,
        matrixIdentity: matrixIdentity, matrixZeros: matrixZeros,
        matrixOnes: matrixOnes, matrixDeterminant: matrixDeterminant,
        matrixTrace: matrixTrace,
        vectorAdd: vectorAdd, vectorSub: vectorSub, vectorScalarMul: vectorScalarMul,
        dotProduct: dotProduct, crossProduct: crossProduct, vectorNorm: vectorNorm,
        vectorNormalize: vectorNormalize, vectorDistance: vectorDistance,
        vectorAngle: vectorAngle, vectorProjection: vectorProjection,
        complex: complex, complexAdd: complexAdd, complexSub: complexSub,
        complexMul: complexMul, complexDiv: complexDiv, complexAbs: complexAbs,
        complexArg: complexArg, complexConj: complexConj, complexExp: complexExp,
        complexLog: complexLog, complexPow: complexPow, complexSin: complexSin,
        complexCos: complexCos,
        polyEval: polyEval, polyDerivative: polyDerivative,
        polyIntegral: polyIntegral, polyRoots: polyRoots,
        random: random, randomInt: randomInt, randomChoice: randomChoice,
        randomShuffle: randomShuffle, randomNormal: randomNormal,
        randomExponential: randomExponential, randomPoisson: randomPoisson,
        toString: toString, toBinary: toBinary, toOctal: toOctal, toHex: toHex,
        fromString: fromString, degToRad: degToRad, radToDeg: radToDeg,
        toRadians: toRadians, toDegrees: toDegrees,
        signum: signum, heaviside: heaviside, dirac: dirac, sinc: sinc,
        gaussian: gaussian, erf: erf, erfc: erfc, gamma: gamma,
        lgamma: lgamma, beta: beta
    },
    string: {
        space: space, empty: empty, newline: newline, tab: tab,
        len: len, char_at: char_at, concat: concat, to_upper: to_upper,
        to_lower: to_lower, trim: trim, trim_start: trim_start, trim_end: trim_end,
        substring: substring, split: split, join: join, replace: replace,
        replace_all: replace_all, index_of: index_of, last_index_of: last_index_of,
        includes: includes, starts_with: starts_with, ends_with: ends_with,
        repeat: repeat, pad_start: pad_start, pad_end: pad_end,
        char_code: char_code, from_char_code: from_char_code, reverse: reverse,
        count_char: count_char, count_word: count_word, is_empty: is_empty,
        is_whitespace: is_whitespace, first: first, last: last, take: take,
        drop: drop, slice: slice, to_array: to_array, from_array: from_array,
        compare: compare, equal: equal, random_char: random_char,
        random_string: random_string, escape_html: escape_html,
        unescape_html: unescape_html, to_slug: to_slug, to_camel: to_camel,
        to_snake: to_snake, to_kebab: to_kebab, mask: mask, truncate: truncate,
        swap_case: swap_case, count_lines: count_lines,
        extract_numbers: extract_numbers, extract_letters: extract_letters,
        is_alpha: is_alpha, is_digit: is_digit, is_alphanumeric: is_alphanumeric,
        is_lower: is_lower, is_upper: is_upper, to_title: to_title,
        surround: surround, quote: quote, unquote: unquote, center: center
    },
    datetime: {
        now: now, createDate: createDate, parseDate: parseDate, parseISO: parseISO,
        fromUnix: fromUnix, fromMillis: fromMillis,
        getYear: getYear, getMonth: getMonth, getDay: getDay, getHour: getHour,
        getMinute: getMinute, getSecond: getSecond, getMillisecond: getMillisecond,
        getDayOfWeek: getDayOfWeek, getDayOfYear: getDayOfYear,
        getWeekOfYear: getWeekOfYear, getQuarter: getQuarter,
        getEpoch: getEpoch, getMillis: getMillis,
        getTimezoneOffset: getTimezoneOffset, getTimezoneName: getTimezoneName,
        isEqual: isEqual, isBefore: isBefore, isAfter: isAfter,
        isBetween: isBetween, isSameDay: isSameDay, isSameMonth: isSameMonth,
        isSameYear: isSameYear, isWeekend: isWeekend, isWeekday: isWeekday,
        isLeapYear: isLeapYear, isToday: isToday, isFuture: isFuture, isPast: isPast,
        addYears: addYears, addMonths: addMonths, addDays: addDays,
        addHours: addHours, addMinutes: addMinutes, addSeconds: addSeconds,
        addMilliseconds: addMilliseconds,
        subYears: subYears, subMonths: subMonths, subDays: subDays,
        subHours: subHours, subMinutes: subMinutes, subSeconds: subSeconds,
        diffYears: diffYears, diffMonths: diffMonths, diffDays: diffDays,
        diffHours: diffHours, diffMinutes: diffMinutes, diffSeconds: diffSeconds,
        diffMilliseconds: diffMilliseconds,
        startOfDay: startOfDay, endOfDay: endOfDay, startOfWeek: startOfWeek,
        endOfWeek: endOfWeek, startOfMonth: startOfMonth, endOfMonth: endOfMonth,
        startOfYear: startOfYear, endOfYear: endOfYear,
        startOfQuarter: startOfQuarter, endOfQuarter: endOfQuarter,
        formatDate: formatDate, toISO: toISO, toLocaleString: toLocaleString,
        toDateString: toDateString, toTimeString: toTimeString,
        toUTCString: toUTCString, toRelative: toRelative,
        daysInMonth: daysInMonth, daysInYear: daysInYear,
        dayOfYear: dayOfYear, weekNumber: weekNumber, monthName: monthName,
        dayName: dayName, age: age, ageInMonths: ageInMonths, ageInDays: ageInDays,
        rangeOfDates: rangeOfDates, getAge: getAge, getTimeRemaining: getTimeRemaining
    },
    csv: CSV,
    audio: AudioUnderstanding,
    vision: Vision,
    text: TextUnderstanding,
    file: File
}

// Export for browser
if (typeof window !== 'undefined') {
    window.fileAml = fileAml
    window.MLMath = fileAml.math
    window.MLString = fileAml.string
    window.CSV = CSV
    window.AudioUnderstanding = AudioUnderstanding
    window.Vision = Vision
    window.TextUnderstanding = TextUnderstanding
    window.File = File
}

console.log('fileAml loaded successfully with ' + Object.keys(fileAml).length + ' main modules')
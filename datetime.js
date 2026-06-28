// ==================== HELPERS ====================
function _isDate(d) {
    return d instanceof Date && !isNaN(d.getTime())
}

function _validateDate(d, name = 'date') {
    if (!_isDate(d)) throw new Error(`${name} must be a valid Date object`)
    return d
}

function _validateNumber(n, name = 'value') {
    if (typeof n !== 'number' || isNaN(n)) throw new Error(`${name} must be a number`)
    return n
}

function _validateString(s, name = 'string') {
    if (typeof s !== 'string') throw new Error(`${name} must be a string`)
    return s
}

function _padZero(n, length = 2) {
    return String(n).padStart(length, '0')
}

// ==================== DATE CREATION ====================

// Create current date/time
function now() {
    return new Date()
}

// Create date from components
function createDate(year, month = 0, day = 1, hour = 0, minute = 0, second = 0, ms = 0) {
    _validateNumber(year, 'year')
    _validateNumber(month, 'month')
    _validateNumber(day, 'day')
    _validateNumber(hour, 'hour')
    _validateNumber(minute, 'minute')
    _validateNumber(second, 'second')
    _validateNumber(ms, 'ms')
    return new Date(year, month - 1, day, hour, minute, second, ms)
}

// Parse string to date
function parseDate(str, format = 'auto') {
    _validateString(str, 'str')
    if (format === 'auto') {
        const d = new Date(str)
        if (_isDate(d)) return d
        throw new Error(`Cannot parse date: ${str}`)
    }
    // Custom format parsing
    const parts = format.split(/[-\/\\:. ]+/)
    const values = str.split(/[-\/\\:. ]+/)
    if (parts.length !== values.length) throw new Error('Format and value mismatch')
    
    let year, month, day, hour = 0, minute = 0, second = 0
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const val = parseInt(values[i])
        if (isNaN(val)) throw new Error(`Invalid value: ${values[i]}`)
        if (part === 'YYYY' || part === 'yyyy') year = val
        else if (part === 'YY' || part === 'yy') year = 2000 + val
        else if (part === 'MM') month = val - 1
        else if (part === 'DD') day = val
        else if (part === 'HH') hour = val
        else if (part === 'mm') minute = val
        else if (part === 'ss') second = val
    }
    if (year === undefined) throw new Error('Year not found in format')
    return new Date(year, month || 0, day || 1, hour, minute, second)
}

// Parse ISO string
function parseISO(str) {
    _validateString(str, 'str')
    const d = new Date(str)
    if (!_isDate(d)) throw new Error(`Invalid ISO string: ${str}`)
    return d
}

// Parse Unix timestamp
function fromUnix(timestamp, ms = false) {
    _validateNumber(timestamp, 'timestamp')
    return ms ? new Date(timestamp) : new Date(timestamp * 1000)
}

// Parse milliseconds since epoch
function fromMillis(ms) {
    _validateNumber(ms, 'ms')
    return new Date(ms)
}

// ==================== DATE EXTRACTION ====================

function getYear(date) {
    _validateDate(date)
    return date.getFullYear()
}

function getMonth(date) {
    _validateDate(date)
    return date.getMonth() + 1
}

function getDay(date) {
    _validateDate(date)
    return date.getDate()
}

function getHour(date) {
    _validateDate(date)
    return date.getHours()
}

function getMinute(date) {
    _validateDate(date)
    return date.getMinutes()
}

function getSecond(date) {
    _validateDate(date)
    return date.getSeconds()
}

function getMillisecond(date) {
    _validateDate(date)
    return date.getMilliseconds()
}

function getDayOfWeek(date) {
    _validateDate(date)
    return date.getDay() // 0=Sunday, 6=Saturday
}

function getDayOfYear(date) {
    _validateDate(date)
    const start = new Date(date.getFullYear(), 0, 0)
    return Math.floor((date - start) / (24 * 60 * 60 * 1000))
}

function getWeekOfYear(date) {
    _validateDate(date)
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7)
    const week1 = new Date(d.getFullYear(), 0, 4)
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

function getQuarter(date) {
    _validateDate(date)
    return Math.floor((date.getMonth()) / 3) + 1
}

function getEpoch(date) {
    _validateDate(date)
    return Math.floor(date.getTime() / 1000)
}

function getMillis(date) {
    _validateDate(date)
    return date.getTime()
}

function getTimezoneOffset(date) {
    _validateDate(date)
    return date.getTimezoneOffset()
}

function getTimezoneName(date) {
    _validateDate(date)
    return date.toString().match(/\(([^)]+)\)/)?.[1] || 'UTC'
}

// ==================== DATE COMPARISON ====================

function isEqual(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return date1.getTime() === date2.getTime()
}

function isBefore(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return date1.getTime() < date2.getTime()
}

function isAfter(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return date1.getTime() > date2.getTime()
}

function isBetween(date, start, end) {
    _validateDate(date, 'date')
    _validateDate(start, 'start')
    _validateDate(end, 'end')
    const t = date.getTime()
    return t >= start.getTime() && t <= end.getTime()
}

function isSameDay(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
}

function isSameMonth(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth()
}

function isSameYear(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return date1.getFullYear() === date2.getFullYear()
}

function isWeekend(date) {
    _validateDate(date)
    const day = date.getDay()
    return day === 0 || day === 6
}

function isWeekday(date) {
    return !isWeekend(date)
}

function isLeapYear(year) {
    _validateNumber(year, 'year')
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function isToday(date) {
    _validateDate(date)
    return isSameDay(date, new Date())
}

function isFuture(date) {
    _validateDate(date)
    return isAfter(date, new Date())
}

function isPast(date) {
    _validateDate(date)
    return isBefore(date, new Date())
}

// ==================== DATE MATH ====================

function addYears(date, years) {
    _validateDate(date)
    _validateNumber(years, 'years')
    const d = new Date(date)
    d.setFullYear(d.getFullYear() + years)
    return d
}

function addMonths(date, months) {
    _validateDate(date)
    _validateNumber(months, 'months')
    const d = new Date(date)
    d.setMonth(d.getMonth() + months)
    return d
}

function addDays(date, days) {
    _validateDate(date)
    _validateNumber(days, 'days')
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}

function addHours(date, hours) {
    _validateDate(date)
    _validateNumber(hours, 'hours')
    const d = new Date(date)
    d.setHours(d.getHours() + hours)
    return d
}

function addMinutes(date, minutes) {
    _validateDate(date)
    _validateNumber(minutes, 'minutes')
    const d = new Date(date)
    d.setMinutes(d.getMinutes() + minutes)
    return d
}

function addSeconds(date, seconds) {
    _validateDate(date)
    _validateNumber(seconds, 'seconds')
    const d = new Date(date)
    d.setSeconds(d.getSeconds() + seconds)
    return d
}

function addMilliseconds(date, ms) {
    _validateDate(date)
    _validateNumber(ms, 'ms')
    const d = new Date(date)
    d.setMilliseconds(d.getMilliseconds() + ms)
    return d
}

function subYears(date, years) { return addYears(date, -years) }
function subMonths(date, months) { return addMonths(date, -months) }
function subDays(date, days) { return addDays(date, -days) }
function subHours(date, hours) { return addHours(date, -hours) }
function subMinutes(date, minutes) { return addMinutes(date, -minutes) }
function subSeconds(date, seconds) { return addSeconds(date, -seconds) }

function diffYears(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return (date1.getFullYear() - date2.getFullYear()) +
           (date1.getMonth() - date2.getMonth()) / 12
}

function diffMonths(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return (date1.getFullYear() - date2.getFullYear()) * 12 +
           date1.getMonth() - date2.getMonth()
}

function diffDays(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)
    return Math.floor((d1 - d2) / (24 * 60 * 60 * 1000))
}

function diffHours(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return (date1 - date2) / (60 * 60 * 1000)
}

function diffMinutes(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return (date1 - date2) / (60 * 1000)
}

function diffSeconds(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return (date1 - date2) / 1000
}

function diffMilliseconds(date1, date2) {
    _validateDate(date1, 'date1')
    _validateDate(date2, 'date2')
    return date1 - date2
}

// ==================== DATE BOUNDARIES ====================

function startOfDay(date) {
    _validateDate(date)
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

function endOfDay(date) {
    _validateDate(date)
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
}

function startOfWeek(date, weekStartsOn = 0) {
    _validateDate(date)
    _validateNumber(weekStartsOn, 'weekStartsOn')
    const d = new Date(date)
    const day = d.getDay()
    d.setDate(d.getDate() - ((day - weekStartsOn + 7) % 7))
    d.setHours(0, 0, 0, 0)
    return d
}

function endOfWeek(date, weekStartsOn = 0) {
    _validateDate(date)
    _validateNumber(weekStartsOn, 'weekStartsOn')
    const d = startOfWeek(date, weekStartsOn)
    d.setDate(d.getDate() + 6)
    d.setHours(23, 59, 59, 999)
    return d
}

function startOfMonth(date) {
    _validateDate(date)
    const d = new Date(date)
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
}

function endOfMonth(date) {
    _validateDate(date)
    const d = new Date(date)
    d.setMonth(d.getMonth() + 1)
    d.setDate(0)
    d.setHours(23, 59, 59, 999)
    return d
}

function startOfYear(date) {
    _validateDate(date)
    const d = new Date(date)
    d.setMonth(0, 1)
    d.setHours(0, 0, 0, 0)
    return d
}

function endOfYear(date) {
    _validateDate(date)
    const d = new Date(date)
    d.setMonth(11, 31)
    d.setHours(23, 59, 59, 999)
    return d
}

function startOfQuarter(date) {
    _validateDate(date)
    const q = getQuarter(date)
    const d = new Date(date)
    d.setMonth((q - 1) * 3, 1)
    d.setHours(0, 0, 0, 0)
    return d
}

function endOfQuarter(date) {
    _validateDate(date)
    const q = getQuarter(date)
    const d = new Date(date)
    d.setMonth(q * 3, 0)
    d.setHours(23, 59, 59, 999)
    return d
}

// ==================== FORMATTING ====================

function formatDate(date, format = 'YYYY-MM-DD') {
    _validateDate(date)
    const map = {
        'YYYY': date.getFullYear(),
        'YY': String(date.getFullYear()).slice(-2),
        'MM': _padZero(date.getMonth() + 1),
        'M': date.getMonth() + 1,
        'DD': _padZero(date.getDate()),
        'D': date.getDate(),
        'HH': _padZero(date.getHours()),
        'H': date.getHours(),
        'hh': _padZero(date.getHours() % 12 || 12),
        'h': date.getHours() % 12 || 12,
        'mm': _padZero(date.getMinutes()),
        'm': date.getMinutes(),
        'ss': _padZero(date.getSeconds()),
        's': date.getSeconds(),
        'SSS': _padZero(date.getMilliseconds(), 3),
        'A': date.getHours() >= 12 ? 'PM' : 'AM',
        'a': date.getHours() >= 12 ? 'pm' : 'am',
        'dddd': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
        'ddd': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        'dd': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()],
        'MMMM': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()],
        'MMM': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()],
        'Q': getQuarter(date),
        'Do': ['th', 'st', 'nd', 'rd'][date.getDate() % 10] || 'th',
    }
    let result = format
    for (const [key, value] of Object.entries(map)) {
        result = result.replace(new RegExp(key, 'g'), value)
    }
    return result
}

function toISO(date) {
    _validateDate(date)
    return date.toISOString()
}

function toLocaleString(date, locale = 'en-US', options = {}) {
    _validateDate(date)
    return date.toLocaleString(locale, options)
}

function toDateString(date) {
    _validateDate(date)
    return date.toDateString()
}

function toTimeString(date) {
    _validateDate(date)
    return date.toTimeString()
}

function toUTCString(date) {
    _validateDate(date)
    return date.toUTCString()
}

function toRelative(date, baseDate = new Date()) {
    _validateDate(date)
    _validateDate(baseDate, 'baseDate')
    const diff = diffSeconds(date, baseDate)
    const absDiff = Math.abs(diff)
    if (absDiff < 60) return diff < 0 ? 'just now' : 'in a moment'
    if (absDiff < 3600) {
        const m = Math.floor(absDiff / 60)
        return diff < 0 ? `${m} min ago` : `in ${m} min`
    }
    if (absDiff < 86400) {
        const h = Math.floor(absDiff / 3600)
        return diff < 0 ? `${h} hour${h > 1 ? 's' : ''} ago` : `in ${h} hour${h > 1 ? 's' : ''}`
    }
    if (absDiff < 604800) {
        const d = Math.floor(absDiff / 86400)
        return diff < 0 ? `${d} day${d > 1 ? 's' : ''} ago` : `in ${d} day${d > 1 ? 's' : ''}`
    }
    if (absDiff < 2592000) {
        const w = Math.floor(absDiff / 604800)
        return diff < 0 ? `${w} week${w > 1 ? 's' : ''} ago` : `in ${w} week${w > 1 ? 's' : ''}`
    }
    if (absDiff < 31536000) {
        const m = Math.floor(absDiff / 2592000)
        return diff < 0 ? `${m} month${m > 1 ? 's' : ''} ago` : `in ${m} month${m > 1 ? 's' : ''}`
    }
    const y = Math.floor(absDiff / 31536000)
    return diff < 0 ? `${y} year${y > 1 ? 's' : ''} ago` : `in ${y} year${y > 1 ? 's' : ''}`
}

// ==================== DATE INFO ====================

function daysInMonth(date) {
    _validateDate(date)
    const d = new Date(date)
    d.setMonth(d.getMonth() + 1)
    d.setDate(0)
    return d.getDate()
}

function daysInYear(date) {
    _validateDate(date)
    return isLeapYear(date.getFullYear()) ? 366 : 365
}

function dayOfYear(date) {
    _validateDate(date)
    return getDayOfYear(date)
}

function weekNumber(date) {
    _validateDate(date)
    return getWeekOfYear(date)
}

function monthName(date, short = false) {
    _validateDate(date)
    const names = short ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                         : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return names[date.getMonth()]
}

function dayName(date, short = false) {
    _validateDate(date)
    const names = short ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                         : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return names[date.getDay()]
}

// ==================== AGE CALCULATION ====================

function age(birthDate, date = new Date()) {
    _validateDate(birthDate, 'birthDate')
    _validateDate(date, 'date')
    let age = date.getFullYear() - birthDate.getFullYear()
    const m = date.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && date.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}

function ageInMonths(birthDate, date = new Date()) {
    _validateDate(birthDate, 'birthDate')
    _validateDate(date, 'date')
    return diffMonths(date, birthDate)
}

function ageInDays(birthDate, date = new Date()) {
    _validateDate(birthDate, 'birthDate')
    _validateDate(date, 'date')
    return diffDays(date, birthDate)
}

// ==================== DATE GENERATION ====================

function rangeOfDates(start, end, step = 1, unit = 'days') {
    _validateDate(start, 'start')
    _validateDate(end, 'end')
    _validateNumber(step, 'step')
    _validateString(unit, 'unit')
    const dates = []
    const d = new Date(start)
    const addFn = {
        'days': addDays,
        'weeks': addDays,
        'months': addMonths,
        'years': addYears
    }[unit]
    if (!addFn) throw new Error('Unit must be days, weeks, months, or years')
    const stepMultiplier = unit === 'weeks' ? step * 7 : step
    while (isBefore(d, end) || isEqual(d, end)) {
        dates.push(new Date(d))
        const next = unit === 'weeks' ? addDays(d, stepMultiplier) : addFn(d, stepMultiplier)
        d.setTime(next.getTime())
    }
    return dates
}

function getAge(birthDate) { return age(birthDate) }

function getTimeRemaining(date) {
    _validateDate(date)
    const diff = date - new Date()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 }
    const ms = diff
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    return {
        days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        ms: ms % 1000
    }
}

// ==================== EXPORT ====================
const datetime = {
    // Creation
    now, createDate, parseDate, parseISO, fromUnix, fromMillis,

    // Extraction
    getYear, getMonth, getDay, getHour, getMinute, getSecond,
    getMillisecond, getDayOfWeek, getDayOfYear, getWeekOfYear,
    getQuarter, getEpoch, getMillis, getTimezoneOffset, getTimezoneName,

    // Comparison
    isEqual, isBefore, isAfter, isBetween, isSameDay, isSameMonth,
    isSameYear, isWeekend, isWeekday, isLeapYear, isToday, isFuture, isPast,

    // Math
    addYears, addMonths, addDays, addHours, addMinutes, addSeconds,
    addMilliseconds, subYears, subMonths, subDays, subHours, subMinutes,
    subSeconds, diffYears, diffMonths, diffDays, diffHours, diffMinutes,
    diffSeconds, diffMilliseconds,

    // Boundaries
    startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
    startOfYear, endOfYear, startOfQuarter, endOfQuarter,

    // Formatting
    formatDate, toISO, toLocaleString, toDateString, toTimeString,
    toUTCString, toRelative,

    // Info
    daysInMonth, daysInYear, dayOfYear, weekNumber, monthName, dayName,

    // Age
    age, ageInMonths, ageInDays,

    // Generation
    rangeOfDates,

    // Utilities
    getAge, getTimeRemaining
}

window.datetime = datetime;

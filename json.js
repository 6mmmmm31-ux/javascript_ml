function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isBoolean(b) { return typeof b === 'boolean' }
function _isFunction(f) { return typeof f === 'function' }
function _isNull(v) { return v === null }
function _isUndefined(v) { return v === undefined }

function _clone(obj) { return JSON.parse(JSON.stringify(obj)) }
function _escapeJSON(str) { return JSON.stringify(str) }
function _unescapeJSON(str) { return JSON.parse(str) }
function parseJSON(json) {
    if (!_isString(json)) throw new Error('Input must be a string')
    try {
        return JSON.parse(json)
    } catch (e) {
        throw new Error('Invalid JSON: ' + e.message)
    }
}
function stringifyJSON(obj, indent) {
    indent = indent || 0
    try {
        return JSON.stringify(obj, null, indent)
    } catch (e) {
        throw new Error('Cannot stringify: ' + e.message)
    }
}

// Validate JSON
function validateJSON(json) {
    if (!_isString(json)) return { valid: false, error: 'Input must be a string' }
    try {
        JSON.parse(json)
        return { valid: true }
    } catch (e) {
        return { valid: false, error: e.message }
    }
}
function parseJSONL(jsonl) {
    if (!_isString(jsonl)) throw new Error('Input must be a string')
    const lines = jsonl.split(/\r?\n/).filter(function(line) { return line.trim() !== '' })
    const result = []
    for (let i = 0; i < lines.length; i++) {
        try {
            result.push(JSON.parse(lines[i]))
        } catch (e) {
            throw new Error('Invalid JSONL at line ' + (i + 1) + ': ' + e.message)
        }
    }
    return result
}
function stringifyJSONL(data) {
    if (!_isArray(data)) throw new Error('Input must be an array')
    return data.map(function(item) {
        try {
            return JSON.stringify(item)
        } catch (e) {
            throw new Error('Cannot stringify item: ' + e.message)
        }
    }).join('\n')
}
function validateJSONL(jsonl) {
    if (!_isString(jsonl)) return { valid: false, error: 'Input must be a string' }
    const lines = jsonl.split(/\r?\n/).filter(function(line) { return line.trim() !== '' })
    for (let i = 0; i < lines.length; i++) {
        try {
            JSON.parse(lines[i])
        } catch (e) {
            return { valid: false, error: 'Invalid JSONL at line ' + (i + 1) + ': ' + e.message }
        }
    }
    return { valid: true, lineCount: lines.length }
}

function jsonToJSONL(json) {
    const data = _isString(json) ? parseJSON(json) : json
    if (!_isArray(data)) throw new Error('JSON must be an array')
    return stringifyJSONL(data)
}
function jsonlToJSON(jsonl) {
    const data = parseJSONL(jsonl)
    return stringifyJSON(data, 2)
}
function getPath(obj, path) {
    if (!_isObject(obj) && !_isArray(obj)) throw new Error('Object must be an object or array')
    if (!_isString(path)) throw new Error('Path must be a string')
    
    const parts = path.split(/[\.\[\]]+/).filter(function(p) { return p !== '' })
    let current = obj
    
    for (const part of parts) {
        if (current === undefined || current === null) return undefined
        if (_isArray(current) && !isNaN(part)) {
            current = current[parseInt(part)]
        } else if (_isObject(current)) {
            current = current[part]
        } else {
            return undefined
        }
    }
    return current
}

function setPath(obj, path, value) {
    if (!_isObject(obj) && !_isArray(obj)) throw new Error('Object must be an object or array')
    if (!_isString(path)) throw new Error('Path must be a string')
    
    const parts = path.split(/[\.\[\]]+/).filter(function(p) { return p !== '' })
    let current = obj
    
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (_isArray(current) && !isNaN(part)) {
            current = current[parseInt(part)]
        } else if (_isObject(current)) {
            if (!(part in current)) {
                current[part] = isNaN(parts[i + 1]) ? {} : []
            }
            current = current[part]
        } else {
            throw new Error('Invalid path: ' + path)
        }
    }
    
    const lastPart = parts[parts.length - 1]
    if (_isArray(current) && !isNaN(lastPart)) {
        current[parseInt(lastPart)] = value
    } else if (_isObject(current)) {
        current[lastPart] = value
    } else {
        throw new Error('Invalid path: ' + path)
    }
    
    return obj
}

function deletePath(obj, path) {
    if (!_isObject(obj) && !_isArray(obj)) throw new Error('Object must be an object or array')
    if (!_isString(path)) throw new Error('Path must be a string')
    
    const parts = path.split(/[\.\[\]]+/).filter(function(p) { return p !== '' })
    if (parts.length === 0) return obj
    
    let current = obj
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (_isArray(current) && !isNaN(part)) {
            current = current[parseInt(part)]
        } else if (_isObject(current)) {
            current = current[part]
        } else {
            return obj
        }
    }
    
    const lastPart = parts[parts.length - 1]
    if (_isArray(current) && !isNaN(lastPart)) {
        current.splice(parseInt(lastPart), 1)
    } else if (_isObject(current)) {
        delete current[lastPart]
    }
    
    return obj
}

function hasPath(obj, path) {
    return getPath(obj, path) !== undefined
}
function findInJSON(obj, predicate) {
    const results = []
    
    function _search(current, path) {
        if (predicate(current, path)) {
            results.push({ value: current, path: path })
        }
        if (_isObject(current)) {
            for (const key in current) {
                if (current.hasOwnProperty(key)) {
                    _search(current[key], path + '.' + key)
                }
            }
        } else if (_isArray(current)) {
            for (let i = 0; i < current.length; i++) {
                _search(current[i], path + '[' + i + ']')
            }
        }
    }
    
    _search(obj, '')
    return results
}

function findKeys(obj, keyPattern) {
    const keys = []
    const regex = _isString(keyPattern) ? new RegExp(keyPattern) : keyPattern
    
    function _search(current, path) {
        if (_isObject(current)) {
            for (const key in current) {
                if (current.hasOwnProperty(key)) {
                    if (regex.test(key)) {
                        keys.push(path ? path + '.' + key : key)
                    }
                    _search(current[key], path ? path + '.' + key : key)
                }
            }
        } else if (_isArray(current)) {
            for (let i = 0; i < current.length; i++) {
                _search(current[i], path + '[' + i + ']')
            }
        }
    }
    
    _search(obj, '')
    return keys
}

function findValues(obj, valuePattern) {
    const values = []
    
    function _search(current) {
        if (_isObject(current)) {
            for (const key in current) {
                if (current.hasOwnProperty(key)) {
                    if (current[key] === valuePattern) {
                        values.push(current[key])
                    }
                    _search(current[key])
                }
            }
        } else if (_isArray(current)) {
            for (const item of current) {
                if (item === valuePattern) {
                    values.push(item)
                }
                _search(item)
            }
        }
    }
    
    _search(obj)
    return values
}
function flattenJSON(obj, prefix) {
    prefix = prefix || ''
    const result = {}
    
    if (_isObject(obj)) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = prefix ? prefix + '.' + key : key
                const value = obj[key]
                if (_isObject(value) || _isArray(value)) {
                    Object.assign(result, flattenJSON(value, newKey))
                } else {
                    result[newKey] = value
                }
            }
        }
    } else if (_isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            const newKey = prefix + '[' + i + ']'
            const value = obj[i]
            if (_isObject(value) || _isArray(value)) {
                Object.assign(result, flattenJSON(value, newKey))
            } else {
                result[newKey] = value
            }
        }
    } else {
        result[prefix] = obj
    }
    
    return result
}

function unflattenJSON(flatObj) {
    const result = {}
    
    for (const key in flatObj) {
        if (flatObj.hasOwnProperty(key)) {
            const parts = key.split(/[\.\[\]]+/).filter(function(p) { return p !== '' })
            let current = result
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i]
                const isArray = key.includes('[' + part + ']') || 
                                (i < parts.length - 1 && !isNaN(parts[i + 1]))
                
                if (i === parts.length - 1) {
                    if (isArray) {
                        if (!_isArray(current)) current[part] = []
                        current[parseInt(part)] = flatObj[key]
                    } else {
                        current[part] = flatObj[key]
                    }
                } else {
                    if (isArray) {
                        if (!_isArray(current)) current[part] = []
                        current = current[parseInt(part)]
                    } else {
                        if (!_isObject(current)) current[part] = {}
                        current = current[part]
                    }
                }
            }
        }
    }
    
    return result
}

function sortKeys(obj) {
    if (_isArray(obj)) {
        return obj.map(sortKeys)
    }
    if (!_isObject(obj)) {
        return obj
    }
    
    const sorted = {}
    const keys = Object.keys(obj).sort()
    for (const key of keys) {
        sorted[key] = sortKeys(obj[key])
    }
    return sorted
}

function filterJSON(obj, predicate) {
    if (_isArray(obj)) {
        return obj.filter(predicate)
    }
    if (_isObject(obj)) {
        const result = {}
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && predicate(obj[key], key)) {
                result[key] = obj[key]
            }
        }
        return result
    }
    return obj
}

function mapJSON(obj, mapper) {
    if (_isArray(obj)) {
        return obj.map(mapper)
    }
    if (_isObject(obj)) {
        const result = {}
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = mapper(obj[key], key)
            }
        }
        return result
    }
    return obj
}

function reduceJSON(obj, reducer, initial) {
    if (_isArray(obj)) {
        return obj.reduce(reducer, initial)
    }
    if (_isObject(obj)) {
        let result = initial
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result = reducer(result, obj[key], key)
            }
        }
        return result
    }
    return obj
}
function mergeJSON(obj1, obj2) {
    const result = _clone(obj1)
    
    function _merge(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (_isObject(source[key]) && _isObject(target[key]) && !_isArray(target[key])) {
                    _merge(target[key], source[key])
                } else if (_isArray(source[key]) && _isArray(target[key])) {
                    target[key] = target[key].concat(source[key])
                } else {
                    target[key] = _clone(source[key])
                }
            }
        }
    }
    
    _merge(result, obj2)
    return result
}

function deepMergeJSON() {
    const args = Array.prototype.slice.call(arguments)
    if (args.length === 0) return {}
    
    let result = _clone(args[0])
    for (let i = 1; i < args.length; i++) {
        result = mergeJSON(result, args[i])
    }
    return result
}

function diffJSON(obj1, obj2) {
    const diff = {
        added: {},
        removed: {},
        changed: {},
        unchanged: {}
    }
    
    function _compare(a, b, path) {
        if (a === b) {
            diff.unchanged[path] = a
            return
        }
        
        if (a === undefined || a === null) {
            diff.added[path] = b
            return
        }
        
        if (b === undefined || b === null) {
            diff.removed[path] = a
            return
        }
        
        if (typeof a !== typeof b) {
            diff.changed[path] = { from: a, to: b }
            return
        }
        
        if (!_isObject(a) && !_isArray(a)) {
            diff.changed[path] = { from: a, to: b }
            return
        }
        
        if (_isArray(a) && _isArray(b)) {
            const maxLen = Math.max(a.length, b.length)
            for (let i = 0; i < maxLen; i++) {
                _compare(a[i], b[i], path + '[' + i + ']')
            }
        } else if (_isObject(a) && _isObject(b)) {
            const keys = new Set([...Object.keys(a), ...Object.keys(b)])
            for (const key of keys) {
                _compare(a[key], b[key], path ? path + '.' + key : key)
            }
        } else {
            diff.changed[path] = { from: a, to: b }
        }
    }
    
    _compare(obj1, obj2, '')
    return diff
}

function patchJSON(obj, diff) {
    let result = _clone(obj)
    for (const path in diff.added) {
        if (diff.added.hasOwnProperty(path)) {
            result = setPath(result, path, diff.added[path])
        }
    }
    for (const path in diff.changed) {
        if (diff.changed.hasOwnProperty(path)) {
            result = setPath(result, path, diff.changed[path].to)
        }
    }
    for (const path in diff.removed) {
        if (diff.removed.hasOwnProperty(path)) {
            result = deletePath(result, path)
        }
    }
    
    return result
}

function validateSchema(json, schema) {
    if (_isString(json)) {
        try { json = JSON.parse(json) } catch (e) { return { valid: false, error: 'Invalid JSON' } }
    }
    
    function _validate(value, schema, path) {
        if (!schema) return { valid: true }
        if (schema.required && schema.required.length > 0) {
            for (const req of schema.required) {
                if (!(req in value)) {
                    return { valid: false, error: 'Missing required field: ' + req, path: path }
                }
            }
        }
        if (schema.type) {
            const expectedType = schema.type
            const actualType = _isArray(value) ? 'array' : typeof value
            
            if (expectedType === 'array' && !_isArray(value)) {
                return { valid: false, error: 'Expected array, got ' + actualType, path: path }
            }
            if (expectedType === 'object' && !_isObject(value)) {
                return { valid: false, error: 'Expected object, got ' + actualType, path: path }
            }
            if (expectedType === 'string' && typeof value !== 'string') {
                return { valid: false, error: 'Expected string, got ' + actualType, path: path }
            }
            if (expectedType === 'number' && typeof value !== 'number') {
                return { valid: false, error: 'Expected number, got ' + actualType, path: path }
            }
            if (expectedType === 'boolean' && typeof value !== 'boolean') {
                return { valid: false, error: 'Expected boolean, got ' + actualType, path: path }
            }
        }
        if (schema.properties && _isObject(value)) {
            for (const key in schema.properties) {
                if (schema.properties.hasOwnProperty(key) && key in value) {
                    const result = _validate(value[key], schema.properties[key], path ? path + '.' + key : key)
                    if (!result.valid) return result
                }
            }
        }
        if (schema.items && _isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                const result = _validate(value[i], schema.items, path + '[' + i + ']')
                if (!result.valid) return result
            }
        }
        if (schema.minimum !== undefined && value < schema.minimum) {
            return { valid: false, error: 'Value less than minimum: ' + schema.minimum, path: path }
        }
        if (schema.maximum !== undefined && value > schema.maximum) {
            return { valid: false, error: 'Value greater than maximum: ' + schema.maximum, path: path }
        }
        if (schema.minLength !== undefined && value.length < schema.minLength) {
            return { valid: false, error: 'Length less than minimum: ' + schema.minLength, path: path }
        }
        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
            return { valid: false, error: 'Length greater than maximum: ' + schema.maxLength, path: path }
        }
        if (schema.pattern && typeof value === 'string') {
            if (!new RegExp(schema.pattern).test(value)) {
                return { valid: false, error: 'Does not match pattern: ' + schema.pattern, path: path }
            }
        }
        if (schema.enum && !schema.enum.includes(value)) {
            return { valid: false, error: 'Value not in enum: ' + JSON.stringify(schema.enum), path: path }
        }
        
        return { valid: true }
    }
    
    return _validate(json, schema, '')
}
function jsonStats(obj) {
    const stats = {
        type: null,
        size: 0,
        depth: 0,
        keys: 0,
        arrays: 0,
        objects: 0,
        strings: 0,
        numbers: 0,
        booleans: 0,
        nulls: 0,
        undefineds: 0,
        totalValues: 0,
        maxDepth: 0
    }
    
    function _analyze(value, depth) {
        stats.totalValues++
        if (depth > stats.maxDepth) stats.maxDepth = depth
        
        if (_isArray(value)) {
            stats.arrays++
            stats.type = 'array'
            for (const item of value) {
                _analyze(item, depth + 1)
            }
        } else if (_isObject(value)) {
            stats.objects++
            stats.type = 'object'
            stats.keys += Object.keys(value).length
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    _analyze(value[key], depth + 1)
                }
            }
        } else if (typeof value === 'string') {
            stats.strings++
        } else if (typeof value === 'number') {
            stats.numbers++
        } else if (typeof value === 'boolean') {
            stats.booleans++
        } else if (value === null) {
            stats.nulls++
        } else if (value === undefined) {
            stats.undefineds++
        }
    }
    
    _analyze(obj, 0)
    stats.depth = stats.maxDepth
    return stats
}
function jsonToCSV(json, headers) {
    if (!_isArray(json)) throw new Error('Input must be an array')
    if (json.length === 0) return ''
    
    const h = headers || Object.keys(json[0])
    const rows = [h]
    
    for (const item of json) {
        const row = h.map(function(key) {
            const val = item[key]
            if (val === null || val === undefined) return ''
            if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
                return '"' + val.replace(/"/g, '""') + '"'
            }
            return String(val)
        })
        rows.push(row)
    }
    
    return rows.map(function(row) { return row.join(',') }).join('\n')
}

function jsonToXML(json, rootName) {
    rootName = rootName || 'root'
    
    function _toXML(obj, tag) {
        if (obj === null || obj === undefined) return ''
        if (!_isObject(obj) && !_isArray(obj)) {
            return '<' + tag + '>' + String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</' + tag + '>'
        }
        if (_isArray(obj)) {
            return obj.map(function(item) {
                return _toXML(item, 'item')
            }).join('')
        }
        let result = ''
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result += _toXML(obj[key], key)
            }
        }
        return result
    }
    
    return '<' + rootName + '>' + _toXML(json, rootName) + '</' + rootName + '>'
}

function jsonToYAML(json, indent) {
    indent = indent || 0
    const spaces = '  '.repeat(indent)
    
    if (json === null || json === undefined) return 'null'
    if (typeof json === 'string') return '"' + json.replace(/"/g, '\\"') + '"'
    if (typeof json === 'number' || typeof json === 'boolean') return String(json)
    if (_isArray(json)) {
        if (json.length === 0) return '[]'
        return json.map(function(item) {
            return spaces + '- ' + jsonToYAML(item, indent + 1)
        }).join('\n')
    }
    if (_isObject(json)) {
        const keys = Object.keys(json)
        if (keys.length === 0) return '{}'
        return keys.map(function(key) {
            const val = jsonToYAML(json[key], indent + 1)
            return spaces + key + ': ' + val
        }).join('\n')
    }
    return String(json)
}
function jsonSize(obj) {
    if (obj === null || obj === undefined) return 0
    if (typeof obj === 'string') return obj.length
    if (typeof obj === 'number') return 8
    if (typeof obj === 'boolean') return 4
    if (_isArray(obj)) {
        let size = 0
        for (const item of obj) {
            size += jsonSize(item)
        }
        return size
    }
    if (_isObject(obj)) {
        let size = 0
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                size += key.length + jsonSize(obj[key])
            }
        }
        return size
    }
    return 0
}

function jsonStringSize(json) {
    return JSON.stringify(json).length
}
function streamJSON(data, chunkSize) {
    chunkSize = chunkSize || 100
    if (!_isArray(data)) throw new Error('Data must be an array')
    
    const chunks = []
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize))
    }
    
    return {
        chunks: chunks,
        total: data.length,
        chunkCount: chunks.length,
        next: function() {
            return chunks.shift() || null
        },
        hasNext: function() {
            return chunks.length > 0
        }
    }
}

function streamJSONL(jsonl, chunkSize) {
    chunkSize = chunkSize || 100
    const data = parseJSONL(jsonl)
    return streamJSON(data, chunkSize)
}

function compressJSON(obj) {
    const json = JSON.stringify(obj)
    return json.replace(/\s+/g, '')
}

function decompressJSON(compressed) {
    return JSON.parse(compressed)
}

function minifyJSON(json) {
    return compressJSON(json)
}

function prettifyJSON(json, indent) {
    indent = indent || 2
    if (_isString(json)) {
        try { json = JSON.parse(json) } catch (e) { throw new Error('Invalid JSON') }
    }
    return JSON.stringify(json, null, indent)
}
function searchJSON(obj, query) {
    const results = []
    const regex = _isString(query) ? new RegExp(query, 'i') : query
    
    function _search(current, path) {
        if (_isObject(current)) {
            for (const key in current) {
                if (current.hasOwnProperty(key)) {
                    if (regex.test(key) || regex.test(String(current[key]))) {
                        results.push({ key: key, value: current[key], path: path ? path + '.' + key : key })
                    }
                    _search(current[key], path ? path + '.' + key : key)
                }
            }
        } else if (_isArray(current)) {
            for (let i = 0; i < current.length; i++) {
                if (regex.test(String(current[i]))) {
                    results.push({ index: i, value: current[i], path: path + '[' + i + ']' })
                }
                _search(current[i], path + '[' + i + ']')
            }
        }
    }
    
    _search(obj, '')
    return results
}
function generateJSON(schema, count) {
    count = count || 1
    const results = []
    
    function _generate(schema) {
        if (schema === null) return null
        if (typeof schema === 'function') return schema()
        if (_isArray(schema)) {
            return schema.map(_generate)
        }
        if (_isObject(schema)) {
            const result = {}
            for (const key in schema) {
                if (schema.hasOwnProperty(key)) {
                    result[key] = _generate(schema[key])
                }
            }
            return result
        }
        if (typeof schema === 'string') {
            if (schema === 'string') return 'random_string_' + Math.random().toString(36).substr(2, 5)
            if (schema === 'number') return Math.floor(Math.random() * 1000)
            if (schema === 'boolean') return Math.random() > 0.5
            if (schema === 'date') return new Date().toISOString()
            if (schema === 'email') return 'user' + Math.random().toString(36).substr(2, 5) + '@example.com'
            if (schema === 'phone') return '+1' + Math.floor(Math.random() * 9000000000 + 1000000000)
            if (schema === 'uuid') {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0
                    const v = c === 'x' ? r : (r & 0x3 | 0x8)
                    return v.toString(16)
                })
            }
            return schema
        }
        return schema
    }
    
    for (let i = 0; i < count; i++) {
        results.push(_generate(schema))
    }
    
    return count === 1 ? results[0] : results
}

var JSONLib = {
    parseJSON: parseJSON,
    stringifyJSON: stringifyJSON,
    validateJSON: validateJSON,
    parseJSONL: parseJSONL,
    stringifyJSONL: stringifyJSONL,
    validateJSONL: validateJSONL,
    jsonToJSONL: jsonToJSONL,
    jsonlToJSON: jsonlToJSON,
    getPath: getPath,
    setPath: setPath,
    deletePath: deletePath,
    hasPath: hasPath,
    findInJSON: findInJSON,
    findKeys: findKeys,
    findValues: findValues,
    flattenJSON: flattenJSON,
    unflattenJSON: unflattenJSON,
    sortKeys: sortKeys,
    filterJSON: filterJSON,
    mapJSON: mapJSON,
    reduceJSON: reduceJSON,
    mergeJSON: mergeJSON,
    deepMergeJSON: deepMergeJSON,
    diffJSON: diffJSON,
    patchJSON: patchJSON,
    validateSchema: validateSchema,
    jsonStats: jsonStats,
    jsonSize: jsonSize,
    jsonStringSize: jsonStringSize,
    jsonToCSV: jsonToCSV,
    jsonToXML: jsonToXML,
    jsonToYAML: jsonToYAML,
    streamJSON: streamJSON,
    streamJSONL: streamJSONL,
    compressJSON: compressJSON,
    decompressJSON: decompressJSON,
    minifyJSON: minifyJSON,
    prettifyJSON: prettifyJSON,
    searchJSON: searchJSON,
    generateJSON: generateJSON,
    clone: _clone,
    escape: _escapeJSON,
    unescape: _unescapeJSON
}

var pathFunctions = ['get', 'set', 'delete', 'has']
for (const fn of pathFunctions) {
    JSONLib[fn + 'Path'] = JSONLib[fn + 'Path']
}

var formats = ['CSV', 'XML', 'YAML']
for (const format of formats) {
    JSONLib['jsonTo' + format] = JSONLib['jsonTo' + format]
}

var validators = ['Required', 'Type', 'MinLength', 'MaxLength', 'Pattern', 'Enum']
var stats = ['Count', 'Keys', 'Depth']
if (typeof window !== 'undefined') {
    window.JSONLib = JSONLib
    window.JSONL = {
        parse: parseJSONL,
        stringify: stringifyJSONL,
        validate: validateJSONL
    }
}
console.log('JSON Library loaded with ' + Object.keys(JSONLib).length + ' functions')
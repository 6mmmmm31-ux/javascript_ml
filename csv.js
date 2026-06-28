function _isString(s) {
    return typeof s === 'string'
}

function _isArray(a) {
    return Array.isArray(a)
}

function _isObject(o) {
    return o !== null && typeof o === 'object' && !Array.isArray(o)
}

function _escapeCSV(str) {
    if (str === null || str === undefined) return ''
    str = String(str)
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"'
    }
    return str
}
function csvToArray(csv, delimiter = ',', hasHeader = true) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '')
    if (lines.length === 0) return []
    
    const parsedLines = []
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const parsed = []
        let current = ''
        let inQuotes = false
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j]
            if (inQuotes) {
                if (char === '"' && j + 1 < line.length && line[j + 1] === '"') {
                    current += '"'
                    j++
                } else if (char === '"') {
                    inQuotes = false
                } else {
                    current += char
                }
            } else {
                if (char === '"') {
                    inQuotes = true
                } else if (char === delimiter) {
                    parsed.push(current.trim())
                    current = ''
                } else {
                    current += char
                }
            }
        }
        parsed.push(current.trim())
        parsedLines.push(parsed)
    }
    
    const rowLength = parsedLines[0].length
    for (let i = 0; i < parsedLines.length; i++) {
        if (parsedLines[i].length !== rowLength) {
            throw new Error('Row ' + (i + 1) + ' has ' + parsedLines[i].length + ' columns, expected ' + rowLength)
        }
    }
    
    if (hasHeader && parsedLines.length > 0) {
        const result = []
        const headers = parsedLines[0]
        for (let i = 1; i < parsedLines.length; i++) {
            const row = {}
            for (let j = 0; j < headers.length; j++) {
                row[headers[j]] = parsedLines[i][j] || ''
            }
            result.push(row)
        }
        return result
    }
    
    return parsedLines
}

function arrayToCsv(data, delimiter = ',') {
    if (!_isArray(data)) throw new Error('Data must be an array')
    if (data.length === 0) return ''
    
    return data.map(row => {
        if (!_isArray(row)) throw new Error('Each row must be an array')
        return row.map(cell => _escapeCSV(cell)).join(delimiter)
    }).join('\n')
}

function jsonToCsv(data, delimiter = ',', headers = null) {
    if (!_isArray(data)) throw new Error('Data must be an array')
    if (data.length === 0) return ''
    
    const h = headers || Object.keys(data[0])
    const rows = [h]
    
    for (const item of data) {
        const row = h.map(key => {
            const value = item[key]
            return value === null || value === undefined ? '' : value
        })
        rows.push(row)
    }
    
    return arrayToCsv(rows, delimiter)
}

function csvToJson(csv, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    return csvToArray(csv, delimiter, true)
}

function csvToTable(csv, delimiter = ',', hasHeader = true) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, hasHeader)
    if (!_isArray(data) || data.length === 0) return ''
    
    let html = '<table>\n'
    
    if (hasHeader) {
        html += '  <thead>\n    <tr>\n'
        const header = data[0]
        for (const key of Object.keys(header)) {
            html += '      <th>' + key + '</th>\n'
        }
        html += '    </tr>\n  </thead>\n  <tbody>\n'
        
        for (let i = 0; i < data.length; i++) {
            const row = data[i]
            html += '    <tr>\n'
            for (const key of Object.keys(row)) {
                html += '      <td>' + (row[key] || '') + '</td>\n'
            }
            html += '    </tr>\n'
        }
        html += '  </tbody>\n'
    } else {
        for (const row of data) {
            html += '  <tr>\n'
            for (const cell of row) {
                html += '    <td>' + cell + '</td>\n'
            }
            html += '  </tr>\n'
        }
    }
    
    html += '</table>'
    return html
}

function tableToCsv(tableHtml, delimiter = ',') {
    if (!_isString(tableHtml)) throw new Error('Table HTML must be a string')
    const parser = new DOMParser()
    const doc = parser.parseFromString(tableHtml, 'text/html')
    const rows = doc.querySelectorAll('tr')
    
    if (rows.length === 0) throw new Error('No rows found in table')
    
    const data = []
    for (const row of rows) {
        const cells = row.querySelectorAll('td, th')
        const rowData = []
        for (const cell of cells) {
            rowData.push(cell.textContent.trim())
        }
        data.push(rowData)
    }
    
    return arrayToCsv(data, delimiter)
}

function validateCsv(csv, delimiter = ',') {
    if (!_isString(csv)) return { valid: false, error: 'CSV must be a string' }
    try {
        const data = csvToArray(csv, delimiter, false)
        if (!_isArray(data) || data.length === 0) {
            return { valid: false, error: 'Empty CSV data' }
        }
        const cols = data[0].length
        for (let i = 0; i < data.length; i++) {
            if (data[i].length !== cols) {
                return { 
                    valid: false, 
                    error: 'Row ' + (i + 1) + ' has ' + data[i].length + ' columns, expected ' + cols
                }
            }
        }
        return { valid: true }
    } catch (error) {
        return { valid: false, error: error.message }
    }
}

function getColumnNames(csv, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data) || data.length === 0) return []
    return Object.keys(data[0])
}

function getRowCount(csv, delimiter = ',', hasHeader = true) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, hasHeader)
    if (!_isArray(data)) return 0
    return data.length
}

function getColumnCount(csv, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, false)
    if (!_isArray(data) || data.length === 0) return 0
    return data[0].length
}

function addColumn(csv, columnName, defaultValue = '', delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data) || data.length === 0) return csv
    
    for (const row of data) {
        row[columnName] = defaultValue
    }
    
    return jsonToCsv(data, delimiter)
}

function removeColumn(csv, columnName, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data) || data.length === 0) return csv
    
    for (const row of data) {
        delete row[columnName]
    }
    
    const headers = Object.keys(data[0])
    const result = data.map(row => {
        const newRow = {}
        for (const key of headers) {
            newRow[key] = row[key]
        }
        return newRow
    })
    
    return jsonToCsv(result, delimiter)
}

function renameColumn(csv, oldName, newName, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data) || data.length === 0) return csv
    
    for (const row of data) {
        if (oldName in row) {
            row[newName] = row[oldName]
            delete row[oldName]
        }
    }
    
    return jsonToCsv(data, delimiter)
}

function filterRows(csv, predicate, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data) || data.length === 0) return csv
    
    const filtered = data.filter(predicate)
    return jsonToCsv(filtered, delimiter)
}

function sortRows(csv, column, ascending = true, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data) || data.length === 0) return csv
    
    const sorted = [...data].sort((a, b) => {
        const valA = a[column] || ''
        const valB = b[column] || ''
        if (ascending) return valA > valB ? 1 : -1
        return valA < valB ? 1 : -1
    })
    
    return jsonToCsv(sorted, delimiter)
}
function getColumn(csv, column, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data) || data.length === 0) return []
    
    return data.map(row => row[column])
}

function getUniqueValues(csv, column, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const values = getColumn(csv, column, delimiter)
    return [...new Set(values)]
}

function getColumnStats(csv, column, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const values = getColumn(csv, column, delimiter)
    if (values.length === 0) return null
    
    const nums = values.map(v => parseFloat(v)).filter(v => !isNaN(v))
    if (nums.length === 0) {
        return {
            min: null,
            max: null,
            sum: null,
            avg: null,
            count: values.length
        }
    }
    
    const sum = nums.reduce((a, b) => a + b, 0)
    const avg = sum / nums.length
    const min = Math.min(...nums)
    const max = Math.max(...nums)
    
    return { min, max, sum, avg, count: nums.length }
}

function csvToMarkdown(csv, delimiter = ',') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data) || data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    let result = '| ' + headers.join(' | ') + ' |\n'
    result += '|' + headers.map(function() { return ' --- ' }).join('|') + '|\n'
    
    for (const row of data) {
        result += '| ' + headers.map(function(h) { return row[h] || '' }).join(' | ') + ' |\n'
    }
    
    return result
}

function csvToHtml(csv, delimiter = ',') {
    return csvToTable(csv, delimiter)
}

function htmlToCsv(html, delimiter = ',') {
    return tableToCsv(html, delimiter)
}

function csvToDsv(csv, delimiter = ',', newDelimiter = ';') {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const data = csvToArray(csv, delimiter, false)
    if (!_isArray(data)) return ''
    return arrayToCsv(data, newDelimiter)
}

function dsvToCsv(dsv, delimiter = ';', newDelimiter = ',') {
    return csvToDsv(dsv, delimiter, newDelimiter)
}

function downloadCsv(csv, filename) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    filename = filename || 'data.csv'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
}

function uploadCsv(callback) {
    if (typeof callback !== 'function') throw new Error('Callback must be a function')
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = function(event) {
        const file = event.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = function(e) {
            callback(e.target.result)
        }
        reader.readAsText(file)
    }
    input.click()
}

function readCsvFile(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        reader.onload = function(e) { resolve(e.target.result) }
        reader.onerror = function(e) { reject(e) }
        reader.readAsText(file)
    })
}
function parseCsvWithOptions(csv, options) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    options = options || {}
    const delimiter = options.delimiter || ','
    const hasHeader = options.hasHeader !== undefined ? options.hasHeader : true
    const trim = options.trim !== undefined ? options.trim : true
    const quoteChar = options.quoteChar || '"'
    const escapeChar = options.escapeChar || '"'
    
    const lines = csv.split(/\r?\n/).filter(function(line) { return line.trim() !== '' })
    if (lines.length === 0) return { data: [], headers: [] }
    
    const parsedLines = []
    
    for (const line of lines) {
        const parsed = []
        let current = ''
        let inQuotes = false
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j]
            if (inQuotes) {
                if (char === quoteChar && j + 1 < line.length && line[j + 1] === escapeChar) {
                    current += quoteChar
                    j++
                } else if (char === quoteChar) {
                    inQuotes = false
                } else {
                    current += char
                }
            } else {
                if (char === quoteChar) {
                    inQuotes = true
                } else if (char === delimiter) {
                    parsed.push(trim ? current.trim() : current)
                    current = ''
                } else {
                    current += char
                }
            }
        }
        parsed.push(trim ? current.trim() : current)
        parsedLines.push(parsed)
    }
    
    let headers = []
    let data = []
    
    if (hasHeader && parsedLines.length > 0) {
        headers = parsedLines[0]
        for (let i = 1; i < parsedLines.length; i++) {
            const row = {}
            for (let j = 0; j < headers.length; j++) {
                row[headers[j]] = parsedLines[i][j] || ''
            }
            data.push(row)
        }
    } else {
        data = parsedLines
    }
    
    return { data: data, headers: headers }
}

function* csvGenerator(csv, delimiter, chunkSize) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    delimiter = delimiter || ','
    chunkSize = chunkSize || 1000
    const data = csvToArray(csv, delimiter, true)
    if (!_isArray(data)) return
    
    for (let i = 0; i < data.length; i += chunkSize) {
        yield data.slice(i, i + chunkSize)
    }
}

function processCsvStream(csv, processor, delimiter, chunkSize) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    if (typeof processor !== 'function') throw new Error('Processor must be a function')
    delimiter = delimiter || ','
    chunkSize = chunkSize || 1000
    const generator = csvGenerator(csv, delimiter, chunkSize)
    const results = []
    
    for (const chunk of generator) {
        const processed = processor(chunk)
        if (processed !== undefined) {
            results.push(processed)
        }
    }
    
    return results
}

// ==================== DIAGNOSTICS ====================

function detectDelimiter(csv) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const line = csv.split('\n')[0]
    const delimiters = [',', ';', '\t', '|']
    let best = ','
    let maxCount = 0
    
    for (const d of delimiters) {
        const regex = new RegExp(d, 'g')
        const matches = line.match(regex)
        const count = matches ? matches.length : 0
        if (count > maxCount) {
            maxCount = count
            best = d
        }
    }
    
    return best
}

function getCSVInfo(csv) {
    if (!_isString(csv)) throw new Error('CSV must be a string')
    const delimiter = detectDelimiter(csv)
    const rows = csv.split(/\r?\n/).filter(function(line) { return line.trim() !== '' })
    const headers = rows.length > 0 ? rows[0].split(delimiter) : []
    
    return {
        delimiter: delimiter,
        rowCount: rows.length,
        columnCount: headers.length,
        hasHeader: true,
        fileSize: csv.length,
        headers: headers
    }
}

// ==================== EXPORT ====================
var CSV = {
    csvToArray: csvToArray,
    arrayToCsv: arrayToCsv,
    jsonToCsv: jsonToCsv,
    csvToJson: csvToJson,
    csvToTable: csvToTable,
    tableToCsv: tableToCsv,
    validateCsv: validateCsv,
    getColumnNames: getColumnNames,
    getRowCount: getRowCount,
    getColumnCount: getColumnCount,
    addColumn: addColumn,
    removeColumn: removeColumn,
    renameColumn: renameColumn,
    filterRows: filterRows,
    sortRows: sortRows,
    getColumn: getColumn,
    getUniqueValues: getUniqueValues,
    getColumnStats: getColumnStats,
    csvToMarkdown: csvToMarkdown,
    csvToHtml: csvToHtml,
    htmlToCsv: htmlToCsv,
    csvToDsv: csvToDsv,
    dsvToCsv: dsvToCsv,
    downloadCsv: downloadCsv,
    uploadCsv: uploadCsv,
    readCsvFile: readCsvFile,
    parseCsvWithOptions: parseCsvWithOptions,
    csvGenerator: csvGenerator,
    processCsvStream: processCsvStream,
    detectDelimiter: detectDelimiter,
    getCSVInfo: getCSVInfo
}

// برای استفاده در مرورگر
if (typeof window !== 'undefined') {
    window.CSV = CSV
}
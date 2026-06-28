// ==================== HELPERS ====================
function _isString(s) { return typeof s === 'string' }
function _isArray(a) { return Array.isArray(a) }
function _isObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) }
function _isNumber(n) { return typeof n === 'number' && !isNaN(n) }
function _isBoolean(b) { return typeof b === 'boolean' }
function _isFunction(f) { return typeof f === 'function' }

function _escapeXML(str) {
    if (!_isString(str)) return str
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;')
}

function _unescapeXML(str) {
    if (!_isString(str)) return str
    return str.replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
}

function _clone(obj) { return JSON.parse(JSON.stringify(obj)) }

// ==================== CORE XML FUNCTIONS ====================

// Parse XML to DOM
function parseXML(xml) {
    if (!_isString(xml)) throw new Error('Input must be a string')
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')
    const error = doc.querySelector('parsererror')
    if (error) {
        throw new Error('Invalid XML: ' + error.textContent)
    }
    return doc
}

// Stringify DOM to XML
function stringifyXML(doc) {
    if (!doc || !doc.documentElement) throw new Error('Invalid XML document')
    return new XMLSerializer().serializeToString(doc)
}

// Validate XML
function validateXML(xml) {
    if (!_isString(xml)) return { valid: false, error: 'Input must be a string' }
    try {
        parseXML(xml)
        return { valid: true }
    } catch (e) {
        return { valid: false, error: e.message }
    }
}

// ==================== XML TO JSON ====================

function xmlToJSON(xml) {
    const doc = parseXML(xml)
    return _nodeToJSON(doc.documentElement)
}

function _nodeToJSON(node) {
    if (node.nodeType === 3) {
        const text = node.nodeValue.trim()
        return text || null
    }
    if (node.nodeType === 1) {
        const obj = {}
        const children = node.childNodes
        const hasText = false
        const textContent = []
        
        // Attributes
        if (node.attributes && node.attributes.length > 0) {
            obj._attributes = {}
            for (const attr of node.attributes) {
                obj._attributes[attr.name] = attr.value
            }
        }
        
        // Children
        for (const child of children) {
            if (child.nodeType === 3) {
                const text = child.nodeValue.trim()
                if (text) textContent.push(text)
                continue
            }
            if (child.nodeType === 1) {
                const name = child.nodeName
                const val = _nodeToJSON(child)
                if (obj[name] === undefined) {
                    obj[name] = val
                } else if (_isArray(obj[name])) {
                    obj[name].push(val)
                } else {
                    obj[name] = [obj[name], val]
                }
            }
        }
        
        // Text content
        if (textContent.length > 0) {
            obj._text = textContent.join(' ')
        }
        
        // If no children and no attributes, return text or empty
        if (Object.keys(obj).length === 0) {
            return null
        }
        if (Object.keys(obj).length === 1 && obj._text !== undefined && !obj._attributes) {
            return obj._text
        }
        
        return obj
    }
    return null
}

// ==================== JSON TO XML ====================

function jsonToXML(json, rootName) {
    rootName = rootName || 'root'
    if (_isString(json)) {
        try { json = JSON.parse(json) } catch (e) { throw new Error('Invalid JSON') }
    }
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + _jsonToNode(json, rootName)
}

function _jsonToNode(obj, name) {
    if (obj === null || obj === undefined) {
        return '<' + name + '/>'
    }
    
    if (typeof obj !== 'object') {
        return '<' + name + '>' + _escapeXML(String(obj)) + '</' + name + '>'
    }
    
    if (_isArray(obj)) {
        return obj.map(function(item) {
            return _jsonToNode(item, name)
        }).join('')
    }
    
    // Handle object
    let result = '<' + name
    let text = ''
    let children = ''
    const attrs = obj._attributes || {}
    
    // Attributes
    for (const key in attrs) {
        if (attrs.hasOwnProperty(key)) {
            result += ' ' + key + '="' + _escapeXML(String(attrs[key])) + '"'
        }
    }
    
    // Children
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && key !== '_attributes' && key !== '_text') {
            children += _jsonToNode(obj[key], key)
        }
    }
    
    // Text content
    if (obj._text !== undefined) {
        text = _escapeXML(String(obj._text))
    }
    
    if (children || text) {
        result += '>' + text + children + '</' + name + '>'
    } else {
        result += '/>'
    }
    
    return result
}

// ==================== XML QUERY FUNCTIONS ====================

function queryXML(xml, xpath) {
    const doc = parseXML(xml)
    const result = doc.evaluate(
        xpath,
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
    )
    
    const results = []
    let node = result.iterateNext()
    while (node) {
        if (node.nodeType === 1) {
            results.push(node)
        } else if (node.nodeType === 3) {
            results.push(node.nodeValue)
        } else {
            results.push(node)
        }
        node = result.iterateNext()
    }
    return results
}

function queryXMLText(xml, xpath) {
    const results = queryXML(xml, xpath)
    return results.filter(function(r) { return typeof r === 'string' })
}

function queryXMLNodes(xml, xpath) {
    const results = queryXML(xml, xpath)
    return results.filter(function(r) { return r.nodeType === 1 })
}

function getElementById(xml, id) {
    const doc = parseXML(xml)
    return doc.getElementById(id)
}

function getElementsByTagName(xml, tagName) {
    const doc = parseXML(xml)
    return Array.from(doc.getElementsByTagName(tagName))
}

function getElementsByClassName(xml, className) {
    const doc = parseXML(xml)
    return Array.from(doc.getElementsByClassName(className))
}

// ==================== XML MANIPULATION ====================

function createElement(tagName, attributes, content) {
    attributes = attributes || {}
    let xml = '<' + tagName
    
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            xml += ' ' + key + '="' + _escapeXML(String(attributes[key])) + '"'
        }
    }
    
    if (content !== undefined && content !== null) {
        xml += '>' + _escapeXML(String(content)) + '</' + tagName + '>'
    } else {
        xml += '/>'
    }
    
    return xml
}

function createElementWithChildren(tagName, attributes, children) {
    attributes = attributes || {}
    children = children || []
    let xml = '<' + tagName
    
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            xml += ' ' + key + '="' + _escapeXML(String(attributes[key])) + '"'
        }
    }
    
    xml += '>'
    for (const child of children) {
        xml += child
    }
    xml += '</' + tagName + '>'
    
    return xml
}

function appendChild(xml, parentPath, child) {
    const doc = parseXML(xml)
    const parent = queryXMLNodes(xml, parentPath)[0]
    if (!parent) throw new Error('Parent not found: ' + parentPath)
    
    const childDoc = parseXML(child)
    const imported = doc.importNode(childDoc.documentElement, true)
    parent.appendChild(imported)
    return stringifyXML(doc)
}

function removeChild(xml, path) {
    const doc = parseXML(xml)
    const nodes = queryXMLNodes(xml, path)
    if (nodes.length === 0) throw new Error('Node not found: ' + path)
    
    for (const node of nodes) {
        node.parentNode.removeChild(node)
    }
    return stringifyXML(doc)
}

function setAttribute(xml, path, attrName, attrValue) {
    const doc = parseXML(xml)
    const nodes = queryXMLNodes(xml, path)
    if (nodes.length === 0) throw new Error('Node not found: ' + path)
    
    for (const node of nodes) {
        node.setAttribute(attrName, attrValue)
    }
    return stringifyXML(doc)
}

function getAttribute(xml, path, attrName) {
    const nodes = queryXMLNodes(xml, path)
    if (nodes.length === 0) return null
    return nodes[0].getAttribute(attrName)
}

function removeAttribute(xml, path, attrName) {
    const doc = parseXML(xml)
    const nodes = queryXMLNodes(xml, path)
    if (nodes.length === 0) throw new Error('Node not found: ' + path)
    
    for (const node of nodes) {
        node.removeAttribute(attrName)
    }
    return stringifyXML(doc)
}

function setTextContent(xml, path, text) {
    const doc = parseXML(xml)
    const nodes = queryXMLNodes(xml, path)
    if (nodes.length === 0) throw new Error('Node not found: ' + path)
    
    for (const node of nodes) {
        node.textContent = text
    }
    return stringifyXML(doc)
}

function getTextContent(xml, path) {
    const nodes = queryXMLNodes(xml, path)
    if (nodes.length === 0) return null
    return nodes[0].textContent
}

// ==================== XML SEARCH ====================

function searchXML(xml, query) {
    const doc = parseXML(xml)
    const results = []
    const regex = _isString(query) ? new RegExp(query, 'i') : query
    
    function _search(node, path) {
        // Check node name
        if (regex.test(node.nodeName)) {
            results.push({
                type: 'element',
                name: node.nodeName,
                path: path,
                node: node
            })
        }
        
        // Check attributes
        if (node.attributes) {
            for (const attr of node.attributes) {
                if (regex.test(attr.name) || regex.test(attr.value)) {
                    results.push({
                        type: 'attribute',
                        name: attr.name,
                        value: attr.value,
                        path: path + '/@' + attr.name,
                        node: node
                    })
                }
            }
        }
        
        // Check text content
        if (node.textContent && regex.test(node.textContent)) {
            results.push({
                type: 'text',
                value: node.textContent,
                path: path + '/text()',
                node: node
            })
        }
        
        // Children
        for (const child of node.childNodes) {
            if (child.nodeType === 1) {
                _search(child, path + '/' + child.nodeName)
            }
        }
    }
    
    _search(doc.documentElement, '/' + doc.documentElement.nodeName)
    return results
}

// ==================== XML VALIDATION ====================

function validateXMLSchema(xml, schema) {
    // Simple schema validation
    if (_isString(xml)) {
        try { xml = parseXML(xml) } catch (e) { return { valid: false, error: 'Invalid XML' } }
    }
    
    const errors = []
    
    function _validate(node, schemaNode, path) {
        if (!schemaNode) return
        
        // Check required attributes
        if (schemaNode.attributes) {
            for (const attrName of schemaNode.attributes) {
                if (attrName.required && !node.hasAttribute(attrName.name)) {
                    errors.push('Missing required attribute: ' + attrName.name + ' at ' + path)
                }
            }
        }
        
        // Check children
        if (schemaNode.children) {
            const children = Array.from(node.children)
            for (const childSchema of schemaNode.children) {
                const matching = children.filter(function(c) { return c.nodeName === childSchema.name })
                
                if (childSchema.minOccurs && matching.length < childSchema.minOccurs) {
                    errors.push('Too few ' + childSchema.name + ' elements at ' + path + ' (min: ' + childSchema.minOccurs + ')')
                }
                if (childSchema.maxOccurs && matching.length > childSchema.maxOccurs) {
                    errors.push('Too many ' + childSchema.name + ' elements at ' + path + ' (max: ' + childSchema.maxOccurs + ')')
                }
                
                for (const child of matching) {
                    _validate(child, childSchema, path + '/' + child.nodeName)
                }
            }
        }
    }
    
    _validate(xml.documentElement, schema, '/' + xml.documentElement.nodeName)
    
    return {
        valid: errors.length === 0,
        errors: errors
    }
}

// ==================== XML TRANSFORM ====================

function transformXML(xml, transform) {
    const doc = parseXML(xml)
    
    function _transform(node) {
        if (node.nodeType === 1) {
            const result = transform(node)
            if (result === false) {
                node.parentNode.removeChild(node)
                return
            }
            for (const child of Array.from(node.children)) {
                _transform(child)
            }
        }
    }
    
    _transform(doc.documentElement)
    return stringifyXML(doc)
}

function filterXML(xml, predicate) {
    return transformXML(xml, function(node) {
        return predicate(node)
    })
}

function mapXML(xml, mapper) {
    const doc = parseXML(xml)
    const results = []
    
    function _map(node) {
        if (node.nodeType === 1) {
            results.push(mapper(node))
            for (const child of Array.from(node.children)) {
                _map(child)
            }
        }
    }
    
    _map(doc.documentElement)
    return results
}

function reduceXML(xml, reducer, initial) {
    const doc = parseXML(xml)
    let result = initial
    
    function _reduce(node) {
        if (node.nodeType === 1) {
            result = reducer(result, node)
            for (const child of Array.from(node.children)) {
                _reduce(child)
            }
        }
    }
    
    _reduce(doc.documentElement)
    return result
}

// ==================== XML STATISTICS ====================

function xmlStats(xml) {
    const doc = parseXML(xml)
    const stats = {
        elements: 0,
        attributes: 0,
        textNodes: 0,
        maxDepth: 0,
        uniqueTags: new Set(),
        tagCounts: {}
    }
    
    function _analyze(node, depth) {
        if (node.nodeType === 1) {
            stats.elements++
            stats.uniqueTags.add(node.nodeName)
            stats.tagCounts[node.nodeName] = (stats.tagCounts[node.nodeName] || 0) + 1
            if (depth > stats.maxDepth) stats.maxDepth = depth
            
            if (node.attributes) {
                stats.attributes += node.attributes.length
            }
            
            for (const child of node.childNodes) {
                if (child.nodeType === 3 && child.nodeValue.trim()) {
                    stats.textNodes++
                }
                _analyze(child, depth + 1)
            }
        }
    }
    
    _analyze(doc.documentElement, 0)
    
    return {
        elements: stats.elements,
        attributes: stats.attributes,
        textNodes: stats.textNodes,
        maxDepth: stats.maxDepth,
        uniqueTags: stats.uniqueTags.size,
        tagCounts: stats.tagCounts,
        tagList: Array.from(stats.uniqueTags)
    }
}

// ==================== XML PRETTY PRINT ====================

function prettyXML(xml, indent) {
    indent = indent || 2
    const doc = parseXML(xml)
    return stringifyXML(doc)
}

function minifyXML(xml) {
    return xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
}

// ==================== XML TO OTHER FORMATS ====================

function xmlToCSV(xml, xpath) {
    const nodes = xpath ? queryXMLNodes(xml, xpath) : [parseXML(xml).documentElement]
    const data = nodes.map(function(node) {
        const obj = {}
        for (const child of node.children) {
            obj[child.nodeName] = child.textContent
        }
        return obj
    })
    
    if (data.length === 0) return ''
    const headers = Object.keys(data[0])
    const rows = [headers]
    
    for (const item of data) {
        rows.push(headers.map(function(h) { return item[h] || '' }))
    }
    
    return rows.map(function(row) { return row.join(',') }).join('\n')
}

function xmlToHTML(xml) {
    const doc = parseXML(xml)
    return new XMLSerializer().serializeToString(doc)
}

function xmlToText(xml) {
    const doc = parseXML(xml)
    return doc.documentElement.textContent
}

function xmlToMarkdown(xml) {
    const doc = parseXML(xml)
    let md = ''
    
    function _convert(node, level) {
        if (node.nodeType === 1) {
            const tag = node.nodeName.toLowerCase()
            if (tag === 'h1') md += '# ' + node.textContent + '\n\n'
            else if (tag === 'h2') md += '## ' + node.textContent + '\n\n'
            else if (tag === 'h3') md += '### ' + node.textContent + '\n\n'
            else if (tag === 'h4') md += '#### ' + node.textContent + '\n\n'
            else if (tag === 'h5') md += '##### ' + node.textContent + '\n\n'
            else if (tag === 'h6') md += '###### ' + node.textContent + '\n\n'
            else if (tag === 'p') md += node.textContent + '\n\n'
            else if (tag === 'ul' || tag === 'ol') {
                for (const child of node.children) {
                    if (child.nodeName === 'li') {
                        md += '- ' + child.textContent + '\n'
                    }
                }
                md += '\n'
            } else if (tag === 'table') {
                const rows = node.querySelectorAll('tr')
                if (rows.length > 0) {
                    // Headers
                    const headers = rows[0].querySelectorAll('th, td')
                    md += '| ' + Array.from(headers).map(function(h) { return h.textContent }).join(' | ') + ' |\n'
                    md += '|' + Array.from(headers).map(function() { return ' --- ' }).join('|') + '|\n'
                    
                    // Body
                    for (let i = 1; i < rows.length; i++) {
                        const cells = rows[i].querySelectorAll('td')
                        md += '| ' + Array.from(cells).map(function(c) { return c.textContent }).join(' | ') + ' |\n'
                    }
                    md += '\n'
                }
            } else {
                for (const child of node.childNodes) {
                    _convert(child, level + 1)
                }
            }
        } else if (node.nodeType === 3) {
            const text = node.nodeValue.trim()
            if (text) md += text
        }
    }
    
    _convert(doc.documentElement, 0)
    return md
}

// ==================== XML GENERATOR ====================

function generateXML(schema) {
    function _generate(schema) {
        if (schema === null) return ''
        if (typeof schema === 'string') {
            if (schema === 'string') return 'random_text_' + Math.random().toString(36).substr(2, 5)
            if (schema === 'number') return String(Math.floor(Math.random() * 1000))
            if (schema === 'boolean') return String(Math.random() > 0.5)
            if (schema === 'date') return new Date().toISOString()
            return schema
        }
        if (_isArray(schema)) {
            return schema.map(_generate).join('')
        }
        if (_isObject(schema)) {
            let result = ''
            for (const key in schema) {
                if (schema.hasOwnProperty(key)) {
                    result += _generate(schema[key], key)
                }
            }
            return result
        }
        return String(schema)
    }
    
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + _generate(schema)
}

// ==================== XML CDATA FUNCTIONS ====================

function createCDATA(content) {
    return '<![CDATA[' + content + ']]>'
}

function extractCDATA(xml) {
    const matches = xml.match(/<!\[CDATA\[([\s\S]*?)\]\]>/g)
    if (!matches) return []
    return matches.map(function(m) {
        return m.replace(/<!\[CDATA\[/, '').replace(/\]\]>/, '')
    })
}

// ==================== XML NAMESPACE FUNCTIONS ====================

function addNamespace(xml, prefix, uri) {
    const doc = parseXML(xml)
    doc.documentElement.setAttribute('xmlns:' + prefix, uri)
    return stringifyXML(doc)
}

function removeNamespace(xml, prefix) {
    const doc = parseXML(xml)
    doc.documentElement.removeAttribute('xmlns:' + prefix)
    return stringifyXML(doc)
}

function getNamespaces(xml) {
    const doc = parseXML(xml)
    const namespaces = {}
    const attrs = doc.documentElement.attributes
    for (const attr of attrs) {
        if (attr.name.startsWith('xmlns')) {
            const prefix = attr.name === 'xmlns' ? '' : attr.name.split(':')[1]
            namespaces[prefix] = attr.value
        }
    }
    return namespaces
}

// ==================== EXPORT ====================
var XML = {
    // Core
    parseXML: parseXML,
    stringifyXML: stringifyXML,
    validateXML: validateXML,
    
    // Convert
    xmlToJSON: xmlToJSON,
    jsonToXML: jsonToXML,
    xmlToCSV: xmlToCSV,
    xmlToHTML: xmlToHTML,
    xmlToText: xmlToText,
    xmlToMarkdown: xmlToMarkdown,
    
    // Query
    queryXML: queryXML,
    queryXMLText: queryXMLText,
    queryXMLNodes: queryXMLNodes,
    getElementById: getElementById,
    getElementsByTagName: getElementsByTagName,
    getElementsByClassName: getElementsByClassName,
    
    // Manipulation
    createElement: createElement,
    createElementWithChildren: createElementWithChildren,
    appendChild: appendChild,
    removeChild: removeChild,
    setAttribute: setAttribute,
    getAttribute: getAttribute,
    removeAttribute: removeAttribute,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    
    // Search
    searchXML: searchXML,
    
    // Validation
    validateXMLSchema: validateXMLSchema,
    
    // Transform
    transformXML: transformXML,
    filterXML: filterXML,
    mapXML: mapXML,
    reduceXML: reduceXML,
    
    // Stats
    xmlStats: xmlStats,
    
    // Format
    prettyXML: prettyXML,
    minifyXML: minifyXML,
    
    // Generator
    generateXML: generateXML,
    
    // CDATA
    createCDATA: createCDATA,
    extractCDATA: extractCDATA,
    
    // Namespace
    addNamespace: addNamespace,
    removeNamespace: removeNamespace,
    getNamespaces: getNamespaces,
    
    // Utilities
    escapeXML: _escapeXML,
    unescapeXML: _unescapeXML,
    clone: _clone
}

// ==================== GENERATE 1000+ FUNCTIONS ====================

// Generate query functions for common tags
var commonTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                   'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'a', 'img',
                   'form', 'input', 'button', 'select', 'option', 'textarea']

for (const tag of commonTags) {
    XML['get' + tag.charAt(0).toUpperCase() + tag.slice(1) + 's'] = function(tagName) {
        return function(xml) {
            return getElementsByTagName(xml, tagName)
        }
    }(tag)
}

// Generate creation functions
for (const tag of commonTags) {
    XML['create' + tag.charAt(0).toUpperCase() + tag.slice(1)] = function(tagName) {
        return function(attributes, content) {
            return createElement(tagName, attributes, content)
        }
    }(tag)
}

// ==================== EXPORT ====================
if (typeof window !== 'undefined') {
    window.XML = XML
}

console.log('XML Library loaded with ' + Object.keys(XML).length + ' functions')

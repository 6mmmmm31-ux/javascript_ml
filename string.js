var space = ' '
var empty = ''
var newline = '\n'
var tab = '\t'
function len(a) { let b = 0; while (a[b] !== undefined) b = add(b, 1); return b }
function char_at(a, b) { return a[b] || '' }
function concat(a, b) { return a + b }
function to_upper(a) { let b = ''; for (let c = 0; c < len(a); c++) { let d = a[c]; let e = d.charCodeAt(0); if (e >= 97 && e <= 122) { e = e - 32 } b = b + String.fromCharCode(e) } return b }
function to_lower(a) { let b = ''; for (let c = 0; c < len(a); c++) { let d = a[c]; let e = d.charCodeAt(0); if (e >= 65 && e <= 90) { e = e + 32 } b = b + String.fromCharCode(e) } return b }
function trim(a) { let b = 0, c = len(a) - 1; while (a[b] === ' ' || a[b] === '\n' || a[b] === '\t') b = add(b, 1); while (a[c] === ' ' || a[c] === '\n' || a[c] === '\t') c = sub(c, 1); let d = ''; for (let e = b; e <= c; e++) d = d + a[e]; return d }
function trim_start(a) { let b = 0; while (a[b] === ' ' || a[b] === '\n' || a[b] === '\t') b = add(b, 1); let c = ''; for (let d = b; d < len(a); d++) c = c + a[d]; return c }
function trim_end(a) { let b = len(a) - 1; while (a[b] === ' ' || a[b] === '\n' || a[b] === '\t') b = sub(b, 1); let c = ''; for (let d = 0; d <= b; d++) c = c + a[d]; return c }
function substring(a, b, c) { let d = ''; let e = c || len(a); for (let f = b; f < e; f++) d = d + a[f]; return d }
function split(a, b) { let c = [], d = ''; for (let e = 0; e < len(a); e++) { if (a[e] === b) { c.push(d); d = '' } else { d = d + a[e] } } c.push(d); return c }
function join(a, b) { let c = ''; for (let d = 0; d < len(a); d++) { c = c + a[d]; if (d < len(a) - 1) c = c + b } return c }
function replace(a, b, c) { let d = ''; for (let e = 0; e < len(a); e++) { if (a[e] === b) { d = d + c } else { d = d + a[e] } } return d }
function replace_all(a, b, c) { let d = ''; for (let e = 0; e < len(a); e++) { if (a[e] === b) { d = d + c } else { d = d + a[e] } } return d }
function index_of(a, b) { for (let c = 0; c < len(a); c++) { if (a[c] === b) return c } return -1 }
function last_index_of(a, b) { for (let c = len(a) - 1; c >= 0; c--) { if (a[c] === b) return c } return -1 }
function includes(a, b) { for (let c = 0; c < len(a); c++) { if (a[c] === b) return true } return false }
function starts_with(a, b) { for (let c = 0; c < len(b); c++) { if (a[c] !== b[c]) return false } return true }
function ends_with(a, b) { let c = len(b); for (let d = 0; d < c; d++) { if (a[len(a) - c + d] !== b[d]) return false } return true }
function repeat(a, b) { let c = ''; for (let d = 0; d < b; d++) c = c + a; return c }
function pad_start(a, b, c) { let d = ''; let e = b - len(a); for (let f = 0; f < e; f++) d = d + c; return d + a }
function pad_end(a, b, c) { let d = ''; let e = b - len(a); for (let f = 0; f < e; f++) d = d + c; return a + d }
function char_code(a, b) { return a.charCodeAt(b) }
function from_char_code(a) { return String.fromCharCode(a) }
function reverse(a) { let b = ''; for (let c = len(a) - 1; c >= 0; c--) b = b + a[c]; return b }
function count_char(a, b) { let c = 0; for (let d = 0; d < len(a); d++) { if (a[d] === b) c = add(c, 1) } return c }
function count_word(a) { let b = trim(a); let c = 0; for (let d = 0; d < len(b); d++) { if (b[d] === ' ' && b[d + 1] !== ' ') c = add(c, 1) } return add(c, 1) }
function is_empty(a) { return len(a) === 0 }
function is_whitespace(a) { for (let b = 0; b < len(a); b++) { if (a[b] !== ' ' && a[b] !== '\n' && a[b] !== '\t') return false } return true }
function first(a) { return a[0] || '' }
function last(a) { return a[len(a) - 1] || '' }
function take(a, b) { let c = ''; for (let d = 0; d < b; d++) c = c + a[d]; return c }
function drop(a, b) { let c = ''; for (let d = b; d < len(a); d++) c = c + a[d]; return c }
function slice(a, b, c) { let d = ''; let e = c || len(a); for (let f = b; f < e; f++) d = d + a[f]; return d }
function to_array(a) { let b = []; for (let c = 0; c < len(a); c++) b.push(a[c]); return b }
function from_array(a) { let b = ''; for (let c = 0; c < len(a); c++) b = b + a[c]; return b }
function compare(a, b) { if (a === b) return 0; return a > b ? 1 : -1 }
function equal(a, b) { return a === b }
function random_char() { let a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; return a[random_int(0, len(a) - 1)] }
function random_string(a) { let b = ''; for (let c = 0; c < a; c++) b = b + random_char(); return b }
function escape_html(a) { let b = ''; for (let c = 0; c < len(a); c++) { let d = a[c]; if (d === '<') b = b + '&lt;'; else if (d === '>') b = b + '&gt;'; else if (d === '&') b = b + '&amp;'; else if (d === '"') b = b + '&quot;'; else if (d === "'") b = b + '&#39;'; else b = b + d } return b }
function unescape_html(a) { let b = a; b = replace_all(b, '&lt;', '<'); b = replace_all(b, '&gt;', '>'); b = replace_all(b, '&amp;', '&'); b = replace_all(b, '&quot;', '"'); b = replace_all(b, '&#39;', "'"); return b }
function to_slug(a) { let b = to_lower(a); let c = ''; for (let d = 0; d < len(b); d++) { let e = b[d]; if (e >= 'a' && e <= 'z') c = c + e; else if (e >= '0' && e <= '9') c = c + e; else if (e === ' ') c = c + '-'; else c = c + '' } return c }
function to_camel(a) { let b = to_lower(a); let c = ''; let d = false; for (let e = 0; e < len(b); e++) { if (b[e] === ' ') { d = true } else if (d) { c = c + to_upper(b[e]); d = false } else { c = c + b[e] } } return c }
function to_snake(a) { let b = to_lower(a); let c = ''; for (let d = 0; d < len(b); d++) { if (b[d] === ' ') c = c + '_'; else c = c + b[d] } return c }
function to_kebab(a) { let b = to_lower(a); let c = ''; for (let d = 0; d < len(b); d++) { if (b[d] === ' ') c = c + '-'; else c = c + b[d] } return c }
function mask(a, b = 4, c = '*') { let d = len(a); if (d <= b) return a; let e = ''; for (let f = 0; f < d - b; f++) e = e + c; return e + substring(a, d - b, d) }
function truncate(a, b) { if (len(a) <= b) return a; return substring(a, 0, b) + '...' }
function swap_case(a) { let b = ''; for (let c = 0; c < len(a); c++) { let d = a[c]; if (d === to_upper(d)) b = b + to_lower(d); else b = b + to_upper(d) } return b }
function count_lines(a) { let b = split(a, '\n'); return len(b) }
function extract_numbers(a) { let b = ''; for (let c = 0; c < len(a); c++) { if (a[c] >= '0' && a[c] <= '9') b = b + a[c] } return b }
function extract_letters(a) { let b = ''; for (let c = 0; c < len(a); c++) { if ((a[c] >= 'a' && a[c] <= 'z') || (a[c] >= 'A' && a[c] <= 'Z')) b = b + a[c] } return b }
function is_alpha(a) { for (let b = 0; b < len(a); b++) { let c = a[b]; if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) return false } return true }
function is_digit(a) { for (let b = 0; b < len(a); b++) { let c = a[b]; if (!(c >= '0' && c <= '9')) return false } return true }
function is_alphanumeric(a) { for (let b = 0; b < len(a); b++) { let c = a[b]; if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'))) return false } return true }
function is_lower(a) { for (let b = 0; b < len(a); b++) { let c = a[b]; if (c >= 'A' && c <= 'Z') return false } return true }
function is_upper(a) { for (let b = 0; b < len(a); b++) { let c = a[b]; if (c >= 'a' && c <= 'z') return false } return true }
function to_title(a) { let b = to_lower(a); let c = ''; let d = true; for (let e = 0; e < len(b); e++) { if (b[e] === ' ') { d = true; c = c + ' ' } else if (d) { c = c + to_upper(b[e]); d = false } else { c = c + b[e] } } return c }
function surround(a, b, c) { return b + a + c }
function quote(a) { return '"' + a + '"' }
function unquote(a) { if (starts_with(a, '"') && ends_with(a, '"')) return substring(a, 1, len(a) - 1); return a }
function center(a, b, c = ' ') { let d = b - len(a); let e = floor(div(d, 2)); let f = ''; for (let g = 0; g < e; g++) f = f + c; return f + a + f }

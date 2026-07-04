"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCardImportText = parseCardImportText;
var FRONT_KEYS = new Set(['front', 'prompt', 'question', 'term', 'q']);
var BACK_KEYS = new Set(['back', 'answer', 'definition', 'response', 'a']);
var DECK_KEYS = new Set(['deck', 'deckname', 'deck_name', 'category']);
function stripBom(value) {
    return value.replace(/^\uFEFF/, '');
}
function normalizeHeader(value) {
    return value.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '_');
}
function splitDelimitedLine(line, delimiter) {
    var cells = [];
    var current = '';
    var inQuotes = false;
    for (var index = 0; index < line.length; index += 1) {
        var character = line[index];
        var nextCharacter = line[index + 1];
        if (character === '"') {
            if (inQuotes && nextCharacter === '"') {
                current += '"';
                index += 1;
            }
            else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (character === delimiter && !inQuotes) {
            cells.push(current.trim());
            current = '';
            continue;
        }
        current += character;
    }
    cells.push(current.trim());
    return cells;
}
function detectDelimiter(text) {
    var _a, _b, _c, _d;
    var firstUsefulLine = (_a = text
        .split(/\r?\n/)
        .map(function (line) { return line.trim(); })
        .find(Boolean)) !== null && _a !== void 0 ? _a : '';
    var tabCount = ((_b = firstUsefulLine.match(/\t/g)) !== null && _b !== void 0 ? _b : []).length;
    var commaCount = ((_c = firstUsefulLine.match(/,/g)) !== null && _c !== void 0 ? _c : []).length;
    var pipeCount = ((_d = firstUsefulLine.match(/\|/g)) !== null && _d !== void 0 ? _d : []).length;
    if (tabCount >= commaCount && tabCount >= pipeCount && tabCount > 0) {
        return { delimiter: '\t', format: 'tsv' };
    }
    if (commaCount >= pipeCount && commaCount > 0) {
        return { delimiter: ',', format: 'csv' };
    }
    return { delimiter: '|', format: 'txt' };
}
function detectHeader(cells) {
    var normalized = cells.map(normalizeHeader);
    return normalized.some(function (cell) { return FRONT_KEYS.has(cell) || BACK_KEYS.has(cell); });
}
function getColumnIndexes(headerCells) {
    var normalized = headerCells.map(normalizeHeader);
    var frontIndex = normalized.findIndex(function (cell) { return FRONT_KEYS.has(cell); });
    var backIndex = normalized.findIndex(function (cell) { return BACK_KEYS.has(cell); });
    var deckIndex = normalized.findIndex(function (cell) { return DECK_KEYS.has(cell); });
    return {
        frontIndex: frontIndex >= 0 ? frontIndex : 0,
        backIndex: backIndex >= 0 ? backIndex : 1,
        deckIndex: deckIndex >= 0 ? deckIndex : undefined,
    };
}
function parseCardImportText(rawText) {
    var cleanedText = stripBom(rawText).trim();
    var warnings = [];
    if (!cleanedText) {
        return {
            cards: [],
            detectedFormat: 'txt',
            skippedRows: 0,
            warnings: ['No import text was provided.'],
        };
    }
    var _a = detectDelimiter(cleanedText), delimiter = _a.delimiter, format = _a.format;
    var rows = cleanedText
        .split(/\r?\n/)
        .map(function (line) { return line.trim(); })
        .filter(Boolean)
        .map(function (line) { return splitDelimitedLine(line, delimiter); });
    if (rows.length === 0) {
        return {
            cards: [],
            detectedFormat: format,
            skippedRows: 0,
            warnings: ['No card rows were found.'],
        };
    }
    var hasHeader = detectHeader(rows[0]);
    var _b = getColumnIndexes(hasHeader ? rows[0] : []), frontIndex = _b.frontIndex, backIndex = _b.backIndex, deckIndex = _b.deckIndex;
    var dataRows = hasHeader ? rows.slice(1) : rows;
    var skippedRows = 0;
    var cards = dataRows.reduce(function (nextCards, row) {
        var _a, _b, _c, _d, _e;
        var front = (_b = (_a = row[frontIndex]) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
        var back = (_d = (_c = row[backIndex]) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
        var deckName = deckIndex === undefined ? undefined : (_e = row[deckIndex]) === null || _e === void 0 ? void 0 : _e.trim();
        if (!front || !back) {
            skippedRows += 1;
            return nextCards;
        }
        nextCards.push({
            front: front,
            back: back,
            deckName: deckName || undefined,
        });
        return nextCards;
    }, []);
    if (hasHeader && (frontIndex === backIndex || backIndex < 0)) {
        warnings.push('Header row was detected, but the parser could not confidently map front/back fields.');
    }
    return {
        cards: cards,
        detectedFormat: format,
        skippedRows: skippedRows,
        warnings: warnings,
    };
}

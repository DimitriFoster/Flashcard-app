/**
 * Import parsing helpers for CSV / TSV / simple TXT card files.
 *
 * The UI currently accepts pasted file contents so we can support imports without
 * adding native document-picker dependencies yet. The parser is deliberately
 * small and predictable: it extracts front/back/deck fields and lets storage
 * decide where the cards should be saved.
 */
export type ParsedImportCard = {
  front: string;
  back: string;
  deckName?: string;
};

export type ParsedImportResult = {
  cards: ParsedImportCard[];
  detectedFormat: 'csv' | 'tsv' | 'txt';
  skippedRows: number;
  warnings: string[];
};

const FRONT_KEYS = new Set(['front', 'prompt', 'question', 'term', 'q']);
const BACK_KEYS = new Set(['back', 'answer', 'definition', 'response', 'a']);
const DECK_KEYS = new Set(['deck', 'deckname', 'deck_name', 'category']);

function stripBom(value: string) {
  return value.replace(/^\uFEFF/, '');
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '_');
}

function splitDelimitedLine(line: string, delimiter: string) {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
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

function detectDelimiter(text: string) {
  const firstUsefulLine = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? '';

  const tabCount = (firstUsefulLine.match(/\t/g) ?? []).length;
  const commaCount = (firstUsefulLine.match(/,/g) ?? []).length;
  const pipeCount = (firstUsefulLine.match(/\|/g) ?? []).length;

  if (tabCount >= commaCount && tabCount >= pipeCount && tabCount > 0) {
    return { delimiter: '\t', format: 'tsv' as const };
  }

  if (commaCount >= pipeCount && commaCount > 0) {
    return { delimiter: ',', format: 'csv' as const };
  }

  return { delimiter: '|', format: 'txt' as const };
}

function detectHeader(cells: string[]) {
  const normalized = cells.map(normalizeHeader);
  return normalized.some((cell) => FRONT_KEYS.has(cell) || BACK_KEYS.has(cell));
}

function getColumnIndexes(headerCells: string[]) {
  const normalized = headerCells.map(normalizeHeader);
  const frontIndex = normalized.findIndex((cell) => FRONT_KEYS.has(cell));
  const backIndex = normalized.findIndex((cell) => BACK_KEYS.has(cell));
  const deckIndex = normalized.findIndex((cell) => DECK_KEYS.has(cell));

  return {
    frontIndex: frontIndex >= 0 ? frontIndex : 0,
    backIndex: backIndex >= 0 ? backIndex : 1,
    deckIndex: deckIndex >= 0 ? deckIndex : undefined,
  };
}

export function parseCardImportText(rawText: string): ParsedImportResult {
  const cleanedText = stripBom(rawText).trim();
  const warnings: string[] = [];

  if (!cleanedText) {
    return {
      cards: [],
      detectedFormat: 'txt',
      skippedRows: 0,
      warnings: ['No import text was provided.'],
    };
  }

  const { delimiter, format } = detectDelimiter(cleanedText);
  const rows = cleanedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => splitDelimitedLine(line, delimiter));

  if (rows.length === 0) {
    return {
      cards: [],
      detectedFormat: format,
      skippedRows: 0,
      warnings: ['No card rows were found.'],
    };
  }

  const hasHeader = detectHeader(rows[0]);
  const { frontIndex, backIndex, deckIndex } = getColumnIndexes(hasHeader ? rows[0] : []);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  let skippedRows = 0;
  const cards = dataRows.reduce<ParsedImportCard[]>((nextCards, row) => {
    const front = row[frontIndex]?.trim() ?? '';
    const back = row[backIndex]?.trim() ?? '';
    const deckName = deckIndex === undefined ? undefined : row[deckIndex]?.trim();

    if (!front || !back) {
      skippedRows += 1;
      return nextCards;
    }

    nextCards.push({
      front,
      back,
      deckName: deckName || undefined,
    });

    return nextCards;
  }, []);

  if (hasHeader && (frontIndex === backIndex || backIndex < 0)) {
    warnings.push('Header row was detected, but the parser could not confidently map front/back fields.');
  }

  return {
    cards,
    detectedFormat: format,
    skippedRows,
    warnings,
  };
}

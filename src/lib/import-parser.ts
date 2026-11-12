/**
 * Import parsing helpers for CSV / TSV / simple TXT card files.
 *
 * Bounded UTF-8 input from the picker and paste surface share the same parser.
 */
import { assertImportText, MAX_IMPORT_CARDS, MAX_IMPORT_FIELD, validateImportCards } from './import-policy';

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

function splitDelimitedRows(text: string, delimiter: string) {
  const rows: string[][] = [];
  let cells: string[] = [];
  let current = '';
  let inQuotes = false;
  function field() {
    if (current.length > MAX_IMPORT_FIELD) throw new Error('Keep each field under 16,000 characters.');
    cells.push(current.trim());
    current = '';
    if (cells.length > 32) throw new Error('Import files can have up to 32 columns.');
  }
  function row() {
    field();
    if (cells.some(Boolean)) rows.push(cells);
    cells = [];
    if (rows.length > MAX_IMPORT_CARDS + 1) throw new Error('Import up to 5,000 cards at a time.');
  }
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];
    if (current.length > MAX_IMPORT_FIELD) throw new Error('Keep each field under 16,000 characters.');
    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else if (inQuotes || !current.trim()) inQuotes = !inQuotes;
      else current += character;
      continue;
    }
    if (character === delimiter && !inQuotes) {
      field();
      continue;
    }
    if ((character === '\n' || character === '\r') && !inQuotes) {
      row();
      if (character === '\r' && nextCharacter === '\n') index++;
      continue;
    }
    current += character;
  }
  if (inQuotes) throw new Error('A quoted field is not closed. Check the CSV and try again.');
  row();
  return rows;
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
  return normalized.some((cell) => FRONT_KEYS.has(cell)) && normalized.some((cell) => BACK_KEYS.has(cell));
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
  assertImportText(rawText);
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
  const rows = splitDelimitedRows(cleanedText, delimiter);

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
  if (dataRows.length > MAX_IMPORT_CARDS) throw new Error('Import up to 5,000 cards at a time.');

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

  validateImportCards(cards);
  return {
    cards,
    detectedFormat: format,
    skippedRows,
    warnings,
  };
}

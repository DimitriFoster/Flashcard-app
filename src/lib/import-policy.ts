export const MAX_IMPORT_BYTES = 1024 * 1024;
export const MAX_IMPORT_CARDS = 5000;
export const MAX_IMPORT_FIELD = 16000;
export const MAX_IMPORT_NAME = 200;

export function assertImportText(text: string) {
  let bytes = 0;
  for (const character of text) {
    const point = character.codePointAt(0)!;
    if ((point < 32 && point !== 9 && point !== 10 && point !== 13) || (point >= 0xd800 && point <= 0xdfff)) {
      throw new Error('Choose a UTF-8 text file, not a binary document.');
    }
    bytes += point < 128 ? 1 : point < 2048 ? 2 : point < 65536 ? 3 : 4;
    if (bytes > MAX_IMPORT_BYTES) throw new Error('Choose a file smaller than 1 MB.');
  }
  if (!text.trim()) throw new Error('That file is empty.');
}

export function validateImportName(name: string) {
  if (name.length > MAX_IMPORT_NAME || /[\x00-\x1f\x7f]/.test(name)) throw new Error('A deck name is too long or contains invalid characters.');
}

export function getDeckFileKind(name: string): 'backup' | 'rows' {
  if (!name || name.length > 200 || /[\x00-\x1f\x7f/\\]/.test(name)) throw new Error('That filename is not supported.');
  if (/\.(json|foliopack)$/i.test(name)) return 'backup';
  if (/\.(csv|tsv|txt)$/i.test(name)) return 'rows';
  throw new Error('Choose a CSV, TSV, TXT, JSON, or .foliopack file. Export spreadsheets as CSV first.');
}

export function validateImportCards(cards: { front: string; back: string; deckName?: string }[]) {
  if (cards.length > MAX_IMPORT_CARDS) throw new Error('Import up to 5,000 cards at a time.');
  for (const card of cards) {
    if (typeof card.front !== 'string' || typeof card.back !== 'string' || card.front.length > MAX_IMPORT_FIELD || card.back.length > MAX_IMPORT_FIELD) {
      throw new Error('A card is too long. Keep each side under 16,000 characters.');
    }
    if (card.deckName) validateImportName(card.deckName);
  }
}

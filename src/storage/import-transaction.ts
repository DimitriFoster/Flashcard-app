type Store = { getString: (key: string) => string | undefined; set: (key: string, value: string) => unknown; remove: (key: string) => unknown };
const JOURNAL = 'deck-import-rollback';
const KEYS = new Set(['decks', 'flashcards', 'review-logs', 'notes', 'note-notebooks', 'last-review-undo']);

export function recoverInterruptedImport(store: Store) {
  const pending = store.getString(JOURNAL);
  if (!pending) return;
  const entries: unknown = JSON.parse(pending);
  if (!Array.isArray(entries) || entries.length > KEYS.size || entries.some((entry) => !Array.isArray(entry) || entry.length !== 2 || !KEYS.has(entry[0]) || (entry[1] !== null && typeof entry[1] !== 'string'))) {
    throw new Error('Import recovery data is invalid. Do not overwrite existing data.');
  }
  for (const [key, value] of entries) {
    if (value === null) store.remove(key);
    else store.set(key, value);
  }
  store.remove(JOURNAL);
}

export function commitImport(store: Store, values: Record<string, string | null>) {
  recoverInterruptedImport(store);
  const entries = Object.entries(values);
  if (entries.some(([key]) => !KEYS.has(key))) throw new Error('Invalid import destination.');
  store.set(JOURNAL, JSON.stringify(entries.map(([key]) => [key, store.getString(key) ?? null])));
  try {
    for (const [key, value] of entries) {
      if (value === null) store.remove(key);
      else store.set(key, value);
    }
    store.remove(JOURNAL);
  } catch (error) {
    // Keep the journal if rollback itself fails; the next read retries recovery.
    recoverInterruptedImport(store);
    throw error;
  }
}

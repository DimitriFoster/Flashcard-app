// Keep this order and hash stable: existing shelf covers are derived from IDs.
export const NOTEBOOK_APPEARANCES = [
  { key: 'ideas', coverColor: '#A5B87C' },
  { key: 'flowers', coverColor: '#F0A28F' },
  { key: 'clouds', coverColor: '#9AC8EB' },
  { key: 'sun', coverColor: '#F7D17A' },
  { key: 'moon', coverColor: '#B8A1CF' },
  { key: 'feather', coverColor: '#F3DFB5' },
  { key: 'leaves', coverColor: '#E98F72' },
  { key: 'checklist', coverColor: '#B69BCB' },
] as const;

export type NotebookCoverKey = (typeof NOTEBOOK_APPEARANCES)[number]['key'];

export function getNotebookAppearance(notebookId: string) {
  let hash = 0;
  for (const character of notebookId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return NOTEBOOK_APPEARANCES[hash % NOTEBOOK_APPEARANCES.length];
}

export function getNotebookNotePreview(body: string) {
  return body.split('\n').map((line) => line.trim()).filter(Boolean).slice(1).join(' ')
    || 'Tap to keep writing';
}

export function formatNotebookNoteDate(value: string, now = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Saved note';
  if (date.toDateString() === now.toDateString()) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

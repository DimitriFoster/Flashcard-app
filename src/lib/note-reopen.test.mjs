import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createContext, runInContext } from 'node:vm';
import ts from 'typescript';

// Exercise the route's real handlers without adding a React Native test runtime.
const source = ts.createSourceFile(
  'notes.tsx',
  readFileSync(new URL('../app/notes/index.tsx', import.meta.url), 'utf8'),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const handlers = [];
function collectHandlers(node) {
  if (ts.isFunctionDeclaration(node) &&
      ['openExistingNote', 'openStoredNoteById'].includes(node.name?.text)) {
    handlers.push(node.getText(source));
  }
  ts.forEachChild(node, collectHandlers);
}
collectHandlers(source);
assert.equal(handlers.length, 2);
const handlerCode = ts.transpileModule(handlers.join('\n'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;

const NOTE = { id: 'loose-a', title: 'A thought', body: 'Latest saved text' };
const OTHER_NOTE = { id: 'loose-b', title: 'Another thought', body: 'Other text' };

function createScreen(overrides = {}) {
  const state = {
    isEditorOpen: false,
    isNotebookOverviewOpen: false,
    selectedNoteId: NOTE.id,
    selectedNoteIdRef: { current: NOTE.id },
    isEditorArmed: true,
    editorSession: 0,
    ...overrides,
  };
  const events = [];
  Object.assign(state, {
    closeNotebookPicker() { events.push('close-picker'); },
    shouldPersistCurrentDraft() { return true; },
    persistCurrentDraft() { events.push('save'); },
    getNotes() { events.push('read-storage'); return [NOTE, OTHER_NOTE]; },
    refreshNotesState() { events.push('refresh'); },
    setActiveNoteId(id) {
      state.selectedNoteId = id;
      state.selectedNoteIdRef.current = id;
    },
    setActiveNotebookId(id) { state.selectedNotebookId = id; },
    setIsNotebookOverviewOpen(value) { state.isNotebookOverviewOpen = value; },
    setIsEditorOpen(value) { state.isEditorOpen = value; },
    setIsEditorArmed(value) { state.isEditorArmed = value; },
    setEditorSession(update) { state.editorSession = update(state.editorSession); },
    setDraftBody(value) { state.body = value; },
  });
  runInContext(handlerCode, createContext(state));
  return { state, events, open: state.openExistingNote };
}

test('the highlighted loose note reopens after returning to the list, repeatedly', () => {
  const screen = createScreen();
  for (let attempt = 0; attempt < 3; attempt++) {
    screen.state.isEditorOpen = false;
    screen.open(NOTE);
    assert.equal(screen.state.isEditorOpen, true);
    assert.equal(screen.state.selectedNoteId, NOTE.id);
    assert.equal(screen.state.body, NOTE.body);
    assert.equal(screen.state.isEditorArmed, false);
    assert.equal(screen.state.editorSession, attempt + 1);
  }
  assert.equal(screen.events.filter((event) => event === 'read-storage').length, 3);
  assert.ok(!screen.events.includes('save'));
});

test('reopening uses current storage and does not save a closed editor draft', () => {
  const screen = createScreen({ body: 'Discarded draft' });
  screen.open({ ...NOTE, body: 'Stale list text' });
  assert.equal(screen.state.body, NOTE.body);
  assert.deepEqual(screen.events, ['close-picker', 'read-storage']);
});

test('tapping the same note while it is open preserves the live editing session', () => {
  const screen = createScreen({ isEditorOpen: true, body: 'Unsaved text' });
  screen.open(NOTE);
  assert.equal(screen.state.body, 'Unsaved text');
  assert.equal(screen.state.isEditorArmed, true);
  assert.equal(screen.state.editorSession, 0);
  assert.deepEqual(screen.events, ['close-picker']);
});

test('switching notes while editing still saves before loading the next note', () => {
  const screen = createScreen({ isEditorOpen: true });
  screen.open(OTHER_NOTE);
  assert.deepEqual(screen.events, ['close-picker', 'save', 'read-storage']);
  assert.equal(screen.state.body, OTHER_NOTE.body);
  assert.equal(screen.state.selectedNoteId, OTHER_NOTE.id);
});

test('opening a different note from the list does not resave the previous draft', () => {
  const screen = createScreen();
  screen.open(OTHER_NOTE);
  assert.deepEqual(screen.events, ['close-picker', 'read-storage']);
  assert.equal(screen.state.isEditorOpen, true);
});

test('a notebook overview is not mistaken for an already open note editor', () => {
  const screen = createScreen({ isEditorOpen: true, isNotebookOverviewOpen: true });
  screen.open(NOTE);
  assert.equal(screen.state.isNotebookOverviewOpen, false);
  assert.equal(screen.state.isEditorOpen, true);
  assert.equal(screen.state.body, NOTE.body);
  assert.deepEqual(screen.events, ['close-picker', 'read-storage']);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { getEditorVisibleHeight } from './note-editor-scroll.ts';
import { installNotebookPaper } from '../../packages/folio-editor-hardening/notebook-paper.mjs';

const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8');
const dockSource = read('../components/notes/note-editor-dock.tsx');
const code = ts.transpileModule(dockSource, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function layout({ height = 800, top = 0, bottom = 24, toolbar = 'toolbar' } = {}) {
  const exports = {};
  let contextCount = 0;
  const native = { Platform: { OS: 'android' }, StatusBar: { currentHeight: 24 },
    StyleSheet: { create: (styles) => styles }, View: 'View', useWindowDimensions: () => ({ width: 360, height }) };
  const hooks = { createContext: () => ({ value: contextCount++ === 0 ? toolbar : null }),
    useContext: (context) => context.value, useRef: () => ({ current: null }), useLayoutEffect() {},
    useState: () => [{ top, height }, () => {}] };
  const jsx = (type, props) => ({ type, props });
  runInNewContext(code, { exports, require: (name) => {
    if (name === 'react') return hooks;
    if (name === 'react-native') return native;
    if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
    if (name === 'react-native-safe-area-context') return { useSafeAreaInsets: () => ({ bottom, left: 0, right: 0 }) };
    if (name === '@/lib/note-editor-scroll') return { getEditorVisibleHeight };
    throw new Error(`Unexpected import: ${name}`);
  } });
  return exports;
}

test('keyboard frame clips to keyboard screenY, with Android status-bar coordinates', () => {
  const outer = layout().NoteKeyboardFrame({ keyboardTop: 500, children: 'workspace-and-dock' });
  assert.equal(outer.props.children.props.style[1].height, 476);
  assert.equal(outer.props.children.props.style[1].flex, 0);
  assert.equal(outer.props.children.props.children, 'workspace-and-dock');
});

test('an already-resized window is not reduced by the keyboard twice', () => {
  const inner = layout({ height: 476 }).NoteKeyboardFrame({ keyboardTop: 500 }).props.children;
  assert.equal(inner.props.style[1].height, 476);
  assert.equal(layout({ height: 320 }).NoteKeyboardFrame({}).props.children.props.style[1].height, 320);
  assert.equal(layout({ height: 400, top: 550 }).NoteKeyboardFrame({ keyboardTop: 500 }).props.children.props.style[1].height, 0);
});

test('dock respects the bottom safe area only while the keyboard is closed', () => {
  const dock = layout();
  assert.equal(dock.NoteEditorToolbarDock({ keyboardVisible: false }).props.style[1].paddingBottom, 24);
  const open = dock.NoteEditorToolbarDock({ keyboardVisible: true });
  assert.equal(open.props.style[1].paddingBottom, 0);
  assert.equal(open.props.style[0].position, undefined); // Normal flow reserves real toolbar height.
  assert.equal(open.props.style[0].flexShrink, 0);
  assert.equal(layout({ toolbar: null }).NoteEditorToolbarDock({ keyboardVisible: false }).props.style.height, 24);
  assert.equal(layout({ toolbar: null }).NoteEditorToolbarDock({ keyboardVisible: true }).props.style.height, 0);
});

test('the paper viewport ends above the dock for different keyboard heights', () => {
  for (const keyboardTop of [420, 500, 660]) {
    const workspaceHeight = getEditorVisibleHeight(800, 24, keyboardTop);
    const headerAndPicker = 170;
    const toolbarHeight = 48;
    const paperTop = 24 + headerAndPicker;
    const paperHeight = workspaceHeight - headerAndPicker - toolbarHeight;
    assert.equal(paperTop + getEditorVisibleHeight(paperHeight, paperTop, keyboardTop), keyboardTop - toolbarHeight);
  }
});

test('native paper patch is deterministic and idempotent without changing security patches', () => {
  const files = new Map([
    ['android/src/main/java/com/swmansion/enriched/textinput/EnrichedTextInputView.kt',
      '  override fun onCreateInputConnection(outAttrs: EditorInfo): InputConnection? {'],
    ['ios/enrichedInputTextView/EnrichedInputTextView.mm',
      '- (void)layoutSubviews {\n  [super layoutSubviews];\n}\n// existing paste policy'],
  ]);
  let writes = 0;
  const patch = (file, before, after) => {
    const source = files.get(file);
    if (source.includes(after)) return;
    assert.equal(source.split(before).length, 2);
    files.set(file, source.replace(before, after));
    writes += 1;
  };
  installNotebookPaper(patch);
  const first = [...files.values()];
  installNotebookPaper(patch);
  assert.equal(writes, 3);
  assert.deepEqual([...files.values()], first);
  assert.ok(first[0].includes('textLayout.getLineBottom(line)'));
  assert.ok(first[0].includes('textLayout.getLineForVertical'));
  assert.ok(first[1].includes('enumerateLineFragmentsForGlyphRange:glyphs'));
  assert.ok(first[1].includes('existing paste policy'));
});

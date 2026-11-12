import assert from 'node:assert/strict';
import test from 'node:test';
import { getCaretLine, getCaretScrollOffset, getEditorVisibleHeight, getSelectionAfterEdit } from './note-editor-scroll.ts';

const lines = ['A paragraph that ', 'soft wraps twice ', 'before Enter.\n', 'Next row\n', '\u200B']
  .map((text, i) => ({ text, y: i * 28, height: 28 }));

test('Enter includes every preceding wrapped row and the trailing empty row', () => {
  const text = lines.map((line) => line.text).join('').slice(0, -1);
  assert.equal(getCaretLine(lines, text.length), lines[4]);
  assert.equal(getCaretLine(lines, lines[0].text.length + lines[1].text.length + lines[2].text.length), lines[3]);
});

test('soft wrap boundaries use measured lines, not character-count estimates', () => {
  assert.equal(getCaretLine(lines, lines[0].text.length), lines[1]);
  assert.equal(getCaretLine(lines, 3), lines[0]);
});

test('native UTF-16 selection indices work with emoji and empty paragraphs', () => {
  const emojiLines = [{ text: '\uD83D\uDE00\n', y: 0, height: 28 }, { text: '\n', y: 28, height: 28 }, { text: '\u200B', y: 56, height: 28 }];
  assert.equal(getCaretLine(emojiLines, 3), emojiLines[1]);
  assert.equal(getCaretLine(emojiLines, 4), emojiLines[2]);
});

test('resized viewport does not subtract the keyboard height a second time', () => {
  assert.equal(getEditorVisibleHeight(280, 180, 500), 280);
  assert.equal(getEditorVisibleHeight(600, 180, 500), 320);
  assert.equal(getEditorVisibleHeight(600, 180), 600);
  assert.equal(getEditorVisibleHeight(600, 180, 160), 0);
});

const geometry = { caretTop: 500, caretBottom: 528, offset: 0, viewportHeight: 300, visibleHeight: 300, contentHeight: 1000, margin: 28 };
test('Enter or wrapping reveals the complete row with breathing room', () => {
  assert.equal(getCaretScrollOffset(geometry), 256);
  assert.equal(getCaretScrollOffset({ ...geometry, caretTop: 528, caretBottom: 556, offset: 256 }), 284);
});

test('typing after a manual scroll uses the latest offset, in either direction', () => {
  assert.equal(getCaretScrollOffset({ ...geometry, offset: 100 }), 256);
  assert.equal(getCaretScrollOffset({ ...geometry, offset: 700 }), 472);
  assert.equal(getCaretScrollOffset({ ...geometry, offset: 300 }), 300);
});

test('overlaid keyboards use only the visible area and extra content space', () => {
  assert.equal(getCaretScrollOffset({ ...geometry, viewportHeight: 600, visibleHeight: 300, contentHeight: 1300 }), 256);
});

test('new row can be revealed after its content extent grows', () => {
  assert.equal(getCaretScrollOffset({ ...geometry, contentHeight: 540 }), 240);
  assert.equal(getCaretScrollOffset({ ...geometry, contentHeight: 578 }), 256);
});

test('very short editor clamps the margin without scrolling past its bounds', () => {
  assert.equal(getCaretScrollOffset({ ...geometry, visibleHeight: 40 }), 494);
  assert.equal(getCaretScrollOffset({ ...geometry, caretTop: 0, caretBottom: 28, offset: 100 }), 0);
});

test('middle edits and replacements do not jump to the end of the note', () => {
  assert.deepEqual(getSelectionAfterEdit('one two three', 'one Xtwo three', { start: 4, end: 4 }), { start: 5, end: 5 });
  assert.deepEqual(getSelectionAfterEdit('one two three', 'one X three', { start: 4, end: 7 }), { start: 5, end: 5 });
  assert.deepEqual(getSelectionAfterEdit('aaa', 'aaaa', { start: 1, end: 1 }), { start: 2, end: 2 });
  assert.deepEqual(getSelectionAfterEdit('one two three', 'one tw three', { start: 7, end: 7 }), { start: 6, end: 6 });
});

test('separately delivered selection events and Enter are tolerated', () => {
  assert.deepEqual(getSelectionAfterEdit('one two', 'one \ntwo', { start: 5, end: 5 }), { start: 5, end: 5 });
  assert.deepEqual(getSelectionAfterEdit('one\n', 'one\n\n', { start: 4, end: 4 }), { start: 5, end: 5 });
});

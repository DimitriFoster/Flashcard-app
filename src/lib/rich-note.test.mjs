import assert from 'node:assert/strict';
import test from 'node:test';
import { testModules } from '../test/module-loader.mjs';
const { sanitizeNoteHtml, plainNoteHtml, normalizeRichNote } = testModules()('lib/rich-note.ts');

test('old plain notes remain literal text, including markup and blank lines', () => {
  for (const text of ['<script>hello</script> & text', 'One\n\nTwo\n', '', '\n\n', 'Hello 😀\nWorld']) {
    assert.equal(sanitizeNoteHtml(plainNoteHtml(text)).body, text);
  }
});
test('formatting, alignment, and checked lists survive sanitization', () => {
  const input = '<html><h1>Title</h1><p style="text-align: center"><b>Bold</b> <i>italic</i></p><ul data-type="checkbox"><li checked>Done</li><li>Next</li></ul></html>';
  const safe = sanitizeNoteHtml(input);
  assert.equal(safe.body, 'Title\nBold italic\nDone\nNext');
  assert.match(safe.html, /<li checked>/);
  assert.match(safe.html, /text-align: center/);
  assert.deepEqual(sanitizeNoteHtml(safe.html), safe);
});
test('stored formatting never contains remote content, URLs, scripts, arbitrary CSS or events', () => {
  const safe = sanitizeNoteHtml('<p onclick="evil()" style="background:url(https://bad)">Text<img src="https://bad"><a href="javascript:evil()">link</a></p><script>evil()</script><svg><script>evil()</script></svg>');
  assert.equal(safe.body, 'Textlink');
  assert.equal(safe.html, '<html><p>Textlink</p></html>');
});
test('malformed HTML and encoded markup are rebuilt, not injected', () => {
  const safe = sanitizeNoteHtml('<p><b>&lt;img src=x onerror=evil()&gt;</p>');
  assert.equal(safe.body, '<img src=x onerror=evil()>');
  assert.equal(safe.html, '<html><p><b>&lt;img src=x onerror=evil()&gt;</b></p></html>');
});
test('formatting is discarded when its text does not match the saved body', () => {
  assert.equal(normalizeRichNote({ version: 1, html: '<p>Wrong</p>' }, 'Right'), undefined);
  assert.equal(normalizeRichNote({ version: 2, html: '<p>Right</p>' }, 'Right'), undefined);
});
test('huge and deeply nested formatting is bounded', () => {
  assert.throws(() => sanitizeNoteHtml('x'.repeat(1024 * 1024 + 1)), /large/);
  assert.throws(() => sanitizeNoteHtml('<b>'.repeat(100) + 'x' + '</b>'.repeat(100)), /nested/);
});

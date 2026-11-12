import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { installNotebookPaper } from './notebook-paper.mjs';

// Pinned, fail-closed patches: clipboard content must not enter the HTML/image loaders.
// Re-review this policy when upgrading the editor. No network or device access here.
const root = fileURLToPath(new URL('../../node_modules/react-native-enriched-html/', import.meta.url));
if (JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version !== '1.1.1') {
  throw new Error('Review Folio editor hardening before upgrading react-native-enriched-html.');
}
function patch(file, before, after) {
  const target = path.join(root, file);
  const source = readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
  if (source.includes(after)) return;
  if (source.split(before).length !== 2) throw new Error(`Editor hardening no longer matches ${file}`);
  writeFileSync(target, source.replace(before, after));
}
const android = 'android/src/main/java/com/swmansion/enriched/textinput/';
patch(android + 'EnrichedTextInputView.kt',
`        item.htmlText != null -> {
          val parsed = parseText(item.htmlText)
          (parsed as? Spannable) ?: return
        }

`, '        // Folio: only plain text may enter through the clipboard.\n');
patch(android + 'EnrichedTextInputView.kt',
  '    val finalText = currentText.mergeSpannables(start, end, pastedSpannable, htmlStyle)',
  '    if (currentText.length - (end - start) + pastedSpannable.length > 262144) return\n    val finalText = currentText.mergeSpannables(start, end, pastedSpannable, htmlStyle)');
patch(android + 'utils/RichContentReceiver.kt',
`    if (uriContent != null) {
      processClipDataInBackground(uriContent.clip)
    }`, '    // Folio consumes URI content without reading, copying, or decoding it.');
patch(android + 'utils/RichContentReceiver.kt',
  'val MIME_TYPES = arrayOf("image/*", "text/*")', 'val MIME_TYPES = arrayOf("text/*") // Folio: no image input');

const ios = 'ios/enrichedInputTextView/EnrichedInputTextView.mm';
const source = readFileSync(path.join(root, ios), 'utf8').replace(/\r\n/g, '\n');
const start = source.indexOf('- (void)paste:(id)sender {');
const end = source.indexOf('- (NSDictionary *)detectImageFormat:', start);
const paste = `- (void)paste:(id)sender {
  // Folio: no HTML/RTF parsing or image copies from untrusted clipboard content.
  EnrichedTextInputView *input = (EnrichedTextInputView *)_input;
  if (input == nullptr) return;
  [self tryHandlingPlainTextItemsIn:[UIPasteboard generalPasteboard]
                            range:input->textView.selectedRange input:input];
  [input anyTextMayHaveBeenModified];
}

`;
if (start < 0 || end < 0) throw new Error('Editor iOS paste policy needs review.');
patch(ios, source.slice(start, end), paste);
patch(ios, '  if (!plainText) {',
  '  if (!plainText || input->textView.text.length - range.length + plainText.length > 262144) {');
patch(ios, 'if (pasteboard.hasStrings || pasteboard.hasImages)', 'if (pasteboard.hasStrings) /* Folio: text-only paste */');
patch('ios/enrichedInputTextView/EnrichedInputTextView.h',
  '@interface EnrichedInputTextView : UITextView\n',
  '@interface EnrichedInputTextView : UITextView <UITextDropDelegate>\n');
patch('ios/EnrichedTextInputView.mm', '  textView.input = self;',
  '  textView.input = self;\n  textView.textDropDelegate = textView; // Folio: reject rich drop input');
patch(ios, '@implementation EnrichedInputTextView\n', `@implementation EnrichedInputTextView

- (UITextDropProposal *)textDroppableView:(UIView<UITextDroppable> *)view
                         proposalForDrop:(id<UITextDropRequest>)drop {
  // Native drag/drop must not bypass the bounded plain-text paste policy.
  return [[UITextDropProposal alloc] initWithDropOperation:UIDropOperationCancel];
}
`);
console.log('Folio editor: native paste limited to bounded plain text.');
installNotebookPaper(patch);
console.log('Folio editor: notebook ruling follows the native text layout.');

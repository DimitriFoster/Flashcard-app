import { readFileSync } from 'node:fs';

export function installNotebookPaper(patch) {
  const android = readFileSync(new URL('./android-notebook-paper.kt', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const ios = readFileSync(new URL('./ios-notebook-paper.mm', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const androidAnchor = '  override fun onCreateInputConnection(outAttrs: EditorInfo): InputConnection? {';
  patch('android/src/main/java/com/swmansion/enriched/textinput/EnrichedTextInputView.kt',
    androidAnchor, android + '\n' + androidAnchor);
  const iosFile = 'ios/enrichedInputTextView/EnrichedInputTextView.mm';
  patch(iosFile, '- (void)layoutSubviews {', ios + '\n- (void)layoutSubviews {');
  patch(iosFile, '  [super layoutSubviews];',
    '  [super layoutSubviews];\n  [self setNeedsDisplay]; // Folio: redraw on typing, resizing, and native scrolling.');
}

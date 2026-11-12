import { useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { EnrichedTextInput, type EnrichedTextInputInstance, type OnChangeStateEvent } from 'react-native-enriched-html';
import { COLORS } from '@/constants/design';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import { getEditorVisibleHeight } from '@/lib/note-editor-scroll';
import { plainNoteHtml, sanitizeNoteHtml } from '@/lib/rich-note';
import { NoteTextToolbar } from './note-text-toolbar';
import { useNoteEditorToolbar } from './note-editor-dock';
import type { NoteEditorProps } from './note-editor.types';

export function RichNoteEditor({ value, richText, inputRef, keyboardTop, placeholder, onChangeText, onSurfacePress, onBlur }: NoteEditorProps) {
  const editor = useRef<EnrichedTextInputInstance>(null);
  const container = useRef<View>(null);
  const [initial] = useState(() => richText?.html ?? plainNoteHtml(value));
  const lastHtml = useRef(initial);
  const lastSafeHtml = useRef(initial);
  const touched = useRef(false);
  const { width, height } = useWindowDimensions();
  const [viewport, setViewport] = useState({ top: 0, height: 0 });
  const [formatState, setFormatState] = useState<OnChangeStateEvent>();
  const [warning, setWarning] = useState('');
  const [focused, setFocused] = useState(false);
  const registerToolbar = useNoteEditorToolbar();
  const actions = useRef({ runCommand, done: () => editor.current?.blur() });
  const screenTop = viewport.top + (Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0);
  const visibleHeight = getEditorVisibleHeight(viewport.height, screenTop, keyboardTop);
  useImperativeHandle(inputRef, () => ({ focus: () => editor.current?.focus(), blur: () => editor.current?.blur() }), []);

  function measure() {
    container.current?.measureInWindow((_x, top, _width, measuredHeight) => {
      setViewport((current) => current.top === top && current.height === measuredHeight ? current : { top, height: measuredHeight });
    });
  }
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [width, height, keyboardTop]);

  function runCommand(command: (instance: EnrichedTextInputInstance) => void) {
    if (!editor.current) return;
    touched.current = true;
    // Focus first would collapse selected ranges on Android. Apply formatting first.
    command(editor.current);
    if (!focused) editor.current.focus();
  }

  useLayoutEffect(() => {
    actions.current = { runCommand, done: () => editor.current?.blur() };
  });
  useLayoutEffect(() => {
    if (!registerToolbar) return;
    registerToolbar(<NoteTextToolbar state={formatState}
      onCommand={(command) => actions.current.runCommand(command)}
      onDone={focused ? () => actions.current.done() : undefined} />);
  }, [registerToolbar, formatState, focused]);
  useLayoutEffect(() => () => registerToolbar?.(null), [registerToolbar]);

  return (
    <View ref={container} collapsable={false} onLayout={measure} style={styles.container} testID="note-editor-surface">
      {/* Explicit flex: 0 prevents the frame from growing behind the keyboard. */}
      <View style={[styles.frame, viewport.height > 0 && { height: visibleHeight, flex: 0 }]}>
        {warning ? <Text accessibilityLiveRegion="polite" style={styles.warning}>{warning}</Text> : null}
        <EnrichedTextInput ref={editor} defaultValue={initial}
          testID="note-editor-input" accessibilityLabel="Note text" autoFocus={false} scrollEnabled
          linkRegex={null} mentionIndicators={[]} textShortcuts={[]} useHtmlNormalizer={false}
          placeholder={placeholder} placeholderTextColor={COLORS.muted} selectionColor={COLORS.note}
          onFocus={() => { touched.current = true; setFocused(true); onSurfacePress(); }}
          onBlur={() => { setFocused(false); onBlur(); }}
          onChangeState={({ nativeEvent }) => setFormatState(nativeEvent)}
          onChangeHtml={({ nativeEvent }) => {
            if (!touched.current || nativeEvent.value === lastHtml.current) return;
            try {
              const next = sanitizeNoteHtml(nativeEvent.value);
              lastHtml.current = nativeEvent.value;
              lastSafeHtml.current = next.html;
              setWarning('');
              onChangeText(next.body, { version: 1, html: next.html });
            } catch {
              editor.current?.setValue(lastSafeHtml.current);
              setWarning('Note limit reached. Split this into smaller notes to keep writing.');
            }
          }}
          htmlStyle={{ h1: { fontSize: 25, bold: true }, h2: { fontSize: 21, bold: true },
            ul: { bulletColor: COLORS.ink, marginLeft: 18, gapWidth: 8 }, ol: { markerColor: COLORS.ink, marginLeft: 22, gapWidth: 8 },
            ulCheckbox: { boxColor: '#738768', boxSize: 18, marginLeft: 2, gapWidth: 8 } }}
          style={{ flex: 1, color: COLORS.ink, backgroundColor: 'transparent', fontFamily: FOLIO_HAND_FONT, fontSize: 17, lineHeight: 28, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 30 }}
        />
        {!registerToolbar ? <NoteTextToolbar state={formatState} onCommand={runCommand} onDone={focused ? () => editor.current?.blur() : undefined} /> : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' }, frame: { flex: 1, overflow: 'hidden' },
  warning: { color: '#794330', backgroundColor: '#F7E3D3', padding: 8, fontSize: 12 },
});

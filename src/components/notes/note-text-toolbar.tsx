import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { EnrichedTextInputInstance, OnChangeStateEvent } from 'react-native-enriched-html';
import { COLORS } from '@/constants/design';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';

type Command = 'toggleBold' | 'toggleItalic' | 'toggleUnderline' | 'toggleStrikeThrough' | 'toggleH1' | 'toggleH2' | 'toggleUnorderedList' | 'toggleOrderedList' | 'toggleBlockQuote';
type Tool = { label: string; glyph: string; state: keyof OnChangeStateEvent; command: Command };
const tools: Tool[] = [
  { label: 'Bold', glyph: 'B', state: 'bold', command: 'toggleBold' },
  { label: 'Italic', glyph: 'I', state: 'italic', command: 'toggleItalic' },
  { label: 'Underline', glyph: 'U', state: 'underline', command: 'toggleUnderline' },
  { label: 'Strikethrough', glyph: 'S', state: 'strikeThrough', command: 'toggleStrikeThrough' },
  { label: 'Heading', glyph: 'H1', state: 'h1', command: 'toggleH1' },
  { label: 'Subheading', glyph: 'H2', state: 'h2', command: 'toggleH2' },
  { label: 'Bulleted list', glyph: '\u2022', state: 'unorderedList', command: 'toggleUnorderedList' },
  { label: 'Numbered list', glyph: '1.', state: 'orderedList', command: 'toggleOrderedList' },
  { label: 'Quote', glyph: '\u201c', state: 'blockQuote', command: 'toggleBlockQuote' },
];
type Props = { state?: OnChangeStateEvent; onCommand: (command: (editor: EnrichedTextInputInstance) => void) => void; onDone?: () => void };

export function NoteTextToolbar({ state, onCommand, onDone }: Props) {
  const [expanded, setExpanded] = useState(true);
  function button(label: string, glyph: string, active: boolean, blocked: boolean, action: () => void) {
    return (
      <Pressable key={label} testID={`note-format-${label.toLowerCase().replace(/ /g, '-')}`}
        accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active, disabled: blocked }}
        disabled={blocked} onPress={action} style={({ pressed }) => [styles.tool, active && styles.active, blocked && styles.disabled, pressed && styles.pressed]}>
        <Text style={[styles.glyph, label === 'Bold' && styles.bold, label === 'Italic' && styles.italic,
          label === 'Underline' && styles.underline, label === 'Strikethrough' && styles.strike]}>{glyph}</Text>
      </Pressable>
    );
  }
  return (
    <View style={styles.row} testID="note-text-toolbar">
      <Pressable testID="note-format-toggle" accessibilityRole="button" accessibilityLabel={expanded ? 'Collapse text tools' : 'Expand text tools'}
        accessibilityState={{ expanded }} onPress={() => setExpanded(!expanded)} style={styles.toggle}>
        <Text style={styles.toggleText}>{expanded ? 'Aa -' : 'Aa +'}</Text>
      </Pressable>
      {expanded ? <ScrollView horizontal style={styles.scroll} showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always" contentContainerStyle={styles.tools}>
        {tools.map((tool) => {
          const status = state?.[tool.state];
          return button(tool.label, tool.glyph, typeof status === 'object' && status.isActive, typeof status === 'object' && status.isBlocking,
            () => onCommand((editor) => editor[tool.command]()));
        })}
        {button('Checklist', '[ ]', state?.checkboxList.isActive ?? false, state?.checkboxList.isBlocking ?? false, () => onCommand((editor) => editor.toggleCheckboxList(false)))}
        {(['left', 'center', 'right'] as const).map((alignment) => button(`Align ${alignment}`, alignment === 'left' ? '|=' : alignment === 'right' ? '=|' : '=|=',
          state?.alignment === alignment, false, () => onCommand((editor) => editor.setTextAlignment(alignment))))}
      </ScrollView> : <Text style={styles.hint}>Text tools</Text>}
      {onDone ? <Pressable testID="note-editor-done" accessibilityRole="button" accessibilityLabel="Finish editing" onPress={onDone} style={styles.toggle}><Text style={styles.toggleText}>Done</Text></Pressable> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 48, backgroundColor: '#FCF5E7', borderTopColor: '#D9CDB6', borderTopWidth: StyleSheet.hairlineWidth },
  scroll: { flex: 1 },
  tools: { paddingHorizontal: 4, gap: 4, alignItems: 'center' },
  toggle: { minWidth: 56, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#D9CDB6' },
  toggleText: { fontFamily: FOLIO_HAND_FONT, fontSize: 13, color: COLORS.ink },
  tool: { minWidth: 48, minHeight: 48, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  active: { backgroundColor: '#DCEAD8' },
  glyph: { color: COLORS.ink, fontSize: 16 },
  hint: { flex: 1, fontFamily: FOLIO_HAND_FONT, color: COLORS.muted, paddingHorizontal: 12, fontSize: 13 },
  bold: { fontWeight: 'bold' }, italic: { fontStyle: 'italic' }, underline: { textDecorationLine: 'underline' }, strike: { textDecorationLine: 'line-through' },
  disabled: { opacity: 0.35 }, pressed: { opacity: 0.65 },
});

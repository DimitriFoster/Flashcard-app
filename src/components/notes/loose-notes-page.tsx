import type { ReactNode } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { StudyNote } from '@/types/note';
import { LooseNotePaper } from './loose-note-paper';
import { PdfImportButton } from './pdf-attachment';
import { looseNotesStyles as styles } from './loose-notes.styles';
import { PickerSymbol } from './notebook-picker-art';
import { NewNoteButtonArt } from './open-notebook-art';

type Props = {
  notes: StudyNote[];
  body: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onNewNote: () => void;
  onPdfImported: (note: StudyNote) => void;
  renderNote: (note: StudyNote) => ReactNode;
};

export function LooseNotesPage({ notes, body, onChange, onSave, onNewNote, onPdfImported, renderNote }: Props) {
  const { height } = useWindowDimensions();
  const canSave = Boolean(body.trim());

  return (
    <View style={styles.page} testID="notes-loose-list">
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>Loose notes</Text>
        <Text style={styles.subtitle}>Little thoughts, all in one place.</Text>
      </View>

      <View style={styles.quickCard} testID="notes-quick-paper">
        <LooseNotePaper kind="quick" />
        <View style={styles.quickHeading}>
          <View accessible={false} pointerEvents="none">
            <Svg width={26} height={26} viewBox="0 0 24 24">
              <Path d="M4 16 L3 21 L8 20 L21 7 Q22 6 20 4 Q18 2 17 3 Z M15 5 L19 9"
                fill="none" stroke="#644C3A" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <Text accessibilityRole="header" style={styles.quickTitle}>Quick note</Text>
        </View>
        <TextInput accessibilityLabel="Quick note capture" testID="notes-quick-capture"
          multiline scrollEnabled value={body} onChangeText={onChange}
          placeholder="Jot something down..." placeholderTextColor="#8B7767"
          textAlignVertical="top" underlineColorAndroid="transparent"
          style={[styles.input, height < 700 && styles.inputCompact]} />
        <Text style={styles.hint}>A small thought is enough.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Save quick note"
          accessibilityState={{ disabled: !canSave }} disabled={!canSave} onPress={onSave}
          testID="notes-quick-save"
          style={({ pressed }) => [styles.save, !canSave && styles.disabled, pressed && styles.pressed]}>
          <NewNoteButtonArt />
          <PickerSymbol name="check" />
          <Text style={styles.saveText}>Save note</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionCopy}>
            <Text accessibilityRole="header" style={styles.eyebrow}>YOUR LOOSE NOTES</Text>
            <Text style={styles.count} testID="notes-loose-count">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="New Note" onPress={onNewNote}
            testID="notes-loose-new-note" style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}>
            <PickerSymbol name="plus" />
            <Text style={styles.newText}>New note</Text>
          </Pressable>
        </View>
        <PdfImportButton onImported={onPdfImported} />
        <View style={styles.list}>
          {notes.length ? notes.map((note) => renderNote(note)) : (
            <View style={styles.empty} testID="notes-loose-empty">
              <LooseNotePaper kind="sage" />
              <Text style={styles.emptyTitle}>A fresh page.</Text>
              <Text style={styles.emptyCopy}>Your loose notes will gather here. Start with a quick thought above.</Text>
            </View>
          )}
        </View>
      </View>
      {notes.length > 0 ? <Text style={styles.footer}>Tap a note to pick up where you left off.</Text> : null}
    </View>
  );
}

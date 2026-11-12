import { type ReactNode, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { formatNotebookNoteDate, getNotebookNotePreview } from '@/lib/notebook-appearance';
import type { StudyNote } from '@/types/note';
import { pdfNoteSummary } from '@/lib/pdf-note';
import { LooseNotePaper, type LoosePaperTone } from './loose-note-paper';
import { looseNotesStyles as styles } from './loose-notes.styles';
import { PickerSymbol } from './notebook-picker-art';

type Props = {
  note: StudyNote;
  onOpen: (note: StudyNote) => void;
  onDelete: (note: StudyNote) => void;
  children: ReactNode;
};

export function LooseNoteCard({ note, onOpen, onDelete, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  // A note keeps its paper color when the list is reordered or another is added.
  const hash = Array.from(note.id).reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
  const tone: LoosePaperTone = (['blush', 'blue', 'sage'] as const)[hash % 3];

  return (
    <View style={styles.card} testID={`loose-note-card-${note.id}`}>
      <LooseNotePaper kind={tone} />
      <View>
        <Pressable accessibilityRole="button" accessibilityLabel={`Open note ${note.title}`}
          onPress={() => onOpen(note)} onLongPress={() => setMenuOpen(true)}
          testID={`loose-note-open-${note.id}`} style={({ pressed }) => [styles.openArea, pressed && styles.pressed]}>
          <View style={styles.cardCopy}>
            <Text numberOfLines={2} style={styles.cardTitle}>{note.title}</Text>
            <Text numberOfLines={2} style={styles.preview}>{note.kind === 'pdf' ? pdfNoteSummary(note) : getNotebookNotePreview(note.body)}</Text>
            <Text style={styles.date}>{formatNotebookNoteDate(note.updatedAt)}</Text>
          </View>
          <View accessible={false} style={styles.chevron}>
            <Svg width={16} height={20} viewBox="0 0 16 20">
              <Path d="M5 4 L11 10 L5 16" stroke="#644C3A" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Options for ${note.title}`}
          accessibilityState={{ expanded: menuOpen }} onPress={() => setMenuOpen(!menuOpen)}
          testID={`loose-note-options-${note.id}`} style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}>
          <Svg aria-hidden width={24} height={20} viewBox="0 0 24 20">
            {[4, 12, 20].map((cx) => <Circle key={cx} cx={cx} cy={10} r={1.8} fill="#644C3A" />)}
          </Svg>
        </Pressable>
      </View>
      {menuOpen ? (
        <View style={styles.menu}>
          {children}
          <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${note.title}`}
            onPress={() => onDelete(note)} testID={`loose-note-delete-${note.id}`}
            style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
            <PickerSymbol name="trash" color="#984B42" />
            <Text style={styles.deleteText}>Delete note</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

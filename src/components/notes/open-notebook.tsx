import { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { getNotebookAppearance, getNotebookNotePreview, formatNotebookNoteDate } from '@/lib/notebook-appearance';
import type { Notebook, StudyNote } from '@/types/note';
import { pdfNoteSummary } from '@/lib/pdf-note';
import { PdfImportButton } from './pdf-attachment';
import { PickerSymbol } from './notebook-picker-art';
import { NewNoteButtonArt, notebookNoteIcon, OpenNotebookArt } from './open-notebook-art';
import { openNotebookStyles as styles } from './open-notebook.styles';

type Props = {
  notebook: Notebook;
  notes: StudyNote[];
  nameDraft: string;
  sortDirection: 'newest' | 'oldest';
  onNameChange: (name: string) => void;
  onSaveName: () => void;
  onToggleSort: () => void;
  onNewNote: () => void;
  onPdfImported: (note: StudyNote) => void;
  onOpenNote: (note: StudyNote) => void;
  onDeleteNote: (note: StudyNote) => void;
  onRemoveNote: (noteId: string) => void;
  onDeleteNotebook: () => void;
};

export function OpenNotebook({ notebook, notes, nameDraft, sortDirection, onNameChange, onSaveName,
  onToggleSort, onNewNote, onPdfImported, onOpenNote, onDeleteNote, onRemoveNote, onDeleteNotebook }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 360;
  const [isRenaming, setIsRenaming] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [noteMenuId, setNoteMenuId] = useState<string>();
  const titleRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const appearance = getNotebookAppearance(notebook.id);

  function finishRename() {
    setIsRenaming(false);
    onSaveName();
  }

  function startRename() {
    setIsMenuOpen(false);
    setIsRenaming(true);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  return (
    <View style={styles.root} testID="open-notebook">
      <View style={styles.frame}>
        <OpenNotebookArt color={appearance.coverColor} />
        <ScrollView ref={scrollRef} style={styles.scroll} keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag" contentContainerStyle={[styles.content, compact && styles.contentCompact]}
          testID="open-notebook-scroll">
          <Text style={styles.eyebrow}>NOTEBOOK</Text>
          <View style={styles.titleRow}>
            {isRenaming ? (
              <TextInput ref={titleRef} autoFocus selectTextOnFocus value={nameDraft} maxLength={80}
                accessibilityLabel="Notebook name" testID="open-notebook-name" returnKeyType="done"
                onChangeText={onNameChange} onBlur={finishRename} onSubmitEditing={() => titleRef.current?.blur()}
                style={[styles.title, compact && styles.titleCompact, styles.titleInput]} />
            ) : (
              <Pressable accessibilityRole="button" accessibilityLabel={`Rename notebook ${notebook.name}`}
                onPress={startRename} style={({ pressed }) => [styles.titleButton, pressed && styles.pressed]}>
                <Text style={[styles.title, compact && styles.titleCompact]}>{notebook.name}</Text>
              </Pressable>
            )}
            <Pressable accessibilityRole="button" accessibilityLabel={isRenaming ? 'Save notebook name' : 'Rename notebook'}
              testID="open-notebook-rename" onPress={() => isRenaming ? titleRef.current?.blur() : startRename()}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              {isRenaming ? <PickerSymbol name="check" /> : (
                <Svg aria-hidden width={23} height={23} viewBox="0 0 24 24">
                  <Path d="M4 16 L3 21 L8 20 L21 7 Q22 6 20 4 Q18 2 17 3 Z M15 5 L19 9"
                    fill="none" stroke="#644C3A" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              )}
            </Pressable>
          </View>
          <Text style={styles.subtitle}>A little learning, one page at a time.</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YOUR NOTES</Text>
            <Text style={styles.count}>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Notebook options" accessibilityState={{ expanded: isMenuOpen }}
              testID="open-notebook-options" onPress={() => setIsMenuOpen(!isMenuOpen)}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Text style={styles.dots}>...</Text>
            </Pressable>
          </View>
          {isMenuOpen ? (
            <View style={styles.menu}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Sort notes ${sortDirection === 'newest' ? 'oldest' : 'newest'} first`}
                testID="open-notebook-sort" onPress={onToggleSort} style={styles.menuAction}>
                <Text style={styles.menuText}>{sortDirection === 'newest' ? 'Newest first' : 'Oldest first'} - tap to change</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => { setIsManaging(!isManaging); setNoteMenuId(undefined); setIsMenuOpen(false); }} style={styles.menuAction}>
                <Text style={styles.menuText}>{isManaging ? 'Done managing notes' : 'Manage notes'}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Delete selected notebook" testID="open-notebook-delete"
                onPress={() => { setIsMenuOpen(false); onDeleteNotebook(); }} style={styles.menuAction}>
                <Text style={[styles.menuText, styles.danger]}>Delete notebook</Text>
              </Pressable>
            </View>
          ) : null}
          <PdfImportButton notebookId={notebook.id} onImported={onPdfImported} />
          {notes.map((note) => (
            <View key={note.id} style={styles.row}>
              <View style={styles.rowBody}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Open note ${note.title}`}
                  accessibilityHint="Hold for note options" testID={`open-notebook-note-${note.id}`}
                  onPress={() => onOpenNote(note)} onLongPress={() => setNoteMenuId(noteMenuId === note.id ? undefined : note.id)}
                  accessibilityActions={[{ name: 'longpress', label: 'Show note options' }]}
                  onAccessibilityAction={({ nativeEvent }) => { if (nativeEvent.actionName === 'longpress') setNoteMenuId(note.id); }}
                  style={({ pressed }) => [styles.notePress, pressed && styles.pressed]}>
                  {!compact ? <Image source={notebookNoteIcon} accessible={false} resizeMode="contain" style={styles.noteIcon} /> : null}
                  <View style={styles.noteCopy}>
                    <Text numberOfLines={2} style={styles.noteTitle}>{note.title}</Text>
                    <Text numberOfLines={2} style={styles.preview}>{note.kind === 'pdf' ? pdfNoteSummary(note) : getNotebookNotePreview(note.body)}</Text>
                    <Text style={styles.date}>{formatNotebookNoteDate(note.updatedAt)}</Text>
                  </View>
                  {!isManaging ? <Text accessible={false} style={styles.chevron}>{'\u203a'}</Text> : null}
                </Pressable>
                {isManaging ? (
                  <Pressable accessibilityRole="button" accessibilityLabel={`Options for ${note.title}`}
                    onPress={() => setNoteMenuId(noteMenuId === note.id ? undefined : note.id)} style={styles.iconButton}>
                    <Text style={styles.dots}>...</Text>
                  </Pressable>
                ) : null}
              </View>
              {noteMenuId === note.id ? (
                <View style={styles.menu}>
                  <Pressable accessibilityRole="button" onPress={() => { setNoteMenuId(undefined); onRemoveNote(note.id); }} style={styles.menuAction}>
                    <Text style={styles.menuText}>Move to Loose notes</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${note.title}`}
                    onPress={() => { setNoteMenuId(undefined); onDeleteNote(note); }} style={styles.menuAction}>
                    <Text style={[styles.menuText, styles.danger]}>Delete note</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          ))}
          {notes.length === 0 ? (
            <View style={styles.empty} testID="open-notebook-empty">
              <Image source={notebookNoteIcon} accessible={false} resizeMode="contain" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>A fresh page awaits.</Text>
              <Text style={styles.emptyCopy}>Give your first thought a home. Tap New note to begin.</Text>
            </View>
          ) : null}
        </ScrollView>
        <View style={[styles.footer, compact && styles.footerCompact]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Create note in notebook" testID="open-notebook-new-note"
            onPress={() => { titleRef.current?.blur(); onNewNote(); }} style={({ pressed }) => [styles.newNote, pressed && styles.pressed]}>
            <NewNoteButtonArt />
            <PickerSymbol name="plus" color="#314F36" />
            <Text style={styles.newNoteText}>New note</Text>
          </Pressable>
        </View>
      </View>
      {height >= 700 ? <Text style={styles.helper}>Tap a note to pick up where you left off.</Text> : null}
    </View>
  );
}

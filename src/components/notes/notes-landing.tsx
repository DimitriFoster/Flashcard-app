import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { NotebookBookcase } from '@/components/notes/notebook-bookcase';
import { LooseNotesPage } from '@/components/notes/loose-notes-page';
import { PdfImportButton } from '@/components/notes/pdf-attachment';
import { COLORS, RADIUS, SHADOWS } from '@/constants/design';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import type { Notebook, NotebookShelf, StudyNote } from '@/types/note';

const notesIcon = require('../../../assets/folio-ui/home-page/home_notes_icon.png');
const notebookIcon = require('../../../assets/folio-ui/home-page/open-pick/pick_header_notebook.png');
const arrowIcon = require('../../../assets/folio-ui/home-page/home_arrow_icon.png');
const notesSwatch = require('../../../assets/folio-ui/home-page/swatches/home_notes_panel_swatch.png');
const createSwatch = require('../../../assets/folio-ui/home-page/open-create/open_create_panel_swatch.png');
const looseNotesTable = require('./assets/loose-notes-table.png');
const notebookShelf = require('./assets/notebook-shelf.png');

export type NotesLandingView = 'hub' | 'loose' | 'notebooks' | 'new-notebook';

type NotebookGroup = { notebook: Notebook; notes: StudyNote[] };

type NotesLandingProps = {
  view: NotesLandingView;
  looseNotes: StudyNote[];
  notebookGroups: NotebookGroup[];
  shelves: NotebookShelf[];
  newNotebookShelfId?: string;
  quickCaptureBody: string;
  onQuickCaptureChange: (value: string) => void;
  onQuickCaptureSave: () => void;
  onNewNote: () => void;
  onPdfImported: (note: StudyNote) => void;
  onNewNotebook: (shelfId?: string) => void;
  onOpenLooseNotes: () => void;
  onOpenNotebooks: () => void;
  onCreateNotebook: (name: string, shelfId: string) => boolean;
  onAddShelf: (name: string) => boolean;
  onRenameShelf: (shelfId: string, name: string) => boolean;
  onDeleteShelf: (shelfId: string) => boolean;
  onMoveNotebook: (notebookId: string, shelfId: string) => boolean;
  onOpenNotebook: (notebook: Notebook) => void;
  renderNote: (note: StudyNote, variant?: 'loose') => React.ReactNode;
};

function countLabel(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

export function NotesLanding({
  view,
  looseNotes,
  notebookGroups,
  shelves,
  newNotebookShelfId,
  quickCaptureBody,
  onQuickCaptureChange,
  onQuickCaptureSave,
  onNewNote,
  onPdfImported,
  onNewNotebook,
  onOpenLooseNotes,
  onOpenNotebooks,
  onCreateNotebook,
  onAddShelf,
  onRenameShelf,
  onDeleteShelf,
  onMoveNotebook,
  onOpenNotebook,
  renderNote,
}: NotesLandingProps) {
  if (view === 'hub') {
    return (
      <View style={styles.hub} testID="notes-hub">
        <View style={styles.createArea}>
          <Text style={styles.sectionLabel}>START SOMETHING</Text>
          <Text style={styles.invitation}>A thought or a whole collection?</Text>

          <Pressable
            accessibilityLabel="New Note"
            accessibilityRole="button"
            onPress={onNewNote}
            style={({ pressed }) => [styles.createButton, styles.noteButton, pressed && styles.pressed]}
            testID="notes-new-note">
            <HomePanelFill source={notesSwatch} />
            <Image resizeMode="contain" source={notesIcon} style={styles.createIcon} />
            <View style={styles.createCopy}>
              <Text numberOfLines={1} style={[styles.createTitle, styles.noteText]}>New Note</Text>
              <Text numberOfLines={2} style={styles.createSubtitle}>Catch a thought, big or small.</Text>
            </View>
            <Image resizeMode="contain" source={arrowIcon} style={[styles.createArrow, styles.noteArrow]} />
          </Pressable>

          <Pressable
            accessibilityLabel="New Notebook"
            accessibilityRole="button"
            onPress={() => onNewNotebook()}
            style={({ pressed }) => [styles.createButton, styles.notebookButton, pressed && styles.pressed]}
            testID="notes-new-notebook">
            <HomePanelFill source={createSwatch} />
            <Image resizeMode="contain" source={notebookIcon} style={styles.createIcon} />
            <View style={styles.createCopy}>
              <Text numberOfLines={1} style={[styles.createTitle, styles.notebookText]}>New Notebook</Text>
              <Text numberOfLines={2} style={styles.createSubtitle}>Give related ideas a home.</Text>
            </View>
            <Image resizeMode="contain" source={arrowIcon} style={[styles.createArrow, styles.notebookArrow]} />
          </Pressable>
        </View>

        <PdfImportButton onImported={onPdfImported} />
        <View style={styles.browseArea}>
          <View style={styles.browseHeading}>
            <Text style={styles.sectionLabel}>PICK UP WHERE YOU LEFT OFF</Text>
            <View style={styles.headingRule} />
          </View>
          <View style={styles.destinationRow}>
            <Pressable
              accessibilityLabel={`Open loose notes, ${countLabel(looseNotes.length, 'note')}`}
              accessibilityRole="button"
              onPress={onOpenLooseNotes}
              style={({ pressed }) => [styles.destination, pressed && styles.pressed]}
              testID="notes-loose-notes">
              <View pointerEvents="none" style={styles.illustration}>
                <Image accessible={false} resizeMode="contain" source={looseNotesTable} style={styles.destinationArt} />
              </View>
              <Text numberOfLines={1} style={styles.destinationTitle}>Loose notes</Text>
              <Text style={styles.destinationCount}>{countLabel(looseNotes.length, 'note')}</Text>
            </Pressable>
            <Pressable
              accessibilityLabel={`Open notebooks, ${countLabel(notebookGroups.length, 'notebook')}`}
              accessibilityRole="button"
              onPress={onOpenNotebooks}
              style={({ pressed }) => [styles.destination, pressed && styles.pressed]}
              testID="notes-notebooks">
              <View pointerEvents="none" style={styles.illustration}>
                <Image accessible={false} resizeMode="contain" source={notebookShelf} style={[styles.destinationArt, styles.shelfArt]} />
              </View>
              <Text numberOfLines={1} style={styles.destinationTitle}>Notebooks</Text>
              <Text style={styles.destinationCount}>{countLabel(notebookGroups.length, 'notebook')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (view === 'loose') {
    return (
      <LooseNotesPage notes={looseNotes} body={quickCaptureBody}
        onPdfImported={onPdfImported}
        onChange={onQuickCaptureChange} onSave={onQuickCaptureSave} onNewNote={onNewNote}
        renderNote={(note) => renderNote(note, 'loose')} />
    );
  }

  return (
    <View style={styles.collection} testID="notes-notebook-list">
      <View style={styles.collectionHeading}>
        <View style={styles.collectionHeadingCopy}>
          <Text style={styles.collectionDescription}>A notebook for every thread.</Text>
        </View>
        {view !== 'new-notebook' ? (
          <Pressable
            accessibilityLabel="New Notebook"
            accessibilityRole="button"
            onPress={() => onNewNotebook()}
            style={({ pressed }) => [styles.smallAction, styles.greenAction, pressed && styles.pressed]}>
            <Text style={[styles.smallActionText, styles.greenActionText]}>+ New</Text>
          </Pressable>
        ) : null}
      </View>

      <NotebookBookcase
        shelves={shelves}
        notebookGroups={notebookGroups}
        creatingNotebookShelfId={view === 'new-notebook' ? newNotebookShelfId ?? shelves[0]?.id : undefined}
        onOpenNotebook={onOpenNotebook}
        onNewNotebook={onNewNotebook}
        onCreateNotebook={onCreateNotebook}
        onCancelNewNotebook={onOpenNotebooks}
        onAddShelf={onAddShelf}
        onRenameShelf={onRenameShelf}
        onDeleteShelf={onDeleteShelf}
        onMoveNotebook={onMoveNotebook}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hub: { flexGrow: 1, justifyContent: 'space-between', gap: 30, paddingTop: 12 },
  createArea: { gap: 12 },
  sectionLabel: { color: COLORS.noteDeep, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  invitation: { color: COLORS.ink, fontFamily: FOLIO_HAND_FONT, fontSize: 17, lineHeight: 25, marginBottom: 2 },
  createButton: {
    position: 'relative', overflow: 'hidden', minHeight: 108, flexDirection: 'row', alignItems: 'center',
    gap: 8, borderRadius: RADIUS.lg, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 12, ...SHADOWS.card,
  },
  noteButton: { backgroundColor: COLORS.notePaper, borderColor: COLORS.noteCrayon },
  notebookButton: { backgroundColor: COLORS.createPaper, borderColor: COLORS.createCrayon },
  createIcon: { width: 50, height: 60, flexShrink: 0 },
  createCopy: { flex: 1, minWidth: 0, gap: 2 },
  createTitle: { fontFamily: FOLIO_HAND_FONT, fontSize: 20, lineHeight: 29, flexShrink: 1 },
  noteText: { color: COLORS.noteDeep },
  notebookText: { color: COLORS.createDeep },
  createSubtitle: { color: '#4F4740', fontSize: 12, fontWeight: '700', lineHeight: 17 },
  createArrow: { width: 18, height: 18, flexShrink: 0 },
  noteArrow: { tintColor: COLORS.noteDeep },
  notebookArrow: { tintColor: COLORS.createDeep },
  browseArea: { gap: 12 },
  browseHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headingRule: { height: 1, flex: 1, backgroundColor: COLORS.line },
  destinationRow: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  destination: {
    flex: 1, minWidth: 0, minHeight: 205, paddingHorizontal: 2, paddingTop: 2,
    paddingBottom: 9, alignItems: 'center', justifyContent: 'flex-end',
  },
  illustration: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: 154 },
  destinationArt: { width: '100%', height: '100%' },
  shelfArt: { transform: [{ scale: 1.2 }] },
  destinationTitle: { color: COLORS.ink, fontFamily: FOLIO_HAND_FONT, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  destinationCount: { color: COLORS.muted, fontSize: 11, fontWeight: '800', marginTop: 2, textAlign: 'center' },
  collection: { gap: 14, paddingTop: 10 },
  collectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  collectionHeadingCopy: { flex: 1, minWidth: 0, gap: 3 },
  collectionDescription: { color: COLORS.ink, fontFamily: FOLIO_HAND_FONT, fontSize: 15, lineHeight: 23 },
  smallAction: {
    minHeight: 44, justifyContent: 'center', borderRadius: RADIUS.pill,
    paddingHorizontal: 13, backgroundColor: COLORS.notePaper, borderWidth: 1, borderColor: COLORS.noteCrayon,
  },
  smallActionText: { color: COLORS.noteDeep, fontWeight: '900', fontSize: 12 },
  greenAction: { backgroundColor: COLORS.createPaper, borderColor: COLORS.createCrayon },
  greenActionText: { color: COLORS.createDeep },
  pressed: { opacity: 0.92, transform: [{ scale: 0.985 }] },
});

/**
 * Notes screen.
 *
 * This route is a fast, freeform note-taking workspace. It intentionally does
 * not force every thought into a flashcard. Notes can later become source
 * material for decks, prompts, or study plans.
 */
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  PixelRatio,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { NotesLanding, type NotesLandingView } from '@/components/notes/notes-landing';
import { RuledNotebookPaper } from '@/components/notes/ruled-notebook-paper';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';
import { folioReviewAssets } from '@/folio-review/folioReviewAssets';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import { FIRST_SHELF } from '@/lib/notebook-shelves';
import {
  deleteNotebook as deleteStoredNotebook,
  deleteNote as deleteStoredNote,
  createNotebook,
  createNotebookShelf,
  deleteNotebookShelf,
  getNotebooks,
  getNotebookShelves,
  getNotes,
  moveNotebookToShelf,
  moveNoteOutOfNotebook,
  moveNoteToNotebook,
  renameNotebookShelf,
  renameNotebook,
  saveNote,
} from '@/storage/notes';
import type { Notebook, NotebookShelf, StudyNote } from '@/types/note';

const notesPanelSwatch = require('../../../assets/folio-ui/home-page/swatches/home_notes_panel_swatch.png');

const NOTEBOOK_LINE_HEIGHT = 28;
const NOTEBOOK_FONT_SIZE = 17;
const NOTEBOOK_TEXT_TOP_PADDING = 47;

type SortDirection = 'newest' | 'oldest';
type NoteCardVariant = 'sidebar' | 'overview';

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Saved note';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function getPreview(value: string) {
  const preview = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1)
    .join(' ');

  if (!preview) {
    return 'Tap to keep writing';
  }

  return preview.length > 52 ? `${preview.slice(0, 51)}…` : preview;
}

function createNotebookDrafts(notebooks: Notebook[]) {
  return notebooks.reduce<Record<string, string>>((drafts, notebook) => {
    drafts[notebook.id] = notebook.name;
    return drafts;
  }, {});
}

function sortNotesByCreatedAt(notes: StudyNote[], direction: SortDirection) {
  return [...notes].sort((a, b) =>
    direction === 'newest'
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt)
  );
}


type NoteCardProps = {
  note: StudyNote;
  variant?: NoteCardVariant;
  nested?: boolean;
  isActive?: boolean;
  isNotebookPickerOpen?: boolean;
  currentNotebook?: Notebook;
  notebooks?: Notebook[];
  notebookCounts?: Record<string, number>;
  isCreatingNotebook?: boolean;
  notebookNameDraft?: string;
  onOpen: (note: StudyNote) => void;
  onDelete: (note: StudyNote) => void;
  onToggleNotebookPicker?: (noteId: string) => void;
  onAssignNotebook?: (noteId: string, notebookId: string) => void;
  onRemoveFromNotebook?: (noteId: string) => void;
  onStartCreateNotebook?: (noteId: string) => void;
  onCancelCreateNotebook?: () => void;
  onNotebookNameChange?: (value: string) => void;
  onCreateNotebook?: (noteId: string) => void;
};

type NoteCardVisualProps = {
  note: StudyNote;
  variant?: NoteCardVariant;
  isActive?: boolean;
};

function NoteCardVisual({ note, variant = 'sidebar', isActive = false }: NoteCardVisualProps) {
  if (variant === 'overview') {
    return (
      <View style={styles.notebookNoteTextGroup}>
        <Text numberOfLines={2} style={styles.notebookNoteTitle}>
          {note.title}
        </Text>
        <Text numberOfLines={3} style={styles.notebookNotePreview}>
          {getPreview(note.body)}
        </Text>
        <Text style={styles.noteListDate}>{formatUpdatedAt(note.createdAt)}</Text>
      </View>
    );
  }

  return (
    <>
      <Text numberOfLines={2} style={[styles.noteListTitle, isActive && styles.noteListTitleActive]}>
        {note.title}
      </Text>
      <Text numberOfLines={2} style={styles.noteListPreview}>
        {getPreview(note.body)}
      </Text>
      <Text style={styles.noteListDate}>{formatUpdatedAt(note.updatedAt)}</Text>
    </>
  );
}

function NoteCard({
  note,
  variant = 'sidebar',
  nested = false,
  isActive = false,
  isNotebookPickerOpen = false,
  currentNotebook,
  notebooks = [],
  notebookCounts = {},
  isCreatingNotebook = false,
  notebookNameDraft = '',
  onOpen,
  onDelete,
  onToggleNotebookPicker,
  onAssignNotebook,
  onRemoveFromNotebook,
  onStartCreateNotebook,
  onCancelCreateNotebook,
  onNotebookNameChange,
  onCreateNotebook,
}: NoteCardProps) {
  const showNotebookControls = variant === 'sidebar';

  return (
    <View
      style={[
        variant === 'overview' ? styles.notebookNoteCard : styles.noteListItem,
        nested && styles.noteListItemNested,
        isActive && styles.noteListItemActive,
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open note ${note.title}`}
        onPress={() => onOpen(note)}
        style={({ pressed }) => [
          variant === 'overview' ? styles.notebookNotePressArea : styles.notePressArea,
          pressed && styles.pressed,
        ]}>
        <NoteCardVisual note={note} variant={variant} isActive={isActive} />
      </Pressable>

      {showNotebookControls ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={currentNotebook ? `Change notebook for ${note.title}` : `Add ${note.title} to a notebook`}
            onPress={() => onToggleNotebookPicker?.(note.id)}
            style={({ pressed }) => [styles.notebookAssignmentButton, pressed && styles.pressed]}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.notebookAssignmentButtonText}>
              {currentNotebook ? `Notebook - ${currentNotebook.name}` : 'Add to notebook'}
            </Text>
          </Pressable>

          {isNotebookPickerOpen ? (
            <View style={styles.notebookPicker}>
              <Text style={styles.notebookPickerTitle}>Choose a notebook</Text>
              {notebooks.map((notebook) => {
                const isCurrent = notebook.id === currentNotebook?.id;
                const count = notebookCounts[notebook.id] ?? 0;

                return (
                  <Pressable
                    key={notebook.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${isCurrent ? 'Current notebook' : 'Move note to'} ${notebook.name}`}
                    onPress={() => onAssignNotebook?.(note.id, notebook.id)}
                    style={({ pressed }) => [
                      styles.notebookPickerOption,
                      isCurrent && styles.notebookPickerOptionCurrent,
                      pressed && styles.pressed,
                    ]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.notebookPickerOptionName}>
                      {notebook.name}
                    </Text>
                    <Text style={styles.notebookPickerOptionMeta}>
                      {isCurrent ? 'Current' : `${count} ${count === 1 ? 'note' : 'notes'}`}
                    </Text>
                  </Pressable>
                );
              })}

              {currentNotebook ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${note.title} from ${currentNotebook.name}`}
                  onPress={() => onRemoveFromNotebook?.(note.id)}
                  style={({ pressed }) => [styles.notebookPickerRemove, pressed && styles.pressed]}>
                  <Text style={styles.notebookPickerRemoveText}>Remove from notebook</Text>
                </Pressable>
              ) : null}

              {isCreatingNotebook ? (
                <View style={styles.notebookCreateForm}>
                  <TextInput
                    accessibilityLabel="New notebook name"
                    autoFocus
                    maxLength={36}
                    onChangeText={onNotebookNameChange}
                    placeholder="Notebook name"
                    placeholderTextColor={COLORS.muted}
                    style={styles.notebookCreateInput}
                    value={notebookNameDraft}
                  />
                  <View style={styles.notebookCreateActions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Cancel new notebook"
                      onPress={onCancelCreateNotebook}
                      style={({ pressed }) => [styles.notebookCreateCancel, pressed && styles.pressed]}>
                      <Text style={styles.notebookCreateCancelText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Create notebook"
                      onPress={() => onCreateNotebook?.(note.id)}
                      style={({ pressed }) => [styles.notebookCreateSubmit, pressed && styles.pressed]}>
                      <Text style={styles.notebookCreateSubmitText}>Create</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Create a new notebook for ${note.title}`}
                  onPress={() => onStartCreateNotebook?.(note.id)}
                  style={({ pressed }) => [styles.newNotebookButton, pressed && styles.pressed]}>
                  <Text style={styles.newNotebookButtonText}>+ New notebook</Text>
                </Pressable>
              )}
            </View>
          ) : null}
        </>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete ${note.title}`}
        onPress={() => onDelete(note)}
        style={({ pressed }) => [styles.deleteNoteButton, pressed && styles.pressed]}>
        <Text style={styles.deleteNoteButtonText}>×</Text>
      </Pressable>
    </View>
  );
}

type NotesPresentationProps = {
  isEditorOpen: boolean;
  isNotebookOverviewOpen: boolean;
  isKeyboardVisible: boolean;
  isDirty: boolean;
  landingView: NotesLandingView;
  looseNotes: StudyNote[];
  notebookGroups: { notebook: Notebook; notes: StudyNote[] }[];
  shelves: NotebookShelf[];
  newNotebookShelfId?: string;
  selectedNote?: StudyNote;
  selectedNotebook?: Notebook;
  quickCaptureBody: string;
  saveStatusMessage: string;
  onQuickCaptureChange: (value: string) => void;
  onQuickCaptureSave: () => void;
  onOpenBlankNote: () => void;
  onOpenNewNotebook: (shelfId?: string) => void;
  onOpenLooseNotes: () => void;
  onOpenNotebooks: () => void;
  onBackToHub: () => void;
  onCreateNotebook: (name: string, shelfId: string) => boolean;
  onAddShelf: (name: string) => boolean;
  onRenameShelf: (shelfId: string, name: string) => boolean;
  onDeleteShelf: (shelfId: string) => boolean;
  onMoveNotebook: (notebookId: string, shelfId: string) => boolean;
  onOpenNotebook: (notebook: Notebook) => void;
  onLeaveNotes: () => void;
  onBackToNotes: () => void;
  onSaveCurrentNote: () => void;
  onDeleteSelectedNote: (note: StudyNote) => void;
  renderEditor: () => React.ReactNode;
  renderNote: (note: StudyNote) => React.ReactNode;
};

function NotesPresentation({
  isDirty,
  isEditorOpen,
  isKeyboardVisible,
  isNotebookOverviewOpen,
  landingView,
  looseNotes,
  notebookGroups,
  shelves,
  newNotebookShelfId,
  onBackToNotes,
  onBackToHub,
  onCreateNotebook,
  onAddShelf,
  onRenameShelf,
  onDeleteShelf,
  onMoveNotebook,
  onOpenNotebook,
  onDeleteSelectedNote,
  onLeaveNotes,
  onOpenBlankNote,
  onOpenLooseNotes,
  onOpenNewNotebook,
  onOpenNotebooks,
  onQuickCaptureChange,
  onQuickCaptureSave,
  onSaveCurrentNote,
  quickCaptureBody,
  renderEditor,
  renderNote,
  saveStatusMessage,
  selectedNote,
  selectedNotebook,
}: NotesPresentationProps) {
  const insets = useSafeAreaInsets();
  const landingScrollRef = useRef<ScrollView>(null);
  const isHub = landingView === 'hub';
  const landingTitle = isHub
    ? 'Thoughts worth keeping.'
    : landingView === 'loose'
      ? 'Loose notes'
      : 'Your notebooks';
  const landingSection = landingView === 'new-notebook' ? 'notebooks' : landingView;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      landingScrollRef.current?.scrollTo({ y: 0, animated: false });
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [landingSection]);

  return (
    <ImageBackground source={folioReviewAssets.background.pagePaper} resizeMode="cover" imageStyle={styles.pagePaperImage} style={[styles.screen, styles.pageBackground]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.screen}>
        <View style={styles.screenRoot}>
          <View
            style={[
              styles.notesPage,
              {
                paddingTop: insets.top + 8,
                paddingBottom: isKeyboardVisible ? Math.max(insets.bottom, 12) : insets.bottom + 18,
              },
            ]}>
          {isEditorOpen ? (
            <>
              <View style={styles.focusedHeader}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Back to Notes"
                  onPress={onBackToNotes}
                  style={({ pressed }) => [styles.notesBackButton, pressed && styles.pressed]}>
                  <Text style={styles.notesBackButtonText}>‹ Notes</Text>
                </Pressable>

                <View style={styles.focusedHeaderTitle}>
                  <Text style={styles.focusedEyebrow}>{isNotebookOverviewOpen ? 'NOTEBOOK' : 'FOCUSED EDITOR'}</Text>
                  <Text numberOfLines={1} style={styles.focusedTitle}>
                    {isNotebookOverviewOpen ? selectedNotebook?.name ?? 'Notebook' : selectedNote ? 'Edit note' : 'New note'}
                  </Text>
                </View>

                {!isNotebookOverviewOpen ? (
                  <View style={styles.focusedHeaderActions}>
                    {selectedNote ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${selectedNote.title}`}
                        onPress={() => onDeleteSelectedNote(selectedNote)}
                        style={({ pressed }) => [styles.deleteHeaderButton, pressed && styles.pressed]}>
                        <Text style={styles.deleteHeaderButtonText}>Delete</Text>
                      </Pressable>
                    ) : null}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Save note"
                      accessibilityState={{ disabled: !isDirty }}
                      disabled={!isDirty}
                      onPress={onSaveCurrentNote}
                      style={({ pressed }) => [
                        styles.primaryActionButton,
                        !isDirty && styles.primaryActionButtonDisabled,
                        pressed && styles.pressed,
                      ]}>
                      {isDirty ? <HomePanelFill source={notesPanelSwatch} opacity={1} /> : null}
                      <Text style={[styles.primaryActionButtonText, !isDirty && styles.primaryActionButtonTextDisabled]}>Save note</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>

              {saveStatusMessage ? (
                <View pointerEvents="none" style={styles.saveStatusPill}>
                  <Text style={styles.saveStatusText}>{saveStatusMessage}</Text>
                </View>
              ) : null}

              <View style={styles.focusedEditorFrame}>{renderEditor()}</View>
            </>
          ) : (
            <>
              <View style={styles.notesHeader}>
                <View style={styles.notesHeaderTop}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isHub ? 'Back home' : 'Back to Notes'}
                    onPress={isHub ? onLeaveNotes : onBackToHub}
                    style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}>
                    <Text style={styles.homeButtonText}>{isHub ? 'Back home' : '< Notes'}</Text>
                  </Pressable>
                  <Image source={folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.notesWordmark} />
                </View>
                <View style={styles.notesHeaderCopy}>
                  <Text style={styles.notesEyebrow}>NOTES</Text>
                  <Text style={styles.notesTitle}>{landingTitle}</Text>
                </View>
              </View>

              {saveStatusMessage ? (
                <View pointerEvents="none" style={styles.saveStatusPill}>
                  <Text style={styles.saveStatusText}>{saveStatusMessage}</Text>
                </View>
              ) : null}

              <ScrollView
                key={landingSection}
                ref={landingScrollRef}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={!isHub}
                style={styles.landingScroll}
                contentContainerStyle={styles.landingScrollContent}>
                <NotesLanding
                  view={landingView}
                  looseNotes={looseNotes}
                  notebookGroups={notebookGroups}
                  shelves={shelves}
                  newNotebookShelfId={newNotebookShelfId}
                  quickCaptureBody={quickCaptureBody}
                  onQuickCaptureChange={onQuickCaptureChange}
                  onQuickCaptureSave={onQuickCaptureSave}
                  onNewNote={onOpenBlankNote}
                  onNewNotebook={onOpenNewNotebook}
                  onOpenLooseNotes={onOpenLooseNotes}
                  onOpenNotebooks={onOpenNotebooks}
                  onCreateNotebook={onCreateNotebook}
                  onAddShelf={onAddShelf}
                  onRenameShelf={onRenameShelf}
                  onDeleteShelf={onDeleteShelf}
                  onMoveNotebook={onMoveNotebook}
                  onOpenNotebook={onOpenNotebook}
                  renderNote={renderNote}
                />
              </ScrollView>
            </>
          )}
          </View>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, fontScale } = useWindowDimensions();

  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [shelves, setShelves] = useState<NotebookShelf[]>([FIRST_SHELF]);
  const [newNotebookShelfId, setNewNotebookShelfId] = useState<string | undefined>();
  const [notebookNameDrafts, setNotebookNameDrafts] = useState<Record<string, string>>({});
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | undefined>();
  const [isNotebookOverviewOpen, setIsNotebookOverviewOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [landingView, setLandingView] = useState<NotesLandingView>('hub');
  const [quickCaptureBody, setQuickCaptureBody] = useState('');
  const [body, setBody] = useState('');
  const [openNotebookPickerNoteId, setOpenNotebookPickerNoteId] = useState<string | null>(null);
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
  const [notebookNameDraft, setNotebookNameDraft] = useState('');
  const [editorViewportHeight, setEditorViewportHeight] = useState(0);
  const [editorContentHeight, setEditorContentHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [notebookSortDirection, setNotebookSortDirection] = useState<SortDirection>('newest');
  const [saveStatusMessage, setSaveStatusMessage] = useState('');
  const [isSavedPanelOpen, setIsSavedPanelOpen] = useState(false);
  const [isEmptyNoteWarningVisible, setIsEmptyNoteWarningVisible] = useState(false);

  const editorInputRef = useRef<TextInput | null>(null);
  const editorScrollRef = useRef<ScrollView | null>(null);
  const bodyRef = useRef('');
  const quickCaptureBodyRef = useRef('');
  const selectedNoteIdRef = useRef<string | undefined>(undefined);
  const selectedNotebookIdRef = useRef<string | undefined>(undefined);
  const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emptyNoteWarningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorScrollY = useRef(new Animated.Value(0)).current;
  const editorScrollOffsetRef = useRef(0);
  const editorSelectionRef = useRef({ start: 0, end: 0 });

  const [isEditorArmed, setIsEditorArmed] = useState(false);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId),
    [notes, selectedNoteId]
  );

  const selectedNotebook = useMemo(
    () => notebooks.find((notebook) => notebook.id === selectedNotebookId),
    [notebooks, selectedNotebookId]
  );

  const notebookGroups = useMemo(
    () =>
      notebooks
        .map((notebook) => ({
          notebook,
          notes: notes.filter((note) => note.notebookId === notebook.id),
        })),
    [notebooks, notes]
  );

  const looseNotes = useMemo(() => notes.filter((note) => !note.notebookId), [notes]);

  const notebookCounts = useMemo(
    () =>
      notes.reduce<Record<string, number>>((counts, note) => {
        if (note.notebookId) {
          counts[note.notebookId] = (counts[note.notebookId] ?? 0) + 1;
        }

        return counts;
      }, {}),
    [notes]
  );

  const selectedNotebookNotes = useMemo(
    () =>
      selectedNotebookId
        ? sortNotesByCreatedAt(
            notes.filter((note) => note.notebookId === selectedNotebookId),
            notebookSortDirection
          )
        : [],
    [notebookSortDirection, notes, selectedNotebookId]
  );

  const isDirty = selectedNote ? selectedNote.body !== body : body.trim().length > 0;
  const sidePanelWidth = Math.min(Math.max(width * 0.3, 108), 162);
  const editorAvailableWidth = isSavedPanelOpen ? width - sidePanelWidth : width;
  const selectedNotebookDraftName = selectedNotebook
    ? notebookNameDrafts[selectedNotebook.id] ?? selectedNotebook.name
    : '';
  const notebookTitleLength = selectedNotebookDraftName.trim().length;
  const notebookDisplayTitleLength = Math.max(notebookTitleLength, 'Notebook'.length);
  const notebookToolButtonSize = Math.max(
    26,
    34 - Math.min(Math.max(notebookDisplayTitleLength - 8, 0), 8)
  );
  const notebookToolIconSize = Math.max(12, notebookToolButtonSize - 16);
  const notebookTitleNaturalWidth = Math.max(86, notebookDisplayTitleLength * 8.6 + 22);
  const notebookTitleEstimatedCharacterWidth = notebookDisplayTitleLength * 0.58;
  const notebookTitleFontSize = Math.max(
    9,
    Math.min(17, (Math.min(notebookTitleNaturalWidth, 224) - 16) / notebookTitleEstimatedCharacterWidth)
  );
  const notebookTitleInputWidth = Math.min(224, notebookTitleNaturalWidth);
  const keyboardScrollPadding = isKeyboardVisible
    ? Math.min(Math.max(keyboardHeight * 0.72, 128), 280)
    : 0;
  const editorBottomPadding = 38;
  const editorLineHeight = PixelRatio.roundToNearestPixel(NOTEBOOK_LINE_HEIGHT * fontScale);
  const editorFontSize = PixelRatio.roundToNearestPixel(NOTEBOOK_FONT_SIZE * fontScale);

  function normalizeEditorContentHeight(value: number) {
    const safeValue = Number.isFinite(value) ? Math.max(value, editorLineHeight) : editorLineHeight;
    return Math.ceil(safeValue / editorLineHeight) * editorLineHeight;
  }

  const editorScrollContentHeight = Math.max(
    editorViewportHeight,
    editorContentHeight + editorBottomPadding + keyboardScrollPadding
  );
  const editorSurfaceHeight = Math.ceil(editorScrollContentHeight / editorLineHeight) * editorLineHeight;
  const shouldScrollEditor =
    editorViewportHeight > 0 &&
    editorScrollContentHeight > editorViewportHeight + editorLineHeight;
  const shouldAllowEditorScroll = true;

  useEffect(() => {
    refreshNotesState();
    setActiveNoteId(undefined);
    setActiveNotebookId(undefined);
    setIsNotebookOverviewOpen(false);
    setIsEditorOpen(false);
    setIsSavedPanelOpen(false);
    setIsEditorArmed(false);
    editorScrollY.setValue(0);
    editorScrollOffsetRef.current = 0;
    setEditorContentHeight(0);
    bodyRef.current = '';
    setDraftBody('');
    quickCaptureBodyRef.current = '';
    setQuickCaptureBody('');
  }, []);

  useEffect(() => {
    bodyRef.current = body;
  }, [body]);

  useEffect(() => {
    return () => {
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      if (emptyNoteWarningTimeoutRef.current) {
        clearTimeout(emptyNoteWarningTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
      editorScrollRef.current?.scrollTo({ y: Math.max(editorScrollOffsetRef.current, 0), animated: false });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!shouldScrollEditor && !isKeyboardVisible) {
      editorScrollY.setValue(0);
      editorScrollOffsetRef.current = 0;
    }
  }, [editorScrollY, isKeyboardVisible, shouldScrollEditor]);

  useEffect(() => {
    if (!isKeyboardVisible || !isEditorArmed) {
      return;
    }

    requestAnimationFrame(() => {
      keepCaretVisible(editorSelectionRef.current, bodyRef.current, { animated: false });
    });
  }, [editorSurfaceHeight, editorViewportHeight, isEditorArmed, isKeyboardVisible, keyboardHeight]);

  function refreshNotesState() {
    const nextNotes = getNotes();
    const nextNotebooks = getNotebooks();
    const nextShelves = getNotebookShelves();

    setNotes(nextNotes);
    setNotebooks(nextNotebooks);
    setShelves(nextShelves);
    setNotebookNameDrafts(createNotebookDrafts(nextNotebooks));

    return {
      notes: nextNotes,
      notebooks: nextNotebooks,
      shelves: nextShelves,
    };
  }

  function setActiveNoteId(noteId: string | undefined) {
    selectedNoteIdRef.current = noteId;
    setSelectedNoteId(noteId);
  }

  function setActiveNotebookId(notebookId: string | undefined) {
    selectedNotebookIdRef.current = notebookId;
    setSelectedNotebookId(notebookId);
  }

  function closeNotebookPicker() {
    setOpenNotebookPickerNoteId(null);
    setIsCreatingNotebook(false);
    setNotebookNameDraft('');
  }

  function toggleNotebookPicker(noteId: string) {
    setOpenNotebookPickerNoteId((currentNoteId) => {
      const nextNoteId = currentNoteId === noteId ? null : noteId;

      setIsCreatingNotebook(false);
      setNotebookNameDraft('');
      return nextNoteId;
    });
  }

  function startCreateNotebook(noteId: string) {
    setOpenNotebookPickerNoteId(noteId);
    setIsCreatingNotebook(true);
    setNotebookNameDraft('');
  }

  function cancelCreateNotebook() {
    setIsCreatingNotebook(false);
    setNotebookNameDraft('');
  }

  function applyNotebookResult(result: ReturnType<typeof moveNoteToNotebook> | ReturnType<typeof moveNoteOutOfNotebook>) {
    if (!result) {
      showSaveStatus('Could not update notebook');
      return false;
    }

    setNotes(result.notes);
    setNotebooks(result.notebooks);
    setNotebookNameDrafts(createNotebookDrafts(result.notebooks));
    closeNotebookPicker();
    return true;
  }

  function assignNoteToNotebook(noteId: string, notebookId: string) {
    applyNotebookResult(moveNoteToNotebook(noteId, notebookId));
  }

  function removeNoteFromNotebook(noteId: string) {
    applyNotebookResult(moveNoteOutOfNotebook(noteId));
  }

  function createNotebookForNote(noteId: string) {
    const name = notebookNameDraft.trim();

    if (!name) {
      showSaveStatus('Name your notebook');
      return;
    }

    const notebook = createNotebook(name);

    if (!notebook) {
      showSaveStatus('Could not create notebook');
      return;
    }

    const moved = moveNoteToNotebook(noteId, notebook.id);

    if (!applyNotebookResult(moved)) {
      showSaveStatus('Could not add note to notebook');
    }
  }

  function createNotebookFromLanding(name: string, shelfId: string) {
    const notebook = createNotebook(name, shelfId);

    if (!notebook) {
      return false;
    }

    refreshNotesState();
    setNewNotebookShelfId(undefined);
    setLandingView('notebooks');
    openNotebook(notebook);
    return true;
  }

  function addShelfFromLanding(name: string) {
    const shelf = createNotebookShelf(name);
    if (!shelf) {
      return false;
    }
    setShelves(getNotebookShelves());
    return true;
  }

  function renameShelfFromLanding(shelfId: string, name: string) {
    if (!renameNotebookShelf(shelfId, name)) {
      return false;
    }
    setShelves(getNotebookShelves());
    return true;
  }

  function deleteShelfFromLanding(shelfId: string) {
    const result = deleteNotebookShelf(shelfId);
    if (!result) {
      return false;
    }
    setShelves(result.shelves);
    setNotebooks(result.notebooks);
    if (newNotebookShelfId === shelfId) {
      setNewNotebookShelfId(undefined);
    }
    return true;
  }

  function moveNotebookFromLanding(notebookId: string, shelfId: string) {
    if (!moveNotebookToShelf(notebookId, shelfId)) {
      return false;
    }
    refreshNotesState();
    return true;
  }

  function setDraftBody(value: string) {
    bodyRef.current = value;
    setBody(value);
  }

  function setQuickCaptureDraft(value: string) {
    quickCaptureBodyRef.current = value;
    setQuickCaptureBody(value);
  }

  function saveQuickCapture() {
    const draft = quickCaptureBodyRef.current;

    if (!draft.trim()) {
      return;
    }

    const savedNote = saveNote({ body: draft });
    const refreshed = refreshNotesState();
    const verifiedNote = refreshed.notes.find((note) => note.id === savedNote.id);

    if (!verifiedNote) {
      showSaveStatus('Save failed');
      return;
    }

    quickCaptureBodyRef.current = '';
    setQuickCaptureBody('');
    showSaveStatus('Saved');
  }

  function showSaveStatus(message = 'Saved') {
    setSaveStatusMessage(message);

    if (saveStatusTimeoutRef.current) {
      clearTimeout(saveStatusTimeoutRef.current);
    }

    saveStatusTimeoutRef.current = setTimeout(() => {
      setSaveStatusMessage('');
    }, 1500);
  }

  function pulseEmptyNoteActions() {
    setIsEmptyNoteWarningVisible(true);

    if (emptyNoteWarningTimeoutRef.current) {
      clearTimeout(emptyNoteWarningTimeoutRef.current);
    }

    emptyNoteWarningTimeoutRef.current = setTimeout(() => {
      setIsEmptyNoteWarningVisible(false);
    }, 340);
  }

  function upsertSavedNoteLocally(savedNote: StudyNote) {
    setNotes((currentNotes) => {
      const withoutSavedNote = currentNotes.filter((note) => note.id !== savedNote.id);

      return [savedNote, ...withoutSavedNote].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    });
  }

  function saveBodyToStorage(bodyToSave: string, options?: { silent?: boolean }) {
    const currentNoteId = selectedNoteIdRef.current ?? selectedNoteId;
    const currentNotebookId = selectedNotebookIdRef.current ?? selectedNotebookId;

    if (!currentNoteId && bodyToSave.trim().length === 0) {
      return undefined;
    }

    const storedExistingNote = currentNoteId
      ? getNotes().find((note) => note.id === currentNoteId)
      : undefined;
    const savedNote = saveNote({
      id: currentNoteId,
      body: bodyToSave,
      notebookId: storedExistingNote?.notebookId ?? selectedNote?.notebookId ?? currentNotebookId,
    });

    const refreshed = refreshNotesState();
    const verifiedNote = refreshed.notes.find((note) => note.id === savedNote.id);

    if (!verifiedNote || verifiedNote.body !== bodyToSave) {
      if (!options?.silent) {
        showSaveStatus('Save failed');
      }

      return undefined;
    }

    upsertSavedNoteLocally(verifiedNote);
    setActiveNoteId(verifiedNote.id);
    setActiveNotebookId(verifiedNote.notebookId);

    if (bodyRef.current === bodyToSave) {
      setDraftBody(verifiedNote.body);
    }

    if (!options?.silent) {
      showSaveStatus('Saved');
    }

    return verifiedNote;
  }

  function scheduleAutoSave(bodyToSave: string) {
    const currentNoteId = selectedNoteIdRef.current ?? selectedNoteId;

    if (!currentNoteId) {
      return;
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveBodyToStorage(bodyToSave, { silent: true });
    }, 350);
  }

  function persistCurrentDraft() {
    /**
     * A brand-new empty draft does not need to be stored.
     * Existing notes are still saved even if the user clears the body on purpose.
     */
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }

    return saveBodyToStorage(bodyRef.current);
  }

  function shouldPersistCurrentDraft() {
    const currentNoteId = selectedNoteIdRef.current ?? selectedNoteId;
    const currentBody = bodyRef.current;

    return Boolean(currentNoteId) || currentBody.trim().length > 0;
  }

  function isBlankNewNoteDraft() {
    const currentNoteId = selectedNoteIdRef.current ?? selectedNoteId;

    return !currentNoteId && bodyRef.current.trim().length === 0;
  }

  function openStoredNoteById(noteId: string, fallbackNote?: StudyNote) {
    const latestNote = getNotes().find((note) => note.id === noteId) ?? fallbackNote;

    if (!latestNote) {
      refreshNotesState();
      return;
    }

    setActiveNoteId(latestNote.id);
    setActiveNotebookId(latestNote.notebookId);
    setIsNotebookOverviewOpen(false);
    setIsEditorOpen(true);
    setIsEditorArmed(false);
    editorScrollY.setValue(0);
    editorScrollOffsetRef.current = 0;
    editorSelectionRef.current = { start: 0, end: 0 };
    setEditorContentHeight(0);
    setDraftBody(latestNote.body);
  }

  function openBlankNote() {
    closeNotebookPicker();

    if (isEditorOpen && isBlankNewNoteDraft()) {
      pulseEmptyNoteActions();
      showSaveStatus('Already blank');
      return;
    }

    if (isEditorOpen && shouldPersistCurrentDraft()) {
      persistCurrentDraft();
    }

    setActiveNoteId(undefined);
    setActiveNotebookId(undefined);
    setIsNotebookOverviewOpen(false);
    setIsEditorOpen(true);
    setDraftBody('');
  }

  function openBlankNoteInNotebook(notebook: Notebook) {
    closeNotebookPicker();

    if (shouldPersistCurrentDraft()) {
      persistCurrentDraft();
    }

    setActiveNoteId(undefined);
    setActiveNotebookId(notebook.id);
    setIsNotebookOverviewOpen(false);
    setIsEditorOpen(true);
    setIsEditorArmed(false);
    editorScrollY.setValue(0);
    editorScrollOffsetRef.current = 0;
    editorSelectionRef.current = { start: 0, end: 0 };
    setEditorContentHeight(0);
    setDraftBody('');
  }

  function openNotebook(notebook: Notebook) {
    closeNotebookPicker();

    if (shouldPersistCurrentDraft()) {
      persistCurrentDraft();
    }

    setActiveNoteId(undefined);
    setActiveNotebookId(notebook.id);
    setIsNotebookOverviewOpen(true);
    setIsEditorOpen(true);
    setIsEditorArmed(false);
    editorScrollY.setValue(0);
    editorScrollOffsetRef.current = 0;
    setEditorContentHeight(0);
    setDraftBody('');
  }

  function openExistingNote(note: StudyNote) {
    closeNotebookPicker();

    const currentNoteId = selectedNoteIdRef.current ?? selectedNoteId;
    const isNoteEditorOpen = isEditorOpen && !isNotebookOverviewOpen;

    if (isNoteEditorOpen && note.id === currentNoteId) {
      return;
    }

    if (isNoteEditorOpen && shouldPersistCurrentDraft()) {
      persistCurrentDraft();
    }

    /**
     * Do not trust the note object from the rendered list after saving.
     * It may be one render behind. Re-read by ID from storage before opening.
     */
    openStoredNoteById(note.id, note);
  }

  function handleEditorSurfacePress() {
    /**
     * Opening/selecting a note should not immediately summon the keyboard.
     * First tap arms the editor. Second tap focuses the TextInput.
     */
    if (!isEditorArmed) {
      setIsEditorArmed(true);
      return;
    }

    editorInputRef.current?.focus();
  }

  function keepCaretVisible(
    selection = editorSelectionRef.current,
    value = bodyRef.current,
    options: { animated?: boolean } = {}
  ) {
    if (!isKeyboardVisible || !isEditorArmed || editorViewportHeight <= 0) {
      return;
    }

    const safeSelection = selection ?? editorSelectionRef.current ?? { start: 0, end: 0 };
    const selectionEnd = Math.min(Math.max(safeSelection.end ?? 0, 0), value.length);
    const textBeforeCaret = value.slice(0, selectionEnd);
    const linesBeforeCaret = textBeforeCaret.split('\n');
    const explicitLineIndex = Math.max(linesBeforeCaret.length - 1, 0);
    const currentLineText = linesBeforeCaret[linesBeforeCaret.length - 1] ?? '';
    const estimatedTextWidth = Math.max(160, editorAvailableWidth - 116);
    const estimatedCharsPerLine = Math.max(18, Math.floor(estimatedTextWidth / 9));
    const estimatedSoftWrapRows = Math.floor(currentLineText.length / estimatedCharsPerLine);
    const estimatedCaretLine = explicitLineIndex + estimatedSoftWrapRows;
    const caretY = NOTEBOOK_TEXT_TOP_PADDING + (estimatedCaretLine + 1) * editorLineHeight;
    const visibleTop = editorScrollOffsetRef.current;
    const safeVisibleBottom =
      visibleTop + editorViewportHeight - keyboardScrollPadding - editorLineHeight * 2;

    if (caretY <= safeVisibleBottom) {
      return;
    }

    const targetY =
      caretY - (editorViewportHeight - keyboardScrollPadding - editorLineHeight * 3);
    const maxY = Math.max(0, editorSurfaceHeight - editorViewportHeight);
    const nextY = Math.min(Math.max(targetY, 0), maxY);

    if (Math.abs(nextY - visibleTop) < 4) {
      return;
    }

    editorScrollOffsetRef.current = nextY;
    editorScrollRef.current?.scrollTo({ y: nextY, animated: options.animated ?? true });
  }


  function handleEditorBodyChange(value: string) {
    const previousBody = bodyRef.current;
    const textGrew = value.length > previousBody.length;

    setDraftBody(value);
    scheduleAutoSave(value);

    /**
     * Keep the caret above the keyboard. When the user is actively adding text,
     * bias toward pushing the note upward again instead of trapping the cursor
     * under the keyboard.
     */
    requestAnimationFrame(() => {
      const targetSelection = textGrew
        ? { start: value.length, end: value.length }
        : editorSelectionRef.current;

      keepCaretVisible(targetSelection, value, { animated: false });
    });
  }

  function saveCurrentNote() {
    const savedNote = persistCurrentDraft();

    if (!savedNote) {
      pulseEmptyNoteActions();
      showSaveStatus('Add text first');
      return;
    }

    /**
     * Saving should keep the user in the same note. The New button is the action
     * that clears the editor or starts a fresh draft.
     */
    setActiveNoteId(savedNote.id);
    setActiveNotebookId(savedNote.notebookId);
    setIsNotebookOverviewOpen(false);
    setDraftBody(savedNote.body);
  }

  function restoreEditorFocusIfNeeded(shouldFocus: boolean) {
    if (!shouldFocus) {
      return;
    }

    requestAnimationFrame(() => {
      setIsEditorArmed(true);
      editorInputRef.current?.focus();
    });
  }

  function openSavedPanel() {
    const shouldRefocusEditor = isEditorArmed;

    setIsSavedPanelOpen(true);
    restoreEditorFocusIfNeeded(shouldRefocusEditor);
  }

  function closeSavedPanel() {
    const shouldRefocusEditor = isEditorArmed;

    setIsSavedPanelOpen(false);
    restoreEditorFocusIfNeeded(shouldRefocusEditor);
  }

  function goHome() {
    closeNotebookPicker();

    if (!isDirty) {
      router.replace('/');
      return;
    }

    Alert.alert('Leave notes?', 'You have unsaved note changes.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save & leave',
        onPress: () => {
          persistCurrentDraft();
          router.replace('/');
        },
      },
      {
        text: 'Leave without saving',
        style: 'destructive',
        onPress: () => router.replace('/'),
      },
    ]);
  }

  function goBackToNotes() {
    closeNotebookPicker();

    if (!isDirty) {
      setIsEditorOpen(false);
      setIsNotebookOverviewOpen(false);
      setIsEditorArmed(false);
      return;
    }

    Alert.alert('Leave note?', 'You have unsaved note changes.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Save & return',
        onPress: () => {
          persistCurrentDraft();
          setIsEditorOpen(false);
          setIsNotebookOverviewOpen(false);
          setIsEditorArmed(false);
        },
      },
      {
        text: 'Discard changes',
        style: 'destructive',
        onPress: () => {
          setIsEditorOpen(false);
          setIsNotebookOverviewOpen(false);
          setIsEditorArmed(false);
        },
      },
    ]);
  }

  function confirmDeleteNote(note: StudyNote) {
    Alert.alert('Delete note?', `Delete "${note.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete note',
        style: 'destructive',
        onPress: () => {
          const wasSelected = note.id === (selectedNoteIdRef.current ?? selectedNoteId);

          if (deleteStoredNote(note.id)) {
            refreshNotesState();

            if (wasSelected) {
              setActiveNoteId(undefined);
              setActiveNotebookId(undefined);
              setDraftBody('');
              setIsNotebookOverviewOpen(false);
              setIsEditorOpen(false);
            }
          }
        },
      },
    ]);
  }

  function confirmDeleteNotebook(notebook: Notebook) {
    Alert.alert(
      'Delete notebook?',
      `Delete "${notebook.name}"? Notes inside it will move back to Saved Notes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete notebook',
          style: 'destructive',
          onPress: () => {
            const result = deleteStoredNotebook(notebook.id);

            if (result) {
              setNotes(result.notes);
              setNotebooks(result.notebooks);
              setNotebookNameDrafts(createNotebookDrafts(result.notebooks));
              setActiveNotebookId(undefined);
              setIsNotebookOverviewOpen(false);
              setActiveNoteId(undefined);
              setDraftBody('');
            }
          },
        },
      ]
    );
  }

  function saveNotebookName(notebook: Notebook) {
    const draftName = notebookNameDrafts[notebook.id] ?? notebook.name;
    const nextName = draftName.trim().length > 0 ? draftName : 'Notebook';
    const renamedNotebook = renameNotebook(notebook.id, nextName);

    if (renamedNotebook) {
      refreshNotesState();
      setNotebookNameDrafts((drafts) => ({
        ...drafts,
        [notebook.id]: renamedNotebook.name,
      }));
    }
  }

  function toggleNotebookSortDirection() {
    setNotebookSortDirection((current) => (current === 'newest' ? 'oldest' : 'newest'));
  }

  function renderNoteListItem(note: StudyNote, variant: NoteCardVariant = 'sidebar') {
    const isActive = note.id === selectedNoteId;

    return (
      <NoteCard
        key={note.id}
        note={note}
        variant={variant}
        isActive={isActive}
        isNotebookPickerOpen={openNotebookPickerNoteId === note.id}
        currentNotebook={notebooks.find((notebook) => notebook.id === note.notebookId)}
        notebooks={notebooks}
        notebookCounts={notebookCounts}
        isCreatingNotebook={isCreatingNotebook && openNotebookPickerNoteId === note.id}
        notebookNameDraft={notebookNameDraft}
        onOpen={openExistingNote}
        onDelete={confirmDeleteNote}
        onToggleNotebookPicker={toggleNotebookPicker}
        onAssignNotebook={assignNoteToNotebook}
        onRemoveFromNotebook={removeNoteFromNotebook}
        onStartCreateNotebook={startCreateNotebook}
        onCancelCreateNotebook={cancelCreateNotebook}
        onNotebookNameChange={setNotebookNameDraft}
        onCreateNotebook={createNotebookForNote}
      />
    );
  }

  function renderNotebookListItem(group: { notebook: Notebook; notes: StudyNote[] }) {
    const isActive = group.notebook.id === selectedNotebookId;

    return (
      <View
        key={group.notebook.id}
        style={[
          styles.notebookListItem,
          isActive && styles.notebookListItemActive,
        ]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => openNotebook(group.notebook)}
          style={({ pressed }) => [styles.notebookPressArea, pressed && styles.pressed]}>
          <Text style={styles.notebookIcon}>▦</Text>
          <View style={styles.notebookSidebarTextGroup}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.notebookSidebarTitle}>
              {group.notebook.name}
            </Text>
            <Text style={styles.notebookSidebarMeta}>
              {group.notes.length} {group.notes.length === 1 ? 'note' : 'notes'}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  function renderNotebookOverview() {
    if (!selectedNotebook) {
      return null;
    }

    return (
      <View style={styles.notebookOverviewPage}>
        <View style={styles.notebookOverviewHeader}>
          <View style={styles.notebookOverviewSpacer} />

          <View style={styles.notebookOverviewActions}>
            <View style={styles.notebookTitleSlot}>
              <TextInput
                value={notebookNameDrafts[selectedNotebook.id] ?? selectedNotebook.name}
                onChangeText={(value) =>
                  setNotebookNameDrafts((drafts) => ({
                    ...drafts,
                    [selectedNotebook.id]: value,
                  }))
                }
                onBlur={() => saveNotebookName(selectedNotebook)}
                maxLength={36}
                selectTextOnFocus
                numberOfLines={1}
                multiline={false}
                style={[
                  styles.notebookOverviewTitle,
                  {
                    width: '100%',
                    maxWidth: notebookTitleInputWidth,
                    fontSize: notebookTitleFontSize,
                    lineHeight: notebookTitleFontSize + 3,
                  },
                ]}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create note in notebook"
              onPress={() => openBlankNoteInNotebook(selectedNotebook)}
              style={({ pressed }) => [
                styles.squareToolButton,
                { width: notebookToolButtonSize, height: notebookToolButtonSize },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.squareToolButtonText, { fontSize: notebookToolIconSize }]}>+</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Toggle notebook note sort"
              onPress={toggleNotebookSortDirection}
              style={({ pressed }) => [
                styles.squareToolButton,
                { width: notebookToolButtonSize, height: notebookToolButtonSize },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.squareToolButtonText, { fontSize: notebookToolIconSize }]}>
                {notebookSortDirection === 'newest' ? '↓' : '↑'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete selected notebook"
              onPress={() => confirmDeleteNotebook(selectedNotebook)}
              style={({ pressed }) => [
                styles.squareTrashButton,
                { width: notebookToolButtonSize, height: notebookToolButtonSize },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.squareTrashButtonText, { fontSize: Math.max(12, notebookToolIconSize - 1) }]}>
                🗑
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          nestedScrollEnabled
          directionalLockEnabled
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={104}
          keyboardShouldPersistTaps="always"
          style={styles.notebookOverviewList}
          contentContainerStyle={styles.notebookOverviewListContent}>
          {selectedNotebookNotes.length > 0 ? (
            selectedNotebookNotes.map((note) => renderNoteListItem(note, 'overview'))
          ) : (
            <View style={styles.emptyNotebookState}>
              <Text style={styles.emptyNotesText}>
                This notebook is empty. Tap + to create a note here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  function renderEditor() {
    if (isNotebookOverviewOpen && selectedNotebook) {
      return renderNotebookOverview();
    }

    return (
      <Pressable style={styles.notebookPage} onPress={handleEditorSurfacePress}>
        <View
          style={styles.editorScrollClip}
          onLayout={(event) => setEditorViewportHeight(event.nativeEvent.layout.height)}>
          <ScrollView
            ref={editorScrollRef}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            scrollEnabled={shouldAllowEditorScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={shouldScrollEditor}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: editorScrollY } } }],
              {
                useNativeDriver: false,
                listener: (event: any) => {
                  editorScrollOffsetRef.current = event.nativeEvent.contentOffset.y;
                },
              }
            )}
            contentContainerStyle={[
              styles.editorScrollContent,
              { minHeight: editorViewportHeight },
            ]}>
            <View
              style={[
                styles.editorScrollContentSurface,
                {
                  minHeight: editorViewportHeight,
                  height: editorSurfaceHeight,
                },
              ]}>
              <RuledNotebookPaper
                height={editorSurfaceHeight}
                lineHeight={editorLineHeight}
                textTop={NOTEBOOK_TEXT_TOP_PADDING}
              />
              {Platform.OS === 'web' ? (
                <Text
                  accessible={false}
                  aria-hidden
                  importantForAccessibility="no-hide-descendants"
                  pointerEvents="none"
                  onLayout={(event) => {
                    const nextHeight = normalizeEditorContentHeight(
                      NOTEBOOK_TEXT_TOP_PADDING + event.nativeEvent.layout.height
                    );
                    setEditorContentHeight((currentHeight) =>
                      currentHeight === nextHeight ? currentHeight : nextHeight
                    );
                  }}
                  style={[
                    styles.editorTextMeasure,
                    { fontSize: editorFontSize, lineHeight: editorLineHeight },
                  ]}>
                  {body || ' '}
                </Text>
              ) : null}
              <TextInput
                ref={editorInputRef}
                allowFontScaling={false}
                multiline
                scrollEnabled={false}
                onContentSizeChange={Platform.OS === 'web' ? undefined : (event) => {
                  const nextHeight = normalizeEditorContentHeight(event.nativeEvent.contentSize.height);
                  setEditorContentHeight((currentHeight) =>
                    currentHeight === nextHeight ? currentHeight : nextHeight
                  );
                }}
                editable={isEditorArmed}
                pointerEvents={isEditorArmed ? 'auto' : 'none'}
                showSoftInputOnFocus={isEditorArmed}
                value={body}
                onChangeText={handleEditorBodyChange}
                onSelectionChange={(event) => {
                  const nextSelection =
                    event.nativeEvent?.selection ?? editorSelectionRef.current ?? { start: 0, end: 0 };

                  editorSelectionRef.current = nextSelection;

                  if (isKeyboardVisible) {
                    requestAnimationFrame(() => {
                      keepCaretVisible(nextSelection, bodyRef.current, {
                        animated: false,
                      });
                    });
                  }
                }}
                onBlur={() => {
                  setIsEditorArmed(false);
                  setIsKeyboardVisible(false);
                  setKeyboardHeight(0);
                }}
                onPressIn={handleEditorSurfacePress}
                placeholder={
                  selectedNotebook ? `New note in ${selectedNotebook.name}...` : 'Start writing...'
                }
                placeholderTextColor={COLORS.muted}
                selectionColor={COLORS.note}
                style={[
                  styles.editorInput,
                  {
                    minHeight: editorViewportHeight,
                    height: editorSurfaceHeight,
                    fontSize: editorFontSize,
                    lineHeight: editorLineHeight,
                    paddingBottom: editorBottomPadding,
                  },
                  !isEditorArmed && styles.editorInputUnarmed,
                ]}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </View>

        <View pointerEvents="none" style={styles.bindingShadow} />

        {selectedNote && !isEditorOpen ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${selectedNote.title}`}
            onPress={() => confirmDeleteNote(selectedNote)}
            style={({ pressed }) => [styles.editorDeleteButton, pressed && styles.pressed]}>
            <Text style={styles.editorDeleteButtonText}>🗑</Text>
          </Pressable>
        ) : null}
      </Pressable>
    );
  }

  const useLegacyNotesLayout = false;
  return useLegacyNotesLayout ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      style={styles.screen}>
      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top - 2, 0),
            paddingBottom: insets.bottom + 14,
          },
        ]}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            onPress={goHome}
            style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}>
            <Text style={styles.homeButtonText}>Back home</Text>
          </Pressable>

          <View style={[styles.titleGroup, isKeyboardVisible && styles.titleGroupKeyboard]}>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} style={styles.title}>
              {isKeyboardVisible ? 'Editing Note' : 'Quick Notebook'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={saveCurrentNote}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
            <HomePanelFill source={notesPanelSwatch} opacity={1} />
            <Text style={styles.saveButtonText}>Save note</Text>
          </Pressable>
        </View>

        {saveStatusMessage ? (
          <View pointerEvents="none" style={styles.saveStatusPill}>
            <Text style={styles.saveStatusText}>{saveStatusMessage}</Text>
          </View>
        ) : null}

        <View style={styles.workspace}>
          {isSavedPanelOpen ? (
            <View style={[styles.sidePanel, { width: sidePanelWidth }]}>
              <View style={styles.sideHeader}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  style={styles.sideTitle}>
                  Saved
                </Text>

                <View style={styles.sideHeaderControls}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={openBlankNote}
                    style={({ pressed }) => [
                      styles.newNoteButton,
                      isEmptyNoteWarningVisible && styles.emptyNotePulseButton,
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.newNoteButtonText,
                        isEmptyNoteWarningVisible && styles.emptyNotePulseButtonText,
                      ]}>
                      New
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close saved notes panel"
                    onPress={closeSavedPanel}
                    hitSlop={8}
                    style={({ pressed }) => [styles.closeSavedPanelButton, pressed && styles.pressed]}>
                    <Text style={styles.closeSavedPanelButtonText}>‹</Text>
                  </Pressable>
                </View>
              </View>

              <ScrollView
                nestedScrollEnabled
                directionalLockEnabled
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToAlignment="start"
                snapToInterval={88}
                showsVerticalScrollIndicator={notes.length > 5}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.noteList}>
                {notebookGroups.map((group) => renderNotebookListItem(group))}

                {looseNotes.map((note) => renderNoteListItem(note))}

                {notes.length === 0 ? (
                  <View style={styles.emptyNotesState}>
                    <Text style={styles.emptyNotesText}>No saved notes yet.</Text>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.collapsedSavedRail}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Start a new note"
                onPress={openBlankNote}
                style={({ pressed }) => [
                  styles.collapsedNewNoteButton,
                  isEmptyNoteWarningVisible && styles.emptyNotePulseButton,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.collapsedNewNoteButtonText,
                    isEmptyNoteWarningVisible && styles.emptyNotePulseButtonText,
                  ]}>
                  +
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open saved notes panel"
                onPress={openSavedPanel}
                style={({ pressed }) => [styles.openSavedPanelTab, pressed && styles.pressed]}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  style={styles.openSavedPanelTabText}>
                  Saved
                </Text>
              </Pressable>
            </View>
          )}

          <View style={[styles.editorShell, !isSavedPanelOpen && styles.editorShellWide]}>
            {renderEditor()}
          </View>
        </View>
      </View>

    </KeyboardAvoidingView>
  ) : (
    <NotesPresentation
      isEditorOpen={isEditorOpen}
      isNotebookOverviewOpen={isNotebookOverviewOpen}
      isKeyboardVisible={isKeyboardVisible}
      isDirty={isDirty}
      landingView={landingView}
      looseNotes={looseNotes}
      notebookGroups={notebookGroups}
      shelves={shelves}
      newNotebookShelfId={newNotebookShelfId}
      selectedNote={selectedNote}
      selectedNotebook={selectedNotebook}
      quickCaptureBody={quickCaptureBody}
      saveStatusMessage={saveStatusMessage}
      onQuickCaptureChange={setQuickCaptureDraft}
      onQuickCaptureSave={saveQuickCapture}
      onOpenBlankNote={openBlankNote}
      onOpenNewNotebook={(shelfId) => {
        setNewNotebookShelfId(shelfId);
        setLandingView('new-notebook');
      }}
      onOpenLooseNotes={() => setLandingView('loose')}
      onOpenNotebooks={() => {
        setNewNotebookShelfId(undefined);
        setLandingView('notebooks');
      }}
      onBackToHub={() => setLandingView('hub')}
      onCreateNotebook={createNotebookFromLanding}
      onAddShelf={addShelfFromLanding}
      onRenameShelf={renameShelfFromLanding}
      onDeleteShelf={deleteShelfFromLanding}
      onMoveNotebook={moveNotebookFromLanding}
      onOpenNotebook={openNotebook}
      onLeaveNotes={goHome}
      onBackToNotes={goBackToNotes}
      onSaveCurrentNote={saveCurrentNote}
      onDeleteSelectedNote={confirmDeleteNote}
      renderEditor={renderEditor}
      renderNote={renderNoteListItem}
    />
  );
}

const styles = StyleSheet.create({
  pageBackground: {
    overflow: 'hidden',
  },
  pagePaperImage: {
    width: '100%',
    height: '100%',
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenRoot: {
    flex: 1,
    position: 'relative',
    overflow: 'visible',
  },
  notesPage: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 434,
    paddingHorizontal: 9,
  },
  notesHeader: {
    minHeight: 82,
    gap: 6,
    marginBottom: 8,
  },
  notesHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  notesWordmark: {
    width: 88,
    height: 34,
    flexShrink: 0,
  },
  notesHeaderCopy: {
    minWidth: 0,
    gap: 2,
  },
  notesEyebrow: {
    color: COLORS.noteDeep,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  notesTitle: {
    color: COLORS.ink,
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 21,
    lineHeight: 29,
    flexShrink: 1,
  },
  landingScroll: {
    flex: 1,
  },
  landingScrollContent: {
    flexGrow: 1,
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  quickCaptureCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.notePaper,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    ...SHADOWS.card,
  },
  sectionEyebrow: {
    color: COLORS.noteDeep,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  quickCaptureInput: {
    minHeight: 96,
    marginTop: 8,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.noteLine,
    borderWidth: 1,
    color: COLORS.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  quickCaptureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  quickCaptureHint: {
    flex: 1,
    minWidth: 0,
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sectionHeadingCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  sectionSupportingText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  newFullNoteButton: {
    minHeight: 36,
    flexShrink: 0,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  newFullNoteButtonText: {
    color: COLORS.noteDeep,
    fontSize: 11,
    fontWeight: '900',
  },
  recentNotesList: {
    gap: SPACING.sm,
  },
  notebookShortcuts: {
    gap: SPACING.sm,
  },
  focusedHeader: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notesBackButton: {
    minHeight: 40,
    minWidth: 76,
    flexShrink: 0,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  notesBackButtonText: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  focusedHeaderTitle: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  focusedEyebrow: {
    color: COLORS.noteDeep,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  focusedTitle: {
    color: COLORS.ink,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    flexShrink: 1,
  },
  focusedHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  primaryActionButton: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 40,
    minWidth: 92,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.reviewPaper,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
    ...SHADOWS.soft,
  },
  primaryActionButtonDisabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.line,
  },
  primaryActionButtonText: {
    color: COLORS.noteDeep,
    fontSize: 12,
    fontWeight: '900',
  },
  primaryActionButtonTextDisabled: {
    color: COLORS.muted,
  },
  deleteHeaderButton: {
    minHeight: 40,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.dangerCrayon,
    borderWidth: 1,
  },
  deleteHeaderButtonText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '900',
  },
  focusedEditorFrame: {
    flex: 1,
    minHeight: 320,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 8,
    padding: 8,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.notePaper,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    ...SHADOWS.card,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: -6,
  },
  titleGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  titleGroupKeyboard: {
    gap: 0,
  },
  titleKeyboard: {
    color: COLORS.noteDeep,
    fontSize: 15,
    fontWeight: '900',
  },
  eyebrow: {
    color: COLORS.noteDeep,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.ink,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    textAlign: 'center',
  },
  homeButton: {
    minHeight: 38,
    borderRadius: RADIUS.md,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  homeButtonText: {
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  saveButton: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 38,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.notePaper,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  saveButtonText: {
    color: COLORS.noteDeep,
    fontSize: 14,
    fontWeight: '900',
  },
  saveStatusPill: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginRight: 0,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  saveStatusText: {
    color: COLORS.noteDeep,
    fontSize: 12,
    fontWeight: '900',
  },
  workspace: {
    flex: 1,
    flexDirection: 'row',
    gap: 0,
  },
  sidePanel: {
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: SPACING.sm,
    gap: SPACING.xs,
    ...SHADOWS.soft,
  },
  sideHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 5,
    minHeight: 74,
  },
  sideTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
    flexShrink: 1,
  },
  sideHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sideHeaderControls: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    flexShrink: 0,
  },
  sideTitle: {
    flexShrink: 1,
    minWidth: 0,
    color: COLORS.ink,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    includeFontPadding: false,
  },
  newNoteButton: {
    minHeight: 34,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    flexShrink: 0,
  },
  newNoteButtonText: {
    color: COLORS.noteDeep,
    fontSize: 12,
    fontWeight: '900',
  },
  closeSavedPanelButton: {
    width: 38,
    minHeight: 28,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    flexShrink: 0,
    zIndex: 20,
    elevation: 6,
  },
  closeSavedPanelButtonText: {
    color: COLORS.noteDeep,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '900',
  },
  collapsedSavedRail: {
    width: 48,
    alignItems: 'stretch',
    gap: 8,
  },
  collapsedNewNoteButton: {
    height: 42,
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.sm,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    ...SHADOWS.soft,
  },
  collapsedNewNoteButtonText: {
    color: COLORS.noteDeep,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '900',
  },
  emptyNotePulseButton: {
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.dangerCrayon,
    transform: [{ scale: 1.03 }],
  },
  emptyNotePulseButtonText: {
    color: COLORS.danger,
  },
  openSavedPanelTab: {
    flex: 1,
    minHeight: 160,
    borderTopLeftRadius: RADIUS.sm,
    borderBottomLeftRadius: RADIUS.lg,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    ...SHADOWS.soft,
  },
  openSavedPanelTabText: {
    width: 86,
    color: COLORS.noteDeep,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '900',
    letterSpacing: 0.7,
    textAlign: 'center',
    textTransform: 'uppercase',
    transform: [{ rotate: '-90deg' }],
    includeFontPadding: false,
  },
  noteList: {
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  notebookListItem: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 80,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  notebookListItemActive: {
    borderColor: COLORS.noteDeep,
    borderWidth: 2,
  },
  notebookPressArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 9,
    gap: 6,
  },
  notebookIcon: {
    color: COLORS.noteDeep,
    fontSize: 14,
    fontWeight: '900',
  },
  notebookSidebarTextGroup: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  notebookSidebarTitle: {
    color: COLORS.noteDeep,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
    flexShrink: 1,
    includeFontPadding: false,
  },
  notebookSidebarMeta: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  noteListItem: {
    position: 'relative',
    overflow: 'visible',
    minHeight: 80,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.panelAlt,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  noteListItemNested: {
    backgroundColor: COLORS.panel,
  },
  noteListItemActive: {
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
  },
  notePressArea: {
    minHeight: 58,
    paddingLeft: 10,
    paddingRight: 27,
    paddingTop: 9,
    paddingBottom: 9,
    gap: 4,
  },
  notebookAssignmentButton: {
    alignSelf: 'flex-start',
    minHeight: 32,
    maxWidth: '100%',
    marginLeft: 10,
    marginRight: 27,
    marginBottom: 9,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 9,
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  notebookAssignmentButtonText: {
    maxWidth: '100%',
    color: COLORS.noteDeep,
    fontSize: 11,
    fontWeight: '900',
  },
  notebookPicker: {
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.notePaper,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    gap: 6,
  },
  notebookPickerTitle: {
    color: COLORS.noteDeep,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  notebookPickerOption: {
    minHeight: 46,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  notebookPickerOptionCurrent: {
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteDeep,
  },
  notebookPickerOptionName: {
    flex: 1,
    minWidth: 0,
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  notebookPickerOptionMeta: {
    color: COLORS.noteDeep,
    fontSize: 11,
    fontWeight: '800',
  },
  notebookPickerRemove: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  notebookPickerRemoveText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  newNotebookButton: {
    minHeight: 44,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  newNotebookButtonText: {
    color: COLORS.noteDeep,
    fontSize: 12,
    fontWeight: '900',
  },
  notebookCreateForm: {
    gap: 6,
    paddingTop: 2,
  },
  notebookCreateInput: {
    minHeight: 42,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
    color: COLORS.ink,
    fontSize: 14,
  },
  notebookCreateActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  notebookCreateCancel: {
    minHeight: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  notebookCreateCancelText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
  },
  notebookCreateSubmit: {
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteDeep,
    borderWidth: 1,
  },
  notebookCreateSubmitText: {
    color: COLORS.noteDeep,
    fontSize: 11,
    fontWeight: '900',
  },
  noteListTitle: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 17,
  },
  noteListTitleActive: {
    color: COLORS.noteDeep,
  },
  noteListPreview: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
  noteListDate: {
    color: COLORS.noteDeep,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  deleteNoteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.dangerCrayon,
    borderWidth: 1,
  },
  deleteNoteButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '900',
  },
  emptyNotesState: {
    borderRadius: RADIUS.md,
    padding: 10,
    backgroundColor: COLORS.panelAlt,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  emptyNotesText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  editorShell: {
    flex: 1,
    backgroundColor: COLORS.notePaper,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    padding: SPACING.sm,
    ...SHADOWS.card,
  },
  editorShellWide: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  notebookPage: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFDF4',
    borderColor: '#EEE6CD',
    borderWidth: 1,
  },
  notebookOverviewPage: {
    flex: 1,
    overflow: 'visible',
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    borderColor: '#EEE6CD',
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  notebookOverviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notebookOverviewSpacer: {
    width: 0,
  },
  notebookOverviewActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    minWidth: 0,
    overflow: 'visible',
  },
  notebookTitleSlot: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  notebookOverviewTitle: {
    flexShrink: 1,
    minWidth: 0,
    maxWidth: 224,
    overflow: 'hidden',
    color: COLORS.noteDeep,
    fontWeight: '900',
    textAlign: 'right',
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    includeFontPadding: false,
  },
  squareToolButton: {
    minWidth: 26,
    minHeight: 26,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  squareToolButtonText: {
    color: COLORS.noteDeep,
    fontSize: 18,
    fontWeight: '900',
  },
  squareTrashButton: {
    minWidth: 26,
    minHeight: 26,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.dangerCrayon,
    borderWidth: 1,
  },
  squareTrashButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '900',
  },
  notebookOverviewList: {
    flex: 1,
  },
  notebookOverviewListContent: {
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  notebookNoteCard: {
    position: 'relative',
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 92,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  notebookNotePressArea: {
    flex: 1,
    padding: 12,
    paddingRight: 34,
  },
  notebookNoteTextGroup: {
    flex: 1,
    gap: 4,
  },
  notebookNoteTitle: {
    color: COLORS.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },
  notebookNotePreview: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  emptyNotebookState: {
    borderRadius: RADIUS.md,
    padding: 14,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  editorScrollClip: {
    flex: 1,
    overflow: 'hidden',
  },
  editorScrollContent: {
    flexGrow: 1,
  },
  editorScrollContentSurface: {
    position: 'relative',
    overflow: 'hidden',
  },
  bindingShadow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 12,
    backgroundColor: 'rgba(42, 36, 31, 0.035)',
    borderRightColor: 'rgba(42, 36, 31, 0.055)',
    borderRightWidth: 1,
  },
  editorDeleteButton: {
    position: 'absolute',
    top: 10,
    right: 7,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.dangerCrayon,
    borderWidth: 1,
  },
  editorDeleteButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '900',
  },
  editorInput: {
    flex: 1,
    color: COLORS.ink,
    backgroundColor: 'transparent',
    padding: 0,
    paddingTop: NOTEBOOK_TEXT_TOP_PADDING,
    paddingLeft: 24,
    paddingRight: 24,
    fontWeight: '500',
    includeFontPadding: false,
  },
  editorTextMeasure: {
    position: 'absolute',
    top: NOTEBOOK_TEXT_TOP_PADDING,
    left: 24,
    right: 24,
    opacity: 0,
    fontWeight: '500',
  },
  editorInputUnarmed: {
    color: COLORS.ink,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

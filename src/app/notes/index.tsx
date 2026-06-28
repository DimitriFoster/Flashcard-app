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
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
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

import { CrayonFill } from '@/components/ui/crayon-fill';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';
import {
  deleteNotebook as deleteStoredNotebook,
  deleteNote as deleteStoredNote,
  getNotebooks,
  getNotes,
  groupNotesIntoNotebook,
  moveNoteOutOfNotebook,
  moveNoteToNotebook,
  renameNotebook,
  saveNote,
} from '@/storage/notes';
import type { Notebook, StudyNote } from '@/types/note';

const NOTEBOOK_LINE_COUNT = 240;
const NOTEBOOK_LINE_HEIGHT = 28;
const NOTEBOOK_TOP_OFFSET = 70;

type DropTarget = {
  id: string;
  type: 'note' | 'notebook';
  x: number;
  y: number;
  width: number;
  height: number;
};

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

function NotebookLines() {
  return (
    <View pointerEvents="none" style={styles.notebookLines}>
      {Array.from({ length: NOTEBOOK_LINE_COUNT }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.notebookLine,
            {
              top: NOTEBOOK_TOP_OFFSET + index * NOTEBOOK_LINE_HEIGHT,
            },
          ]}
        />
      ))}
    </View>
  );
}

type DraggableNoteCardProps = {
  note: StudyNote;
  variant?: NoteCardVariant;
  nested?: boolean;
  isActive?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onOpen: (note: StudyNote) => void;
  onDelete: (note: StudyNote) => void;
  onDragStart: (note: StudyNote, pageX: number, pageY: number) => void;
  onDragMove: (pageX: number, pageY: number) => void;
  onDragEnd: (note: StudyNote, pageX: number, pageY: number) => void;
  setRef: (ref: View | null) => void;
};

function DraggableNoteCard({
  note,
  variant = 'sidebar',
  nested = false,
  isActive = false,
  isDragging = false,
  isDropTarget = false,
  onOpen,
  onDelete,
  onDragStart,
  onDragMove,
  onDragEnd,
  setRef,
}: DraggableNoteCardProps) {
  const drag = useRef(new Animated.ValueXY()).current;
  const lift = useRef(new Animated.Value(0)).current;
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localDraggingRef = useRef(false);
  const lastPageRef = useRef({ x: 0, y: 0 });
  const [isLocallyDragging, setIsLocallyDragging] = useState(false);

  function clearLongPressTimer() {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }

  function startDrag() {
    if (localDraggingRef.current) {
      return;
    }

    localDraggingRef.current = true;
    setIsLocallyDragging(true);
    onDragStart(note, lastPageRef.current.x, lastPageRef.current.y);

    Animated.spring(lift, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }

  function resetDrag() {
    clearLongPressTimer();

    Animated.parallel([
      Animated.spring(drag, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        speed: 20,
        bounciness: 7,
      }),
      Animated.spring(lift, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 7,
      }),
    ]).start(() => {
      drag.setValue({ x: 0, y: 0 });
      localDraggingRef.current = false;
      setIsLocallyDragging(false);
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        lastPageRef.current = {
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        };
        drag.setValue({ x: 0, y: 0 });
        longPressTimeoutRef.current = setTimeout(startDrag, 260);
      },
      onPanResponderMove: (_event, gestureState) => {
        const movedFarEnough = Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8;

        if (!localDraggingRef.current && movedFarEnough) {
          clearLongPressTimer();
        }

        if (localDraggingRef.current) {
          lastPageRef.current = { x: gestureState.moveX, y: gestureState.moveY };
          drag.setValue({ x: gestureState.dx, y: gestureState.dy });
          onDragMove(gestureState.moveX, gestureState.moveY);
        }
      },
      onPanResponderRelease: (_event, gestureState) => {
        clearLongPressTimer();

        if (localDraggingRef.current) {
          onDragEnd(note, gestureState.moveX, gestureState.moveY);
          resetDrag();
          return;
        }

        const wasTap = Math.abs(gestureState.dx) < 8 && Math.abs(gestureState.dy) < 8;

        if (wasTap) {
          onOpen(note);
        }

        resetDrag();
      },
      onPanResponderTerminate: () => {
        clearLongPressTimer();
        resetDrag();
      },
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  const liftedScale = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.035],
  });
  const liftedY = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <Animated.View
      ref={(ref) => setRef(ref as unknown as View | null)}
      style={[
        variant === 'overview' ? styles.notebookNoteCard : styles.noteListItem,
        nested && styles.noteListItemNested,
        isActive && styles.noteListItemActive,
        isDropTarget && styles.noteListItemDropTarget,
        (isDragging || isLocallyDragging) && styles.noteListItemDragging,
        {
          opacity: isDragging || isLocallyDragging ? 0.12 : 1,
          transform: [{ scale: liftedScale }],
          zIndex: isDragging || isLocallyDragging ? 20 : 1,
          elevation: isDragging || isLocallyDragging ? 8 : variant === 'overview' ? 1 : 0,
        },
      ]}>
      <View
        {...panResponder.panHandlers}
        style={variant === 'overview' ? styles.notebookNoteDragArea : styles.notePressArea}>
        {variant === 'overview' ? (
          <View style={styles.notebookNoteTextGroup}>
            <Text numberOfLines={2} style={styles.notebookNoteTitle}>
              {note.title}
            </Text>
            <Text numberOfLines={3} style={styles.notebookNotePreview}>
              {getPreview(note.body)}
            </Text>
            <Text style={styles.noteListDate}>{formatUpdatedAt(note.createdAt)}</Text>
          </View>
        ) : (
          <>
            <Text
              numberOfLines={2}
              style={[styles.noteListTitle, isActive && styles.noteListTitleActive]}>
              {note.title}
            </Text>
            <Text numberOfLines={2} style={styles.noteListPreview}>
              {getPreview(note.body)}
            </Text>
            <Text style={styles.noteListDate}>{formatUpdatedAt(note.updatedAt)}</Text>
          </>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete ${note.title}`}
        onPress={() => onDelete(note)}
        style={({ pressed }) => [styles.deleteNoteButton, pressed && styles.pressed]}>
        <Text style={styles.deleteNoteButtonText}>×</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notebookNameDrafts, setNotebookNameDrafts] = useState<Record<string, string>>({});
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | undefined>();
  const [isNotebookOverviewOpen, setIsNotebookOverviewOpen] = useState(false);
  const [body, setBody] = useState('');
  const [draggingNoteId, setDraggingNoteId] = useState<string | undefined>();
  const [hoverTargetId, setHoverTargetId] = useState<string | undefined>();
  const [dragOverlay, setDragOverlay] = useState<{ note: StudyNote; x: number; y: number } | undefined>();
  const [editorViewportHeight, setEditorViewportHeight] = useState(0);
  const [editorContentHeight, setEditorContentHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [pulseNotebookId, setPulseNotebookId] = useState<string | undefined>();
  const [notebookSortDirection, setNotebookSortDirection] = useState<SortDirection>('newest');

  const noteRefs = useRef<Record<string, View | null>>({});
  const notebookRefs = useRef<Record<string, View | null>>({});
  const editorInputRef = useRef<TextInput | null>(null);
  const editorScrollRef = useRef<ScrollView | null>(null);
  const editorScrollY = useRef(new Animated.Value(0)).current;
  const dropTargetsRef = useRef<DropTarget[]>([]);
  const dragWasActiveRef = useRef(false);
  const notebookPulse = useRef(new Animated.Value(0)).current;

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
        }))
        .filter((group) => group.notes.length > 0),
    [notebooks, notes]
  );

  const looseNotes = useMemo(() => notes.filter((note) => !note.notebookId), [notes]);

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
  const editorScrollContentHeight = Math.max(
    editorViewportHeight,
    editorContentHeight + editorBottomPadding + keyboardScrollPadding
  );
  const shouldScrollEditor =
    editorViewportHeight > 0 &&
    editorScrollContentHeight > editorViewportHeight + NOTEBOOK_LINE_HEIGHT;
  const shouldAllowEditorScroll = shouldScrollEditor;

  useEffect(() => {
    refreshNotesState();
    setSelectedNoteId(undefined);
    setSelectedNotebookId(undefined);
    setIsNotebookOverviewOpen(false);
    setIsEditorArmed(false);
    editorScrollY.setValue(0);
    setEditorContentHeight(0);
    setBody('');
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
      editorScrollRef.current?.scrollTo({ y: Math.max(editorScrollY.__getValue?.() ?? 0, 0), animated: false });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!shouldScrollEditor && !isKeyboardVisible) {
      editorScrollY.setValue(0);
    }
  }, [editorScrollY, isKeyboardVisible, shouldScrollEditor]);

  function refreshNotesState() {
    const nextNotes = getNotes();
    const nextNotebooks = getNotebooks();

    setNotes(nextNotes);
    setNotebooks(nextNotebooks);
    setNotebookNameDrafts(createNotebookDrafts(nextNotebooks));

    return {
      notes: nextNotes,
      notebooks: nextNotebooks,
    };
  }

  function persistCurrentDraft() {
    /**
     * A brand-new empty draft does not need to be stored.
     * Existing notes are still saved even if the user clears the body on purpose.
     */
    if (!selectedNoteId && body.trim().length === 0) {
      return undefined;
    }

    const savedNote = saveNote({
      id: selectedNoteId,
      body,
      notebookId: selectedNote?.notebookId ?? selectedNotebookId,
    });

    refreshNotesState();
    setSelectedNoteId(savedNote.id);
    setSelectedNotebookId(savedNote.notebookId);
    setBody(savedNote.body);

    return savedNote;
  }

  function openBlankNote() {
    if (isDirty) {
      persistCurrentDraft();
    }

    setSelectedNoteId(undefined);
    setSelectedNotebookId(undefined);
    setIsNotebookOverviewOpen(false);
    setBody('');
  }

  function openBlankNoteInNotebook(notebook: Notebook) {
    if (isDirty) {
      persistCurrentDraft();
    }

    setSelectedNoteId(undefined);
    setSelectedNotebookId(notebook.id);
    setIsNotebookOverviewOpen(false);
    setIsEditorArmed(false);
    editorScrollY.setValue(0);
    setEditorContentHeight(0);
    setBody('');
  }

  function openNotebook(notebook: Notebook) {
    if (isDirty) {
      persistCurrentDraft();
    }

    setSelectedNoteId(undefined);
    setSelectedNotebookId(notebook.id);
    setIsNotebookOverviewOpen(true);
    setIsEditorArmed(false);
    editorScrollY.setValue(0);
    setEditorContentHeight(0);
    setBody('');
  }

  function openExistingNote(note: StudyNote) {
    /**
     * Long-press drag can still trigger a normal press on some mobile devices.
     * This guard prevents a drag gesture from also opening the note.
     */
    if (dragWasActiveRef.current) {
      return;
    }

    if (note.id === selectedNoteId) {
      return;
    }

    if (isDirty) {
      persistCurrentDraft();
    }

    setSelectedNoteId(note.id);
    setSelectedNotebookId(note.notebookId);
    setIsNotebookOverviewOpen(false);
    setIsEditorArmed(false);
    editorScrollY.setValue(0);
    setEditorContentHeight(0);
    setBody(note.body);
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

  function handleEditorBodyChange(value: string) {
    setBody(value);

    /**
     * When the keyboard overlays the lower part of the screen, don't resize the
     * whole Android root view. Instead, keep the scrollable paper surface moving
     * toward the active writing area.
     */
    if (isKeyboardVisible) {
      requestAnimationFrame(() => {
        editorScrollRef.current?.scrollToEnd({ animated: true });
      });
    }
  }

  function saveAndStartNewNote() {
    const savedNote = persistCurrentDraft();

    if (savedNote?.notebookId) {
      setSelectedNoteId(undefined);
      setSelectedNotebookId(savedNote.notebookId);
      setIsNotebookOverviewOpen(true);
      setBody('');
      return;
    }

    if (savedNote) {
      setSelectedNoteId(undefined);
      setSelectedNotebookId(undefined);
      setIsNotebookOverviewOpen(false);
      setBody('');
    }
  }

  function goHome() {
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

  function confirmDeleteNote(note: StudyNote) {
    Alert.alert('Delete note?', `Delete "${note.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete note',
        style: 'destructive',
        onPress: () => {
          const wasSelected = note.id === selectedNoteId;

          if (deleteStoredNote(note.id)) {
            refreshNotesState();

            if (wasSelected) {
              setSelectedNoteId(undefined);
              setBody('');
              setIsNotebookOverviewOpen(Boolean(note.notebookId));
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
              setSelectedNotebookId(undefined);
              setIsNotebookOverviewOpen(false);
              setSelectedNoteId(undefined);
              setBody('');
            }
          },
        },
      ]
    );
  }

  function measureDropTargets(sourceNoteId: string) {
    const targets: DropTarget[] = [];
    const noteEntries = Object.entries(noteRefs.current).filter(
      (entry): entry is [string, View] => Boolean(entry[1]) && entry[0] !== sourceNoteId
    );
    const notebookEntries = Object.entries(notebookRefs.current).filter(
      (entry): entry is [string, View] => Boolean(entry[1])
    );
    const totalMeasurements = noteEntries.length + notebookEntries.length;

    if (totalMeasurements === 0) {
      dropTargetsRef.current = [];
      return;
    }

    let remaining = totalMeasurements;

    function recordTarget(target: DropTarget) {
      targets.push(target);
      remaining -= 1;

      if (remaining === 0) {
        dropTargetsRef.current = targets;
      }
    }

    noteEntries.forEach(([noteId, ref]) => {
      ref.measureInWindow((x, y, targetWidth, height) => {
        recordTarget({ id: noteId, type: 'note', x, y, width: targetWidth, height });
      });
    });

    notebookEntries.forEach(([notebookId, ref]) => {
      ref.measureInWindow((x, y, targetWidth, height) => {
        recordTarget({ id: notebookId, type: 'notebook', x, y, width: targetWidth, height });
      });
    });
  }

  function getDropTargetAt(pageX: number, pageY: number) {
    return dropTargetsRef.current.find((target) => {
      const hitSlop = target.type === 'notebook' ? 26 : 18;

      return (
        pageX >= target.x - hitSlop &&
        pageX <= target.x + target.width + hitSlop &&
        pageY >= target.y - hitSlop &&
        pageY <= target.y + target.height + hitSlop
      );
    });
  }

  function pulseNotebook(notebookId: string) {
    setPulseNotebookId(notebookId);
    notebookPulse.setValue(0);

    Animated.sequence([
      Animated.timing(notebookPulse, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(notebookPulse, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPulseNotebookId(undefined);
    });
  }

  function startDraggingNote(note: StudyNote, pageX: number, pageY: number) {
    dragWasActiveRef.current = true;
    setDraggingNoteId(note.id);
    setHoverTargetId(undefined);
    setDragOverlay({ note, x: pageX, y: pageY });
    measureDropTargets(note.id);
  }

  function moveDragHover(pageX: number, pageY: number) {
    const target = getDropTargetAt(pageX, pageY);
    setHoverTargetId(target?.id);
    setDragOverlay((current) => (current ? { ...current, x: pageX, y: pageY } : current));
  }

  function finishDraggingNote(sourceNote: StudyNote, pageX: number, pageY: number) {
    const target = getDropTargetAt(pageX, pageY);

    if (target?.type === 'note') {
      const result = groupNotesIntoNotebook(sourceNote.id, target.id);

      if (result) {
        setNotes(result.notes);
        setNotebooks(result.notebooks);
        setNotebookNameDrafts(createNotebookDrafts(result.notebooks));
        pulseNotebook(result.notebook.id);
      }
    } else if (target?.type === 'notebook') {
      const result = moveNoteToNotebook(sourceNote.id, target.id);

      if (result) {
        setNotes(result.notes);
        setNotebooks(result.notebooks);
        setNotebookNameDrafts(createNotebookDrafts(result.notebooks));
        pulseNotebook(target.id);
      }
    } else if (sourceNote.notebookId) {
      const result = moveNoteOutOfNotebook(sourceNote.id);

      if (result) {
        setNotes(result.notes);
        setNotebooks(result.notebooks);
        setNotebookNameDrafts(createNotebookDrafts(result.notebooks));

        if (selectedNoteId === sourceNote.id) {
          setSelectedNotebookId(undefined);
        }
      }
    }

    endDragGesture();
  }

  function endDragGesture() {
    setDraggingNoteId(undefined);
    setHoverTargetId(undefined);
    setDragOverlay(undefined);
    dropTargetsRef.current = [];

    /**
     * Wait a beat before allowing normal presses again. This prevents a completed
     * long-press/drop from also opening the note that started the gesture.
     */
    setTimeout(() => {
      dragWasActiveRef.current = false;
    }, 160);
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
    const isDragging = note.id === draggingNoteId;
    const isDropTarget = note.id === hoverTargetId && note.id !== draggingNoteId;

    return (
      <DraggableNoteCard
        key={note.id}
        note={note}
        variant={variant}
        isActive={isActive}
        isDragging={isDragging}
        isDropTarget={isDropTarget}
        onOpen={openExistingNote}
        onDelete={confirmDeleteNote}
        onDragStart={startDraggingNote}
        onDragMove={moveDragHover}
        onDragEnd={finishDraggingNote}
        setRef={(ref) => {
          noteRefs.current[note.id] = ref;
        }}
      />
    );
  }

  function renderNotebookListItem(group: { notebook: Notebook; notes: StudyNote[] }) {
    const isActive = group.notebook.id === selectedNotebookId;
    const isDropTarget = group.notebook.id === hoverTargetId;
    const shouldPulse = group.notebook.id === pulseNotebookId;
    const pulseScale = notebookPulse.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.045, 1],
    });

    return (
      <Animated.View
        key={group.notebook.id}
        ref={(ref) => {
          notebookRefs.current[group.notebook.id] = ref;
        }}
        style={[
          styles.notebookListItem,
          isActive && styles.notebookListItemActive,
          isDropTarget && styles.notebookListItemDropTarget,
          shouldPulse && { transform: [{ scale: pulseScale }] },
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
      </Animated.View>
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

  function renderDragOverlay() {
    if (!dragOverlay) {
      return null;
    }

    const overlayWidth = Math.min(Math.max(width * 0.42, 150), 280);
    const left = Math.min(Math.max(dragOverlay.x - overlayWidth / 2, 8), width - overlayWidth - 8);
    const top = Math.max(dragOverlay.y - 44, insets.top + 8);

    return (
      <View
        pointerEvents="none"
        style={[
          styles.dragOverlay,
          {
            left,
            top,
            width: overlayWidth,
          },
        ]}>
        <Text numberOfLines={2} style={styles.noteListTitle}>
          {dragOverlay.note.title}
        </Text>
        <Text numberOfLines={2} style={styles.noteListPreview}>
          {getPreview(dragOverlay.note.body)}
        </Text>
        <Text style={styles.noteListDate}>{formatUpdatedAt(dragOverlay.note.updatedAt)}</Text>
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
            showsVerticalScrollIndicator={shouldAllowEditorScroll}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: editorScrollY } } }],
              { useNativeDriver: false }
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
                  height: editorScrollContentHeight,
                },
              ]}>
              <NotebookLines />

              <TextInput
                ref={editorInputRef}
                multiline
                scrollEnabled={false}
                onContentSizeChange={(event) =>
                  setEditorContentHeight(event.nativeEvent.contentSize.height)
                }
                editable={isEditorArmed}
                showSoftInputOnFocus={isEditorArmed}
                value={body}
                onChangeText={handleEditorBodyChange}
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
                    height: editorScrollContentHeight,
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

        {selectedNote ? (
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      style={styles.screen}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 18,
            paddingBottom: insets.bottom + 18,
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
            {isKeyboardVisible ? (
              <Text style={styles.titleKeyboard}>Editing note</Text>
            ) : (
              <>
                <Text style={styles.eyebrow}>Notes</Text>
                <Text style={styles.title}>Quick lined notebook</Text>
              </>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={saveAndStartNewNote}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
            <CrayonFill tone="note" variant="tight" opacity={0.82} />
            <Text style={styles.saveButtonText}>Save note</Text>
          </Pressable>
        </View>

        <View style={styles.workspace}>
          <View style={[styles.sidePanel, { width: sidePanelWidth }]}>
            <View style={styles.sideHeader}>
              <Text style={styles.sideTitle}>Saved</Text>
              <Pressable
                accessibilityRole="button"
                onPress={openBlankNote}
                style={({ pressed }) => [styles.newNoteButton, pressed && styles.pressed]}>
                <Text style={styles.newNoteButtonText}>New</Text>
              </Pressable>
            </View>

            <Text style={styles.dragHint}>
              {draggingNoteId ? 'Drop on note/notebook' : 'Hold + drag to group'}
            </Text>

            <ScrollView
              nestedScrollEnabled
              directionalLockEnabled
              scrollEventThrottle={16}
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

          <View style={styles.editorShell}>{renderEditor()}</View>
        </View>
      </View>

      {renderDragOverlay()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingRight: Platform.OS === 'android' ? 44 : 0,
  },
  titleGroup: {
    flex: 1,
    gap: 2,
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
    fontSize: 20,
    fontWeight: '800',
  },
  homeButton: {
    minHeight: 42,
    borderRadius: RADIUS.md,
    paddingHorizontal: 13,
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
    minHeight: 42,
    borderRadius: RADIUS.md,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  saveButtonText: {
    color: COLORS.noteDeep,
    fontSize: 14,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  sideTitle: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  dragHint: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 13,
  },
  newNoteButton: {
    minHeight: 34,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.noteSoft,
    borderColor: COLORS.noteCrayon,
    borderWidth: 1,
  },
  newNoteButtonText: {
    color: COLORS.noteDeep,
    fontSize: 12,
    fontWeight: '900',
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
  notebookListItemDropTarget: {
    backgroundColor: COLORS.notePaper,
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
  noteListItemDropTarget: {
    backgroundColor: COLORS.notePaper,
    borderColor: COLORS.noteDeep,
    borderWidth: 2,
  },
  noteListItemDragging: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.noteDeep,
    borderWidth: 2,
    ...SHADOWS.card,
  },
  notePressArea: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 27,
    paddingTop: 9,
    paddingBottom: 9,
    gap: 4,
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
  notebookNoteDragArea: {
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
  notebookLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: NOTEBOOK_TOP_OFFSET + NOTEBOOK_LINE_COUNT * NOTEBOOK_LINE_HEIGHT,
  },
  notebookLine: {
    position: 'absolute',
    left: 20,
    right: 18,
    height: 1,
    backgroundColor: COLORS.noteLine,
    opacity: 0.78,
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
    right: 10,
    zIndex: 10,
    width: 34,
    height: 34,
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
    paddingTop: NOTEBOOK_TOP_OFFSET - 23,
    paddingLeft: 24,
    paddingRight: 54,
    fontSize: 17,
    lineHeight: NOTEBOOK_LINE_HEIGHT,
    fontWeight: '500',
  },
  editorInputUnarmed: {
    color: COLORS.ink,
  },
  dragOverlay: {
    position: 'absolute',
    zIndex: 999,
    elevation: 20,
    minHeight: 80,
    borderRadius: RADIUS.md,
    opacity: 0.98,
    paddingLeft: 10,
    paddingRight: 14,
    paddingTop: 9,
    paddingBottom: 9,
    gap: 4,
    backgroundColor: COLORS.white,
    borderColor: COLORS.noteDeep,
    borderWidth: 2,
    ...SHADOWS.card,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { NotebookCover, ShelfCavity, ShelfPlaque, ShelfRail } from '@/components/notes/notebook-bookcase-art';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import { FIRST_SHELF_ID, groupNotebooksByShelf } from '@/lib/notebook-shelves';
import type { Notebook, NotebookShelf, StudyNote } from '@/types/note';

type NotebookGroup = { notebook: Notebook; notes: StudyNote[] };
type ShelfPanel = {
  shelfId: string;
  kind: 'rename' | 'delete' | 'move';
  notebookId?: string;
};

type NotebookBookcaseProps = {
  shelves: NotebookShelf[];
  notebookGroups: NotebookGroup[];
  creatingNotebookShelfId?: string;
  onOpenNotebook: (notebook: Notebook) => void;
  onNewNotebook: (shelfId: string) => void;
  onCreateNotebook: (name: string, shelfId: string) => boolean;
  onCancelNewNotebook: () => void;
  onAddShelf: (name: string) => boolean;
  onRenameShelf: (shelfId: string, name: string) => boolean;
  onDeleteShelf: (shelfId: string) => boolean;
  onMoveNotebook: (notebookId: string, shelfId: string) => boolean;
};

export function NotebookBookcase({
  shelves,
  notebookGroups,
  creatingNotebookShelfId,
  onOpenNotebook,
  onNewNotebook,
  onCreateNotebook,
  onCancelNewNotebook,
  onAddShelf,
  onRenameShelf,
  onDeleteShelf,
  onMoveNotebook,
}: NotebookBookcaseProps) {
  const [isAddingShelf, setIsAddingShelf] = useState(false);
  const [shelfName, setShelfName] = useState('');
  const [shelfError, setShelfError] = useState('');
  const [activePanel, setActivePanel] = useState<ShelfPanel | null>(null);
  const [panelError, setPanelError] = useState('');
  const [titleDraft, setTitleDraft] = useState('');
  const [notebookName, setNotebookName] = useState('');
  const [notebookError, setNotebookError] = useState('');
  const [caseWidth, setCaseWidth] = useState(0);
  const bookHeight = Math.max(88, caseWidth * 0.235);
  const bookWidth = bookHeight * 0.89;
  const plaqueWidth = Math.min(180, Math.max(128, caseWidth * 0.44));
  const groupedShelves = groupNotebooksByShelf(shelves, notebookGroups.map((group) => group.notebook));
  const groupsById = new Map(notebookGroups.map((group) => [group.notebook.id, group]));

  useEffect(() => {
    if (creatingNotebookShelfId) {
      setActivePanel(null);
      setIsAddingShelf(false);
    }
  }, [creatingNotebookShelfId]);

  function openPanel(panel: ShelfPanel, currentName = '') {
    if (creatingNotebookShelfId) {
      onCancelNewNotebook();
    }
    setActivePanel(panel);
    setTitleDraft(currentName);
    setPanelError('');
  }

  function closePanel() {
    setActivePanel(null);
    setPanelError('');
  }

  function openNewNotebook(shelfId: string) {
    closePanel();
    setIsAddingShelf(false);
    setNotebookName('');
    setNotebookError('');
    onNewNotebook(shelfId);
  }

  function submitNotebook(shelfId: string) {
    if (!notebookName.trim()) {
      setNotebookError('Give your notebook a name.');
      return;
    }
    if (onCreateNotebook(notebookName.trim(), shelfId)) {
      setNotebookName('');
      setNotebookError('');
    } else {
      setNotebookError('Could not create notebook. Try again.');
    }
  }

  function submitShelf() {
    if (onAddShelf(shelfName.trim())) {
      setShelfName('');
      setShelfError('');
      setIsAddingShelf(false);
    } else {
      setShelfError('Could not add a shelf. Try again.');
    }
  }

  function submitTitle(shelfId: string) {
    if (!titleDraft.trim()) {
      setPanelError('Give this shelf a name.');
      return;
    }
    if (onRenameShelf(shelfId, titleDraft.trim())) {
      closePanel();
    } else {
      setPanelError('Could not rename this shelf. Try again.');
    }
  }

  return (
    <View style={styles.bookcase} testID="notes-bookcase" onLayout={({ nativeEvent }) => setCaseWidth(nativeEvent.layout.width)}>
      <View style={styles.woodFrame}>
        <ShelfRail width={caseWidth} kind="top" />

        {groupedShelves.map(({ shelf, notebooks }, shelfIndex) => {
          const isCreatingNotebook = creatingNotebookShelfId === shelf.id;
          const shelfPanel = activePanel?.shelfId === shelf.id ? activePanel : null;
          const movingNotebook = shelfPanel?.kind === 'move'
            ? notebooks.find((notebook) => notebook.id === shelfPanel.notebookId)
            : undefined;
          const hasPanel = isCreatingNotebook || Boolean(shelfPanel);

          return (
            <View key={shelf.id} style={styles.shelfSection} testID={`notes-shelf-${shelfIndex + 1}`}>
              <View style={styles.shelfCavity}>
                <ShelfCavity />
                <View style={styles.shelfWindow}>
                  <View style={styles.shelfHeading}>
                    <Pressable
                      accessibilityLabel={`Edit title of ${shelf.name}`}
                      accessibilityHint="Opens title editing inside this shelf"
                      accessibilityRole="button"
                      onPress={() => openPanel({ shelfId: shelf.id, kind: 'rename' }, shelf.name)}
                      style={({ pressed }) => [styles.plaque, { width: plaqueWidth }, pressed && styles.pressed]}
                      testID={`notes-shelf-title-${shelf.id}`}>
                      <View pointerEvents="none" style={styles.plaqueArt}><ShelfPlaque width={plaqueWidth} /></View>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.plaqueText}>{shelf.name}</Text>
                    </Pressable>
                    <Pressable
                      accessibilityLabel={`Delete shelf ${shelf.name}`}
                      accessibilityHint={shelf.id === FIRST_SHELF_ID ? 'The first shelf stays so every notebook has a home' : undefined}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: shelf.id === FIRST_SHELF_ID }}
                      disabled={shelf.id === FIRST_SHELF_ID}
                      onPress={() => openPanel({ shelfId: shelf.id, kind: 'delete' })}
                      style={({ pressed }) => [styles.deleteShelfButton, shelf.id === FIRST_SHELF_ID && styles.deleteShelfDisabled, pressed && styles.pressed]}
                      testID={`notes-delete-shelf-${shelf.id}`}>
                      <Text style={[styles.deleteShelfText, shelf.id === FIRST_SHELF_ID && styles.deleteShelfTextDisabled]}>Delete</Text>
                    </Pressable>
                  </View>

                  {isCreatingNotebook ? (
                    <View style={styles.inlinePanel} testID={`notes-shelf-dialog-${shelf.id}`}>
                      <Text style={styles.inlineTitle}>A notebook for {shelf.name}</Text>
                      <TextInput
                        accessibilityLabel={`New notebook name for ${shelf.name}`}
                        autoFocus
                        maxLength={80}
                        onChangeText={(value) => {
                          setNotebookName(value);
                          setNotebookError('');
                        }}
                        onSubmitEditing={() => submitNotebook(shelf.id)}
                        placeholder="e.g. Garden ideas"
                        placeholderTextColor="#8A7465"
                        returnKeyType="done"
                        style={styles.panelInput}
                        testID="notes-notebook-name"
                        value={notebookName}
                      />
                      {notebookError ? <Text accessibilityRole="alert" style={styles.formError}>{notebookError}</Text> : null}
                      <View style={styles.confirmRow}>
                        <Pressable accessibilityRole="button" accessibilityLabel="Cancel new notebook" onPress={() => {
                          setNotebookName('');
                          setNotebookError('');
                          onCancelNewNotebook();
                        }} style={styles.confirmCancel}>
                          <Text style={styles.cancelInlineText}>Cancel</Text>
                        </Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel="Create notebook" onPress={() => submitNotebook(shelf.id)} style={styles.createShelfButton} testID="notes-create-notebook">
                          <Text style={styles.createShelfButtonText}>Create notebook</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : shelfPanel?.kind === 'rename' ? (
                    <View style={styles.inlinePanel} testID={`notes-shelf-dialog-${shelf.id}`}>
                      <Text style={styles.inlineTitle}>Rename this shelf</Text>
                      <TextInput
                        accessibilityLabel={`New title for ${shelf.name}`}
                        autoFocus
                        maxLength={36}
                        onChangeText={(value) => {
                          setTitleDraft(value);
                          setPanelError('');
                        }}
                        onSubmitEditing={() => submitTitle(shelf.id)}
                        returnKeyType="done"
                        selectTextOnFocus
                        style={styles.panelInput}
                        value={titleDraft}
                      />
                      {panelError ? <Text accessibilityRole="alert" style={styles.formError}>{panelError}</Text> : null}
                      <View style={styles.confirmRow}>
                        <Pressable accessibilityRole="button" accessibilityLabel="Cancel shelf rename" onPress={closePanel} style={styles.confirmCancel}>
                          <Text style={styles.cancelInlineText}>Cancel</Text>
                        </Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel={`Save title for ${shelf.name}`} onPress={() => submitTitle(shelf.id)} style={styles.createShelfButton}>
                          <Text style={styles.createShelfButtonText}>Save title</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : shelfPanel?.kind === 'delete' ? (
                    <View style={styles.inlinePanel} testID={`notes-shelf-dialog-${shelf.id}`}>
                      <Text style={styles.inlineTitle}>Remove {shelf.name}?</Text>
                      <Text style={styles.inlineCopy}>Notebooks here will move to {shelves[0].name}. Your notes stay safe.</Text>
                      {panelError ? <Text accessibilityRole="alert" style={styles.formError}>{panelError}</Text> : null}
                      <View style={styles.confirmRow}>
                        <Pressable accessibilityRole="button" accessibilityLabel="Keep shelf" onPress={closePanel} style={styles.confirmCancel}>
                          <Text style={styles.cancelInlineText}>Keep shelf</Text>
                        </Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel={`Confirm delete shelf ${shelf.name}`} onPress={() => {
                          if (onDeleteShelf(shelf.id)) {
                            closePanel();
                          } else {
                            setPanelError('Could not delete this shelf. Try again.');
                          }
                        }} style={styles.confirmDelete}>
                          <Text style={styles.confirmDeleteText}>Delete shelf</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : movingNotebook ? (
                    <View style={styles.inlinePanel} testID={`notes-shelf-dialog-${shelf.id}`}>
                      <Text style={styles.inlineTitle}>Move {movingNotebook.name} to</Text>
                      <View style={styles.destinationRow}>
                        {shelves.filter((destination) => destination.id !== shelf.id).map((destination) => (
                          <Pressable
                            key={destination.id}
                            accessibilityLabel={`Move ${movingNotebook.name} to ${destination.name}`}
                            accessibilityRole="button"
                            onPress={() => {
                              if (onMoveNotebook(movingNotebook.id, destination.id)) {
                                closePanel();
                              } else {
                                setPanelError('Could not move this notebook. Try again.');
                              }
                            }}
                            style={({ pressed }) => [styles.destinationButton, pressed && styles.pressed]}>
                            <Text numberOfLines={1} style={styles.destinationText}>{destination.name}</Text>
                          </Pressable>
                        ))}
                      </View>
                      {panelError ? <Text accessibilityRole="alert" style={styles.formError}>{panelError}</Text> : null}
                      <Pressable accessibilityRole="button" accessibilityLabel="Cancel move" onPress={closePanel} style={styles.cancelInline}>
                        <Text style={styles.cancelInlineText}>Cancel</Text>
                      </Pressable>
                    </View>
                  ) : null}

                  {!hasPanel ? (
                    <ScrollView
                      horizontal
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      showsHorizontalScrollIndicator={false}
                      accessibilityLabel={`Notebooks on ${shelf.name}, swipe sideways`}
                      contentContainerStyle={[styles.bookRow, !notebooks.length && styles.emptyBookRow]}
                      style={styles.shelfScroll}>
                      {notebooks.length ? (
                        <>
                          {notebooks.map((notebook) => {
                            const noteCount = groupsById.get(notebook.id)?.notes.length ?? 0;
                            return (
                              <View key={notebook.id} style={[styles.bookColumn, { width: bookWidth }]}>
                                <Pressable
                                  accessibilityLabel={`Open ${notebook.name}, ${noteCount} ${noteCount === 1 ? 'note' : 'notes'}`}
                                  accessibilityHint={shelves.length > 1 ? 'Hold to move this notebook to another shelf' : undefined}
                                  accessibilityRole="button"
                                  accessibilityActions={shelves.length > 1 ? [{ name: 'move', label: 'Move to another shelf' }] : undefined}
                                  onAccessibilityAction={({ nativeEvent }) => {
                                    if (nativeEvent.actionName === 'move') openPanel({ shelfId: shelf.id, kind: 'move', notebookId: notebook.id });
                                  }}
                                  onPress={() => onOpenNotebook(notebook)}
                                  onLongPress={shelves.length > 1 ? () => openPanel({ shelfId: shelf.id, kind: 'move', notebookId: notebook.id }) : undefined}
                                  style={({ pressed }) => [styles.bookPressable, { width: bookWidth, height: bookHeight }, pressed && styles.bookPressed]}
                                  testID={`notes-book-${notebook.id}`}>
                                  <NotebookCover notebookId={notebook.id} height={bookHeight} />
                                  <View pointerEvents="none" style={styles.bookLabel}>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.bookTitle}>{notebook.name}</Text>
                                  </View>
                                </Pressable>
                              </View>
                            );
                          })}
                          <Pressable
                            accessibilityLabel={`Add notebook to ${shelf.name}`}
                            accessibilityRole="button"
                            onPress={() => openNewNotebook(shelf.id)}
                            style={({ pressed }) => [styles.addBook, { height: bookHeight - 10 }, pressed && styles.pressed]}>
                            <Text style={styles.addBookPlus}>+</Text>
                            <Text style={styles.addBookText}>New book</Text>
                          </Pressable>
                        </>
                      ) : (
                        <View style={styles.emptyShelf}>
                          <Text style={styles.emptyShelfTitle}>Room on the shelf.</Text>
                          <Text style={styles.emptyShelfCopy}>A little space for your next idea.</Text>
                          <Pressable
                            accessibilityLabel={`Add notebook to ${shelf.name}`}
                            accessibilityRole="button"
                            onPress={() => openNewNotebook(shelf.id)}
                            style={({ pressed }) => [styles.emptyShelfAction, pressed && styles.pressed]}>
                            <Text style={styles.emptyShelfActionText}>+ Add a notebook</Text>
                          </Pressable>
                        </View>
                      )}
                    </ScrollView>
                  ) : null}
                </View>
              </View>
              <ShelfRail width={caseWidth} kind={shelfIndex === groupedShelves.length - 1 ? 'bottom' : 'divider'} />
            </View>
          );
        })}

      </View>
        <View style={styles.bookcaseFooter}>
          {shelves.length > 1 && notebookGroups.length > 0 ? <Text style={styles.moveHint}>Tap a notebook to open. Hold to move.</Text> : null}
          {isAddingShelf ? (
            <View style={styles.addShelfForm}>
              <Text style={styles.addShelfTitle}>A new spot for your notebooks</Text>
              <TextInput
                accessibilityLabel="New shelf name"
                autoFocus
                maxLength={36}
                onChangeText={(value) => {
                  setShelfName(value);
                  setShelfError('');
                }}
                onSubmitEditing={submitShelf}
                placeholder={`Shelf ${shelves.length + 1} (optional)`}
                placeholderTextColor="#8A7465"
                returnKeyType="done"
                style={styles.panelInput}
                value={shelfName}
              />
              {shelfError ? <Text accessibilityRole="alert" style={styles.formError}>{shelfError}</Text> : null}
              <View style={styles.confirmRow}>
                <Pressable accessibilityRole="button" accessibilityLabel="Cancel new shelf" onPress={() => {
                  setShelfName('');
                  setShelfError('');
                  setIsAddingShelf(false);
                }} style={styles.confirmCancel}>
                  <Text style={styles.cancelInlineText}>Cancel</Text>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Create shelf" onPress={submitShelf} style={styles.createShelfButton}>
                  <Text style={styles.createShelfButtonText}>Add shelf</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              accessibilityLabel="Add shelf"
              accessibilityRole="button"
              onPress={() => setIsAddingShelf(true)}
              style={({ pressed }) => [styles.addShelfButton, pressed && styles.pressed]}
              testID="notes-add-shelf">
              <Text style={styles.addShelfButtonText}>+ Add shelf</Text>
              <Text style={styles.addShelfHint}>Make room for another collection</Text>
            </Pressable>
          )}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookcase: { width: '100%', paddingTop: 5, paddingBottom: 12 },
  woodFrame: { width: '100%' },
  shelfSection: { width: '100%' },
  shelfCavity: { position: 'relative' },
  shelfWindow: { minWidth: 0, marginHorizontal: '6%' },
  shelfHeading: { minHeight: 48, marginTop: -23, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5, zIndex: 2 },
  plaque: { position: 'relative', maxWidth: '74%', minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  plaqueArt: { position: 'absolute', left: 0, top: 0, bottom: 0, justifyContent: 'center' },
  plaqueText: { flexShrink: 1, minWidth: 0, maxWidth: '100%', color: '#542F1C', fontFamily: FOLIO_HAND_FONT, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  deleteShelfButton: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  deleteShelfDisabled: { opacity: 0.65 },
  deleteShelfText: { color: '#FFE4B7', fontSize: 11, fontWeight: '900', textDecorationLine: 'underline' },
  deleteShelfTextDisabled: { color: '#D1B799', textDecorationLine: 'none' },
  shelfScroll: { width: '100%', maxWidth: '100%' },
  bookRow: { alignItems: 'flex-end', gap: 9, paddingHorizontal: 2, paddingTop: 7, paddingBottom: 0 },
  emptyBookRow: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  bookColumn: { alignItems: 'center', justifyContent: 'flex-end' },
  bookPressable: { position: 'relative', alignItems: 'center', justifyContent: 'flex-end' },
  bookPressed: { transform: [{ translateY: -3 }] },
  bookLabel: { position: 'absolute', top: '5%', left: '17%', right: '22%', alignItems: 'center' },
  bookTitle: { color: '#3D3026', fontFamily: FOLIO_HAND_FONT, fontSize: 8.5, lineHeight: 10, textAlign: 'center' },
  moveHint: { color: '#78624E', fontSize: 11, lineHeight: 17, textAlign: 'center', marginBottom: 10 },
  addBook: { width: 65, minHeight: 72, marginHorizontal: 3, marginBottom: 5, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#EAC298', borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 4 },
  addBookPlus: { color: '#FFE9C4', fontFamily: FOLIO_HAND_FONT, fontSize: 34, lineHeight: 38 },
  addBookText: { color: '#FFE9C4', fontSize: 11, fontWeight: '800' },
  emptyShelf: { minHeight: 122, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 8 },
  emptyShelfTitle: { color: '#FFF0CC', fontFamily: FOLIO_HAND_FONT, fontSize: 19, lineHeight: 28, textAlign: 'center' },
  emptyShelfCopy: { color: '#F0CC9C', fontSize: 11, lineHeight: 17, textAlign: 'center' },
  emptyShelfAction: { minHeight: 48, marginTop: 9, paddingHorizontal: 15, borderWidth: 1.5, borderColor: '#D6A773', borderRadius: 22, backgroundColor: '#F5D29B', alignItems: 'center', justifyContent: 'center' },
  emptyShelfActionText: { color: '#59341F', fontSize: 12, fontWeight: '900' },
  inlinePanel: { gap: 9, minHeight: 160, marginHorizontal: 9, marginBottom: 12, padding: 12, borderWidth: 1.5, borderColor: '#D0A06B', borderRadius: 10, backgroundColor: '#FFF2DC' },
  inlineTitle: { color: '#58351F', fontFamily: FOLIO_HAND_FONT, fontSize: 16, lineHeight: 24 },
  inlineCopy: { color: '#6D5544', fontSize: 12, lineHeight: 18 },
  panelInput: { minHeight: 48, borderWidth: 1, borderRadius: 9, borderColor: '#B68455', backgroundColor: '#FFFCF4', color: '#33271F', fontSize: 16, paddingHorizontal: 12 },
  formError: { color: '#AA423C', fontSize: 12, fontWeight: '700' },
  destinationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  destinationButton: { minHeight: 44, minWidth: 90, maxWidth: '100%', paddingHorizontal: 11, justifyContent: 'center', borderWidth: 1, borderColor: '#9C714C', borderRadius: 10, backgroundColor: '#F8D8A8' },
  destinationText: { color: '#563420', fontSize: 12, fontWeight: '800' },
  cancelInline: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  cancelInlineText: { color: '#654F40', fontSize: 12, fontWeight: '800' },
  confirmRow: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8 },
  confirmCancel: { minHeight: 44, paddingHorizontal: 13, justifyContent: 'center' },
  confirmDelete: { minHeight: 44, paddingHorizontal: 13, borderRadius: 10, justifyContent: 'center', backgroundColor: '#B55D4F' },
  confirmDeleteText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  createShelfButton: { minHeight: 44, paddingHorizontal: 13, borderRadius: 10, backgroundColor: '#6A9977', justifyContent: 'center' },
  createShelfButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  bookcaseFooter: { paddingHorizontal: 10, paddingTop: 12 },
  addShelfButton: { minHeight: 59, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B58A5D', borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 1 },
  addShelfButtonText: { color: '#674124', fontFamily: FOLIO_HAND_FONT, fontSize: 17, lineHeight: 24 },
  addShelfHint: { color: '#78624E', fontSize: 10, fontWeight: '700' },
  addShelfForm: { gap: 9, padding: 12, borderWidth: 1.5, borderColor: '#D2A36F', borderRadius: 10, backgroundColor: '#FFF2DC' },
  addShelfTitle: { color: '#563420', fontFamily: FOLIO_HAND_FONT, fontSize: 16, lineHeight: 24 },
  pressed: { opacity: 0.86 },
});

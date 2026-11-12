import { useEffect, useRef, useState } from 'react';
import { BackHandler, Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { filterPickerNotebooks, getNotebookPickerHeight } from '@/lib/note-draft';
import type { Notebook } from '@/types/note';

import { NotebookPickerSurface, PickerNotebookIcon, PickerSymbol } from './notebook-picker-art';
import { styles } from './notebook-picker.styles';

type NotebookPickerProps = {
  notebooks: Notebook[];
  selectedNotebookId?: string;
  availableHeight: number;
  onOpen: () => void;
  onSelect: (notebookId?: string) => void;
  onCreate: (name: string) => Notebook | undefined;
};

export function NotebookPicker({ notebooks, selectedNotebookId, availableHeight, onOpen, onSelect, onCreate }: NotebookPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const nameRef = useRef<TextInput>(null);
  const selected = notebooks.find((notebook) => notebook.id === selectedNotebookId);
  const filtered = filterPickerNotebooks(notebooks, query);
  const menuHeight = getNotebookPickerHeight(availableHeight);

  function close() {
    setOpen(false);
    setCreating(false);
    setError('');
    Keyboard.dismiss();
  }

  useEffect(() => {
    if (!open) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setOpen(false);
      Keyboard.dismiss();
      return true;
    });
    return () => subscription.remove();
  }, [open]);

  function choose(notebookId?: string) {
    onSelect(notebookId);
    close();
  }

  function create() {
    if (!name.trim()) return;
    try {
      const notebook = onCreate(name.trim());
      if (notebook) choose(notebook.id);
      else setError('Could not create notebook. Try again.');
    } catch {
      setError('Could not create notebook. Try again.');
    }
  }

  return (
    <>
    <View style={styles.spacer} />
    {/* Keep the overlay inside its parent's hit bounds on Android. */}
    <View style={styles.root} pointerEvents="box-none" testID="editor-notebook-picker">
      <Pressable
        testID="editor-notebook-trigger"
        accessibilityRole="button"
        accessibilityLabel={`Save to ${selected?.name ?? 'Loose notes'}`}
        accessibilityHint="Choose a notebook, then Save note to apply."
        accessibilityState={{ expanded: open }}
        onPress={() => {
          if (open) close();
          else {
            onOpen();
            setQuery('');
            setName('');
            setCreating(false);
            setError('');
            setOpen(true);
          }
        }}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}>
        <NotebookPickerSurface kind="field" />
        <Text style={styles.label}>Save to</Text>
        <PickerNotebookIcon notebookId={selected?.id} small />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.destination}>{selected?.name ?? 'Loose notes'}</Text>
        <PickerSymbol name={open ? 'up' : 'down'} />
      </Pressable>

      {open ? <>
        <Pressable
          testID="editor-notebook-dismiss"
          accessibilityRole="button"
          accessibilityLabel="Close notebook menu"
          onPress={close}
          style={[styles.backdrop, { height: Math.max(0, availableHeight - 52) }]}
        />
        <View testID="editor-notebook-menu" accessibilityViewIsModal style={[styles.menu, { maxHeight: menuHeight }]}>
          <NotebookPickerSurface kind="menu" />
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.scroll}
            contentContainerStyle={styles.content}
            onLayout={() => { if (creating) scrollRef.current?.scrollToEnd({ animated: false }); }}
            onContentSizeChange={() => { if (creating) scrollRef.current?.scrollToEnd({ animated: false }); }}>
            <View style={styles.search}>
              <NotebookPickerSurface kind="field" />
              <PickerSymbol name="search" color="#7A6C5E" />
              <TextInput
                testID="editor-notebook-search"
                accessibilityLabel="Find a notebook"
                placeholder="Find a notebook..."
                placeholderTextColor="#7A6C5E"
                value={query}
                onChangeText={setQuery}
                onKeyPress={({ nativeEvent }) => { if (nativeEvent.key === 'Escape') close(); }}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <Pressable
              testID="editor-notebook-loose"
              accessibilityRole="button"
              accessibilityLabel="Loose notes. Keep this note on its own."
              accessibilityState={{ selected: !selectedNotebookId }}
              onPress={() => choose(undefined)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
              {!selectedNotebookId ? <NotebookPickerSurface kind="selected" /> : null}
              <PickerNotebookIcon />
              <View style={styles.rowCopy}>
                <Text style={styles.rowName}>Loose notes</Text>
                <Text style={styles.hint}>Keep this note on its own</Text>
              </View>
              {!selectedNotebookId ? <PickerSymbol name="check" /> : null}
            </Pressable>

            <View style={styles.section}><Text style={styles.sectionLabel}>NOTEBOOKS</Text><View style={styles.line} /></View>
            {filtered.map((notebook) => (
              <Pressable
                key={notebook.id}
                testID={`editor-notebook-option-${notebook.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Choose notebook ${notebook.name}`}
                accessibilityState={{ selected: notebook.id === selectedNotebookId }}
                onPress={() => choose(notebook.id)}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                {notebook.id === selectedNotebookId ? <NotebookPickerSurface kind="selected" /> : null}
                <PickerNotebookIcon notebookId={notebook.id} />
                <View style={styles.rowCopy}><Text numberOfLines={2} style={styles.rowName}>{notebook.name}</Text></View>
                {notebook.id === selectedNotebookId ? <PickerSymbol name="check" /> : null}
              </Pressable>
            ))}
            {filtered.length === 0 ? <Text style={styles.empty}>{notebooks.length ? 'No matching notebooks.' : 'Your first notebook starts here.'}</Text> : null}
            <View style={styles.divider} />
            {creating ? (
              <View style={styles.form}>
                <Text style={styles.label}>New notebook</Text>
                <View style={styles.search}>
                  <NotebookPickerSurface kind="field" />
                  <TextInput
                    ref={nameRef}
                    testID="editor-notebook-name"
                    accessibilityLabel="New notebook name"
                    placeholder="Notebook name"
                    placeholderTextColor="#7A6C5E"
                    value={name}
                    onChangeText={setName}
                    onSubmitEditing={create}
                    onKeyPress={({ nativeEvent }) => { if (nativeEvent.key === 'Escape') close(); }}
                    onFocus={() => scrollRef.current?.scrollToEnd({ animated: false })}
                    returnKeyType="done"
                    maxLength={120}
                    style={styles.input}
                  />
                </View>
                {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
                <View style={styles.formActions}>
                  <Pressable accessibilityRole="button" accessibilityLabel="Cancel new notebook" onPress={() => { setCreating(false); setError(''); }} style={styles.cancel}><Text style={styles.label}>Cancel</Text></Pressable>
                  <Pressable
                    testID="editor-notebook-create"
                    accessibilityRole="button"
                    accessibilityLabel="Create notebook and select it"
                    accessibilityState={{ disabled: !name.trim() }}
                    disabled={!name.trim()}
                    onPress={create}
                    style={({ pressed }) => [styles.create, !name.trim() && styles.disabled, pressed && styles.pressed]}>
                    <Text style={[styles.newLabel, !name.trim() && styles.disabledText]}>Create notebook</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                testID="editor-notebook-new"
                accessibilityRole="button"
                accessibilityLabel="New notebook"
                onPress={() => { setCreating(true); setName(query.trim()); }}
                style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}>
                <View style={styles.plus}><PickerSymbol name="plus" color="#285C3F" /></View>
                <Text style={styles.newLabel}>New notebook</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </> : null}
    </View>
    </>
  );
}

/**
 * HomeCreateSection.
 *
 * This component handles the card/deck creation UI on the home screen.
 *
 * Important React pattern:
 * - The component owns temporary form state such as text inputs and expanded panels.
 * - The parent Home screen owns saved app state such as decks and cards.
 *
 * This keeps the form responsive while still letting the parent refresh the rest
 * of the screen after a deck or card is created.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CrayonFill } from '@/components/ui/crayon-fill';
import { parseCardImportText } from '@/lib/import-parser';
import { MOTION } from '@/constants/design';
import type { ImportAppBackupResult, ImportCardsOptions, ImportCardsResult } from '@/storage/flashcards';
import type { ParsedImportCard } from '@/lib/import-parser';
import type { Deck, Flashcard, NewFlashcard } from '@/types/flashcard';
import { COLORS, styles } from './create-section.styles';

/** Count cards for one deck. Used by the horizontal deck picker chips. */
function getDeckCardCount(deckId: string, cards: Flashcard[]) {
  return cards.filter((card) => card.deckId === deckId).length;
}

function previewText(value: string, maxLength = 72) {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 1)}…`;
}

function getDeckNameFromFilename(filename: string) {
  const withoutExtension = filename.replace(/\.[^/.]+$/, '');
  const cleaned = withoutExtension.replace(/[_-]+/g, ' ').trim();

  return cleaned || 'Imported Deck';
}

function getImportedDeckName(filename: string, importedCards: ParsedImportCard[]) {
  const fileDeckName = importedCards.find((card) => card.deckName?.trim())?.deckName?.trim();

  return fileDeckName || getDeckNameFromFilename(filename);
}

type DeleteDeckResult = {
  deck: Deck;
  deletedCards: number;
  decks: Deck[];
  flashcards: Flashcard[];
};

type HomeCreateSectionProps = {
  decks: Deck[];
  cards: Flashcard[];
  selectedDeck?: Deck;
  onSelectDeckId: (deckId: string) => void;
  onCreateDeck: (name: string) => Deck | undefined;
  onCreateCard: (input: NewFlashcard) => Flashcard | undefined;
  onDeleteDeck: (deckId: string) => DeleteDeckResult | undefined;
  onDeleteCard: (cardId: string) => Flashcard | undefined;
  onImportCards: (cards: ParsedImportCard[], options: ImportCardsOptions) => ImportCardsResult;
  onExportBackup: () => string;
  onImportBackup: (rawText: string) => ImportAppBackupResult | undefined;
};

export function HomeCreateSection({
  decks,
  cards,
  selectedDeck,
  onSelectDeckId,
  onCreateDeck,
  onCreateCard,
  onDeleteDeck,
  onDeleteCard,
  onImportCards,
  onExportBackup,
  onImportBackup,
}: HomeCreateSectionProps) {
  /**
   * The create area starts collapsed so the home screen feels simple and inviting.
   * Tapping the green create panel reveals the detailed form.
   */
  const [showCreateDetails, setShowCreateDetails] = useState(false);

  /**
   * These pairs separate "visible state" from "mounted/rendered state".
   * That allows the panel to animate closed before it is removed from the tree.
   */
  const [showDeckPicker, setShowDeckPicker] = useState(false);
  const [isDeckPickerRendered, setIsDeckPickerRendered] = useState(false);
  const [showNewDeckForm, setShowNewDeckForm] = useState(false);
  const [isNewDeckFormRendered, setIsNewDeckFormRendered] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const [showManagePanel, setShowManagePanel] = useState(false);

  /** Controlled inputs for creating decks and cards. */
  const [deckName, setDeckName] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [backupText, setBackupText] = useState('');
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  /**
   * Animated.Value objects persist across renders with useRef.
   * They drive chevron rotation, panel height, opacity, and slide-in movement.
   */
  const deckPickerProgress = useRef(new Animated.Value(0)).current;
  const newDeckProgress = useRef(new Animated.Value(0)).current;
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedDeckFromDecks = selectedDeck ? decks.find((deck) => deck.id === selectedDeck.id) : undefined;
  const activeDeck = selectedDeckFromDecks ?? selectedDeck;
  const selectedDeckCards =
    activeDeck && showManagePanel ? cards.filter((card) => card.deckId === activeDeck.id) : [];
  const hasPromptText = front.trim().length > 0;
  const addCardButtonLabel = activeDeck ? `Add to ${activeDeck.name}` : 'Choose a deck first';

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  function showStatus(message: string) {
    setStatusMessage(message);

    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }

    statusTimeoutRef.current = setTimeout(() => {
      setStatusMessage('');
    }, 1800);
  }

  function closeDeckPickerPanel() {
    setShowDeckPicker(false);
    setIsDeckPickerRendered(false);
    deckPickerProgress.setValue(0);
  }

  function closeNewDeckPanel() {
    setShowNewDeckForm(false);
    setIsNewDeckFormRendered(false);
    newDeckProgress.setValue(0);
  }

  function toggleDeckPicker() {
    const nextValue = showDeckPicker ? 0 : 1;

    if (!showDeckPicker) {
      closeNewDeckPanel();
      setShowImportPanel(false);
      setShowManagePanel(false);
      setIsDeckPickerRendered(true);
    }

    setShowDeckPicker(!showDeckPicker);

    Animated.timing(deckPickerProgress, {
      toValue: nextValue,
      duration: MOTION.fast,
      easing: Easing.out(Easing.quad),
      /**
       * Height animation cannot use the native driver.
       * Native driver only supports transform and opacity.
       */
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && nextValue === 0) {
        setIsDeckPickerRendered(false);
      }
    });
  }

  function toggleNewDeckForm() {
    const nextValue = showNewDeckForm ? 0 : 1;

    if (!showNewDeckForm) {
      closeDeckPickerPanel();
      setShowImportPanel(false);
      setShowManagePanel(false);
      setIsNewDeckFormRendered(true);
    }

    setShowNewDeckForm(!showNewDeckForm);

    Animated.timing(newDeckProgress, {
      toValue: nextValue,
      duration: MOTION.fast,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && nextValue === 0) {
        setIsNewDeckFormRendered(false);
      }
    });
  }

  function toggleCreateSection() {
    if (showCreateDetails) {
      setShowManagePanel(false);
    }

    setShowCreateDetails((current) => !current);
  }

  function selectDeckFromPicker(deckId: string) {
    onSelectDeckId(deckId);

    /**
     * Keep deck selection light. The card-management window can be reopened
     * after a deck is selected, instead of rendering every card during picking.
     */
    setShowManagePanel(false);
  }

  function toggleManagePanel() {
    if (!activeDeck) {
      return;
    }

    setShowManagePanel((current) => !current);
  }

  function toggleImportPanel() {
    if (!showImportPanel) {
      closeDeckPickerPanel();
      closeNewDeckPanel();
      setShowManagePanel(false);
    }

    setShowImportPanel((value) => !value);
  }

  function createDeck() {
    const name = deckName.trim();

    /** Avoid creating empty decks from whitespace-only input. */
    if (!name) {
      return;
    }

    const deck = onCreateDeck(name);

    if (deck) {
      /** New decks become the active destination for card creation. */
      onSelectDeckId(deck.id);
      setShowManagePanel(false);
      setDeckName('');
      showStatus(`Deck created: ${deck.name} ✓`);

      /** Collapse the new deck form after successful creation. */
      setShowNewDeckForm(false);
      Animated.timing(newDeckProgress, {
        toValue: 0,
        duration: MOTION.fast,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setIsNewDeckFormRendered(false);
        }
      });

      /** Show the deck picker so the user can see the deck they just created. */
      setShowImportPanel(false);
      setShowManagePanel(false);
      setShowDeckPicker(true);
      setIsDeckPickerRendered(true);
      Animated.timing(deckPickerProgress, {
        toValue: 1,
        duration: MOTION.fast,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  }

  function createCard() {
    const nextFront = front.trim();
    const nextBack = back.trim();

    /** A card needs a target deck, a prompt, and an answer. */
    if (!activeDeck || !nextFront || !nextBack) {
      return;
    }

    const card = onCreateCard({
      deckId: activeDeck.id,
      front: nextFront,
      back: nextBack,
    });

    if (card) {
      /** Clear the card form so the user can quickly enter the next card. */
      setFront('');
      setBack('');
      showStatus(`Added to ${activeDeck.name} ✓`);
    }
  }

  function deleteSelectedDeck() {
    if (!activeDeck) {
      return;
    }

    const cardCount = selectedDeckCards.length;
    const cardCopy = cardCount === 1 ? '1 card' : `${cardCount} cards`;

    Alert.alert(
      'Delete deck?',
      `Delete "${activeDeck.name}" and ${cardCopy}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete deck',
          style: 'destructive',
          onPress: () => {
            const result = onDeleteDeck(activeDeck.id);

            if (result) {
              setFront('');
              setBack('');
              setShowManagePanel(false);
              showStatus(`Deleted ${result.deck.name} and ${result.deletedCards} cards`);
            }
          },
        },
      ]
    );
  }

  function deleteCard(card: Flashcard) {
    Alert.alert('Delete card?', `Delete "${previewText(card.front, 42)}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete card',
        style: 'destructive',
        onPress: () => {
          const deletedCard = onDeleteCard(card.id);

          if (deletedCard) {
            showStatus('Card deleted');
          }
        },
      },
    ]);
  }


  async function loadFilePickerModules() {
    try {
      const [DocumentPicker, FileSystem] = await Promise.all([
        import('expo-document-picker'),
        import('expo-file-system/legacy'),
      ]);

      return {
        DocumentPicker,
        FileSystem,
      };
    } catch {
      return undefined;
    }
  }

  function showFilePickerError(error: unknown) {
    if (error instanceof Error && error.message === 'FILE_PICKER_UNAVAILABLE') {
      showStatus('File picker needs Expo Go or a rebuilt development build');
      return;
    }

    showStatus('Could not read that file');
  }

  async function pickTextFile() {
    const modules = await loadFilePickerModules();

    if (!modules) {
      throw new Error('FILE_PICKER_UNAVAILABLE');
    }

    const { DocumentPicker, FileSystem } = modules;
    const result = await DocumentPicker.getDocumentAsync({
      type: ['text/*', 'application/json', 'application/octet-stream', '*/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets?.[0]) {
      return undefined;
    }

    const asset = result.assets[0];
    const text = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return {
      filename: asset.name,
      text,
    };
  }

  function summarizeImportResult(result: ImportCardsResult, skippedRows: number) {
    return (
      `Imported ${result.importedCards} cards` +
      (result.createdDeck ? ` · created ${result.createdDeck.name}` : '') +
      (result.skippedDuplicates ? ` · skipped ${result.skippedDuplicates} duplicates` : '') +
      (skippedRows ? ` · ignored ${skippedRows} incomplete rows` : '')
    );
  }

  async function handleImportIntoExistingDeck() {
    if (!selectedDeck) {
      showStatus('Choose a deck before importing');
      return;
    }

    try {
      const pickedFile = await pickTextFile();

      if (!pickedFile) {
        return;
      }

      const parsed = parseCardImportText(pickedFile.text);

      if (parsed.cards.length === 0) {
        showStatus(parsed.warnings[0] ?? 'No cards found to import');
        return;
      }

      const result = onImportCards(parsed.cards, {
        mode: 'existingDeck',
        existingDeckId: selectedDeck.id,
        skipDuplicates,
      });

      showStatus(summarizeImportResult(result, parsed.skippedRows));
    } catch (error) {
      showFilePickerError(error);
    }
  }

  async function handleImportAsNewDeck() {
    try {
      const pickedFile = await pickTextFile();

      if (!pickedFile) {
        return;
      }

      const parsed = parseCardImportText(pickedFile.text);

      if (parsed.cards.length === 0) {
        showStatus(parsed.warnings[0] ?? 'No cards found to import');
        return;
      }

      const result = onImportCards(parsed.cards, {
        mode: 'newDeck',
        newDeckName: getImportedDeckName(pickedFile.filename, parsed.cards),
        skipDuplicates: false,
      });

      showStatus(summarizeImportResult(result, parsed.skippedRows));
    } catch (error) {
      showFilePickerError(error);
    }
  }

  async function handleImportBackupFile() {
    try {
      const pickedFile = await pickTextFile();

      if (!pickedFile) {
        return;
      }

      Alert.alert(
        'Replace app data?',
        'Importing a JSON backup replaces decks, cards, notes, notebooks, and review logs on this device.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import backup',
            style: 'destructive',
            onPress: () => {
              const result = onImportBackup(pickedFile.text);

              if (!result) {
                showStatus('Could not read backup JSON');
                return;
              }

              showStatus(`Restored ${result.decks.length} decks and ${result.flashcards.length} cards`);
            },
          },
        ]
      );
    } catch (error) {
      showFilePickerError(error);
    }
  }

  function handleExportBackup() {
    setBackupText(onExportBackup());
    showStatus('Backup JSON ready below');
  }

  function handleImportBackup() {
    if (!backupText.trim()) {
      showStatus('Paste backup JSON first');
      return;
    }

    Alert.alert(
      'Replace app data?',
      'Importing a JSON backup replaces decks, cards, notes, notebooks, and review logs on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import backup',
          style: 'destructive',
          onPress: () => {
            const result = onImportBackup(backupText);

            if (!result) {
              showStatus('Could not read backup JSON');
              return;
            }

            showStatus(`Restored ${result.decks.length} decks and ${result.flashcards.length} cards`);
          },
        },
      ]
    );
  }

  return (
    <>
      {showCreateDetails ? (
        <View style={[styles.section, styles.createSection]}>
          <CrayonFill tone="create" variant="loose" opacity={0.42} />
          <Pressable
            accessibilityRole="button"
            onPress={toggleCreateSection}
            style={({ pressed }) => [styles.sectionHeader, pressed && styles.pressed]}>
            <Text style={styles.sectionLabel}>create</Text>
            <Text style={styles.sectionKicker}>Choose a deck, add cards, or manage saved cards.</Text>
          </Pressable>

          <View style={styles.createBody}>
            <View style={styles.destinationRow}>
              <CrayonFill tone="create" variant="tight" opacity={0.65} />
              <Text style={styles.destinationLabel}>Deck</Text>
              <Text style={styles.destinationValue}>{activeDeck?.name ?? 'No deck selected'}</Text>
            </View>

            <TextInput
              multiline
              placeholder="Front: prompt, term, or question"
              value={front}
              onChangeText={setFront}
              style={[styles.input, styles.frontInput]}
              placeholderTextColor={COLORS.muted}
            />

            <TextInput
              multiline
              placeholder="Back: answer, explanation, or clue"
              value={back}
              onChangeText={setBack}
              style={[styles.input, styles.backInput]}
              placeholderTextColor={COLORS.muted}
            />

            <View style={styles.addCardActionRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !selectedDeck }}
                disabled={!activeDeck}
                onPress={createCard}
                style={({ pressed }) => [
                  styles.primaryButton,
                  styles.primaryButtonFloating,
                  hasPromptText && styles.primaryButtonPromptActive,
                  !activeDeck && !hasPromptText && styles.primaryButtonDisabled,
                  pressed && activeDeck && styles.pressed,
                ]}>
                {hasPromptText ? <CrayonFill tone="review" variant="tight" opacity={0.78} /> : null}
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.78}
                  style={[
                    styles.primaryButtonText,
                    hasPromptText && styles.primaryButtonTextPromptActive,
                    !activeDeck && !hasPromptText && styles.primaryButtonTextDisabled,
                  ]}>
                  {addCardButtonLabel}
                </Text>
              </Pressable>
            </View>

            <View style={styles.dropdownToggleRow}>
              <Pressable
                accessibilityRole="button"
                onPress={toggleNewDeckForm}
                style={({ pressed }) => [
                  styles.compactToggle,
                  styles.compactToggleNarrow,
                  pressed && styles.pressed,
                ]}>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.deckPickerToggleText}>
                  New deck
                </Text>
                <Animated.Text
                  style={[
                    styles.deckPickerToggleChevron,
                    {
                      transform: [
                        {
                          rotate: newDeckProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        },
                      ],
                    },
                  ]}>
                  v
                </Animated.Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={toggleDeckPicker}
                style={({ pressed }) => [
                  styles.compactToggle,
                  styles.compactToggleWide,
                  pressed && styles.pressed,
                ]}>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.deckPickerToggleText}>
                  Pick deck
                </Text>
                <Animated.Text
                  style={[
                    styles.deckPickerToggleChevron,
                    {
                      transform: [
                        {
                          rotate: deckPickerProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        },
                      ],
                    },
                  ]}>
                  v
                </Animated.Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={toggleImportPanel}
                style={({ pressed }) => [
                  styles.compactToggle,
                  styles.compactToggleWide,
                  pressed && styles.pressed,
                ]}>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.deckPickerToggleText}>
                  Import
                </Text>
                <Text style={styles.deckPickerToggleChevron}>v</Text>
              </Pressable>
            </View>

            {isNewDeckFormRendered ? (
              <Animated.View
                style={[
                  styles.newDeckPanel,
                  {
                    height: newDeckProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 136],
                    }),
                    opacity: newDeckProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    transform: [
                      {
                        translateY: newDeckProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-8, 0],
                        }),
                      },
                    ],
                  },
                ]}>
                <TextInput
                  placeholder="New deck name"
                  value={deckName}
                  onChangeText={setDeckName}
                  style={[styles.input, styles.deckNameInput]}
                  placeholderTextColor={COLORS.muted}
                  returnKeyType="done"
                  onSubmitEditing={createDeck}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={createDeck}
                  style={({ pressed }) => [styles.deckButton, pressed && styles.pressed]}>
                  <CrayonFill tone="create" variant="tight" opacity={0.75} />
                  <Text style={styles.deckButtonText}>Create deck</Text>
                </Pressable>
              </Animated.View>
            ) : null}

            {isDeckPickerRendered ? (
              <Animated.View
                style={[
                  styles.deckPickerPanel,
                  {
                    height: deckPickerProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 158],
                    }),
                    opacity: deckPickerProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    transform: [
                      {
                        translateY: deckPickerProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-8, 0],
                        }),
                      },
                    ],
                  },
                ]}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  disableIntervalMomentum
                  snapToAlignment="start"
                  snapToInterval={148}
                  contentContainerStyle={styles.deckPicker}>
                  {decks.map((deck) => {
                    const active = deck.id === activeDeck?.id;

                    return (
                      <Pressable
                        key={deck.id}
                        accessibilityRole="button"
                        onPress={() => selectDeckFromPicker(deck.id)}
                        style={({ pressed }) => [
                          styles.deckChip,
                          active && styles.deckChipActive,
                          pressed && styles.pressed,
                        ]}>
                        {active ? <CrayonFill tone="create" variant="tight" opacity={0.58} /> : null}
                        <Text style={[styles.deckChipText, active && styles.deckChipTextActive]}>
                          {deck.name}
                        </Text>
                        <Text style={styles.deckChipCount}>
                          {getDeckCardCount(deck.id, cards)} cards
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !selectedDeck, expanded: showManagePanel }}
                  disabled={!activeDeck}
                  onPress={toggleManagePanel}
                  style={({ pressed }) => [
                    styles.manageToggleButton,
                    !activeDeck && styles.primaryButtonDisabled,
                    pressed && activeDeck && styles.pressed,
                  ]}>
                  {activeDeck ? <CrayonFill tone="warning" variant="tight" opacity={0.6} /> : null}
                  <Text
                    style={[
                      styles.manageToggleButtonText,
                      !activeDeck && styles.primaryButtonTextDisabled,
                    ]}>
                    {activeDeck ? (showManagePanel ? 'Hide Manage' : 'Manage deck') : 'Choose deck to manage'}
                  </Text>
                </Pressable>
              </Animated.View>
            ) : null}

            {showImportPanel ? (
              <View style={styles.importPanel}>
                <Text style={styles.importTitle}>Import</Text>
                <Text style={styles.importHelp}>
                  Choose a CSV, TSV, or TXT file from your device. Imported cards start as new.
                  If this button reports that the file picker is unavailable, rebuild the development
                  app after installing the Expo picker modules.
                </Text>

                <View style={styles.importOptionRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setSkipDuplicates(true)}
                    style={({ pressed }) => [
                      styles.importOption,
                      skipDuplicates && styles.importOptionActive,
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.importOptionText,
                        skipDuplicates && styles.importOptionTextActive,
                      ]}>
                      Skip duplicates
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setSkipDuplicates(false)}
                    style={({ pressed }) => [
                      styles.importOption,
                      !skipDuplicates && styles.importOptionActive,
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.importOptionText,
                        !skipDuplicates && styles.importOptionTextActive,
                      ]}>
                      Import duplicates
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.importButtonColumn}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !selectedDeck }}
                    disabled={!activeDeck}
                    onPress={handleImportIntoExistingDeck}
                    style={({ pressed }) => [
                      styles.importActionButton,
                      !activeDeck && styles.primaryButtonDisabled,
                      pressed && activeDeck && styles.pressed,
                    ]}>
                    <CrayonFill tone="create" variant="tight" opacity={0.74} />
                    <Text
                      style={[
                        styles.importActionButtonText,
                        !activeDeck && styles.primaryButtonTextDisabled,
                      ]}>
                      Add file to existing deck
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={handleImportAsNewDeck}
                    style={({ pressed }) => [styles.importActionButton, pressed && styles.pressed]}>
                    <CrayonFill tone="create" variant="tight" opacity={0.74} />
                    <Text style={styles.importActionButtonText}>Create new deck from file</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setShowBackupPanel((value) => !value)}
                    style={({ pressed }) => [styles.importBackupButton, pressed && styles.pressed]}>
                    <Text style={styles.importBackupButtonText}>JSON app backup</Text>
                  </Pressable>
                </View>

                {showBackupPanel ? (
                  <View style={styles.backupPanel}>
                    <Text style={styles.importTitle}>JSON app backup</Text>
                    <Text style={styles.importHelp}>
                      Generate a backup to copy, or choose a JSON backup file to restore this device.
                    </Text>

                    <View style={styles.importOptionRow}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={handleExportBackup}
                        style={({ pressed }) => [styles.importOption, pressed && styles.pressed]}>
                        <Text style={styles.importOptionText}>Generate backup JSON</Text>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        onPress={handleImportBackupFile}
                        style={({ pressed }) => [
                          styles.importOption,
                          styles.importDangerOption,
                          pressed && styles.pressed,
                        ]}>
                        <Text style={[styles.importOptionText, styles.importDangerText]}>
                          Restore from JSON file
                        </Text>
                      </Pressable>
                    </View>

                    <TextInput
                      multiline
                      placeholder="Backup JSON appears here after export."
                      value={backupText}
                      onChangeText={setBackupText}
                      style={[styles.input, styles.backupTextInput]}
                      placeholderTextColor={COLORS.muted}
                    />
                  </View>
                ) : null}
              </View>
            ) : null}

            {activeDeck && showManagePanel ? (
              <View style={styles.managePanel}>
                <View style={styles.manageHeader}>
                  <View style={styles.manageTitleGroup}>
                    <Text style={styles.manageTitle}>Manage selected deck</Text>
                    <Text style={styles.manageSubtitle}>
                      {selectedDeckCards.length} {selectedDeckCards.length === 1 ? 'card' : 'cards'} in{' '}
                      {selectedDeck.name}
                    </Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    onPress={deleteSelectedDeck}
                    style={({ pressed }) => [styles.deleteDeckButton, pressed && styles.pressed]}>
                    <Text style={styles.deleteDeckButtonText}>Delete deck</Text>
                  </Pressable>
                </View>

                {selectedDeckCards.length > 0 ? (
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={selectedDeckCards.length > 4}
                    decelerationRate="fast"
                    snapToAlignment="start"
                    snapToInterval={76}
                    style={styles.cardListWindow}
                    contentContainerStyle={styles.cardList}>
                    {selectedDeckCards.map((card) => (
                      <View key={card.id} style={styles.managedCard}>
                        <View style={styles.managedCardTextGroup}>
                          <Text style={styles.managedCardFront}>{previewText(card.front)}</Text>
                          <Text style={styles.managedCardBack}>{previewText(card.back)}</Text>
                        </View>

                        <Pressable
                          accessibilityRole="button"
                          onPress={() => deleteCard(card)}
                          style={({ pressed }) => [styles.deleteCardButton, pressed && styles.pressed]}>
                          <Text style={styles.deleteCardButtonText}>Delete</Text>
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.emptyManageState}>
                    <Text style={styles.emptyManageText}>No saved cards in this deck yet.</Text>
                  </View>
                )}
              </View>
            ) : null}

            {statusMessage ? (
              <View style={styles.statusMessage}>
                <CrayonFill tone="create" variant="tight" opacity={0.55} />
                <Text style={styles.statusMessageText}>{statusMessage}</Text>
              </View>
            ) : null}

            <View style={styles.deckSummary}>
              <Text style={styles.metric}>{decks.length}</Text>
              <Text style={styles.metricLabel}>decks</Text>
              <Text style={styles.metric}>{cards.length}</Text>
              <Text style={styles.metricLabel}>total cards</Text>
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={toggleCreateSection}
          style={({ pressed }) => [
            styles.section,
            styles.createCollapsedSection,
            pressed && styles.pressed,
          ]}>
          <CrayonFill tone="create" variant="loose" opacity={0.9} />
          <Text style={[styles.sectionLabel, styles.createCollapsedLabel]}>create</Text>
          <Text style={styles.createCollapsedText}>Choose a deck or start a new one.</Text>
        </Pressable>
      )}
    </>
  );
}

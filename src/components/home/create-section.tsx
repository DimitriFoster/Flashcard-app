import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { getDeckTopicIcon } from '@/lib/deck-topic';
import { parseCardImportText } from '@/lib/import-parser';
import type { ImportAppBackupResult, ImportCardsOptions, ImportCardsResult } from '@/storage/flashcards';
import type { ParsedImportCard } from '@/lib/import-parser';
import type { Deck, Flashcard, NewFlashcard } from '@/types/flashcard';
import { COLORS, styles } from './create-section.styles';

const createPanelSwatch = require('../../../assets/folio-ui/home-page/open-create/open_create_panel_swatch.png');
const createCirclePencil = require('../../../assets/folio-ui/home-page/open-create/create_circle_pencil.png');
const createArrowRight = require('../../../assets/folio-ui/home-page/open-create/create_arrow_right.png');
const createCaretDown = require('../../../assets/folio-ui/home-page/open-create/create_caret_down.png');
const createNewDeckIcon = require('../../../assets/folio-ui/home-page/open-create/create_new_deck_icon.png');
const createImportDeckIcon = require('../../../assets/folio-ui/home-page/open-create/create_import_deck_icon.png');
const createUseTemplateIcon = require('../../../assets/folio-ui/home-page/open-create/create_use_template_icon.png');
const createSmallPencil = require('../../../assets/folio-ui/home-page/open-create/create_small_pencil.png');
const createMagicWand = require('../../../assets/folio-ui/home-page/open-create/create_magic_wand.png');

const importHeaderIcon = require('../../../assets/folio-ui/home-page/open-import/import_header_icon.png');
const importCaretDown = require('../../../assets/folio-ui/home-page/open-import/import_caret_down.png');
const importMagicWand = require('../../../assets/folio-ui/home-page/open-import/import_magic_wand.png');
const importLargeFileBox = require('../../../assets/folio-ui/home-page/open-import/import_large_file_box.png');

const pickHeaderNotebook = require('../../../assets/folio-ui/home-page/open-pick/pick_header_notebook.png');
const pickCaretUp = require('../../../assets/folio-ui/home-page/open-pick/pick_caret_up_source.png');
const pickSelectedCheck = require('../../../assets/folio-ui/home-page/open-pick/pick_selected_check.png');
const pickUnselectedRadio = require('../../../assets/folio-ui/home-page/open-pick/pick_unselected_radio.png');
const pickMagicWand = require('../../../assets/folio-ui/home-page/open-pick/pick_magic_wand.png');

const createCardDeckIcon = require('../../../assets/folio-ui/home-page/create-card/create_card_deck_stack.png');
const createCardFrontIcon = require('../../../assets/folio-ui/home-page/create-card/create_card_front_a.png');
const createCardBackIcon = require('../../../assets/folio-ui/home-page/create-card/create_card_back_b.png');
const createCardCaretDown = require('../../../assets/folio-ui/home-page/create-card/create_card_caret_down.png');
const createCardAddIcon = require('../../../assets/folio-ui/home-page/create-card/create_card_add_stack.png');

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
  tabletLayout?: boolean;
  initialCreateDeckId?: string;
  openCreateCardOnMount?: boolean;
  createCardRequestKey?: string;
  onBrowseDeck?: (deckId: string) => void;
};

type CreateOption = 'card' | 'new' | 'import' | 'pick';

export function HomeCreateSection({
  decks,
  cards,
  selectedDeck,
  onCreateDeck,
  onCreateCard,
  onSelectDeckId,
  onImportCards,
  onImportBackup,
  tabletLayout = false,
  initialCreateDeckId,
  openCreateCardOnMount = false,
  createCardRequestKey,
  onBrowseDeck,
}: HomeCreateSectionProps) {
  const [showCreateDetails, setShowCreateDetails] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CreateOption>('card');
  const [localSelectedDeckId, setLocalSelectedDeckId] = useState('');
  const [createCardDeckId, setCreateCardDeckId] = useState('');
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [deckName, setDeckName] = useState('');
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handledCreateRequestRef = useRef('');

  const selectedPickDeckId = localSelectedDeckId || selectedDeck?.id || decks[0]?.id || '';
  const selectedCreateCardDeckId = createCardDeckId || selectedPickDeckId;
  const selectedCreateCardDeck = decks.find((deck) => deck.id === selectedCreateCardDeckId);

  useEffect(() => {
    if (!openCreateCardOnMount || !initialCreateDeckId) return;
    if (!decks.some((deck) => deck.id === initialCreateDeckId)) return;

    const requestKey = `${initialCreateDeckId}:${createCardRequestKey ?? 'default'}`;
    if (handledCreateRequestRef.current === requestKey) return;

    handledCreateRequestRef.current = requestKey;
    setShowCreateDetails(true);
    setSelectedOption('card');
    setLocalSelectedDeckId(initialCreateDeckId);
    setCreateCardDeckId(initialCreateDeckId);
    onSelectDeckId(initialCreateDeckId);
  }, [createCardRequestKey, decks, initialCreateDeckId, onSelectDeckId, openCreateCardOnMount]);

  function showStatus(message: string) {
    setStatusMessage(message);
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => setStatusMessage(''), 1800);
  }

  function toggleCreateSection() {
    setShowCreateDetails((current) => !current);
  }

  function returnToDefaultCreatePanel() {
    setSelectedOption('card');
  }

  function handleHeaderPress() {
    if (selectedOption !== 'card') {
      returnToDefaultCreatePanel();
      return;
    }

    toggleCreateSection();
  }

  function createDeck() {
    const name = deckName.trim();
    if (!name) {
      showStatus('Enter a deck title first');
      return;
    }

    const deck = onCreateDeck(name);
    if (!deck) {
      showStatus('Could not create deck');
      return;
    }

    onSelectDeckId(deck.id);
    setLocalSelectedDeckId(deck.id);
    setCreateCardDeckId(deck.id);
    setDeckName('');
    setSelectedOption('card');
    showStatus(`Deck created: ${deck.name} ✓`);
  }

  function cycleCreateCardDeck() {
    if (!decks.length) {
      showStatus('Create or import a deck first');
      return;
    }

    const currentIndex = decks.findIndex((deck) => deck.id === selectedCreateCardDeckId);
    const nextDeck = decks[(currentIndex + 1 + decks.length) % decks.length] ?? decks[0];
    setCreateCardDeckId(nextDeck.id);
    setLocalSelectedDeckId(nextDeck.id);
    onSelectDeckId(nextDeck.id);
  }

  function createCard() {
    const deckId = selectedCreateCardDeckId;
    const front = cardFront.trim();
    const back = cardBack.trim();

    if (!deckId) {
      showStatus('Choose a deck first');
      return;
    }

    if (!front || !back) {
      showStatus('Add both front and back text');
      return;
    }

    const card = onCreateCard({ deckId, front, back });
    if (!card) {
      showStatus('Could not create card');
      return;
    }

    setCardFront('');
    setCardBack('');
    showStatus('Card created ✓');
  }

  function importCardRowsFromText(rawText: string, fallbackDeckName = 'Imported Deck') {
    const parsed = parseCardImportText(rawText);

    if (!parsed.cards.length) {
      showStatus(parsed.warnings[0] ?? 'No importable card rows found');
      return false;
    }

    const firstDeckName = parsed.cards.find((card) => card.deckName)?.deckName;
    const result = onImportCards(parsed.cards, {
      mode: 'newDeck',
      newDeckName: firstDeckName || fallbackDeckName,
      skipDuplicates: true,
    });

    const deckId = result.createdDeck?.id ?? result.decks[0]?.id;
    if (deckId) {
      setLocalSelectedDeckId(deckId);
      setCreateCardDeckId(deckId);
      onSelectDeckId(deckId);
    }

    setImportText('');
    setSelectedOption('card');
    showStatus(`Imported ${result.importedCards} cards ✓`);
    return true;
  }

  function beginImportDeck() {
    importCardRowsFromText(importText);
  }

  async function chooseImportFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: [
          'text/*',
          'text/csv',
          'application/csv',
          'application/json',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        showStatus('Could not read selected file');
        return;
      }

      const fileName = asset.name || 'Imported Deck';
      const lowerName = fileName.toLowerCase();

      if (lowerName.endsWith('.xlsx')) {
        showStatus('XLSX binary import is not wired yet. Export CSV for now.');
        return;
      }

      const rawText = await FileSystem.readAsStringAsync(asset.uri);

      if (lowerName.endsWith('.foliopack') || lowerName.endsWith('.json')) {
        const backupResult = onImportBackup(rawText);
        if (backupResult) {
          const deckId = backupResult.decks[0]?.id ?? '';
          if (deckId) {
            setLocalSelectedDeckId(deckId);
            setCreateCardDeckId(deckId);
            onSelectDeckId(deckId);
          }
          setImportText('');
          setSelectedOption('card');
          showStatus('Backup imported ✓');
          return;
        }
      }

      const fallbackDeckName = fileName.replace(/\.[^/.]+$/, '') || 'Imported Deck';
      importCardRowsFromText(rawText, fallbackDeckName);
    } catch {
      showStatus('Could not import that file');
    }
  }

  function chooseDeck(deckId: string) {
    setLocalSelectedDeckId(deckId);
    setCreateCardDeckId(deckId);
    onSelectDeckId(deckId);
  }

  function useSelectedDeck() {
    if (!selectedPickDeckId) {
      showStatus('Create or import a deck first');
      return;
    }
    const deck = decks.find((candidate) => candidate.id === selectedPickDeckId);
    if (!deck) {
      showStatus('Choose a deck first');
      return;
    }

    onSelectDeckId(deck.id);
    setCreateCardDeckId(deck.id);
    setSelectedOption('card');
    showStatus(`Selected deck: ${deck.name} ✓`);
  }

  function browseSelectedDeck() {
    if (!selectedPickDeckId || !onBrowseDeck) {
      showStatus('Choose a deck first');
      return;
    }

    const deck = decks.find((candidate) => candidate.id === selectedPickDeckId);
    if (!deck) {
      showStatus('Choose a deck first');
      return;
    }

    onSelectDeckId(deck.id);
    setCreateCardDeckId(deck.id);
    onBrowseDeck(deck.id);
  }

  const options: Array<{
    id: Exclude<CreateOption, 'card'>;
    title: string;
    subtitle: string;
    icon: any;
  }> = [
    {
      id: 'new',
      title: 'New deck',
      subtitle: 'Start a blank deck\nfrom scratch.',
      icon: createNewDeckIcon,
    },
    {
      id: 'import',
      title: 'Import deck',
      subtitle: 'Add cards from a\nfile or other app.',
      icon: createImportDeckIcon,
    },
    {
      id: 'pick',
      title: 'Pick deck',
      subtitle: 'Choose an existing\ndeck to start.',
      icon: createUseTemplateIcon,
    },
  ];

  const headerConfig =
    selectedOption === 'import'
      ? {
          icon: importHeaderIcon,
          title: 'Import deck',
          subtitle: 'Add cards from a file\nor other app.',
          actionIcon: importCaretDown,
          arrowStyle: styles.topArrow,
        }
      : selectedOption === 'pick'
        ? {
            icon: pickHeaderNotebook,
            title: 'Pick deck',
            subtitle: 'Choose an existing deck\nto get started.',
            actionIcon: pickCaretUp,
            arrowStyle: styles.topArrowUp,
          }
        : selectedOption === 'new'
          ? {
              icon: createNewDeckIcon,
              title: 'New deck',
              subtitle: 'Start a blank deck\nfrom scratch.',
              actionIcon: pickCaretUp,
              arrowStyle: styles.topArrowUp,
            }
          : {
              icon: createCirclePencil,
              title: 'create',
              subtitle: 'Choose a deck or start\na new one.',
              actionIcon: createCaretDown,
              arrowStyle: styles.topArrow,
            };

  if (!showCreateDetails) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={toggleCreateSection}
        style={({ pressed }) => [styles.collapsedSection, tabletLayout && styles.collapsedSectionTablet, pressed && styles.pressed]}>
        <HomePanelFill source={createPanelSwatch} opacity={1} />

        {tabletLayout ? (
          <View style={styles.topRowTablet}>
            <View style={styles.tabletTitleLine}>
              <Image source={createCirclePencil} style={styles.tabletInlineIcon} resizeMode="contain" />
              <Text style={[styles.topTitle, styles.topTitleTablet]}>create</Text>
            </View>
            <Text style={[styles.topSubtitle, styles.topSubtitleTablet]}>Choose a deck or start a new one.</Text>
          </View>
        ) : (
          <View style={styles.topRow}>
            <View style={styles.topIconWrap}>
              <Image source={createCirclePencil} style={styles.topIcon} resizeMode="contain" />
            </View>

            <View style={styles.topTextWrap}>
              <Text style={styles.topTitle}>create</Text>
              <Text style={styles.topSubtitle}>Choose a deck or start{`\n`}a new one.</Text>
            </View>

            <Image source={createArrowRight} style={styles.topArrow} resizeMode="contain" />
          </View>
        )}
      </Pressable>
    );
  }

  function renderOptionCards() {
    return (
      <View style={styles.optionRow}>
        {options.map((option) => {
          const active = option.id === selectedOption;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              onPress={() => setSelectedOption(option.id)}
              style={({ pressed }) => [styles.optionCard, active && styles.optionCardActive, pressed && styles.pressed]}>
              <Image source={option.icon} style={styles.optionIcon} resizeMode="contain" />
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function renderCreateCardPanel() {
    return (
      <View style={styles.body}>
        <View style={styles.caretWrap}>
          <Image source={createCaretDown} style={styles.caretIcon} resizeMode="contain" />
        </View>

        <Text style={styles.sectionHeading}>CREATE A CARD</Text>
        <Text style={styles.sectionIntro}>Quickly add a flashcard to an existing deck.</Text>

        <View style={styles.createCardBox}>
          <View style={styles.createCardRow}>
            <Image source={createCardDeckIcon} style={styles.createCardRowIcon} resizeMode="contain" />
            <Text style={styles.createCardLabel}>Deck</Text>
            <Pressable
              accessibilityRole="button"
              onPress={cycleCreateCardDeck}
              style={({ pressed }) => [styles.createCardDeckPicker, pressed && styles.pressed]}>
              <Text numberOfLines={1} style={styles.createCardDeckText}>
                {selectedCreateCardDeck?.name ?? 'Choose a deck'}
              </Text>
              <Image source={createCardCaretDown} style={styles.createCardPickerIcon} resizeMode="contain" />
            </Pressable>
          </View>

          <View style={styles.createCardRow}>
            <Image source={createCardFrontIcon} style={styles.createCardRowIcon} resizeMode="contain" />
            <Text style={styles.createCardLabel}>Front</Text>
            <TextInput
              placeholder="Front of card"
              placeholderTextColor="#8A8E84"
              value={cardFront}
              onChangeText={setCardFront}
              style={styles.createCardInput}
              returnKeyType="next"
            />
          </View>

          <View style={styles.createCardRow}>
            <Image source={createCardBackIcon} style={styles.createCardRowIcon} resizeMode="contain" />
            <Text style={styles.createCardLabel}>Back</Text>
            <TextInput
              placeholder="Back of card"
              placeholderTextColor="#8A8E84"
              value={cardBack}
              onChangeText={setCardBack}
              style={styles.createCardInput}
              returnKeyType="done"
              onSubmitEditing={createCard}
            />
          </View>

          <View style={styles.createCardActionRow}>
            <Pressable
              accessibilityRole="button"
              onPress={createCard}
              style={({ pressed }) => [styles.createCardButton, pressed && styles.pressed]}>
              <Text style={styles.createCardButtonText}>Create card</Text>
              <Image source={createCardAddIcon} style={styles.createCardButtonIcon} resizeMode="contain" />
            </Pressable>
          </View>
        </View>

        {renderOptionCards()}

        <View style={styles.bodyDivider} />

        <Text style={styles.tipText}>💡 Tap <Text style={styles.tipStrong}>New deck</Text> to open deck setup.</Text>
      </View>
    );
  }

  function renderNewDeckPanel() {
    return (
      <View style={styles.body}>
        <View style={styles.caretWrap}>
          <Image source={createCaretDown} style={styles.caretIcon} resizeMode="contain" />
        </View>

        <Text style={styles.sectionHeading}>CREATE A NEW DECK</Text>
        <Text style={styles.sectionIntro}>Start from scratch, then add cards from the Create panel.</Text>

        <Text style={styles.fieldLabel}>Deck title</Text>

        <View style={styles.inputWrap}>
          <TextInput
            placeholder="e.g., Biology Chapter 1"
            placeholderTextColor="#8A8E84"
            value={deckName}
            onChangeText={setDeckName}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={createDeck}
          />
          <Image source={createSmallPencil} style={styles.inputIcon} resizeMode="contain" />
        </View>

        <Text style={styles.helperText}>You can always change this later.</Text>

        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            onPress={createDeck}
            style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
            <Text style={styles.createButtonText}>Create deck</Text>
            <Image source={createMagicWand} style={styles.createButtonIcon} resizeMode="contain" />
          </Pressable>
        </View>
      </View>
    );
  }

  function renderImportDeckPanel() {
    return (
      <View style={styles.importBody}>
        <Text style={styles.importHeading}>IMPORT A DECK</Text>
        <Text style={styles.importIntro}>Paste CSV, TSV, or simple text rows to bring cards into Folio.</Text>

        <View style={styles.importDropZone}>
          <Image source={importLargeFileBox} style={styles.importLargeIcon} resizeMode="contain" />
       <Pressable
            accessibilityRole="button"
            onPress={chooseImportFile}
            style={({ pressed }) => [styles.importChooseFileButton, pressed && styles.pressed]}>
            <Text style={styles.importChooseFileText}>Choose file from phone</Text>
          </Pressable>
          <Text style={styles.importDropTitle}>Or paste card rows here</Text>
          <TextInput
            multiline
            value={importText}
            onChangeText={setImportText}
            placeholder={`front,back\nWhat is RAG?,Retrieval augmented generation`}
            placeholderTextColor="#7E8778"
            textAlignVertical="top"
            style={styles.importTextInput}
          />
        </View>

        <View style={styles.importDividerRow}>
          <View style={styles.importDividerLine} />
          <Text style={styles.importDividerDot}>•</Text>
          <Text style={styles.importDividerStar}>☆</Text>
          <Text style={styles.importDividerDot}>•</Text>
          <View style={styles.importDividerLine} />
        </View>

        <View style={styles.supportedRow}>
          <Text style={styles.supportedText}>Supported files: .csv, .tsv, .txt, .json, .foliopack</Text>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={beginImportDeck}
          style={({ pressed }) => [styles.importButton, pressed && styles.pressed]}>
          <Text style={styles.importButtonText}>Import deck</Text>
          <Image source={importMagicWand} style={styles.importButtonIcon} resizeMode="contain" />
        </Pressable>

        <Pressable accessibilityRole="button" onPress={() => showStatus('Rows can use front/back headers or two columns')}>
          <Text style={styles.importLearnLink}>Learn how import works</Text>
        </Pressable>
      </View>
    );
  }

  function renderPickDeckPanel() {
    return (
      <View style={styles.pickBody}>
        <View style={styles.pickCaretWrap}>
          <Image source={pickCaretUp} style={styles.pickCaretDown} resizeMode="contain" />
        </View>

        <Text style={styles.pickHeading}>AVAILABLE DECKS</Text>

        {decks.length ? (
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={decks.length > 4}
            style={styles.pickListScroll}
            contentContainerStyle={styles.pickList}
          >
            {decks.map((deck) => {
              const deckCards = cards.filter((card) => card.deckId === deck.id);
              const active = deck.id ===selectedPickDeckId;

              return (
                 <Pressable
                  key={deck.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${deck.name}`}
                  onPress={() => chooseDeck(deck.id)}
                  style={({ pressed }) => [
                    styles.pickDeckRow,
                    active && styles.pickDeckRowActive,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.pickTopicIconWrap}>
                    <Image source={getDeckTopicIcon(deck, deckCards)} style={styles.pickTopicIcon} resizeMode="contain" />
                  </View>

                  <View style={styles.pickDeckTextWrap}>
                    <Text style={styles.pickDeckTitle} numberOfLines={1}>{deck.name}</Text>
                    <Text style={styles.pickDeckCount}>{deckCards.length} cards</Text>
                  </View>

                  <Image
                    source={active ? pickSelectedCheck : pickUnselectedRadio}
                    style={active ? styles.pickSelectedIcon : styles.pickUnselectedIcon}
                    resizeMode="contain"
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.pickEmptyState}>
            <Text style={styles.pickDeckTitle}>No decks yet</Text>
            <Text style={styles.pickDeckCount}>Create or import a deck first.</Text>
          </View>
        )}

        <View style={styles.pickDividerRow}>
          <View style={styles.pickDividerLineShort} />
          <Text style={styles.pickDividerStar}>☆</Text>
          <View style={styles.pickDividerLineShort} />
        </View>

        <View style={styles.pickActionRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use selected deck"
            onPress={useSelectedDeck}
            style={({ pressed }) => [styles.pickUseButton, pressed && styles.pressed]}>
            <Text adjustsFontSizeToFit minimumFontScale={0.72} numberOfLines={1} style={styles.pickUseButtonText}>
              Use selected deck
            </Text>
            <Image source={pickMagicWand} style={styles.pickUseButtonIcon} resizeMode="contain" />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Browse selected deck"
            onPress={browseSelectedDeck}
            style={({ pressed }) => [styles.pickBrowseButton, pressed && styles.pressed]}>
            <Text style={styles.pickBrowseButtonText}>Browse</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.panelShell}>
      <HomePanelFill source={createPanelSwatch} opacity={1} />

      <Pressable
        accessibilityRole="button"
        onPress={handleHeaderPress}
        style={({ pressed }) => [styles.headerPressable, pressed && styles.pressed]}>
        {tabletLayout ? (
          <View style={styles.topRowTablet}>
            <View style={styles.tabletTitleLine}>
              <Image source={headerConfig.icon} style={styles.tabletInlineIcon} resizeMode="contain" />
              <Text style={[styles.topTitle, styles.topTitleTablet]}>{headerConfig.title}</Text>
              <Image source={headerConfig.actionIcon} style={[styles.tabletInlineActionIcon, headerConfig.arrowStyle]} resizeMode="contain" />
            </View>
            <Text style={[styles.topSubtitle, styles.topSubtitleTablet]}>{headerConfig.subtitle.replace(/\n/g, ' ')}</Text>
          </View>
        ) : (
          <View style={styles.topRow}>
            <View style={styles.topIconWrap}>
              <Image source={headerConfig.icon} style={styles.topIcon} resizeMode="contain" />
            </View>

            <View style={styles.topTextWrap}>
              <Text style={styles.topTitle}>{headerConfig.title}</Text>
              <Text style={styles.topSubtitle}>{headerConfig.subtitle}</Text>
            </View>

            <Image source={headerConfig.actionIcon} style={headerConfig.arrowStyle} resizeMode="contain" />
          </View>
        )}
      </Pressable>

      <View style={styles.divider} />

      {selectedOption === 'card' ? renderCreateCardPanel() : null}
      {selectedOption === 'new' ? renderNewDeckPanel() : null}
      {selectedOption === 'import' ? renderImportDeckPanel() : null}
      {selectedOption === 'pick' ? renderPickDeckPanel() : null}

      {statusMessage ? (
        <View style={styles.statusMessage}>
          <Text style={styles.statusMessageText}>{statusMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

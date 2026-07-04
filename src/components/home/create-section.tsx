import React, { useRef, useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { getDeckTopicIcon } from '@/lib/deck-topic';
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

type CreateOption = 'new' | 'import' | 'pick';

export function HomeCreateSection({
  decks,
  cards,
  selectedDeck,
  onCreateDeck,
  onSelectDeckId,
}: HomeCreateSectionProps) {
  const [showCreateDetails, setShowCreateDetails] = useState(true);
  const [selectedOption, setSelectedOption] = useState<CreateOption>('new');
  const [localSelectedDeckId, setLocalSelectedDeckId] = useState('');
  const [deckName, setDeckName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedPickDeckId = localSelectedDeckId || selectedDeck?.id || decks[0]?.id || '';

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
    setSelectedOption('new');
  }

  function handleHeaderPress() {
    if (selectedOption === 'import' || selectedOption === 'pick') {
      returnToDefaultCreatePanel();
      return;
    }

    toggleCreateSection();
  }

  function createDeck() {
    if (selectedOption !== 'new') {
      showStatus(selectedOption === 'import' ? 'Import deck picker comes next' : 'Pick a deck first');
      return;
    }

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
    setDeckName('');
    showStatus(`Deck created: ${deck.name} ✓`);
  }

  function beginImportDeck() {
    showStatus('Import deck picker comes next');
  }

  function chooseDeck(deckId: string) {
    setLocalSelectedDeckId(deckId);
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
    showStatus(`Selected deck: ${deck.name} ✓`);
  }

  const options: Array<{
    id: CreateOption;
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
        style={({ pressed }) => [styles.collapsedSection, pressed && styles.pressed]}>
        <HomePanelFill source={createPanelSwatch} opacity={1} />

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
      </Pressable>
    );
  }

  function renderNewDeckPanel() {
    return (
      <View style={styles.body}>
        <Text style={styles.sectionHeading}>CREATE A NEW DECK</Text>
        <Text style={styles.sectionIntro}>Start from scratch, import, or use a template.</Text>

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

        <View style={styles.bodyDivider} />

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
        <Text style={styles.importIntro}>Bring your existing cards into Folio.</Text>

        <Pressable
          accessibilityRole="button"
          onPress={beginImportDeck}
          style={({ pressed }) => [styles.importDropZone, pressed && styles.pressed]}>
          <Image source={importLargeFileBox} style={styles.importLargeIcon} resizeMode="contain" />
          <Text style={styles.importDropTitle}>Drop a file or choose one</Text>
          <Text style={styles.importDropText}>Drag & drop anywhere in this area{`\n`}or tap to browse.</Text>
        </Pressable>

        <View style={styles.importDividerRow}>
          <View style={styles.importDividerLine} />
          <Text style={styles.importDividerDot}>•</Text>
          <Text style={styles.importDividerStar}>☆</Text>
          <Text style={styles.importDividerDot}>•</Text>
          <View style={styles.importDividerLine} />
        </View>

        <View style={styles.supportedRow}>
          <Text style={styles.supportedText}>Supported files: .foliopack, .csv, .txt, .xlsx</Text>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={beginImportDeck}
          style={({ pressed }) => [styles.importButton, pressed && styles.pressed]}>
          <Text style={styles.importButtonText}>Import deck</Text>
          <Image source={importMagicWand} style={styles.importButtonIcon} resizeMode="contain" />
        </Pressable>

        <Pressable accessibilityRole="button" onPress={() => showStatus('Import help comes next')}>
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

        <View style={styles.pickList}>
          {decks.length ? (
            decks.slice(0, 4).map((deck) => {
              const deckCards = cards.filter((card) => card.deckId === deck.id);
              const active = deck.id === selectedPickDeckId;

              return (
                <Pressable
                  key={deck.id}
                  accessibilityRole="button"
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
            })
          ) : (
            <View style={styles.pickEmptyState}>
              <Text style={styles.pickDeckTitle}>No decks yet</Text>
              <Text style={styles.pickDeckCount}>Create or import a deck first.</Text>
            </View>
          )}
        </View>

        <View style={styles.pickDividerRow}>
          <View style={styles.pickDividerLineShort} />
          <Text style={styles.pickDividerStar}>☆</Text>
          <View style={styles.pickDividerLineShort} />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={useSelectedDeck}
          style={({ pressed }) => [styles.pickUseButton, pressed && styles.pressed]}>
          <Text style={styles.pickUseButtonText}>Use selected deck</Text>
          <Image source={pickMagicWand} style={styles.pickUseButtonIcon} resizeMode="contain" />
        </Pressable>
      </View>
    );
  }

  function renderTemplatePanel() {
    return (
      <View style={styles.body}>
        <Text style={styles.sectionHeading}>PICK A DECK</Text>
        <Text style={styles.sectionIntro}>Choose an existing deck to get started.</Text>

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
      </Pressable>

      <View style={styles.divider} />

      {selectedOption === 'new' ? (
        <>
          <View style={styles.caretWrap}>
            <Image source={createCaretDown} style={styles.caretIcon} resizeMode="contain" />
          </View>
          {renderNewDeckPanel()}
        </>
      ) : selectedOption === 'import' ? (
        renderImportDeckPanel()
      ) : selectedOption === 'pick' ? (
        renderPickDeckPanel()
      ) : (
        renderTemplatePanel()
      )}

      {statusMessage ? (
        <View style={styles.statusMessage}>
          <Text style={styles.statusMessageText}>{statusMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

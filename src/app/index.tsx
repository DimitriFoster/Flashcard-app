import { type Href, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  addDeck,
  addFlashcard,
  getDecks,
  getFlashcards,
} from '@/storage/flashcards';
import type { Deck, Flashcard } from '@/types/flashcard';

const COLORS = {
  background: '#F7F8FB',
  panel: '#FFFFFF',
  panelAlt: '#EEF2F7',
  ink: '#172033',
  muted: '#667085',
  line: '#D8DEE8',
  create: '#0E8F7E',
  createSoft: '#DCF8F2',
  review: '#375DFB',
  reviewSoft: '#E5EAFF',
  danger: '#D92D20',
};

function getDeckCardCount(deckId: string, cards: Flashcard[]) {
  return cards.filter((card) => card.deckId === deckId).length;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [showCreateDetails, setShowCreateDetails] = useState(true);
  const [showDeckPicker, setShowDeckPicker] = useState(false);
  const [isDeckPickerRendered, setIsDeckPickerRendered] = useState(false);
  const [showNewDeckForm, setShowNewDeckForm] = useState(false);
  const [isNewDeckFormRendered, setIsNewDeckFormRendered] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const deckPickerProgress = useRef(new Animated.Value(0)).current;
  const newDeckProgress = useRef(new Animated.Value(0)).current;

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId),
    [decks, selectedDeckId]
  );
  const addCardButtonLabel = selectedDeck
    ? `Add card to ${selectedDeck.name}`
    : 'Add card to existing Deck';

  function toggleDeckPicker() {
    const nextValue = showDeckPicker ? 0 : 1;

    if (!showDeckPicker) {
      setIsDeckPickerRendered(true);
    }

    setShowDeckPicker(!showDeckPicker);

    Animated.timing(deckPickerProgress, {
      toValue: nextValue,
      duration: 520,
      easing: Easing.out(Easing.cubic),
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
      setIsNewDeckFormRendered(true);
    }

    setShowNewDeckForm(!showNewDeckForm);

    Animated.timing(newDeckProgress, {
      toValue: nextValue,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && nextValue === 0) {
        setIsNewDeckFormRendered(false);
      }
    });
  }

  function toggleCreateSection() {
    setShowCreateDetails((current) => !current);
  }

  useEffect(() => {
    const nextDecks = getDecks();

    setDecks(nextDecks);
    setCards(getFlashcards());
    setSelectedDeckId((previousDeckId) =>
      nextDecks.some((deck) => deck.id === previousDeckId) ? previousDeckId : ''
    );
  }, []);

  function refresh() {
    const nextDecks = getDecks();
    const nextCards = getFlashcards();

    setDecks(nextDecks);
    setCards(nextCards);

    if (!nextDecks.some((deck) => deck.id === selectedDeckId)) {
      setSelectedDeckId('');
    }
  }

  function createDeck() {
    const name = deckName.trim();

    if (!name) {
      return;
    }

    const deck = addDeck({ name });
    setDeckName('');
    setSelectedDeckId(deck.id);
    setShowNewDeckForm(false);
    Animated.timing(newDeckProgress, {
      toValue: 0,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setIsNewDeckFormRendered(false);
      }
    });
    setShowDeckPicker(true);
    refresh();
  }

  function createCard() {
    const nextFront = front.trim();
    const nextBack = back.trim();

    if (!selectedDeck || !nextFront || !nextBack) {
      return;
    }

    const card = addFlashcard({
      deckId: selectedDeck.id,
      front: nextFront,
      back: nextBack,
    });

    setCards((previousCards) => [card, ...previousCards]);
    setFront('');
    setBack('');
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 110,
        },
      ]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Flashcard workspace</Text>
        <Text style={styles.title}>Create decks fast, then review with intent.</Text>
        <Text style={styles.subtitle}>
          Capture cards into focused decks, then jump to Review when you are ready to study.
        </Text>
      </View>

      {showCreateDetails ? (
        <View style={[styles.section, styles.createSection]}>
          <Pressable
            accessibilityRole="button"
            onPress={toggleCreateSection}
            style={({ pressed }) => [styles.sectionHeader, pressed && styles.pressed]}>
            <Text style={styles.sectionLabel}>create</Text>
            <Text style={styles.sectionKicker}>Choose a deck or start a new one.</Text>
          </Pressable>

          <View style={styles.createBody}>
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

            <View style={styles.dropdownToggleRow}>
              <Pressable
                accessibilityRole="button"
                onPress={toggleNewDeckForm}
                style={({ pressed }) => [styles.compactToggle, styles.compactToggleNarrow, pressed && styles.pressed]}>
                <Text style={styles.deckPickerToggleText}>New Deck</Text>
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
                style={({ pressed }) => [styles.compactToggle, styles.compactToggleWide, pressed && styles.pressed]}>
                <Text style={styles.deckPickerToggleText}>Add cards to existing Deck</Text>
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
            </View>

            {isNewDeckFormRendered ? (
              <Animated.View
                style={[
                  styles.newDeckPanel,
                  {
                    height: newDeckProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 116],
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
                      outputRange: [0, 188],
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
                  contentContainerStyle={styles.deckPicker}>
                  {decks.map((deck) => {
                    const active = deck.id === selectedDeck?.id;

                    return (
                      <Pressable
                        key={deck.id}
                        accessibilityRole="button"
                        onPress={() => setSelectedDeckId(deck.id)}
                        style={[styles.deckChip, active && styles.deckChipActive]}>
                        <Text style={[styles.deckChipText, active && styles.deckChipTextActive]}>
                          {deck.name}
                        </Text>
                        <Text style={styles.deckChipCount}>{getDeckCardCount(deck.id, cards)} cards</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !selectedDeck }}
                  disabled={!selectedDeck}
                  onPress={createCard}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    !selectedDeck && styles.primaryButtonDisabled,
                    pressed && selectedDeck && styles.pressed,
                  ]}>
                  <Text
                    style={[
                      styles.primaryButtonText,
                      !selectedDeck && styles.primaryButtonTextDisabled,
                    ]}>
                    {addCardButtonLabel}
                  </Text>
                </Pressable>
              </Animated.View>
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
          style={({ pressed }) => [styles.section, styles.createCollapsedSection, pressed && styles.pressed]}>
          <Text style={[styles.sectionLabel, styles.createCollapsedLabel]}>create</Text>
          <Text style={styles.createCollapsedText}>Choose a deck or start a new one.</Text>
        </Pressable>
      )}

      <View style={[styles.section, styles.reviewSection]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, styles.reviewSectionLabel]}>review</Text>
          <Text style={styles.sectionKicker}>Jump into spaced repetition when you’re ready.</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/review' as Href)}
          style={({ pressed }) => [styles.reviewButton, pressed && styles.pressed]}>
          <Text style={styles.reviewButtonText}>Review</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 18,
    gap: 18,
  },
  header: {
    gap: 8,
    maxWidth: 820,
  },
  eyebrow: {
    color: COLORS.review,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.ink,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 660,
  },
  section: {
    borderRadius: 8,
    padding: 16,
    gap: 14,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  createSection: {
    borderTopColor: COLORS.create,
    borderTopWidth: 4,
  },
  createCollapsedSection: {
    backgroundColor: COLORS.create,
    borderColor: COLORS.create,
    minHeight: 132,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  reviewSection: {
    borderTopColor: COLORS.review,
    borderTopWidth: 4,
  },
  reviewSectionLabel: {
    color: COLORS.review,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionLabel: {
    color: COLORS.create,
    fontSize: 28,
    fontWeight: '800',
  },
  createCollapsedLabel: {
    color: '#FFFFFF',
  },
  sectionKicker: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  createCollapsedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  dropdownToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  createBody: {
    gap: 14,
    paddingTop: 14,
  },
  deckPickerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  compactToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 42,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  compactToggleNarrow: {
    flex: 0.88,
  },
  compactToggleWide: {
    flex: 1.12,
  },
  deckPickerToggleText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  deckPickerToggleChevron: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    color: COLORS.ink,
    backgroundColor: COLORS.panelAlt,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  deckNameInput: {
    flex: 1,
    minHeight: 48,
  },
  deckButton: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.createSoft,
    borderWidth: 1,
    borderColor: COLORS.create,
  },
  deckButtonText: {
    color: COLORS.create,
    fontSize: 14,
    fontWeight: '800',
  },
  deckPicker: {
    gap: 10,
    paddingVertical: 2,
  },
  deckPickerPanel: {
    gap: 12,
    backgroundColor: COLORS.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    overflow: 'hidden',
  },
  newDeckPanel: {
    gap: 10,
    backgroundColor: COLORS.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    overflow: 'hidden',
  },
  deckChip: {
    minWidth: 132,
    borderRadius: 8,
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  deckChipActive: {
    backgroundColor: COLORS.createSoft,
    borderColor: COLORS.create,
  },
  deckChipText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  deckChipTextActive: {
    color: COLORS.create,
  },
  deckChipCount: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  frontInput: {
    minHeight: 82,
  },
  backInput: {
    minHeight: 108,
  },
  primaryButton: {
    backgroundColor: COLORS.create,
    borderRadius: 8,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D5DBE5',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonTextDisabled: {
    color: COLORS.muted,
  },
  reviewButton: {
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.review,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButtonText: {
    color: COLORS.review,
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.78,
  },
  deckSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  metric: {
    color: COLORS.create,
    fontSize: 22,
    fontWeight: '800',
  },
  metricLabel: {
    color: COLORS.muted,
    fontSize: 13,
    marginRight: 8,
  },
});

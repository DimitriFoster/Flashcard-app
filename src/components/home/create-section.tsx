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
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { COLORS, styles } from './create-section.styles';
import type { Deck, Flashcard, NewFlashcard } from '@/types/flashcard';

/** Count cards for one deck. Used by the horizontal deck picker chips. */
function getDeckCardCount(deckId: string, cards: Flashcard[]) {
  return cards.filter((card) => card.deckId === deckId).length;
}

type HomeCreateSectionProps = {
  decks: Deck[];
  cards: Flashcard[];
  selectedDeck?: Deck;
  onSelectDeckId: (deckId: string) => void;
  onCreateDeck: (name: string) => Deck | undefined;
  onCreateCard: (input: NewFlashcard) => Flashcard | undefined;
};

export function HomeCreateSection({
  decks,
  cards,
  selectedDeck,
  onSelectDeckId,
  onCreateDeck,
  onCreateCard,
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

  /** Controlled inputs for creating decks and cards. */
  const [deckName, setDeckName] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  /**
   * Animated.Value objects persist across renders with useRef.
   * They drive chevron rotation, panel height, opacity, and slide-in movement.
   */
  const deckPickerProgress = useRef(new Animated.Value(0)).current;
  const newDeckProgress = useRef(new Animated.Value(0)).current;

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
      setDeckName('');

      /** Collapse the new deck form after successful creation. */
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

      /** Show the deck picker so the user can see the deck they just created. */
      setShowDeckPicker(true);
    }
  }

  function createCard() {
    const nextFront = front.trim();
    const nextBack = back.trim();

    /** A card needs a target deck, a prompt, and an answer. */
    if (!selectedDeck || !nextFront || !nextBack) {
      return;
    }

    const card = onCreateCard({
      deckId: selectedDeck.id,
      front: nextFront,
      back: nextBack,
    });

    if (card) {
      /** Clear the card form so the user can quickly enter the next card. */
      setFront('');
      setBack('');
    }
  }

  return (
    <>
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
                style={({ pressed }) => [
                  styles.compactToggle,
                  styles.compactToggleNarrow,
                  pressed && styles.pressed,
                ]}>
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
                style={({ pressed }) => [
                  styles.compactToggle,
                  styles.compactToggleWide,
                  pressed && styles.pressed,
                ]}>
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
                        onPress={() => onSelectDeckId(deck.id)}
                        style={[styles.deckChip, active && styles.deckChipActive]}>
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
          style={({ pressed }) => [
            styles.section,
            styles.createCollapsedSection,
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.sectionLabel, styles.createCollapsedLabel]}>create</Text>
          <Text style={styles.createCollapsedText}>Choose a deck or start a new one.</Text>
        </Pressable>
      )}
    </>
  );
}

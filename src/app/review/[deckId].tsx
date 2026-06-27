/**
 * Focused deck review route.
 *
 * This screen contains the review-session state machine:
 * - which deck is open
 * - which card is currently visible
 * - whether the card is flipped
 * - how swipe gestures advance between cards
 * - how difficulty buttons update spaced-repetition state
 *
 * The visual layout is delegated to DeckReviewSession so this route file can
 * focus on data, state, and navigation behavior.
 */
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder } from 'react-native';

import { DeckReviewSession } from '@/components/review/deck-review-session';
import { getDecks, getFlashcardsByDeck, reviewFlashcard } from '@/storage/flashcards';
import type { Deck, Flashcard, ReviewGrade } from '@/types/flashcard';

function findDeck(deckId: string, decks: Deck[]) {
  return decks.find((deck) => deck.id === deckId);
}

export default function DeckReviewScreen() {
  const router = useRouter();

  /**
   * Expo Router gives dynamic route params as string | string[] | undefined.
   * The array case can happen when a query param appears more than once.
   * Normalizing it up front keeps the rest of the screen simpler.
   */
  const params = useLocalSearchParams<{ deckId?: string | string[] }>();
  const deckId = Array.isArray(params.deckId) ? params.deckId[0] : params.deckId;

  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  /**
   * Animated.Value stores the horizontal card position during swipe gestures.
   * It lives in a ref so the same animated value survives re-renders.
   */
  const translateX = useRef(new Animated.Value(0)).current;

  /**
   * PanResponder callbacks are created once and can otherwise close over stale
   * values. This ref keeps the latest card count available inside gesture logic.
   */
  const cardsLengthRef = useRef(0);

  const deckName = useMemo(
    () => (deckId ? findDeck(deckId, decks)?.name : undefined),
    [deckId, decks]
  );
  const currentCard = cards[currentIndex];

  /**
   * Any actual card change should return the review card to the prompt side.
   * This protects swipe navigation from leaving the next card visually stale or
   * stuck on an empty answer face before the user grades anything.
   */
  useEffect(() => {
    setFlipped(false);
    translateX.setValue(0);
  }, [currentCard?.id, translateX]);

  /**
   * Refresh local state whenever this screen becomes active.
   * This allows Home/Review changes to show up without restarting the app.
   */
  useFocusEffect(
    useCallback(() => {
      const nextDecks = getDecks();
      const nextCards = deckId ? getFlashcardsByDeck(deckId) : [];

      setDecks(nextDecks);
      setCards(nextCards);
      setCurrentIndex(0);
      setFlipped(false);
      translateX.setValue(0);
    }, [deckId, translateX])
  );

  /**
   * Keep currentIndex valid whenever the number of cards changes.
   * This prevents a blank screen if the current card array shrinks after review.
   */
  useEffect(() => {
    cardsLengthRef.current = cards.length;

    setCurrentIndex((index) => {
      if (cards.length === 0) {
        return 0;
      }

      return Math.min(index, cards.length - 1);
    });
  }, [cards.length]);

  /** Move forward without grading the card. Used by swipe gestures. */
  const goToNextCard = useCallback(() => {
    const cardCount = cardsLengthRef.current;

    if (cardCount === 0) {
      return;
    }

    setFlipped(false);
    setCurrentIndex((index) => (index >= cardCount - 1 ? 0 : index + 1));
  }, []);

  /** Move backward without grading the card. Used by swipe gestures. */
  const goToPreviousCard = useCallback(() => {
    const cardCount = cardsLengthRef.current;

    if (cardCount === 0) {
      return;
    }

    setFlipped(false);
    setCurrentIndex((index) => (index <= 0 ? cardCount - 1 : index - 1));
  }, []);

  /**
   * Finishes a swipe by sending the card offscreen, then resets translateX to 0
   * before showing the next/previous card. This creates a physical card-deck feel.
   */
  const animateCardOffscreen = useCallback(
    (direction: 'left' | 'right') => {
      Animated.timing(translateX, {
        toValue: direction === 'left' ? -500 : 500,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        translateX.setValue(0);

        if (direction === 'left') {
          goToNextCard();
        } else {
          goToPreviousCard();
        }
      });
    },
    [goToNextCard, goToPreviousCard, translateX]
  );

  /**
   * Difficulty buttons are the only actions that update review scheduling.
   * Swiping intentionally does not mutate card data. It only browses the deck.
   */
  function handleGrade(grade: ReviewGrade) {
    if (!deckId || !currentCard) {
      return;
    }

    reviewFlashcard(currentCard.id, grade);

    /**
     * Reload from storage so the UI reflects the updated review state.
     * This also keeps this screen consistent with the Review preview page.
     */
    const nextCards = getFlashcardsByDeck(deckId);
    setCards(nextCards);

    /**
     * Advance after grading, but clamp against the freshly loaded array length.
     * This avoids pointing at an index that no longer exists.
     */
    setFlipped(false);
    setCurrentIndex((index) => {
      if (nextCards.length === 0) {
        return 0;
      }

      return index >= nextCards.length - 1 ? 0 : index + 1;
    });
  }

  /**
   * PanResponder turns horizontal drag gestures into card navigation.
   *
   * Thresholds:
   * - 12px: start handling the gesture
   * - 90px: commit the swipe
   */
  const panResponder = useRef(
    PanResponder.create({
      /**
       * Let the card surface own both tap and swipe gestures.
       *
       * A nested Pressable inside a PanResponder can look pressed but still fail
       * to fire onPress reliably on mobile. Handling tap-to-flip here avoids that
       * responder conflict.
       */
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6,
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 4) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const absDx = Math.abs(gestureState.dx);
        const absDy = Math.abs(gestureState.dy);

        /**
         * Treat a small movement as a tap. This is now the official flip action.
         */
        if (absDx < 12 && absDy < 12) {
          setFlipped((value) => !value);
          translateX.setValue(0);
          return;
        }

        if (gestureState.dx < -90) {
          animateCardOffscreen('left');
          return;
        }

        if (gestureState.dx > 90) {
          animateCardOffscreen('right');
          return;
        }

        /** If the swipe is too small, spring the card back into place. */
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <DeckReviewSession
      deckName={deckName}
      currentIndex={currentIndex}
      cardsLength={cards.length}
      currentCard={currentCard}
      flipped={flipped}
      translateX={translateX}
      panHandlers={panResponder.panHandlers}
      onBack={() => router.push('/review')}
      onGrade={handleGrade}
    />
  );
}

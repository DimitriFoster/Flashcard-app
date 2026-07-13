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
import { SessionRecap } from '@/components/review/session-recap';
import {
  getDecks,
  getFlashcardsByDeck,
  getReviewLogs,
  reviewFlashcard,
  undoLastReview,
  updateFlashcard,
} from '@/storage/flashcards';
import type { Deck, Flashcard, ReviewGrade } from '@/types/flashcard';
import { getReviewQueue } from '../../lib/review-queue';
import { shouldShowSessionRecap, type ReviewGradeCounts } from '../../lib/session-recap';

function findDeck(deckId: string, decks: Deck[]) {
  return decks.find((deck) => deck.id === deckId);
}

type SessionReviewAction = {
  cardId: string;
  grade: ReviewGrade;
};

function createEmptyGradeCounts(): ReviewGradeCounts {
  return {
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  };
}

export default function DeckReviewScreen() {
  const router = useRouter();

  /**
   * Expo Router gives dynamic route params as string | string[] | undefined.
   * The array case can happen when a query param appears more than once.
   * Normalizing it up front keeps the rest of the screen simpler.
   */
  const params = useLocalSearchParams<{
    deckId?: string | string[];
    mode?: string | string[];
    cardSearch?: string | string[];
    browseSearchLabel?: string | string[];
    initialCardId?: string | string[];
    initialCardIndex?: string | string[];
  }>();
  const deckId = Array.isArray(params.deckId) ? params.deckId[0] : params.deckId;
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const cardSearch = Array.isArray(params.cardSearch) ? params.cardSearch[0] : params.cardSearch;
  const browseSearchLabel = Array.isArray(params.browseSearchLabel) ? params.browseSearchLabel[0] : params.browseSearchLabel;
  const initialCardId = Array.isArray(params.initialCardId) ? params.initialCardId[0] : params.initialCardId;
  const rawInitialCardIndex = Array.isArray(params.initialCardIndex) ? params.initialCardIndex[0] : params.initialCardIndex;
  const requestedInitialCardIndex = rawInitialCardIndex !== undefined ? Number(rawInitialCardIndex) : -1;
  const normalizedCardSearch = cardSearch?.trim().toLowerCase() ?? '';
  const isDueMode = mode === 'due';

  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [totalDeckCards, setTotalDeckCards] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [canUndoReview, setCanUndoReview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');
  const [sessionStartedWithCards, setSessionStartedWithCards] = useState(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);
  const [sessionGradeCounts, setSessionGradeCounts] = useState<ReviewGradeCounts>(createEmptyGradeCounts);
  const [sessionReviewHistory, setSessionReviewHistory] = useState<SessionReviewAction[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

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
  const sessionCompletedRef = useRef(false);
  const sessionStartedAtRef = useRef<string | undefined>(undefined);

  const resetSessionTracking = useCallback((startedWithCards: boolean) => {
    sessionCompletedRef.current = false;
    sessionStartedAtRef.current = startedWithCards ? new Date().toISOString() : undefined;
    setSessionStartedWithCards(startedWithCards);
    setSessionReviewedCount(0);
    setSessionGradeCounts(createEmptyGradeCounts());
    setSessionReviewHistory([]);
    setSessionCompleted(false);
  }, []);

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
    setIsEditing(false);
    setEditFront(currentCard?.front ?? '');
    setEditBack(currentCard?.back ?? '');
    translateX.setValue(0);
  }, [currentCard?.id, currentCard?.front, currentCard?.back, translateX]);

  /**
   * Due mode is used from the default spaced repetition screen.
   * Browse mode uses the full deck so the user can freely inspect cards.
   */
  const loadCardsForCurrentMode = useCallback(() => {
    if (!deckId) {
      return [];
    }

    const deckCards = getFlashcardsByDeck(deckId);

    if (isDueMode) {
      return getReviewQueue(deckCards, { reviewLogs: getReviewLogs() });
    }

    if (normalizedCardSearch) {
      return deckCards.filter(
        (card) =>
          card.front.toLowerCase().includes(normalizedCardSearch) ||
          card.back.toLowerCase().includes(normalizedCardSearch)
      );
    }

    return deckCards;
  }, [deckId, isDueMode, normalizedCardSearch]);

  /**
   * Refresh local state whenever this screen becomes active.
   * This allows Home/Review changes to show up without restarting the app.
   */
  useFocusEffect(
    useCallback(() => {
      const nextDecks = getDecks();
      const nextCards = loadCardsForCurrentMode();
      const totalCardsInDeck = deckId ? getFlashcardsByDeck(deckId).length : nextCards.length;

      const requestedCardIndex = initialCardId
        ? nextCards.findIndex((card) => card.id === initialCardId)
        : -1;
      const requestedFallbackIndex = Number.isInteger(requestedInitialCardIndex)
        ? Math.min(Math.max(requestedInitialCardIndex, 0), Math.max(nextCards.length - 1, 0))
        : -1;
      const nextInitialIndex = requestedCardIndex >= 0 ? requestedCardIndex : requestedFallbackIndex >= 0 ? requestedFallbackIndex : 0;

      setDecks(nextDecks);
      setCards(nextCards);
      setTotalDeckCards(totalCardsInDeck);
      setCurrentIndex(nextInitialIndex);
      setFlipped(false);
       setCanUndoReview(false);
       setIsEditing(false);
       translateX.setValue(0);

      if (!isDueMode || !sessionCompletedRef.current) {
        resetSessionTracking(isDueMode && nextCards.length > 0);
      }
      }, [deckId, initialCardId, isDueMode, loadCardsForCurrentMode, requestedInitialCardIndex, resetSessionTracking, translateX])
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
      const cardCount = cardsLengthRef.current;

      /**
       * A filtered browse result can contain a single matching card. In that case
       * there is no next card to swap in after the offscreen animation, so keep
       * the same card visible and spring it back instead of letting the native
       * animation appear to strand the card offscreen.
       */
      if (cardCount <= 1) {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        return;
      }

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

  function handleStartEditing() {
    if (!currentCard) {
      return;
    }

    setEditFront(currentCard.front);
    setEditBack(currentCard.back);
    setIsEditing(true);
  }

  function handleCancelEditing() {
    setEditFront(currentCard?.front ?? '');
    setEditBack(currentCard?.back ?? '');
    setIsEditing(false);
  }

  function handleSaveEditing() {
    if (!currentCard) {
      return;
    }

    const nextFront = editFront.trim();
    const nextBack = editBack.trim();

    if (!nextFront || !nextBack) {
      return;
    }

    updateFlashcard(currentCard.id, {
      deckId: currentCard.deckId,
      front: nextFront,
      back: nextBack,
    });

    const nextCards = loadCardsForCurrentMode();
    const nextIndex = nextCards.findIndex((card) => card.id === currentCard.id);

    setCards(nextCards);
    setCurrentIndex(nextIndex >= 0 ? nextIndex : 0);
    setIsEditing(false);
  }

  /**
   * Difficulty buttons are the only actions that update review scheduling.
   * Swiping intentionally does not mutate card data. It only browses the deck.
   */
  function handleGrade(grade: ReviewGrade) {
    if (!deckId || !currentCard) {
      return;
    }

    reviewFlashcard(currentCard.id, grade);
    setCanUndoReview(true);
    const nextReviewedCount = sessionReviewedCount + 1;
    setSessionReviewedCount(nextReviewedCount);
    setSessionGradeCounts((counts) => ({ ...counts, [grade]: counts[grade] + 1 }));
    setSessionReviewHistory((history) => [...history, { cardId: currentCard.id, grade }]);

    /**
     * Reload from storage so the UI reflects the updated review state.
     * This also keeps this screen consistent with the Review preview page.
     */
    const nextCards = loadCardsForCurrentMode();
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

      /**
       * The reviewed card usually leaves the due queue. Keeping the same index
       * naturally shows the next card that slid into this position.
       */
      return Math.min(index, nextCards.length - 1);
    });

    if (
      shouldShowSessionRecap({
        isDueMode,
        sessionStartedWithCards,
        sessionReviewedCount: nextReviewedCount,
        currentQueueLength: nextCards.length,
      })
    ) {
      sessionCompletedRef.current = true;
      setSessionCompleted(true);
    }
  }

  function handleUndoReview() {
    if (!deckId || !canUndoReview) {
      return;
    }

    const restoredCard = undoLastReview();

    if (!restoredCard) {
      setCanUndoReview(false);
      return;
    }

    const nextCards = loadCardsForCurrentMode();
    const restoredIndex = nextCards.findIndex((card) => card.id === restoredCard.id);

    setCards(nextCards);
    setCurrentIndex(restoredIndex >= 0 ? restoredIndex : 0);
    setFlipped(false);
    setCanUndoReview(false);
    sessionCompletedRef.current = false;
    setSessionCompleted(false);
    setSessionStartedWithCards(true);
    setSessionReviewHistory((history) => history.slice(0, -1));
    setSessionReviewedCount((count) => Math.max(0, count - 1));
    if (sessionReviewHistory.length > 0) {
      const undoneAction = sessionReviewHistory[sessionReviewHistory.length - 1];
      setSessionGradeCounts((counts) => ({
        ...counts,
        [undoneAction.grade]: Math.max(0, counts[undoneAction.grade] - 1),
      }));
    }
    translateX.setValue(0);
  }

  function restartSession() {
    if (!deckId || !isDueMode) {
      return;
    }

    const nextCards = loadCardsForCurrentMode();

    if (nextCards.length === 0) {
      return;
    }

    resetSessionTracking(true);
    setCards(nextCards);
    setTotalDeckCards(getFlashcardsByDeck(deckId).length);
    setCurrentIndex(0);
    setFlipped(false);
    setCanUndoReview(false);
    setIsEditing(false);
    setEditFront(nextCards[0]?.front ?? '');
    setEditBack(nextCards[0]?.back ?? '');
    translateX.setValue(0);
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

  if (isDueMode && sessionCompleted && deckId) {
    return (
      <SessionRecap
        deckId={deckId}
        deckName={deckName}
        reviewedCount={sessionReviewedCount}
        uniqueReviewedCount={new Set(sessionReviewHistory.map((action) => action.cardId)).size}
        gradeCounts={sessionGradeCounts}
        canUndo={canUndoReview}
        onUndo={handleUndoReview}
        onRestart={restartSession}
        onBackToReview={() => router.push('/review')}
      />
    );
  }

  return (
    <DeckReviewSession
      deckName={deckName}
      currentIndex={currentIndex}
      cardsLength={cards.length}
      totalDeckCards={totalDeckCards}
      currentCard={currentCard}
      flipped={flipped}
      translateX={translateX}
      panHandlers={panResponder.panHandlers}
      showGradeButtons={isDueMode}
      showUndoButton={isDueMode && canUndoReview}
      isEditing={isEditing}
      editFront={editFront}
      editBack={editBack}
      cardSearch={browseSearchLabel ?? cardSearch}
      onChangeEditFront={setEditFront}
      onChangeEditBack={setEditBack}
      onStartEdit={handleStartEditing}
      onCancelEdit={handleCancelEditing}
      onSaveEdit={handleSaveEditing}
      onPreviousCard={goToPreviousCard}
      onNextCard={goToNextCard}
      onToggleFlip={() => setFlipped((value) => !value)}
      onBack={() =>
        router.push(
          isDueMode
            ? '/review'
            : browseSearchLabel || cardSearch
              ? { pathname: '/review/browse', params: { q: browseSearchLabel ?? cardSearch } }
              : '/review/browse'
        )
      }
      onUndo={handleUndoReview}
      onGrade={handleGrade}
    />
  );
}

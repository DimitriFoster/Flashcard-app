import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { AppState } from 'react-native';

import { ReviewDuePage } from '@/components/review/review-due-page';
import { getReviewDeckSummary, getReviewStartAction, type ReviewDeckSummary } from '@/lib/review-deck-summary';
import { getDecks, getFlashcards, getReviewLogs } from '@/storage/flashcards';

function loadCurrentSummary() {
  return getReviewDeckSummary(getDecks(), getFlashcards(), {
    reviewLogs: getReviewLogs(),
    now: new Date(),
  });
}

export default function ReviewIndexScreen() {
  const router = useRouter();
  const [summary, setSummary] = useState<ReviewDeckSummary>({ decks: [], totalDue: 0 });
  const [choosingDeck, setChoosingDeck] = useState(false);

  useFocusEffect(useCallback(() => {
    const refresh = () => setSummary(loadCurrentSummary());
    refresh();
    const timer = setInterval(refresh, 30_000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []));

  function openDueDeck(deckId: string) {
    setChoosingDeck(false);
    router.push({ pathname: '/review/[deckId]', params: { deckId, mode: 'due' } });
  }

  function startReview() {
    const currentSummary = loadCurrentSummary();
    setSummary(currentSummary);
    const action = getReviewStartAction(currentSummary);
    if (action.kind === 'deck') openDueDeck(action.deckId);
    else setChoosingDeck(action.kind === 'choose');
  }

  return (
    <ReviewDuePage
      summary={summary}
      choosingDeck={choosingDeck}
      onStart={startReview}
      onOpenDeck={openDueDeck}
      onHome={() => router.replace('/')}
      onBrowse={() => router.push('/review/browse')}
      onStats={() => router.push('/review/stats')}
    />
  );
}

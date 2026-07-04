import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeCreateSection } from '@/components/home/create-section';
import { HomeNotesSection } from '@/components/home/notes-section';
import { HomeReviewSection } from '@/components/home/review-section';
import { COLORS, SHADOWS, SPACING } from '@/constants/design';
import {
  addDeck,
  addFlashcard,
  deleteDeck,
  deleteFlashcard,
  exportAppBackupText,
  getDecks,
  getFlashcards,
  importAppBackupText,
  importParsedCards,
} from '@/storage/flashcards';
import type { Deck, Flashcard, NewFlashcard } from '@/types/flashcard';
import type { ImportCardsOptions } from '@/storage/flashcards';
import type { ParsedImportCard } from '@/lib/import-parser';

const heroCardsImage = require('../../assets/folio-ui/home-page/home_hero_cards.png');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState('');

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId),
    [decks, selectedDeckId]
  );

  useEffect(() => {
    const nextDecks = getDecks();

    setDecks(nextDecks);
    setCards(getFlashcards());
    setSelectedDeckId((previousDeckId) =>
      nextDecks.some((deck) => deck.id === previousDeckId) ? previousDeckId : ''
    );
  }, []);

  function createDeck(name: string) {
    const deck = addDeck({ name });
    setDecks((previousDecks) => [deck, ...previousDecks]);
    return deck;
  }

  function createCard(input: NewFlashcard) {
    const card = addFlashcard(input);
    setCards((previousCards) => [card, ...previousCards]);
    return card;
  }

  function removeDeck(deckId: string) {
    const result = deleteDeck(deckId);
    if (!result) {
      return undefined;
    }
    setDecks(result.decks);
    setCards(result.flashcards);
    setSelectedDeckId(result.decks[0]?.id ?? '');
    return result;
  }

  function removeCard(cardId: string) {
    const card = cards.find((candidate) => candidate.id === cardId);
    if (!card || !deleteFlashcard(cardId)) {
      return undefined;
    }
    setCards((previousCards) => previousCards.filter((candidate) => candidate.id !== cardId));
    return card;
  }

  function importCards(cardsToImport: ParsedImportCard[], options: ImportCardsOptions) {
    const result = importParsedCards(cardsToImport, options);
    setDecks(result.decks);
    setCards(result.flashcards);
    if (result.createdDeck) {
      setSelectedDeckId(result.createdDeck.id);
    }
    return result;
  }

  function importBackup(rawText: string) {
    const result = importAppBackupText(rawText);
    if (!result) {
      return undefined;
    }
    setDecks(result.decks);
    setCards(result.flashcards);
    setSelectedDeckId(result.decks[0]?.id ?? '');
    return result;
  }

  return (
    <ScrollView
      style={styles.screen}
      directionalLockEnabled
      decelerationRate="fast"
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 14,
          paddingBottom: insets.bottom + 42,
        },
      ]}>
      <Text style={styles.topLabel}>FLASHCARD WORKSPACE</Text>

      <View style={styles.heroRow}>
        <View style={styles.heroTextBlock}>
          <Text style={styles.title}>Create decks fast,{"\n"}then review with{"\n"}intent.</Text>
          <Text style={styles.subtitle}>
            Capture cards into{"\n"}focused decks, then jump{"\n"}to Review when ready.
          </Text>
        </View>

        <View style={styles.heroArtFrame}>
          <Image source={heroCardsImage} style={styles.heroArt} resizeMode="contain" />
        </View>
      </View>

      <HomeCreateSection
        decks={decks}
        cards={cards}
        selectedDeck={selectedDeck}
        onSelectDeckId={setSelectedDeckId}
        onCreateDeck={createDeck}
        onCreateCard={createCard}
        onDeleteDeck={removeDeck}
        onDeleteCard={removeCard}
        onImportCards={importCards}
        onExportBackup={exportAppBackupText}
        onImportBackup={importBackup}
      />

      <HomeReviewSection onPressReview={() => router.push('/review')} />

      <HomeNotesSection onPressNotes={() => router.push('/notes')} />
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
    gap: 12,
  },
  topLabel: {
    color: COLORS.reviewDeep,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroTextBlock: {
    flex: 1,
    paddingTop: 0,
  },
  title: {
    color: COLORS.ink,
    fontSize: 27,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 10,
    color: '#4F4740',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
  },
  heroArtFrame: {
    width: 142,
    height: 142,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  heroArt: {
    width: 136,
    height: 136,
    ...SHADOWS.soft,
  },
});

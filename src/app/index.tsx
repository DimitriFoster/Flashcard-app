import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  const { width } = useWindowDimensions();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState('');

  const isTabletLayout = width >= 600;
  const tabletPageWidth = Math.min(width - 96, 560);

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
      <View style={[styles.pageContent, isTabletLayout ? { width: tabletPageWidth } : null]}>
        <Text style={[styles.topLabel, isTabletLayout && styles.topLabelTablet]}>FLASHCARD WORKSPACE</Text>

        <View style={[styles.heroRow, isTabletLayout && styles.heroRowTablet]}>
          <View style={[styles.heroTextBlock, isTabletLayout && styles.heroTextBlockTablet]}>
            <Text style={[styles.title, isTabletLayout && styles.titleTablet]}>Create decks fast,{"\n"}then review with{"\n"}intent.</Text>
            <Text style={[styles.subtitle, isTabletLayout && styles.subtitleTablet]}>
              Capture cards into{"\n"}focused decks, then jump{"\n"}to Review when ready.
            </Text>
          </View>

          <View style={[styles.heroArtFrame, isTabletLayout && styles.heroArtFrameTablet]}>
            <Image source={heroCardsImage} style={[styles.heroArt, isTabletLayout && styles.heroArtTablet]} resizeMode="contain" />
          </View>
        </View>

        <HomeCreateSection
          decks={decks}
          cards={cards}
          selectedDeck={selectedDeck}
          tabletLayout={isTabletLayout}
          onSelectDeckId={setSelectedDeckId}
          onCreateDeck={createDeck}
          onCreateCard={createCard}
          onDeleteDeck={removeDeck}
          onDeleteCard={removeCard}
          onImportCards={importCards}
          onExportBackup={exportAppBackupText}
          onImportBackup={importBackup}
        />

        <HomeReviewSection onPressReview={() => router.push('/review')} tabletLayout={isTabletLayout} />

        <HomeNotesSection onPressNotes={() => router.push('/notes')} tabletLayout={isTabletLayout} />
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
  },
  pageContent: {
    gap: 12,
    width: '100%',
    alignSelf: 'center',
  },
  topLabel: {
    color: COLORS.reviewDeep,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  topLabelTablet: {
    textAlign: 'center',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroRowTablet: {
    justifyContent: 'center',
    gap: 22,
  },
  heroTextBlock: {
    flex: 1,
    paddingTop: 0,
  },
  heroTextBlockTablet: {
    flex: 0,
    alignItems: 'center',
  },
  title: {
    color: COLORS.ink,
    fontSize: 27,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  titleTablet: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: '#4F4740',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
  },
  subtitleTablet: {
    textAlign: 'center',
  },
  heroArtFrame: {
    width: 142,
    height: 142,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  heroArtFrameTablet: {
    width: 156,
    height: 156,
  },
  heroArt: {
    width: 136,
    height: 136,
    ...SHADOWS.soft,
  },
  heroArtTablet: {
    width: 150,
    height: 150,
  },
});

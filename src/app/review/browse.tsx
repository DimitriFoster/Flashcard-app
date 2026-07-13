/**
 * Folio Browse Decks deck-selection page.
 *
 * This page is only the deck picker. The open-deck browse-card experience
 * stays in /review/[deckId].tsx.
 */
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import { folioReviewAssets } from '@/folio-review/folioReviewAssets';
import { getDecks, getFlashcards, getReviewLogs } from '@/storage/flashcards';
import type { Deck, Flashcard, ReviewLog } from '@/types/flashcard';
import { getDueCards } from '../../lib/review-queue';

const browseDeckAssets = {
  heroPanel: require('../../../assets/folio-ui/browse-selection/panels/browse_hero_panel_transparent_round66.png'),
  reviewDueCardsButton: require('../../../assets/folio-ui/browse-selection/header/review_due_cards_button_round22_padded.png'),
  openDeckButton: require('../../../assets/folio-ui/browse-selection/cards/open_deck_button_mockup_round22.png'),
  createPanelSwatch: require('../../../assets/folio-ui/home-page/open-create/open_create_panel_swatch.png'),
  createCirclePencil: require('../../../assets/folio-ui/home-page/open-create/create_circle_pencil.png'),
  createArrowRight: require('../../../assets/folio-ui/home-page/open-create/create_arrow_right.png'),
  previewCollapsedPanels: [
    require('../../../assets/folio-ui/browse-selection/panels/preview_cards_collapsed_panel_blue_round22.png'),
    require('../../../assets/folio-ui/browse-selection/panels/preview_cards_collapsed_panel_green_round22.png'),
    require('../../../assets/folio-ui/browse-selection/panels/preview_cards_collapsed_panel_yellow_round22.png'),
    require('../../../assets/folio-ui/browse-selection/panels/preview_cards_collapsed_panel_peach_round22.png'),
    require('../../../assets/folio-ui/browse-selection/panels/preview_cards_collapsed_panel_purple_round22.png'),
    require('../../../assets/folio-ui/browse-selection/panels/preview_cards_collapsed_panel_mint_round22.png'),
  ],
  crayonTextures: [
    require('../../../assets/folio-ui/browse-selection/textures/transparent-round43/crayon_texture_blue_transparent_round43.png'),
    require('../../../assets/folio-ui/browse-selection/textures/transparent-round43/crayon_texture_green_transparent_round43.png'),
    require('../../../assets/folio-ui/browse-selection/textures/transparent-round43/crayon_texture_yellow_transparent_round43.png'),
    require('../../../assets/folio-ui/browse-selection/textures/transparent-round43/crayon_texture_peach_transparent_round43.png'),
    require('../../../assets/folio-ui/browse-selection/textures/transparent-round43/crayon_texture_purple_transparent_round43.png'),
    require('../../../assets/folio-ui/browse-selection/textures/transparent-round43/crayon_texture_mint_transparent_round43.png'),
  ],
  selectedDeckShells: [
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_selected_blue_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_selected_green_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_selected_yellow_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_selected_peach_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_selected_purple_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_selected_mint_swatch_shell_round32.png'),
  ],
  sideDeckShells: [
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_side_blue_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_side_green_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_side_yellow_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_side_peach_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_side_purple_swatch_shell_round32.png'),
    require('../../../assets/folio-ui/browse-selection/cards/swatch-shells-round32/deck_card_side_mint_swatch_shell_round32.png'),
  ],
  topicIcons: {
    ai: require('../../../assets/folio-ui/topic-icons/starter-transparent/ai_brain_cloud.png'),
    python: require('../../../assets/folio-ui/topic-icons/starter-transparent/python_snakes.png'),
    language: require('../../../assets/folio-ui/topic-icons/starter-transparent/spanish_hola.png'),
    writing: require('../../../assets/folio-ui/topic-icons/starter-transparent/writing_notebook_pencil.png'),
    music: require('../../../assets/folio-ui/topic-icons/starter-transparent/music_notes.png'),
    science: require('../../../assets/folio-ui/topic-icons/starter-transparent/science_flask.png'),
    geography: require('../../../assets/folio-ui/topic-icons/starter-transparent/geography_earth_pin.png'),
    math: require('../../../assets/folio-ui/topic-icons/starter-transparent/math_notepad.png'),
    general: require('../../../assets/folio-ui/topic-icons/starter-transparent/writing_notebook_pencil.png'),
  },
} as const;

const previewPanelFillColors = ['#EAF4FF', '#EEF7E4', '#FFF6CC', '#FBE6DE', '#EFE6FA', '#E6F5ED'] as const;

type DeckTopic = keyof typeof browseDeckAssets.topicIcons;

function inferDeckTopic(deckName: string, sampleText = ''): DeckTopic {
  const text = `${deckName} ${sampleText}`.toLowerCase();

  if (/\b(ai|llm|rag|embedding|embeddings|token|model|neural|machine learning|architecture)\b/.test(text)) return 'ai';
  if (/\b(python|django|flask|pandas|numpy|operator|operators|script|typescript|javascript|react|code|coding)\b/.test(text)) return 'python';
  if (/\b(spanish|language|phrases|vocab|vocabulary|grammar|hola|translate|translation)\b/.test(text)) return 'language';
  if (/\b(write|writing|notes|essay|journal|composition|pen|notebook)\b/.test(text)) return 'writing';
  if (/\b(music|song|chord|scale|guitar|piano|melody|rhythm)\b/.test(text)) return 'music';
  if (/\b(science|chemistry|biology|lab|flask|experiment|physics)\b/.test(text)) return 'science';
  if (/\b(geography|map|country|earth|location|travel|world)\b/.test(text)) return 'geography';
  if (/\b(math|algebra|calculus|geometry|equation|statistics|stats)\b/.test(text)) return 'math';

  return 'general';
}

function getDeckTopicIcon(deck: Deck, sampleCards: Flashcard[]): ImageSourcePropType {
  const sampleText = sampleCards.slice(0, 4).map((card) => `${card.front} ${card.back}`).join(' ');
  return browseDeckAssets.topicIcons[inferDeckTopic(deck.name, sampleText)];
}

type DeckPreview = {
  deck: Deck;
  allCards: Flashcard[];
  cards: Flashcard[];
  dueCount: number;
  cardSearchQuery?: string;
};

function normalizeParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getCardsForDeck(deckId: string, cards: Flashcard[]) {
  return cards.filter((card) => card.deckId === deckId);
}

function truncate(text: string, maxLength: number) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

function scoreDeck(deck: Deck) {
  const name = deck.name.toLowerCase();
  if (name.includes('spanish')) return 0;
  if (name.includes('ai systems')) return 1;
  if (name.includes('python')) return 2;
  return 10;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export default function BrowseDecksScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    q?: string | string[];
    deckId?: string | string[];
  }>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const carouselRef = useRef<ScrollView | null>(null);
  const initializedSelectionRef = useRef(false);

  const routeSearchQuery = normalizeParam(params.q);
  const routeDeckId = normalizeParam(params.deckId);

  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [reviewLogs, setReviewLogs] = useState<ReviewLog[]>([]);
  const [searchQuery, setSearchQuery] = useState(routeSearchQuery ?? '');
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setDecks(getDecks());
      setCards(getFlashcards());
      setReviewLogs(getReviewLogs());
    }, [])
  );

  useEffect(() => {
    if (routeSearchQuery !== undefined) {
      setSearchQuery(routeSearchQuery);
    }
  }, [routeSearchQuery]);

  const trimmedSearchQuery = searchQuery.trim();
  const normalizedSearchQuery = trimmedSearchQuery.toLowerCase();

  const deckPreviews = useMemo<DeckPreview[]>(() => {
    const next = decks
      .map((deck) => {
        const allCards = getCardsForDeck(deck.id, cards);
        const matchingCards = normalizedSearchQuery
          ? allCards.filter((card) =>
              `${card.front} ${card.back}`.toLowerCase().includes(normalizedSearchQuery)
            )
          : allCards;
        const deckMatches = normalizedSearchQuery
          ? deck.name.toLowerCase().includes(normalizedSearchQuery)
          : true;
        const cardSearchQuery =
          normalizedSearchQuery && matchingCards.length > 0 ? trimmedSearchQuery : undefined;
        const visibleCards = cardSearchQuery ? matchingCards : deckMatches ? allCards : matchingCards;

        return {
          deck,
          allCards,
          cards: visibleCards,
          dueCount: getDueCards(allCards, { reviewLogs }).length,
          cardSearchQuery,
        };
      })
      .filter((preview) =>
        !normalizedSearchQuery ||
        preview.cards.length > 0 ||
        preview.deck.name.toLowerCase().includes(normalizedSearchQuery)
      );

    return next.sort((a, b) => scoreDeck(a.deck) - scoreDeck(b.deck));
  }, [cards, decks, normalizedSearchQuery, reviewLogs, trimmedSearchQuery]);

  const preferredIndex = useMemo(() => {
    const routedDeckIndex = deckPreviews.findIndex((preview) => preview.deck.id === routeDeckId);
    if (routedDeckIndex >= 0) return routedDeckIndex;

    const aiIndex = deckPreviews.findIndex((preview) =>
      preview.deck.name.toLowerCase().includes('ai systems')
    );
    if (aiIndex >= 0) return aiIndex;
    return Math.min(1, Math.max(0, deckPreviews.length - 1));
  }, [deckPreviews, routeDeckId]);

  useEffect(() => {
    if (!routeDeckId) return;

    const routedDeckIndex = deckPreviews.findIndex((preview) => preview.deck.id === routeDeckId);
    if (routedDeckIndex < 0) return;

    initializedSelectionRef.current = true;
    setSelectedIndex(routedDeckIndex);
    setPreviewExpanded(false);
  }, [deckPreviews, routeDeckId]);

  useEffect(() => {
    if (deckPreviews.length === 0) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex((current) => {
      if (!initializedSelectionRef.current) {
        initializedSelectionRef.current = true;
        return preferredIndex;
      }
      return clamp(current, 0, deckPreviews.length - 1);
    });
  }, [deckPreviews.length, preferredIndex]);

  useEffect(() => {
    if (normalizedSearchQuery) {
      setSelectedIndex(0);
    }
  }, [normalizedSearchQuery]);

  const selectedPreview = deckPreviews[selectedIndex] ?? deckPreviews[0];
  const selectedCards = selectedPreview?.cards ?? [];
  const selectedPreviewFill =
    previewPanelFillColors[selectedIndex % previewPanelFillColors.length] ?? previewPanelFillColors[0];
  const selectedCrayonTexture =
    browseDeckAssets.crayonTextures[selectedIndex % browseDeckAssets.crayonTextures.length] ??
    browseDeckAssets.crayonTextures[0];

  const contentWidth = Math.min(width - 32, 430);
  const safeHeight = Math.max(0, height - insets.top - insets.bottom);
  const isNarrowScreen = width < 370;
  const isShortScreen = safeHeight < 720;
  const isVeryShortScreen = safeHeight < 660;
  const compactScale = clamp(Math.min(width / 393, safeHeight / 830), 0.74, 1);
  const headerScale = isNarrowScreen ? 0.82 : isShortScreen ? 0.9 : 1;
  const headerHeight = Math.round(72 * headerScale);
  const reviewDueScale = contentWidth < 400 ? 0.72 : contentWidth < 430 ? 0.86 : 1;
  const reviewDueButtonWidth = Math.round(146 * reviewDueScale);
  const reviewDueButtonHeight = Math.round(62 * reviewDueScale);
  const reviewDueButtonRight = contentWidth < 400 ? 0 : contentWidth < 430 ? -12 : -26;
  const heroHeight = Math.round(contentWidth * 0.38 * compactScale);
  const searchBarHeight = Math.round(clamp(heroHeight * 0.2, isNarrowScreen ? 21 : 24, 31));
  const searchBarWidth = Math.round(contentWidth * (isNarrowScreen ? 0.44 : isShortScreen ? 0.52 : 0.58));
  const searchPlaceholder = isNarrowScreen ? 'Search...' : 'Search decks or cards...';
  const searchFontSize = Math.round(clamp(searchBarHeight * 0.46, 10, 13));
  const searchIconSize = Math.round(clamp(searchBarHeight * 0.58, 12, 17));
  const carouselScale = 1.5625 * (isNarrowScreen ? 0.94 : 1);
  const carouselItemWidth = Math.round(contentWidth * 0.34 * carouselScale);
  const baseSelectedDeckWidth = Math.round(carouselItemWidth * 1.16);
  const baseSelectedDeckHeight = Math.round(baseSelectedDeckWidth * 1.25 * compactScale);
  const baseSideDeckWidth = Math.round(carouselItemWidth * 0.84);
  const baseSideDeckHeight = Math.round(baseSideDeckWidth * 1.48 * compactScale);
  const previewWindowHeight = previewExpanded
    ? Math.round(clamp(safeHeight * (isShortScreen ? 0.18 : 0.22), isVeryShortScreen ? 108 : 128, isShortScreen ? 150 : 210))
    : Math.round(Math.min(210, Math.max(168, safeHeight * 0.22)));
  const createCardsButtonHeight = Math.round(clamp(72 * compactScale, 58, 72) * 0.8);
  const createCardsButtonWidth = Math.round(contentWidth * 0.8);
  const fixedVerticalSpace =
    30 +
    headerHeight +
    8 +
    heroHeight +
    8 +
    25 +
    62 +
    10 +
    (previewExpanded ? previewWindowHeight + 8 : createCardsButtonHeight + 8) +
    Math.max(8, insets.bottom + 4);
  const availableCarouselHeight = Math.max(118, safeHeight - fixedVerticalSpace);
  const deckFitScale = clamp(
    (availableCarouselHeight - 14) / Math.max(1, baseSelectedDeckHeight),
    isVeryShortScreen ? 0.66 : 0.72,
    1,
  );
  const selectedDeckWidth = Math.round(baseSelectedDeckWidth * deckFitScale);
  const selectedDeckHeight = Math.round(baseSelectedDeckHeight * deckFitScale);
  const sideDeckWidth = Math.round(baseSideDeckWidth * deckFitScale);
  const sideDeckHeight = Math.round(baseSideDeckHeight * deckFitScale);
  const deckContentScale = clamp(selectedDeckHeight / 220, 0.64, 1);
  const deckCarouselItemHeight = selectedDeckHeight + Math.round(14 * deckContentScale);
  const previewRowHeight = Math.max(isShortScreen ? 48 : 58, Math.round(64 * compactScale * (previewExpanded && isShortScreen ? 0.88 : 1)));

  useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current?.scrollTo({ x: selectedIndex * carouselItemWidth, animated: true });
    }, 40);
    return () => clearTimeout(timer);
  }, [carouselItemWidth, selectedIndex]);

  function openDeck(preview?: DeckPreview, initialCardId?: string, initialCardIndex?: number) {
    if (!preview || preview.cards.length === 0) return;
    router.push({
      pathname: '/review/[deckId]',
      params: {
        deckId: preview.deck.id,
        ...(initialCardId ? { initialCardId } : {}),
        ...(typeof initialCardIndex === 'number' ? { initialCardIndex: String(initialCardIndex) } : {}),
        ...(preview.cardSearchQuery ? { cardSearch: preview.cardSearchQuery } : {}),
        ...(trimmedSearchQuery ? { browseSearchLabel: trimmedSearchQuery } : {}),
      },
    });
  }

  function selectDeck(index: number) {
    setSelectedIndex(clamp(index, 0, deckPreviews.length - 1));
  }

  function createCardsForSelectedDeck() {
    if (!selectedPreview) return;

    router.push({
      pathname: '/',
      params: {
        createDeckId: selectedPreview.deck.id,
        openCreateCard: '1',
        createRequestId: String(Date.now()),
      },
    });
  }

  return (
    <ImageBackground
      accessibilityLabel="Browse decks screen"
      testID="browse-decks-screen"
      source={folioReviewAssets.background.pagePaper}
      resizeMode="cover"
      style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.page,
            {
              paddingTop: 0,
              paddingBottom: Math.max(8, insets.bottom + 4),
            },
          ]}
        >
          <View style={[styles.headerRow, { height: headerHeight, width: contentWidth }]}> 
            <View pointerEvents="none" style={styles.wordmarkCenter}>
              <Image source={folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.folioWordmark} />
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Back to Review Due Cards" testID="browse-decks-back" onPress={() => router.push('/review')} style={styles.backPressable}>
              <Image source={folioReviewAssets.header.back} resizeMode="contain" style={styles.backButton} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Review due cards" testID="browse-decks-review-due" onPress={() => router.push('/review')} style={[
                styles.reviewDuePressable,
                { height: Math.max(48, reviewDueButtonHeight + 2), right: reviewDueButtonRight, width: reviewDueButtonWidth },
              ]}>
              <Image
                source={browseDeckAssets.reviewDueCardsButton}
                resizeMode="contain"
                style={[styles.reviewDueImage, { height: reviewDueButtonHeight, width: reviewDueButtonWidth }]}
              />
            </Pressable>
          </View>

          <ImageBackground
            source={browseDeckAssets.heroPanel}
            resizeMode="stretch"
            style={[styles.heroPanel, { height: heroHeight, width: contentWidth }]}
          >
            <View
              style={[
                styles.searchBar,
                {
                  borderRadius: Math.round(searchBarHeight / 2),
                  bottom: Math.round(heroHeight * 0.1),
                  height: searchBarHeight,
                  paddingHorizontal: Math.round(searchBarHeight * 0.34),
                  right: Math.round(contentWidth * 0.055),
                  width: searchBarWidth,
                },
              ]}>
              <Text allowFontScaling={false} style={[styles.searchIcon, { fontSize: searchIconSize, lineHeight: searchIconSize + 1, marginRight: Math.round(searchBarHeight * 0.18) }]}>⌕</Text>
              <TextInput
                accessibilityLabel="Search decks or cards"
                testID="browse-decks-search-input"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setSearchQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor="#7B756E"
                style={[styles.searchInput, { fontSize: searchFontSize, lineHeight: searchBarHeight }]}
                value={searchQuery}
              />
            </View>
          </ImageBackground>

          {selectedPreview ? (
            <>
              <ScrollView
                ref={carouselRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={carouselItemWidth}
                disableIntervalMomentum
                contentContainerStyle={[
                  styles.carouselContent,
                  { paddingHorizontal: Math.max(0, (contentWidth - carouselItemWidth) / 2) },
                ]}
                onMomentumScrollEnd={(event) => {
                  const nextIndex = Math.round(event.nativeEvent.contentOffset.x / carouselItemWidth);
                  selectDeck(nextIndex);
                }}
                style={[styles.carouselWindow, { height: deckCarouselItemHeight, width: contentWidth }]}
              >
                {deckPreviews.map((preview, index) => {
                  const active = index === selectedIndex;
                  const shell = active
                    ? browseDeckAssets.selectedDeckShells[index % browseDeckAssets.selectedDeckShells.length]
                    : browseDeckAssets.sideDeckShells[index % browseDeckAssets.sideDeckShells.length];
                  const cardWidth = active ? selectedDeckWidth : sideDeckWidth;
                  const cardHeight = active ? selectedDeckHeight : sideDeckHeight;
                  const cardCount = preview.allCards.length;
                  const cardLabel = cardCount === 1 ? 'card' : 'cards';

                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={active ? `Open ${preview.deck.name}` : `Select ${preview.deck.name}`}
                      testID={active ? `browse-deck-open-${preview.deck.id}` : `browse-deck-select-${preview.deck.id}`}
                      key={preview.deck.id}
                      onPress={() => {
                        if (active) {
                          openDeck(preview);
                          return;
                        }
                        selectDeck(index);
                      }}
                      style={({ pressed }) => [
                        styles.deckCarouselItem,
                        { height: deckCarouselItemHeight, width: carouselItemWidth },
                        pressed && styles.pressed,
                      ]}
                    >
                      <ImageBackground
                        source={shell}
                        resizeMode="stretch"
                        style={[
                          styles.deckCard,
                          {
                            height: cardHeight,
                            marginTop: active ? 0 : Math.round((selectedDeckHeight - sideDeckHeight) * 0.45),
                            paddingHorizontal: Math.round(14 * deckContentScale),
                            paddingTop: Math.round(17 * deckContentScale),
                            width: cardWidth,
                          },
                        ]}
                      >
                        <Text
                          allowFontScaling={false}
                          numberOfLines={active ? 3 : 3}
                          style={[
                            styles.deckTitle,
                            active ? styles.selectedDeckTitle : styles.sideDeckTitle,
                            active
                              ? {
                                  fontSize: 18 * deckContentScale,
                                  lineHeight: 23 * deckContentScale,
                                  minHeight: 64 * deckContentScale,
                                }
                              : {
                                  fontSize: 14 * deckContentScale,
                                  lineHeight: 18 * deckContentScale,
                                  minHeight: 50 * deckContentScale,
                                },
                          ]}>
                          {preview.deck.name}
                        </Text>
                        <Image
                          source={getDeckTopicIcon(preview.deck, preview.allCards)}
                          resizeMode="contain"
                          style={[
                            active ? styles.selectedTopicIcon : styles.sideTopicIcon,
                            active
                              ? { height: 72 * deckContentScale, marginBottom: 4 * deckContentScale, marginTop: 6 * deckContentScale, width: 82 * deckContentScale }
                              : { height: 50 * deckContentScale, marginBottom: 4 * deckContentScale, marginTop: 4 * deckContentScale, width: 58 * deckContentScale },
                          ]}
                        />
                        <View style={[styles.deckCountBlock, active ? styles.selectedDeckCountBlock : null, { paddingBottom: (active ? 24 : 22) * deckContentScale }]}>
                          <Text allowFontScaling={false} numberOfLines={1} style={[styles.deckDueText, { fontSize: 11 * deckContentScale, lineHeight: 15 * deckContentScale }]}>{preview.dueCount} due now</Text>
                          <Text allowFontScaling={false} numberOfLines={1} style={[styles.deckTotalText, { fontSize: 10.5 * deckContentScale, lineHeight: 14 * deckContentScale }]}>{cardCount} total {cardLabel}</Text>
                        </View>

                      </ImageBackground>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.dotsRow}>
                {deckPreviews.slice(0, Math.min(deckPreviews.length, 5)).map((preview, index) => (
                  <View key={preview.deck.id} style={[styles.dot, index === selectedIndex ? styles.activeDot : null]} />
                ))}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={previewExpanded ? 'Hide card previews' : 'Show card previews'}
                testID="browse-decks-toggle-card-previews"
                onPress={() => setPreviewExpanded((value) => !value)}
                style={({ pressed }) => [styles.previewHeader, { width: contentWidth, backgroundColor: selectedPreviewFill }, pressed && styles.pressed]}
              >
                <Image pointerEvents="none" source={selectedCrayonTexture} resizeMode="stretch" style={styles.previewSwatchFill} />
                <View style={styles.previewHeaderPanel}>
                  <View style={styles.previewHeaderLeft}>
                    <Image source={folioReviewAssets.bottomNav.reviewIconInactive} resizeMode="contain" style={styles.previewCardsIcon} />
                    <Text allowFontScaling={false} numberOfLines={1} style={styles.previewHeaderText}>
                      Preview cards from{' '}
                      <Text style={styles.previewDeckName}>{selectedPreview.deck.name}</Text>
                    </Text>
                  </View>
                  <Text allowFontScaling={false} style={styles.previewToggleGlyph}>{previewExpanded ? '⌃' : '⌄'}</Text>
                </View>
              </Pressable>

              {!previewExpanded ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Create cards for ${selectedPreview.deck.name}`}
                  testID="browse-decks-create-cards-selected-deck"
                  onPress={createCardsForSelectedDeck}
                  style={({ pressed }) => [
                    styles.createCardsButton,
                    { height: createCardsButtonHeight, width: createCardsButtonWidth },
                    pressed && styles.pressed,
                  ]}
                >
                  <HomePanelFill source={browseDeckAssets.createPanelSwatch} opacity={1} />
                  <View style={styles.createCardsButtonContent}>
                    <Image
                      source={browseDeckAssets.createCirclePencil}
                      resizeMode="contain"
                      style={styles.createCardsButtonIcon}
                    />
                    <View style={styles.createCardsButtonTextBlock}>
                      <Text allowFontScaling={false} numberOfLines={1} style={styles.createCardsButtonTitle}>
                        Create cards for this deck
                      </Text>
                      <Text allowFontScaling={false} numberOfLines={1} style={styles.createCardsButtonDeckName}>
                        {selectedPreview.deck.name}
                      </Text>
                    </View>
                    <Image
                      source={browseDeckAssets.createArrowRight}
                      resizeMode="contain"
                      style={styles.createCardsButtonArrow}
                    />
                  </View>
                </Pressable>
              ) : null}

              {previewExpanded ? (
                <ImageBackground
                  source={selectedCrayonTexture}
                  resizeMode="stretch"
                  style={[styles.previewWindow, { height: previewWindowHeight, width: contentWidth }]}
                  imageStyle={styles.previewWindowTextureImage}
                >
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={styles.previewScroll} contentContainerStyle={styles.previewList}>
                    {selectedCards.length > 0 ? (
                      selectedCards.slice(0, 30).map((card, previewCardIndex) => (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Open card preview ${truncate(card.front, 36)}`}
                          testID={`browse-card-preview-${card.id}`}
                          key={card.id}
                          onPress={() => openDeck(selectedPreview, card.id, previewCardIndex)}
                          style={({ pressed }) => [styles.previewRow, { minHeight: previewRowHeight }, pressed && styles.pressed]}
                        >
                          <Image source={folioReviewAssets.card.favoriteStar} resizeMode="contain" style={styles.previewStar} />
                          <View style={styles.previewQuestionColumn}>
                            <Text allowFontScaling={false} numberOfLines={2} style={styles.previewQuestionText}>
                              {truncate(card.front, 64)}
                            </Text>
                          </View>
                          <View style={styles.previewDivider} />
                          <View style={styles.previewAnswerColumn}>
                            <Text allowFontScaling={false} numberOfLines={3} style={styles.previewAnswerText}>
                              {truncate(card.back, 86)}
                            </Text>
                          </View>
                          <Text allowFontScaling={false} style={styles.chevron}>›</Text>
                        </Pressable>
                      ))
                    ) : (
                      <View style={styles.emptyPreviewRow}>
                        <Text style={styles.emptyPreviewText}>No cards in this deck yet.</Text>
                      </View>
                    )}
                  </ScrollView>
                </ImageBackground>
              ) : null}
            </>
          ) : (
            <View style={[styles.emptyState, { width: contentWidth }]}> 
              <Text style={styles.emptyTitle}>No decks yet</Text>
              <Text style={styles.emptyText}>Create a deck first, then it will appear here.</Text>
            </View>
          )}

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 30,
  },
  page: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    overflow: 'visible',
    position: 'relative',
  },
  backPressable: {
    height: 58,
    justifyContent: 'center',
    width: 58,
    zIndex: 3,
  },
  backButton: {
    height: 58,
    width: 58,
  },
  wordmarkCenter: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  folioWordmark: {
    height: 62,
    width: 132,
  },
  reviewDuePressable: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    overflow: 'visible',
    position: 'absolute',
    right: -26,
    width: 146,
    zIndex: 3,
  },
  reviewDueImage: {
    height: 62,
    overflow: 'visible',
    width: 146,
  },
  heroPanel: {
    marginBottom: 8,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#FFF9EE',
    borderColor: 'rgba(46, 131, 214, 0.58)',
    borderWidth: 1,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 4,
  },
  searchIcon: {
    color: '#756F66',
    fontSize: 17,
    lineHeight: 19,
    marginRight: 6,
  },
  searchInput: {
    backgroundColor: 'transparent',
    color: '#645F58',
    flex: 1,
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 13,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchInputFilled: {
    backgroundColor: '#FBF6EA',
  },
  carouselWindow: {
    flexGrow: 0,
    marginBottom: 1,
    overflow: 'visible',
  },
  carouselContent: {
    alignItems: 'flex-start',
  },
  deckCarouselItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
  },
  deckCard: {
    alignItems: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingTop: 17,
  },
  deckTitle: {
    color: '#211D19',
    fontFamily: FOLIO_HAND_FONT,
    textAlign: 'center',
    zIndex: 1,
  },
  selectedDeckTitle: {
    fontSize: 18,
    lineHeight: 23,
    minHeight: 64,
  },
  sideDeckTitle: {
    fontSize: 14,
    lineHeight: 18,
    minHeight: 50,
  },
  selectedTopicIcon: {
    height: 72,
    marginBottom: 4,
    marginTop: 6,
    width: 82,
    zIndex: 1,
  },
  sideTopicIcon: {
    height: 50,
    marginBottom: 4,
    marginTop: 4,
    width: 58,
    zIndex: 1,
  },
  deckCountBlock: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 22,
    zIndex: 1,
  },
  selectedDeckCountBlock: {
    paddingBottom: 24,
  },
  deckDueText: {
    color: '#0D75D9',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 11,
    lineHeight: 15,
  },
  deckTotalText: {
    color: '#6D665D',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 10.5,
    lineHeight: 14,
  },
  openDeckButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#3C86E7',
    borderRadius: 8,
    borderWidth: 1.4,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 2,
  },
  openDeckButtonTexture: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  openDeckButtonText: {
    color: '#2675D7',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 10.5,
    lineHeight: 13,
  },
  dotsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot: {
    backgroundColor: '#BFB6A7',
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  activeDot: {
    backgroundColor: '#2E86E6',
    height: 11,
    width: 11,
  },
  previewHeader: {
    borderRadius: 18,
    marginBottom: 6,
    minHeight: 62,
    overflow: 'hidden',
    position: 'relative',
  },
  createCardsButton: {
    alignSelf: 'center',
    backgroundColor: '#EAF8EA',
    borderColor: '#5AAB62',
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  createCardsButtonContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
  },
  createCardsButtonIcon: {
    height: 36,
    width: 36,
  },
  createCardsButtonTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  createCardsButtonTitle: {
    color: '#0E6F20',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 14,
    lineHeight: 18,
  },
  createCardsButtonDeckName: {
    color: '#3D3934',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 10.5,
    lineHeight: 13,
    marginTop: 0,
  },
  createCardsButtonArrow: {
    height: 19,
    width: 19,
  },
  previewSwatchFill: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    zIndex: 0,
  },
  previewHeaderPanel: {
    alignItems: 'center',
    borderColor: '#D8C8A9',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    height: 62,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingRight: 18,
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  previewHeaderLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 34,
    minWidth: 0,
  },
  previewCardsIcon: {
    height: 24,
    marginRight: 8,
    width: 24,
  },
  previewHeaderText: {
    color: '#655E55',
    flex: 1,
    flexShrink: 1,
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 13.5,
    lineHeight: 18,
    minWidth: 0,
  },
  previewDeckName: {
    color: '#0D75D9',
  },
  previewToggleGlyph: {
    color: '#0D75D9',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 22,
    lineHeight: 26,
    minWidth: 22,
    position: 'absolute',
    right: 14,
    textAlign: 'center',
    top: 18,
  },
  previewWindow: {
    borderColor: '#D8C8A9',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 2,
    overflow: 'hidden',
    padding: 6,
    position: 'relative',
  },
  previewWindowTextureImage: {
    borderRadius: 18,
  },
  previewScroll: {
    zIndex: 1,
  },
  previewList: {
    gap: 5,
    paddingBottom: 2,
  },
  previewRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 252, 244, 0.62)',
    borderColor: 'rgba(199, 181, 145, 0.72)',
    borderRadius: 15,
    borderWidth: 1.1,
    flexDirection: 'row',
    paddingHorizontal: 9,
  },
  previewStar: {
    height: 21,
    marginRight: 8,
    width: 21,
  },
  previewQuestionColumn: {
    flex: 1.05,
    paddingRight: 10,
  },
  previewDivider: {
    alignSelf: 'stretch',
    backgroundColor: '#E1D8CA',
    marginRight: 10,
    width: 1,
  },
  previewAnswerColumn: {
    flex: 1.1,
    paddingRight: 7,
  },
  previewQuestionText: {
    color: '#27211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 13.2,
    lineHeight: 17,
  },
  previewAnswerText: {
    color: '#675F57',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 12.5,
    lineHeight: 16,
  },
  chevron: {
    color: '#746C64',
    fontSize: 22,
    lineHeight: 26,
  },
  emptyPreviewRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 252, 244, 0.62)',
    borderColor: 'rgba(199, 181, 145, 0.72)',
    borderRadius: 17,
    borderWidth: 1.2,
    justifyContent: 'center',
    minHeight: 74,
    padding: 14,
  },
  emptyPreviewText: {
    color: '#6D665D',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 15,
  },
  emptyState: {
    backgroundColor: '#FBF7EE',
    borderColor: '#E2D4BC',
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  emptyTitle: {
    color: '#29231D',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 24,
  },
  emptyText: {
    color: '#6D665D',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 15,
    marginTop: 6,
  },

  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});

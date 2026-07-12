/**
 * Spaced repetition review landing page.
 *
 * Round 37 experiment: use the raw crayon swatches as live ImageBackground
 * fills instead of baked PNG shells. This is intentionally a layout/material
 * experiment so we can compare the raw-background approach against the
 * round-32 baked-shell process.
 */
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, RADIUS, SHADOWS, SPACING } from "@/constants/design";
import { getDecks, getFlashcards } from "@/storage/flashcards";
import type { Deck, Flashcard } from "@/types/flashcard";
import { getDueCards } from "../../lib/review-queue";

const reviewDueAssets = {
  calendarIcon: require("../../../assets/folio-ui/review-due-page/icons/generated-transparent/calendar_transparent.png"),
  createIcon: require("../../../assets/folio-ui/review-due-page/icons/generated-transparent/create_transparent.png"),
  browseIcon: require("../../../assets/folio-ui/review-due-page/icons/generated-transparent/browse_transparent.png"),
  statsIcon: require("../../../assets/folio-ui/review-due-page/icons/generated-transparent/stats_transparent.png"),
  retentionNoteIcon: require("../../../assets/folio-ui/review-due-page/icons/generated-transparent/lightbulb_transparent.png"),
  deckBrainIcon: require("../../../assets/folio-ui/review-due-page/icons/generated-transparent/brain_transparent.png"),
  deckArrowIcon: require("../../../assets/folio-ui/review-due-page/icons/generated-transparent/arrow_transparent.png"),
};

const crayonSwatches = {
  blue: require("../../../assets/folio-ui/browse-selection/textures/crayon_texture_blue.png"),
  green: require("../../../assets/folio-ui/browse-selection/textures/crayon_texture_green.png"),
  yellow: require("../../../assets/folio-ui/browse-selection/textures/crayon_texture_yellow.png"),
  peach: require("../../../assets/folio-ui/browse-selection/textures/crayon_texture_peach.png"),
  purple: require("../../../assets/folio-ui/browse-selection/textures/crayon_texture_purple.png"),
  mint: require("../../../assets/folio-ui/browse-selection/textures/crayon_texture_mint.png"),
} as const;

const deckSwatchSequence = [
  crayonSwatches.blue,
  crayonSwatches.green,
  crayonSwatches.yellow,
  crayonSwatches.peach,
  crayonSwatches.purple,
  crayonSwatches.mint,
] as const;

function getMostRecentCard(cards: Flashcard[]) {
  return [...cards].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

function getCardsForDeck(deckId: string, cards: Flashcard[]) {
  return cards.filter((card) => card.deckId === deckId);
}

function formatDueMeta(card: Flashcard | undefined) {
  if (!card) {
    return "due - interval 0d";
  }

  return `due - interval ${card.intervalDays ?? 0}d`;
}

type DeckPreview = {
  deck: Deck;
  cards: Flashcard[];
  dueCards: Flashcard[];
  mostRecentDueCard?: Flashcard;
};

type ActionTextureButtonProps = {
  source: ImageSourcePropType;
  iconSource: ImageSourcePropType;
  label: string;
  labelColor: string;
  borderColor: string;
  onPress: () => void;
  width: number;
  height?: number;
  iconSize?: number;
  labelSize?: number;
  labelLineHeight?: number;
  scale?: number;
  numberOfLines?: number;
  accessibilityLabel?: string;
  testID?: string;
};

function ActionTextureButton({
  source,
  iconSource,
  label,
  labelColor,
  borderColor,
  onPress,
  width,
  height = 60,
  iconSize = 28,
  labelSize = 12.5,
  labelLineHeight = 14,
  scale = 1,
  numberOfLines = 2,
  accessibilityLabel,
  testID,
}: ActionTextureButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? label.replace(/\s+/g, " ").trim()
      }
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionPressable,
        { width },
        pressed && styles.pressed,
      ]}
    >
      <ImageBackground
        source={source}
        resizeMode="stretch"
        style={[
          styles.actionButtonTexture,
          {
            height,
            borderColor,
            borderRadius: Math.round(18 * scale),
            paddingHorizontal: Math.round(8 * scale),
            gap: Math.round(7 * scale),
          },
        ]}
        imageStyle={styles.textureImage}
      >
        <Image
          source={iconSource}
          resizeMode="contain"
          style={[
            styles.actionIconImage,
            { width: iconSize, height: iconSize },
          ]}
        />
        <Text
          allowFontScaling={false}
          numberOfLines={numberOfLines}
          style={[
            styles.actionButtonLabel,
            {
              color: labelColor,
              fontSize: labelSize,
              lineHeight: labelLineHeight,
            },
          ]}
        >
          {label}
        </Text>
      </ImageBackground>
    </Pressable>
  );
}

export default function ReviewIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);

  const pageWidth = Math.min(width - SPACING.lg * 2, 430);
  const safeHeight = height - insets.top - insets.bottom;
  const isCompactReview = width < 370 || safeHeight < 720;
  const compactScale = isCompactReview ? 0.8 : 1;
  const availableHeight = isCompactReview
    ? safeHeight
    : Math.max(safeHeight, 680);
  const topSectionHeight = Math.round(
    availableHeight * (isCompactReview ? 0.43 : 0.49),
  );
  const deckCarouselHeight = Math.round(
    availableHeight * (isCompactReview ? 0.42 : 0.46),
  );
  const createButtonWidth = Math.floor(
    pageWidth * (isCompactReview ? 0.28 : 0.31),
  );
  const browseButtonWidth = Math.floor(
    pageWidth * (isCompactReview ? 0.28 : 0.31),
  );
  const statsButtonWidth =
    pageWidth - createButtonWidth - browseButtonWidth - SPACING.xs * 2;
  const carouselCardWidth = pageWidth - 8;
  const heroTitleSize = Math.round(30 * compactScale);
  const heroTitleLineHeight = Math.round(34 * compactScale);
  const retentionNoteHeight = Math.round(124 * compactScale);
  const actionButtonHeight = Math.round(60 * compactScale);
  const actionIconSize = Math.round(28 * compactScale);
  const actionLabelSize = 12.5 * compactScale;
  const actionLabelLineHeight = Math.round(14 * compactScale);
  const deckPanelVerticalPadding = Math.round(14 * compactScale);
  const deckPanelHorizontalPadding = Math.round(16 * compactScale);
  const deckBadgeMinHeight = Math.round(86 * compactScale);
  const previewCardPaddingHorizontal = Math.round(16 * compactScale);
  const previewCardPaddingTop = Math.round(12 * compactScale);
  const previewCardPaddingBottom = Math.round(14 * compactScale);
  const previewCardGap = Math.round(8 * compactScale);

  const deckPreviews = useMemo<DeckPreview[]>(
    () =>
      decks.map((deck) => {
        const deckCards = getCardsForDeck(deck.id, cards);
        const dueCards = getDueCards(deckCards);

        return {
          deck,
          cards: deckCards,
          dueCards,
          mostRecentDueCard: getMostRecentCard(dueCards),
        };
      }),
    [cards, decks],
  );

  const dueDeckPreviews = useMemo(() => {
    const onlyDue = deckPreviews.filter((item) => item.dueCards.length > 0);
    return onlyDue.length > 0 ? onlyDue : deckPreviews;
  }, [deckPreviews]);

  useFocusEffect(
    useCallback(() => {
      setDecks(getDecks());
      setCards(getFlashcards());
    }, []),
  );

  function openDueDeck(deckId: string | undefined) {
    if (!deckId) {
      return;
    }

    router.push({
      pathname: "/review/[deckId]",
      params: { deckId, mode: "due" },
    });
  }

  return (
    <ScrollView
      accessibilityLabel="Review due cards screen"
      testID="review-index-screen"
      scrollEnabled={isCompactReview}
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 6,
          paddingBottom: insets.bottom + 12,
        },
      ]}
    >
      <View style={[styles.page, { width: pageWidth }]}>
        <View style={[styles.topSection, { minHeight: topSectionHeight }]}>
          <View style={styles.heroRow}>
            <View style={styles.heroTextColumn}>
              <Text
                style={[
                  styles.eyebrow,
                  {
                    fontSize: 13 * compactScale,
                    lineHeight: Math.round(16 * compactScale),
                  },
                ]}
              >
                Spaced repetition
              </Text>
              <Text
                style={[
                  styles.title,
                  { fontSize: heroTitleSize, lineHeight: heroTitleLineHeight },
                ]}
              >
                Review due cards.
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    fontSize: 14 * compactScale,
                    lineHeight: Math.round(20 * compactScale),
                    maxWidth: 290 * compactScale,
                  },
                ]}
              >
                These deck blocks focus on cards that are new or scheduled for
                review today.
              </Text>
            </View>

            <Image
              source={reviewDueAssets.calendarIcon}
              resizeMode="contain"
              style={[
                styles.calendarIcon,
                {
                  width: Math.round(114 * compactScale),
                  height: Math.round(88 * compactScale),
                },
              ]}
            />
          </View>

          <ImageBackground
            source={crayonSwatches.yellow}
            resizeMode="stretch"
            style={[
              styles.retentionNoteTexture,
              styles.yellowBorder,
              {
                minHeight: retentionNoteHeight,
                paddingTop: Math.round(13 * compactScale),
                paddingRight: Math.round(20 * compactScale),
                paddingBottom: Math.round(13 * compactScale),
                paddingLeft: Math.round(16 * compactScale),
                gap: Math.round(12 * compactScale),
              },
            ]}
            imageStyle={styles.textureImage}
          >
            <Image
              source={reviewDueAssets.retentionNoteIcon}
              resizeMode="contain"
              style={[
                styles.noteIconImage,
                {
                  width: Math.round(34 * compactScale),
                  height: Math.round(46 * compactScale),
                },
              ]}
            />
            <View style={styles.noteTextBlock}>
              <Text
                style={[
                  styles.noteTitle,
                  {
                    fontSize: 13 * compactScale,
                    lineHeight: Math.round(17 * compactScale),
                    paddingRight: Math.round(20 * compactScale),
                  },
                ]}
              >
                How to get the most from spaced repetition
              </Text>
              <Text
                style={[
                  styles.noteText,
                  {
                    fontSize: 12 * compactScale,
                    lineHeight: Math.round(17 * compactScale),
                    paddingRight: Math.round(10 * compactScale),
                  },
                ]}
              >
                Review due cards consistently, answer before revealing, and
                grade honestly. Missed cards return quickly; easy cards wait
                longer, focusing effort right before forgetting.
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.actionRow}>
            <ActionTextureButton
              source={crayonSwatches.green}
              iconSource={reviewDueAssets.createIcon}
              label={"Create\ncards"}
              accessibilityLabel="Create cards"
              testID="review-index-create-cards"
              labelColor={COLORS.createDeep}
              borderColor="#63B982"
              onPress={() => router.push("/")}
              width={createButtonWidth}
              scale={compactScale}
              height={actionButtonHeight}
              iconSize={actionIconSize}
              labelSize={actionLabelSize}
              labelLineHeight={actionLabelLineHeight}
            />

            <ActionTextureButton
              source={crayonSwatches.blue}
              iconSource={reviewDueAssets.browseIcon}
              label={"Browse\ndecks"}
              accessibilityLabel="Browse decks"
              testID="review-index-browse-decks"
              labelColor={COLORS.reviewDeep}
              borderColor="#79A7F4"
              onPress={() => router.push("/review/browse")}
              width={browseButtonWidth}
              scale={compactScale}
              height={actionButtonHeight}
              iconSize={actionIconSize}
              labelSize={actionLabelSize}
              labelLineHeight={actionLabelLineHeight}
            />

            <ActionTextureButton
              source={crayonSwatches.yellow}
              iconSource={reviewDueAssets.statsIcon}
              label="Stats"
              accessibilityLabel="Review stats"
              testID="review-index-stats"
              labelColor={COLORS.warning}
              borderColor="#E2AE38"
              onPress={() => router.push("/review/stats")}
              width={statsButtonWidth}
              scale={compactScale}
              height={actionButtonHeight}
              iconSize={actionIconSize}
              labelSize={actionLabelSize}
              labelLineHeight={actionLabelLineHeight}
              numberOfLines={1}
            />
          </View>
        </View>

        {dueDeckPreviews.length > 0 ? (
          <View style={[styles.deckSection, { height: deckCarouselHeight }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={carouselCardWidth + SPACING.md}
              contentContainerStyle={[
                styles.deckCarouselContent,
                { minHeight: deckCarouselHeight },
              ]}
            >
              {dueDeckPreviews.map((item, index) => {
                const dueCount = item.dueCards.length;
                const totalCount = item.cards.length;
                const front =
                  item.mostRecentDueCard?.front?.trim() ||
                  "No cards due right now";
                const back =
                  item.mostRecentDueCard?.back?.trim() ||
                  "Use Browse Decks to open the full deck.";
                const deckSwatch =
                  deckSwatchSequence[index % deckSwatchSequence.length];

                return (
                  <ImageBackground
                    key={item.deck.id}
                    source={deckSwatch}
                    resizeMode="stretch"
                    style={[
                      styles.deckPanelTexture,
                      {
                        width: carouselCardWidth,
                        minHeight: deckCarouselHeight - 4,
                        paddingTop: deckPanelVerticalPadding,
                        paddingHorizontal: deckPanelHorizontalPadding,
                        paddingBottom: deckPanelVerticalPadding,
                      },
                      index === dueDeckPreviews.length - 1 &&
                        styles.deckPanelLast,
                    ]}
                    imageStyle={styles.textureImage}
                  >
                    <View style={styles.deckPanelTopRow}>
                      <Text style={styles.deckCountText}>
                        {dueCount} due now · {totalCount}{" "}
                        {totalCount === 1 ? "card" : "cards"} total.
                      </Text>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${item.deck.name}`}
                        testID={`review-index-open-deck-${item.deck.id}`}
                        onPress={() => openDueDeck(item.deck.id)}
                        style={({ pressed }) => [
                          styles.deckBadgePressable,
                          pressed && styles.pressed,
                        ]}
                      >
                        <ImageBackground
                          source={deckSwatch}
                          resizeMode="stretch"
                          style={[
                            styles.deckBadgeTexture,
                            {
                              minHeight: deckBadgeMinHeight,
                              paddingLeft: Math.round(14 * compactScale),
                              paddingRight: Math.round(42 * compactScale),
                              paddingVertical: Math.round(8 * compactScale),
                              gap: Math.round(10 * compactScale),
                            },
                          ]}
                          imageStyle={styles.textureImage}
                        >
                          <Image
                            source={reviewDueAssets.deckBrainIcon}
                            resizeMode="contain"
                            style={[
                              styles.deckBadgeBrainIcon,
                              {
                                width: Math.round(42 * compactScale),
                                height: Math.round(42 * compactScale),
                              },
                            ]}
                          />
                          <Text
                            numberOfLines={3}
                            style={[
                              styles.deckBadgeText,
                              {
                                fontSize: 12.5 * compactScale,
                                lineHeight: Math.round(16 * compactScale),
                              },
                            ]}
                          >
                            {item.deck.name}
                          </Text>
                          <Image
                            source={reviewDueAssets.deckArrowIcon}
                            resizeMode="contain"
                            style={[
                              styles.deckBadgeArrowIcon,
                              {
                                right: Math.round(14 * compactScale),
                                width: Math.round(24 * compactScale),
                                height: Math.round(24 * compactScale),
                              },
                            ]}
                          />
                        </ImageBackground>
                      </Pressable>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Review due cards from ${item.deck.name}`}
                      testID={`review-index-review-deck-${item.deck.id}`}
                      onPress={() => openDueDeck(item.deck.id)}
                      style={({ pressed }) => [
                        styles.previewCard,
                        {
                          marginTop: Math.round(10 * compactScale),
                          marginHorizontal: Math.round(14 * compactScale),
                          marginBottom: Math.round(10 * compactScale),
                          paddingHorizontal: previewCardPaddingHorizontal,
                          paddingTop: previewCardPaddingTop,
                          paddingBottom: previewCardPaddingBottom,
                          gap: previewCardGap,
                        },
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.previewCardSide,
                          {
                            fontSize: 12 * compactScale,
                            lineHeight: Math.round(14 * compactScale),
                          },
                        ]}
                      >
                        Prompt
                      </Text>
                      <Text
                        numberOfLines={isCompactReview ? 2 : 3}
                        style={[
                          styles.previewPrompt,
                          {
                            fontSize: 18 * compactScale,
                            lineHeight: Math.round(24 * compactScale),
                          },
                        ]}
                      >
                        {front}
                      </Text>
                      <Text
                        numberOfLines={isCompactReview ? 2 : 3}
                        style={[
                          styles.previewAnswer,
                          {
                            fontSize: 14 * compactScale,
                            lineHeight: Math.round(20 * compactScale),
                          },
                        ]}
                      >
                        {back}
                      </Text>
                      <Text
                        style={[
                          styles.previewMeta,
                          {
                            fontSize: 13 * compactScale,
                            lineHeight: Math.round(16 * compactScale),
                          },
                        ]}
                      >
                        {formatDueMeta(item.mostRecentDueCard)}
                      </Text>
                    </Pressable>
                  </ImageBackground>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.emptyDeckState}>
            <Text style={styles.emptyDeckTitle}>No decks yet</Text>
            <Text style={styles.emptyDeckText}>
              Create a deck first, then it will appear here as a spaced
              repetition block.
            </Text>
          </View>
        )}
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
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  page: {
    gap: 10,
  },
  topSection: {
    justifyContent: "space-between",
  },
  textureImage: {
    borderRadius: 20,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  heroTextColumn: {
    flex: 1,
    gap: 6,
    paddingTop: 0,
  },
  eyebrow: {
    color: COLORS.reviewDeep,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    color: COLORS.ink,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.ink,
    opacity: 0.76,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 290,
  },
  calendarIcon: {
    width: 114,
    height: 88,
    marginTop: 10,
    marginRight: -2,
  },
  retentionNoteTexture: {
    minHeight: 124,
    marginTop: -4,
    marginHorizontal: -3,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: "hidden",
    paddingTop: 13,
    paddingRight: 20,
    paddingBottom: 13,
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  yellowBorder: {
    borderColor: "#E2AE38",
  },
  noteIconImage: {
    width: 34,
    height: 46,
    marginLeft: 4,
  },
  noteTextBlock: {
    flex: 1,
    gap: 5,
  },
  noteTitle: {
    color: COLORS.warning,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    paddingRight: 20,
    maxWidth: "96%",
  },
  noteText: {
    color: COLORS.ink,
    fontSize: 12,
    lineHeight: 17,
    paddingRight: 10,
    maxWidth: "96%",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.xs,
    marginTop: -2,
  },
  actionPressable: {
    flexShrink: 0,
  },
  actionButtonTexture: {
    height: 60,
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 7,
  },
  actionIconImage: {
    width: 28,
    height: 28,
    marginRight: 2,
  },
  actionButtonLabel: {
    fontSize: 12.5,
    lineHeight: 14,
    fontWeight: "900",
    textAlign: "left",
  },
  deckSection: {
    marginHorizontal: -2,
    overflow: "visible",
  },
  deckCarouselContent: {
    alignItems: "stretch",
    paddingRight: SPACING.md,
  },
  deckPanelTexture: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#73A6F4",
    overflow: "hidden",
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 14,
    marginRight: SPACING.md,
    ...SHADOWS.soft,
  },
  deckPanelLast: {
    marginRight: 0,
  },
  deckPanelTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 92,
  },
  deckCountText: {
    flex: 1,
    maxWidth: "30%",
    color: "#5B5148",
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: "900",
    paddingTop: 6,
  },
  deckBadgePressable: {
    width: "68%",
  },
  deckBadgeTexture: {
    minHeight: 86,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: "#568BE8",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 14,
    paddingRight: 42,
    paddingVertical: 8,
    gap: 10,
  },
  deckBadgeBrainIcon: {
    width: 42,
    height: 42,
    flexShrink: 0,
  },
  deckBadgeText: {
    flex: 1,
    color: COLORS.reviewDeep,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: "900",
    textAlign: "left",
  },
  deckBadgeArrowIcon: {
    position: "absolute",
    right: 14,
    width: 24,
    height: 24,
  },
  previewCard: {
    flex: 1,
    backgroundColor: "#FFF8E8",
    borderColor: "#E1C891",
    borderWidth: 1.2,
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 10,
    marginHorizontal: 14,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    justifyContent: "flex-start",
    gap: 8,
  },
  previewCardSide: {
    color: "#7D6C59",
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  previewPrompt: {
    color: COLORS.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
  },
  previewAnswer: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  previewMeta: {
    marginTop: 2,
    color: COLORS.reviewDeep,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "900",
  },
  emptyDeckState: {
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: 8,
  },
  emptyDeckTitle: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  emptyDeckText: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

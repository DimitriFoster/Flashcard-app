/**
 * DeckReviewSession.
 *
 * PNG-driven review page implementation for the Folio mockup.
 *
 * The important design rule here is that the crayon / paper look comes from
 * the saved source-of-truth PNG assets under assets/folio-ui/review. React
 * Native still owns layout, data, accessibility, swipe animation, edit state,
 * and review scheduling callbacks.
 */
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type PanResponderInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeckSummaryPanel } from '@/folio-review/DeckSummaryPanel';
import { FolioAssetButton } from '@/folio-review/FolioAssetButton';
import { folioReviewAssets } from '@/folio-review/folioReviewAssets';
import { GradeButtonRow } from '@/folio-review/GradeButtonRow';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import type { SessionTokenStatus } from '@/folio-review/types';
import type { Flashcard, ReviewGrade } from '@/types/flashcard';

const TRY_AT_HOME_BOX_IMAGE = require('../../../assets/folio-ui/home-page/open-import/import_large_file_box.png');

const DEFAULT_SESSION_TOKENS: SessionTokenStatus[] = [
  'empty',
  'new',
  'new',
  'again',
  'hard',
  'empty',
  'empty',
  'good',
  'empty',
  'empty',
  'easy',
  'empty',
];

const ACTIVE_TOKEN_INDEX = 0;

const browseAssets = {
  deckHeaderShell: require('../../../assets/folio-ui/browse/panels/deck_header_shell_round14.png'),
  matchesStripShell: require('../../../assets/folio-ui/browse/panels/matches_strip_shell_round14.png'),
  searchIcon: require('../../../assets/folio-ui/browse/panels/search_icon_round15.png'),
  previousButton: require('../../../assets/folio-ui/browse/controls/previous_button_transparent_round66.png'),
  flipButton: require('../../../assets/folio-ui/browse/controls/flip_button_round15.png'),
  nextButton: require('../../../assets/folio-ui/browse/controls/next_button_transparent_round66.png'),
  noteBar: require('../../../assets/folio-ui/browse/footer/browse_note_bar_transparent_round66.png'),
} as const;

type DeckReviewSessionProps = {
  deckName?: string;
  totalDeckCards?: number;
  currentIndex: number;
  cardsLength: number;
  currentCard?: Flashcard;
  flipped: boolean;
  translateX: Animated.Value;
  panHandlers: PanResponderInstance['panHandlers'];
  showGradeButtons?: boolean;
  showUndoButton?: boolean;
  isEditing?: boolean;
  editFront?: string;
  editBack?: string;
  cardSearch?: string;
  onChangeEditFront?: (value: string) => void;
  onChangeEditBack?: (value: string) => void;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  onPreviousCard?: () => void;
  onNextCard?: () => void;
  onToggleFlip?: () => void;
  onBack: () => void;
  onUndo?: () => void;
  onGrade: (grade: ReviewGrade) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDeckSubtitle(deckName?: string) {
  if (!deckName) return 'Master Deck';

  return /master deck/i.test(deckName) ? '' : 'Master Deck';
}

function getCardQuestion(currentCard: Flashcard, flipped: boolean) {
  return flipped ? currentCard.back : currentCard.front;
}

function getCardHint(flipped: boolean) {
  return flipped ? 'Tap to return to prompt' : 'Tap to reveal answer';
}


function GuideBullet({ color, children }: { color: string; children?: React.ReactNode }) {
  return (
    <View style={styles.guideBulletRow}>
      <View style={[styles.guideBulletDot, { backgroundColor: color }]} />
      <Text style={styles.guideBody}>{children}</Text>
    </View>
  );
}

function GuideStep({ number, children }: { number: string; children?: React.ReactNode }) {
  return (
    <View style={styles.guideStepRow}>
      <View style={styles.guideStepNumber}>
        <Text style={styles.guideStepNumberText}>{number}</Text>
      </View>
      <Text style={styles.guideBody}>{children}</Text>
    </View>
  );
}

function SpacedRepetitionGuide() {
  return (
    <ScrollView
      style={styles.tutorialGuideScroll}
      contentContainerStyle={styles.tutorialGuideContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.guideSection}>
        <Text style={styles.guideSectionTitle}>What is spaced repetition?</Text>
        <Text style={styles.guideBody}>
          Spaced repetition is a simple way to study a little today, then bring cards back later when your memory needs another nudge.
        </Text>
        <Text style={styles.guideBody}>
          Hard cards come back sooner. Easy cards wait longer. The goal is steady recall, not perfect first tries.
        </Text>
      </View>

      <View style={styles.guideSection}>
        <Text style={styles.guideSectionTitle}>How to use Folio</Text>
        <GuideBullet color="#1976D2">Try to answer before you flip the card.</GuideBullet>
        <GuideBullet color="#D1841F">Reveal the answer and compare honestly.</GuideBullet>
        <GuideBullet color="#C75D57">Pick Again, Hard, Good, or Easy.</GuideBullet>
        <GuideBullet color="#5F8E4E">Folio decides when the card returns.</GuideBullet>
        <View style={styles.guideCallout}>
          <Text style={styles.guideCalloutText}>Small, honest reviews beat one giant cram session.</Text>
        </View>
      </View>

      <View style={styles.guideSection}>
        <Text style={styles.guideSectionTitle}>Try at Home!</Text>
        <Text style={styles.guideBody}>
          You can practice the same system with traditional paper flashcards:
        </Text>
        <GuideStep number="1">Make a small stack of about 10 cards.</GuideStep>
        <GuideStep number="2">Answer out loud before you flip each card.</GuideStep>
        <GuideStep number="3">Sort cards into piles: Again, Hard, Good, and Easy.</GuideStep>
        <Image source={TRY_AT_HOME_BOX_IMAGE} resizeMode="contain" style={styles.guideBoxIcon} />
        <GuideStep number="4">Review Again now. Hard later. Good tomorrow. Easy in a few days.</GuideStep>
        <GuideStep number="5">Keep missed cards near the front of your next practice stack.</GuideStep>
      </View>

      <Text style={styles.guideFooter}>You are training your memory in small passes.</Text>
    </ScrollView>
  );
}

function NavigateButton({ label, accessibilityLabel, testID, onPress }: { label: string; accessibilityLabel: string; testID: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [styles.browseButton, pressed && styles.pressed]}>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={styles.browseButtonText}>
        {label}
      </Text>
    </Pressable>
  );
}

export function DeckReviewSession({
  deckName,
  totalDeckCards,
  currentIndex,
  cardsLength,
  currentCard,
  flipped,
  translateX,
  panHandlers,
  showGradeButtons = true,
  showUndoButton = false,
  isEditing = false,
  editFront = '',
  editBack = '',
  cardSearch,
  onChangeEditFront,
  onChangeEditBack,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onPreviousCard,
  onNextCard,
  onToggleFlip,
  onBack,
  onUndo,
  onGrade,
}: DeckReviewSessionProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);
  const [flowPlacement, setFlowPlacement] = React.useState<{ grade: ReviewGrade; key: number } | null>(null);
  const flowPlacementTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const flowPlacementKeyRef = React.useRef(0);
  const flowPlacementInFlightRef = React.useRef(false);

  const pageWidth = Math.min(width - 18, 434);
  const safeHeight = height - insets.top - insets.bottom;
  const isCompactHeight = height < 820;
  const useCompactGuideClose = width < 460 || height < 760;
  const isLandscape = width > height;
  const isBrowseMode = !showGradeButtons;
  const isReviewTiny = showGradeButtons && (width < 360 || safeHeight < 640);
  const isReviewSmall = showGradeButtons && !isReviewTiny && (width < 380 || safeHeight < 710);
  const isReviewMedium = showGradeButtons && !isReviewTiny && !isReviewSmall && (width < 410 || safeHeight < 825);
  const reviewLayoutScale = isReviewTiny ? 0.82 : isReviewSmall ? 0.91 : 1;
  const reviewCardInteriorScale = isReviewTiny ? 0.82 : isReviewSmall ? 0.9 : 1;
  const reviewContentGap = isReviewTiny ? 5 : isReviewSmall ? 6 : isReviewMedium ? 7 : 9;
  const dueOrVisibleCount = Math.max(cardsLength - currentIndex, 0);
  const totalCardsForPanel = Math.max(totalDeckCards ?? cardsLength, cardsLength);
  const currentCardNumber = cardsLength > 0 ? currentIndex + 1 : 0;
  const cardNumberText = `${currentCardNumber} / ${cardsLength || totalCardsForPanel || 0}`;
  const cardWidth = Math.min(pageWidth - 18, 404);
  const reviewCardRatio = isReviewTiny ? 0.72 : isReviewSmall ? 0.8 : isReviewMedium ? 0.89 : 0.94;
  const reviewCardMinHeight = isReviewTiny ? 250 : isReviewSmall ? 286 : isReviewMedium ? 322 : 344;
  const reviewCardMaxHeight = isReviewTiny ? 282 : isReviewSmall ? 318 : isReviewMedium ? 356 : 382;
  const cardHeight = isLandscape
    ? clamp(height * 0.48, 230, 320)
    : clamp(Math.round(cardWidth * reviewCardRatio), reviewCardMinHeight, reviewCardMaxHeight);
  const stackWidth = cardWidth + 16;
  const stackHeight = cardHeight + 16;
  const browseFlipAnim = React.useRef(new Animated.Value(flipped ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(browseFlipAnim, {
      toValue: flipped ? 1 : 0,
      friction: 9,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [browseFlipAnim, flipped]);

  const browseFrontRotation = browseFlipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const browseBackRotation = browseFlipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  React.useEffect(() => {
    setFlowPlacement(null);
    flowPlacementInFlightRef.current = false;
  }, [currentCard?.id]);

  React.useEffect(() => {
    return () => {
      if (flowPlacementTimeoutRef.current) {
        clearTimeout(flowPlacementTimeoutRef.current);
      }
    };
  }, []);

  const handleGradeWithFlowAnimation = React.useCallback((grade: ReviewGrade) => {
    if (flowPlacementInFlightRef.current) return;

    flowPlacementInFlightRef.current = true;
    flowPlacementKeyRef.current += 1;
    setFlowPlacement({ grade, key: flowPlacementKeyRef.current });

    if (flowPlacementTimeoutRef.current) {
      clearTimeout(flowPlacementTimeoutRef.current);
    }

    flowPlacementTimeoutRef.current = setTimeout(() => {
      setFlowPlacement(null);
      flowPlacementInFlightRef.current = false;
      onGrade(grade);
    }, 820);
  }, [onGrade]);

  if (isBrowseMode) {
    const browseAvailableHeight = Math.max(height - insets.top - 8, 700);
    const browseHeaderHeight = 60;
    const browseTopPanelHeight = isCompactHeight ? 90 : 104;
    const browseStripHeight = isCompactHeight ? 68 : 76;
    const browseControlsHeight = isCompactHeight ? 54 : 60;
    const browseNoteHeight = isCompactHeight ? 50 : 54;
    const browseNavHeight = 64;
    const browseGapTotal = isCompactHeight ? 36 : 46;
    const browseCardHeight = clamp(
      Math.round(
        browseAvailableHeight -
          browseHeaderHeight -
          browseTopPanelHeight -
          browseStripHeight -
          browseControlsHeight -
          browseNoteHeight -
          browseNavHeight -
          browseGapTotal,
      ),
      isCompactHeight ? 266 : 286,
      isCompactHeight ? 304 : 322,
    );
    const browseCardWidth = Math.min(pageWidth - 18, 404);
    const browseStackWidth = browseCardWidth + 16;
    const browseStackHeight = browseCardHeight + 16;
    const browseSearchLabel = cardSearch?.trim() || 'all cards';
    const browseTopTitle = deckName ?? 'Deck not found';
    const browseTopSubtitle = getDeckSubtitle(deckName) || 'Master Deck';

    return (
      <ImageBackground
        accessibilityLabel={isBrowseMode ? "Browse session screen" : "Review session screen"}
        testID={isBrowseMode ? "browse-session-screen" : "review-session-screen"}
        source={folioReviewAssets.background.pagePaper}
        resizeMode="cover"
        style={styles.screen}>
        <View style={[styles.safeArea, { paddingTop: insets.top + 4 }]}> 
          <View style={[styles.browsePageFrame, { width: pageWidth }]}> 
            <View style={styles.headerRow}> 
              <FolioAssetButton
                source={folioReviewAssets.header.back}
                accessibilityLabel="Go back"
                testID="session-back"
                onPress={onBack}
                style={styles.backButton}
              />

              <Image source={folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark} />

              <View style={styles.browseHeaderActions}> 
                <FolioAssetButton
                  source={folioReviewAssets.header.edit}
                  accessibilityLabel="Edit current card"
                  testID="session-edit-current-card"
                  onPress={currentCard ? onStartEdit : undefined}
                  disabled={!currentCard || !onStartEdit}
                  style={styles.headerActionButton}
                />
                <FolioAssetButton
                  source={folioReviewAssets.header.help}
                  accessibilityLabel="Open help"
                  testID="session-open-help"
                  onPress={() => setIsTutorialOpen(true)}
                  style={styles.helpButton}
                />
              </View>
            </View>

            <ImageBackground source={browseAssets.deckHeaderShell} resizeMode="stretch" style={[styles.browseDeckPanel, { height: browseTopPanelHeight }]} imageStyle={styles.panelImage}>
              <Image source={folioReviewAssets.deckPanel.brainCloud} resizeMode="contain" style={styles.browseDeckIcon} />
              <View style={styles.browseDeckTextBlock}>
                <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.72} style={styles.browseDeckTitle}>{browseTopTitle}</Text>
                {browseTopSubtitle ? <Text allowFontScaling={false} numberOfLines={1} style={styles.browseDeckSubtitle}>{browseTopSubtitle}</Text> : null}
                <Text allowFontScaling={false} numberOfLines={1} style={styles.browseDeckModeText}>
                  <Text style={styles.browseDeckModeBlue}>Browse cards</Text>
                  <Text> • no scheduling changes</Text>
                </Text>
              </View>
            </ImageBackground>

            <ImageBackground source={browseAssets.matchesStripShell} resizeMode="stretch" style={[styles.browseMatchPanel, { height: browseStripHeight }]} imageStyle={styles.panelImage}>
              <Image source={browseAssets.searchIcon} resizeMode="contain" style={styles.browseSearchIcon} />
              <View style={styles.browseMatchCopy}>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.browseMatchTitle}>Showing matches only</Text>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.browseMatchSearch}>Search: {browseSearchLabel}</Text>
              </View>
              <View style={styles.browseMiniFlow}>
                {(['new', 'again', 'hard', 'good', 'good', 'empty', 'easy', 'again', 'new'] as SessionTokenStatus[]).map((token, index) => {
                  const tokenSource = token === 'empty'
                    ? folioReviewAssets.sessionFlow.emptyDashed
                    : token === 'again'
                      ? folioReviewAssets.sessionFlow.again
                      : token === 'hard'
                        ? folioReviewAssets.sessionFlow.hard
                        : token === 'good'
                          ? folioReviewAssets.sessionFlow.good
                          : token === 'easy'
                            ? folioReviewAssets.sessionFlow.easy
                            : folioReviewAssets.sessionFlow.new;
                  const active = index === 4;
                  return (
                    <View key={`${token}-${index}`} style={styles.browseMiniTokenWrap}>
                      {active ? <Image source={folioReviewAssets.sessionFlow.activeRays} resizeMode="contain" style={styles.browseMiniRays} /> : null}
                      <Image source={active ? folioReviewAssets.sessionFlow.activeGood : tokenSource} resizeMode="contain" style={styles.browseMiniToken} />
                      {active ? <Image source={folioReviewAssets.sessionFlow.activeTriangle} resizeMode="contain" style={styles.browseMiniTriangle} /> : null}
                    </View>
                  );
                })}
              </View>
            </ImageBackground>

            <View style={[styles.cardStage, { minHeight: browseStackHeight }]}> 
              {currentCard && isEditing ? (
                <ImageBackground
                  source={folioReviewAssets.card.frontSurface}
                  resizeMode="stretch"
                  style={[styles.editPanel, { minHeight: browseCardHeight, width: browseCardWidth }]}
                  imageStyle={styles.cardImage}
                >
                  <Text style={styles.editTitle}>Edit current card</Text>
                  <TextInput
                    multiline
                    value={editFront}
                    onChangeText={onChangeEditFront}
                    placeholder="Prompt / front"
                    placeholderTextColor="#8A8177"
                    textAlignVertical="top"
                    style={[styles.editInput, styles.editFrontInput]}
                  />
                  <TextInput
                    multiline
                    value={editBack}
                    onChangeText={onChangeEditBack}
                    placeholder="Answer / back"
                    placeholderTextColor="#8A8177"
                    textAlignVertical="top"
                    style={[styles.editInput, styles.editBackInput]}
                  />
                  <View style={styles.editActionRow}>
                    <Pressable accessibilityRole="button" onPress={onCancelEdit} style={({ pressed }) => [styles.editSecondaryButton, pressed && styles.pressed]}>
                      <Text style={styles.editSecondaryButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={onSaveEdit} style={({ pressed }) => [styles.editPrimaryButton, pressed && styles.pressed]}>
                      <Text style={styles.editPrimaryButtonText}>Save changes</Text>
                    </Pressable>
                  </View>
                </ImageBackground>
              ) : currentCard ? (
                <View style={[styles.cardStackWrap, { height: browseStackHeight }]}> 
                  <Image
                    pointerEvents="none"
                    source={folioReviewAssets.card.stackBackLayers}
                    resizeMode="stretch"
                    style={[styles.cardBackLayers, { height: browseStackHeight, width: browseStackWidth }]}
                  />
                  <Animated.View
                    key={currentCard.id}
                    {...panHandlers}
                    style={[
                      styles.animatedCard,
                      {
                        height: browseCardHeight,
                        width: browseCardWidth,
                        transform: [
                          { translateX },
                          {
                            rotate: translateX.interpolate({
                              inputRange: [-300, 0, 300],
                              outputRange: ['-8deg', '0deg', '8deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Animated.View style={[styles.browseFlipFace, styles.browseFrontFace, { transform: [{ perspective: 1100 }, { rotateY: browseFrontRotation }] }]}>
                      <ImageBackground
                        source={folioReviewAssets.card.frontSurface}
                        resizeMode="stretch"
                        style={styles.browseCardSurface}
                        imageStyle={styles.cardImage}
                      >
                        <View style={styles.cardTopRow}>
                          <Image source={folioReviewAssets.card.favoriteStar} resizeMode="contain" style={styles.favoriteStar} />
                          <Text allowFontScaling={false} style={styles.cardProgress}>{cardNumberText}</Text>
                        </View>
                        <View style={styles.browseCardContent}> 
                          <Text
                            adjustsFontSizeToFit
                            allowFontScaling={false}
                            minimumFontScale={0.72}
                            numberOfLines={4}
                            style={styles.browseCardText}
                          >
                            {currentCard.front}
                          </Text>
                          <Image source={folioReviewAssets.card.questionUnderline} resizeMode="stretch" style={styles.questionUnderline} />
                          <Image source={folioReviewAssets.card.retrievalGenerationIllustration} resizeMode="contain" style={styles.browseCardIllustration} />
                        </View>
                        <Text allowFontScaling={false} numberOfLines={1} style={styles.tapHint}>{getCardHint(false)}</Text>
                      </ImageBackground>
                    </Animated.View>
                    <Animated.View style={[styles.browseFlipFace, styles.browseBackFace, { transform: [{ perspective: 1100 }, { rotateY: browseBackRotation }] }]}>
                      <ImageBackground
                        source={folioReviewAssets.card.frontSurface}
                        resizeMode="stretch"
                        style={styles.browseCardSurface}
                        imageStyle={styles.cardImage}
                      >
                        <View style={styles.cardTopRow}>
                          <Image source={folioReviewAssets.card.favoriteStar} resizeMode="contain" style={styles.favoriteStar} />
                          <Text allowFontScaling={false} style={styles.cardProgress}>{cardNumberText}</Text>
                        </View>
                        <View style={styles.browseCardContent}> 
                          <Text
                            adjustsFontSizeToFit
                            allowFontScaling={false}
                            minimumFontScale={0.72}
                            numberOfLines={7}
                            style={[styles.browseCardText, styles.answerText]}
                          >
                            {currentCard.back}
                          </Text>
                          <Image source={folioReviewAssets.card.questionUnderline} resizeMode="stretch" style={styles.questionUnderline} />
                        </View>
                        <Text allowFontScaling={false} numberOfLines={1} style={styles.tapHint}>{getCardHint(true)}</Text>
                      </ImageBackground>
                    </Animated.View>
                  </Animated.View>
                </View>
              ) : (
                <ImageBackground
                  source={folioReviewAssets.card.frontSurface}
                  resizeMode="stretch"
                  style={[styles.emptyState, { minHeight: browseCardHeight }]}
                  imageStyle={styles.cardImage}
                >
                  <Text style={styles.emptyTitle}>No cards in this deck</Text>
                  <Text style={styles.emptyText}>Go back home and add cards first.</Text>
                </ImageBackground>
              )}
            </View>

            {currentCard && !isEditing ? (
              <View style={[styles.browseCardControls, { height: browseControlsHeight }]}> 
                <Pressable accessibilityRole="button" accessibilityLabel="Previous card" testID="browse-session-previous-card-image" onPress={onPreviousCard} style={({ pressed }) => [styles.browseControlSide, pressed && styles.pressed]}>
                  <Image source={browseAssets.previousButton} resizeMode="contain" style={styles.browseControlImage} />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={flipped ? 'Show prompt' : 'Flip card'} testID="browse-session-flip-card-image" onPress={onToggleFlip} style={({ pressed }) => [styles.browseControlFlip, pressed && styles.pressed]}>
                  <Image source={browseAssets.flipButton} resizeMode="contain" style={styles.browseControlImage} />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Next card" testID="browse-session-next-card-image" onPress={onNextCard} style={({ pressed }) => [styles.browseControlSide, pressed && styles.pressed]}>
                  <Image source={browseAssets.nextButton} resizeMode="contain" style={styles.browseControlImage} />
                </Pressable>
              </View>
            ) : null}

            <Image source={browseAssets.noteBar} resizeMode="stretch" style={[styles.browseNoteBar, { height: browseNoteHeight }]} />
          </View>
        </View>

        <Modal visible={isTutorialOpen} animationType="fade" transparent onRequestClose={() => setIsTutorialOpen(false)}>
          <View style={styles.tutorialOverlay}>
            <View style={styles.tutorialCard}>
              <View style={styles.tutorialHeader}>
                <View style={styles.tutorialTitleBlock}>
                  <Text style={styles.tutorialEyebrow}>Beginner guide</Text>
                  <Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.82} numberOfLines={1} style={styles.tutorialTitle}>Spaced repetition basics</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close help"
                  testID="session-close-help"
                  onPress={() => setIsTutorialOpen(false)}
                  style={({ pressed }) => [
                    styles.tutorialCloseButton,
                    useCompactGuideClose && styles.tutorialCloseButtonCompact,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.tutorialCloseText, useCompactGuideClose && styles.tutorialCloseTextCompact]}>
                    {useCompactGuideClose ? '×' : 'Close'}
                  </Text>
                </Pressable>
              </View>
              <SpacedRepetitionGuide />
            </View>
          </View>
        </Modal>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      accessibilityLabel="Review session screen"
      testID="review-session-screen"
      source={folioReviewAssets.background.pagePaper}
      resizeMode="cover"
      style={styles.screen}>
      <View style={[styles.safeArea, { paddingTop: insets.top + 4 }]}> 
        <View style={[styles.pageFrame, { width: pageWidth }]}> 
          <View style={styles.headerRow}> 
            <FolioAssetButton
              source={folioReviewAssets.header.back}
              accessibilityLabel="Go back"
              onPress={onBack}
              style={styles.backButton}
            />

            <Image source={folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark} />

            <View style={styles.headerActions}> 
              <FolioAssetButton
                source={folioReviewAssets.header.undo}
                accessibilityLabel="Undo last review"
                onPress={showUndoButton ? onUndo : undefined}
                style={styles.headerActionButton}
              />
              <FolioAssetButton
                source={folioReviewAssets.header.edit}
                accessibilityLabel="Edit current card"
                onPress={currentCard ? onStartEdit : undefined}
                disabled={!currentCard || !onStartEdit}
                style={styles.headerActionButton}
              />
              <FolioAssetButton
                source={folioReviewAssets.header.help}
                accessibilityLabel="Open help"
                onPress={() => setIsTutorialOpen(true)}
                style={styles.helpButton}
              />
            </View>
          </View>

          <ScrollView
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              (isReviewTiny || isReviewSmall) && styles.scrollContentCompact,
              { gap: reviewContentGap, paddingBottom: isReviewTiny || isReviewSmall ? 4 : 8 },
            ]}
          >
            <DeckSummaryPanel
              deckTitle={deckName ?? 'Deck not found'}
              deckSubtitle={getDeckSubtitle(deckName)}
              dueCount={isBrowseMode ? cardsLength : dueOrVisibleCount}
              totalCards={totalCardsForPanel}
              cardsLeft={dueOrVisibleCount}
              tokens={DEFAULT_SESSION_TOKENS}
              activeTokenIndex={ACTIVE_TOKEN_INDEX}
              layoutScale={reviewLayoutScale}
              placementGrade={flowPlacement?.grade ?? null}
              placementAnimationKey={flowPlacement?.key ?? 0}
            />

            <View style={[styles.cardStage, { minHeight: stackHeight + 4 }]}> 
              {currentCard && isEditing ? (
                <ImageBackground
                  source={folioReviewAssets.card.frontSurface}
                  resizeMode="stretch"
                  style={[styles.editPanel, { minHeight: cardHeight }]}
                  imageStyle={styles.cardImage}
                >
                  <Text style={styles.editTitle}>Edit current card</Text>
                  <TextInput
                    multiline
                    value={editFront}
                    onChangeText={onChangeEditFront}
                    placeholder="Prompt / front"
                    placeholderTextColor="#8A8177"
                    textAlignVertical="top"
                    style={[styles.editInput, styles.editFrontInput]}
                  />
                  <TextInput
                    multiline
                    value={editBack}
                    onChangeText={onChangeEditBack}
                    placeholder="Answer / back"
                    placeholderTextColor="#8A8177"
                    textAlignVertical="top"
                    style={[styles.editInput, styles.editBackInput]}
                  />
                  <View style={styles.editActionRow}>
                    <Pressable accessibilityRole="button" onPress={onCancelEdit} style={({ pressed }) => [styles.editSecondaryButton, pressed && styles.pressed]}>
                      <Text style={styles.editSecondaryButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={onSaveEdit} style={({ pressed }) => [styles.editPrimaryButton, pressed && styles.pressed]}>
                      <Text style={styles.editPrimaryButtonText}>Save changes</Text>
                    </Pressable>
                  </View>
                </ImageBackground>
              ) : currentCard ? (
                <View style={[styles.cardStackWrap, { height: stackHeight }]}> 
                  <Image
                    pointerEvents="none"
                    source={folioReviewAssets.card.stackBackLayers}
                    resizeMode="stretch"
                    style={[styles.cardBackLayers, { height: stackHeight, width: stackWidth }]}
                  />
                  <Animated.View
                    key={currentCard.id}
                    {...panHandlers}
                    style={[
                      styles.animatedCard,
                      {
                        height: cardHeight,
                        width: cardWidth,
                        transform: [
                          { translateX },
                          {
                            rotate: translateX.interpolate({
                              inputRange: [-300, 0, 300],
                              outputRange: ['-8deg', '0deg', '8deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.browseFlipFace,
                        styles.browseFrontFace,
                        { transform: [{ perspective: 1100 }, { rotateY: browseFrontRotation }] },
                      ]}
                    >
                      <ImageBackground
                        source={folioReviewAssets.card.frontSurface}
                        resizeMode="stretch"
                        style={[
                          styles.cardSurface,
                          {
                            paddingBottom: Math.round(16 * reviewCardInteriorScale),
                            paddingHorizontal: Math.round(26 * reviewCardInteriorScale),
                            paddingTop: Math.round(18 * reviewCardInteriorScale),
                          },
                        ]}
                        imageStyle={styles.cardImage}
                      >
                        <View style={[styles.cardTopRow, { minHeight: Math.round(36 * reviewCardInteriorScale) }]}>
                          <Image
                            source={folioReviewAssets.card.favoriteStar}
                            resizeMode="contain"
                            style={[
                              styles.favoriteStar,
                              {
                                height: Math.round(32 * reviewCardInteriorScale),
                                width: Math.round(32 * reviewCardInteriorScale),
                              },
                            ]}
                          />
                          <Text style={[styles.cardProgress, { fontSize: Math.round(23 * reviewCardInteriorScale) }]}>{cardNumberText}</Text>
                        </View>

                        <View style={[styles.cardContent, { paddingBottom: Math.round(14 * reviewCardInteriorScale) }]}>
                          <Text
                            adjustsFontSizeToFit
                            minimumFontScale={0.72}
                            numberOfLines={5}
                            style={[
                              styles.cardText,
                              {
                                fontSize: Math.round(31 * reviewCardInteriorScale),
                                lineHeight: Math.round(38 * reviewCardInteriorScale),
                              },
                            ]}
                          >
                            {currentCard.front}
                          </Text>
                          <Image
                            source={folioReviewAssets.card.questionUnderline}
                            resizeMode="stretch"
                            style={[
                              styles.questionUnderline,
                              {
                                height: Math.max(7, Math.round(10 * reviewCardInteriorScale)),
                                marginTop: Math.round(10 * reviewCardInteriorScale),
                              },
                            ]}
                          />
                          <Image
                            source={folioReviewAssets.card.retrievalGenerationIllustration}
                            resizeMode="contain"
                            style={[
                              styles.cardIllustration,
                              {
                                height: Math.round(70 * reviewCardInteriorScale),
                                marginTop: Math.round(6 * reviewCardInteriorScale),
                              },
                            ]}
                          />
                        </View>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.tapHint,
                            {
                              fontSize: Math.round(18 * reviewCardInteriorScale),
                              lineHeight: Math.round(22 * reviewCardInteriorScale),
                            },
                          ]}
                        >
                          {getCardHint(false)}
                        </Text>
                      </ImageBackground>
                    </Animated.View>
                    <Animated.View
                      style={[
                        styles.browseFlipFace,
                        styles.browseBackFace,
                        { transform: [{ perspective: 1100 }, { rotateY: browseBackRotation }] },
                      ]}
                    >
                      <ImageBackground
                        source={folioReviewAssets.card.frontSurface}
                        resizeMode="stretch"
                        style={[
                          styles.cardSurface,
                          {
                            paddingBottom: Math.round(16 * reviewCardInteriorScale),
                            paddingHorizontal: Math.round(26 * reviewCardInteriorScale),
                            paddingTop: Math.round(18 * reviewCardInteriorScale),
                          },
                        ]}
                        imageStyle={styles.cardImage}
                      >
                        <View style={[styles.cardTopRow, { minHeight: Math.round(36 * reviewCardInteriorScale) }]}>
                          <Image
                            source={folioReviewAssets.card.favoriteStar}
                            resizeMode="contain"
                            style={[
                              styles.favoriteStar,
                              {
                                height: Math.round(32 * reviewCardInteriorScale),
                                width: Math.round(32 * reviewCardInteriorScale),
                              },
                            ]}
                          />
                          <Text style={[styles.cardProgress, { fontSize: Math.round(23 * reviewCardInteriorScale) }]}>{cardNumberText}</Text>
                        </View>

                        <View style={[styles.cardContent, { paddingBottom: Math.round(14 * reviewCardInteriorScale) }]}>
                          <Text
                            adjustsFontSizeToFit
                            minimumFontScale={0.72}
                            numberOfLines={7}
                            style={[
                              styles.cardText,
                              styles.answerText,
                              {
                                fontSize: Math.round(27 * reviewCardInteriorScale),
                                lineHeight: Math.round(34 * reviewCardInteriorScale),
                              },
                            ]}
                          >
                            {currentCard.back}
                          </Text>
                          <Image
                            source={folioReviewAssets.card.questionUnderline}
                            resizeMode="stretch"
                            style={[
                              styles.questionUnderline,
                              {
                                height: Math.max(7, Math.round(10 * reviewCardInteriorScale)),
                                marginTop: Math.round(10 * reviewCardInteriorScale),
                              },
                            ]}
                          />
                        </View>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.tapHint,
                            {
                              fontSize: Math.round(18 * reviewCardInteriorScale),
                              lineHeight: Math.round(22 * reviewCardInteriorScale),
                            },
                          ]}
                        >
                          {getCardHint(true)}
                        </Text>
                      </ImageBackground>
                    </Animated.View>
                  </Animated.View>
                </View>
              ) : (
                <ImageBackground
                  source={folioReviewAssets.card.frontSurface}
                  resizeMode="stretch"
                  style={[styles.emptyState, { minHeight: cardHeight }]}
                  imageStyle={styles.cardImage}
                >
                  <Text style={styles.emptyTitle}>{showGradeButtons ? 'Nothing due right now' : 'No cards in this deck'}</Text>
                  <Text style={styles.emptyText}>
                    {showGradeButtons
                      ? 'New, learning, and due review cards will appear here when they are ready.'
                      : 'Go back home and add cards first.'}
                  </Text>
                </ImageBackground>
              )}
            </View>

            {currentCard && showGradeButtons && !isEditing ? <GradeButtonRow onGrade={handleGradeWithFlowAnimation} layoutScale={reviewLayoutScale} /> : null}

            {currentCard && isBrowseMode && !isEditing ? (
              <View style={styles.browseControls}> 
                <NavigateButton label="‹ Previous" accessibilityLabel="Previous card" testID="session-previous-card" onPress={onPreviousCard} />
                <NavigateButton label={flipped ? 'Prompt' : 'Flip card'} accessibilityLabel={flipped ? 'Show prompt' : 'Flip card'} testID="session-flip-card" onPress={onToggleFlip} />
                <NavigateButton label="Next ›" accessibilityLabel="Next card" testID="session-next-card" onPress={onNextCard} />
                {cardSearch?.trim() ? <Text style={styles.browseSearchNote}>Search: {cardSearch.trim()}</Text> : null}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>

      <Modal visible={isTutorialOpen} animationType="fade" transparent onRequestClose={() => setIsTutorialOpen(false)}>
        <View style={styles.tutorialOverlay}>
          <View style={styles.tutorialCard}>
            <View style={styles.tutorialHeader}>
              <View style={styles.tutorialTitleBlock}>
                <Text style={styles.tutorialEyebrow}>Beginner guide</Text>
                <Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.82} numberOfLines={1} style={styles.tutorialTitle}>Spaced repetition basics</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close help"
                testID="session-close-help"
                onPress={() => setIsTutorialOpen(false)}
                style={({ pressed }) => [
                  styles.tutorialCloseButton,
                  useCompactGuideClose && styles.tutorialCloseButtonCompact,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.tutorialCloseText, useCompactGuideClose && styles.tutorialCloseTextCompact]}>
                  {useCompactGuideClose ? '×' : 'Close'}
                </Text>
              </Pressable>
            </View>
            <SpacedRepetitionGuide />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  pageFrame: {
    flex: 1,
  },
  browsePageFrame: {
    flex: 1,
    gap: 7,
  },
  panelImage: {
    resizeMode: 'stretch',
  },
  browseHeaderActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'flex-end',
    marginRight: 4,
  },
  browseDeckPanel: {
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'visible',
    paddingHorizontal: 24,
  },
  browseDeckIcon: {
    height: 68,
    marginRight: 16,
    width: 68,
  },
  browseDeckTextBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  browseDeckTitle: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 27,
    fontWeight: '400',
    lineHeight: 32,
  },
  browseDeckSubtitle: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 28,
  },
  browseDeckModeText: {
    color: '#766F65',
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 3,
  },
  browseDeckModeBlue: {
    color: '#0C73DB',
  },
  browseMatchPanel: {
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'visible',
    paddingHorizontal: 18,
  },
  browseSearchIcon: {
    height: 34,
    marginRight: 8,
    width: 34,
  },
  browseMatchCopy: {
    flex: 1.15,
    justifyContent: 'center',
    minWidth: 138,
  },
  browseMatchTitle: {
    color: '#0C73DB',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 14.5,
    fontWeight: '400',
    lineHeight: 18,
  },
  browseMatchSearch: {
    color: '#766F65',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 13.5,
    fontWeight: '400',
    lineHeight: 17,
  },
  browseMiniFlow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    transform: [{ translateY: 7 }],
  },
  browseMiniTokenWrap: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    marginLeft: -1,
    position: 'relative',
    width: 14,
  },
  browseMiniRays: {
    height: 10,
    position: 'absolute',
    top: 1,
    width: 12,
  },
  browseMiniToken: {
    height: 19,
    width: 12,
  },
  browseMiniTriangle: {
    bottom: 2,
    height: 6,
    position: 'absolute',
    width: 8,
  },
  browseFlipFace: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  browseFrontFace: {
    zIndex: 2,
  },
  browseBackFace: {
    zIndex: 1,
  },
  browseCardSurface: {
    flex: 1,
    paddingBottom: 14,
    paddingHorizontal: 26,
    paddingTop: 17,
  },
  browseCardContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 12,
  },
  browseCardText: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 30,
    fontWeight: '400',
    lineHeight: 37,
    textAlign: 'center',
  },
  browseCardIllustration: {
    height: 72,
    marginTop: 5,
    width: '62%',
  },
  browseCardControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  browseControlSide: {
    flex: 1,
    height: '100%',
    overflow: 'visible',
  },
  browseControlFlip: {
    flex: 1.55,
    height: '100%',
    overflow: 'visible',
  },
  browseControlImage: {
    height: '100%',
    overflow: 'visible',
    width: '100%',
  },
  browseNoteBar: {
    marginTop: -2,
    width: '100%',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    height: 50,
    width: 50,
  },
  wordmark: {
    flex: 1,
    height: 52,
    marginHorizontal: 3,
    maxWidth: 134,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'flex-end',
    marginRight: 4,
  },
  headerActionButton: {
    height: 43,
    width: 43,
  },
  helpButton: {
    height: 43,
    width: 43,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 7,
  },
  scrollContentCompact: {
    gap: 6,
  },
  cardStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  cardStackWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  cardBackLayers: {
    bottom: 0,
    opacity: 1,
    position: 'absolute',
  },
  animatedCard: {
    alignSelf: 'center',
    overflow: 'visible',
    position: 'absolute',
    top: 0,
  },
  cardSurface: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 16,
  },
  cardImage: {
    resizeMode: 'stretch',
  },
  cardTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  favoriteStar: {
    height: 32,
    width: 32,
  },
  cardProgress: {
    color: '#766F65',
    fontSize: 23,
    fontWeight: '800',
  },
  cardContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 14,
  },
  cardText: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 31,
    fontWeight: '400',
    lineHeight: 38,
    textAlign: 'center',
  },
  answerText: {
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 27,
    fontWeight: '400',
    lineHeight: 34,
  },
  questionUnderline: {
    height: 10,
    marginTop: 10,
    width: '58%',
  },
  cardIllustration: {
    height: 70,
    marginTop: 6,
    width: '62%',
  },
  tapHint: {
    color: '#8A8177',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 22,
    textAlign: 'center',
  },
  editPanel: {
    alignSelf: 'stretch',
    gap: 10,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 22,
  },
  editTitle: {
    color: '#2E6FB8',
    fontSize: 20,
    fontWeight: '900',
  },
  editInput: {
    backgroundColor: 'rgba(255, 252, 245, 0.82)',
    borderColor: '#D6CABB',
    borderRadius: 14,
    borderWidth: 1,
    color: '#26211C',
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  editFrontInput: {
    minHeight: 88,
  },
  editBackInput: {
    minHeight: 112,
  },
  editActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editSecondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFF9EC',
    borderColor: '#D6CABB',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  editSecondaryButtonText: {
    color: '#766F65',
    fontWeight: '800',
  },
  editPrimaryButton: {
    alignItems: 'center',
    backgroundColor: '#EAF6E4',
    borderColor: '#90B96F',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1.3,
    justifyContent: 'center',
    minHeight: 44,
  },
  editPrimaryButtonText: {
    color: '#3E7E2D',
    fontWeight: '900',
  },
  emptyState: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    padding: 26,
  },
  emptyTitle: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 28,
    fontWeight: '400',
    textAlign: 'center',
  },
  emptyText: {
    color: '#766F65',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  browseControls: {
    gap: 8,
    marginTop: 6,
  },
  browseButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 246, 255, 0.72)',
    borderColor: '#65A6DE',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  browseButtonText: {
    color: '#0C73DB',
    fontSize: 15,
    fontWeight: '900',
  },
  browseSearchNote: {
    color: '#766F65',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  bottomNavWrap: {
    alignSelf: 'center',
    flexShrink: 0,
    marginTop: -4,
  },
  tutorialOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(42, 36, 31, 0.34)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 28,
  },
  tutorialCard: {
    backgroundColor: '#FFF9EC',
    borderColor: '#D8C8A9',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    maxHeight: '92%',
    maxWidth: 520,
    padding: 16,
    width: '100%',
  },
  tutorialHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  tutorialTitleBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 2,
  },
  tutorialEyebrow: {
    color: '#7A6D5E',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  tutorialTitle: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 25,
    fontWeight: '400',
    lineHeight: 31,
  },
  tutorialCloseButton: {
    alignItems: 'center',
    backgroundColor: '#FFF4D8',
    borderColor: '#E7A93B',
    borderRadius: 14,
    borderWidth: 1,
    flexShrink: 0,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 14,
  },
  tutorialCloseButtonCompact: {
    borderRadius: 999,
    height: 36,
    minHeight: 36,
    paddingHorizontal: 0,
    width: 36,
  },
  tutorialCloseText: {
    color: '#D98200',
    fontWeight: '900',
  },
  tutorialCloseTextCompact: {
    fontSize: 24,
    lineHeight: 27,
    textAlign: 'center',
  },
  tutorialGuideScroll: {
    width: '100%',
  },
  tutorialGuideContent: {
    gap: 12,
    paddingBottom: 4,
  },
  guideSection: {
    backgroundColor: 'rgba(255, 252, 245, 0.82)',
    borderColor: '#D8C8A9',
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  guideSectionTitle: {
    color: '#332A24',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 27,
  },
  guideBody: {
    color: '#3D342E',
    flexShrink: 1,
    fontSize: 15.5,
    fontWeight: '700',
    lineHeight: 21,
  },
  guideBulletRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 9,
  },
  guideBulletDot: {
    borderRadius: 999,
    height: 10,
    marginTop: 6,
    width: 10,
  },
  guideCallout: {
    backgroundColor: '#FFF4D8',
    borderColor: '#D8C8A9',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  guideCalloutText: {
    color: '#6F6255',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  guideStepRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  guideStepNumber: {
    alignItems: 'center',
    backgroundColor: '#FFF4D8',
    borderColor: '#E7C16E',
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    marginTop: -1,
    width: 28,
  },
  guideStepNumberText: {
    color: '#6B5837',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  guideBoxIcon: {
    alignSelf: 'center',
    height: 76,
    marginVertical: -1,
    width: 112,
  },
  guideFooter: {
    color: '#7A6D5E',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});

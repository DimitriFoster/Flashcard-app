import { useEffect, useRef } from 'react';
import { ImageBackground, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { folioReviewAssets } from '@/folio-review/folioReviewAssets';
import type { ReviewDeckSummary } from '@/lib/review-deck-summary';
import { BrowseCardStack, DeckBook, ReviewArrow, ReviewPlay } from './review-due-art';
import { styles } from './review-due-page.styles';

const yellow = require('../../../assets/folio-ui/browse-selection/textures/crayon_texture_yellow.png');
const mint = require('../../../assets/folio-ui/browse-selection/textures/crayon_texture_mint.png');

type Props = {
  summary: ReviewDeckSummary;
  choosingDeck: boolean;
  onStart: () => void;
  onOpenDeck: (id: string) => void;
  onHome: () => void;
  onBrowse: () => void;
  onStats: () => void;
};

export function ReviewDuePage({ summary, choosingDeck, onStart, onOpenDeck, onHome, onBrowse, onStats }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const narrow = width < 360;
  const scroll = useRef<ScrollView>(null);
  const deckSectionY = useRef(0);
  const canStart = summary.totalDue > 0;

  useEffect(() => {
    if (choosingDeck) scroll.current?.scrollTo({ y: deckSectionY.current, animated: true });
  }, [choosingDeck]);

  return (
    <ImageBackground source={folioReviewAssets.background.pagePaper} resizeMode="cover" imageStyle={styles.paperImage} style={styles.screen}>
      <ScrollView
        ref={scroll}
        accessibilityLabel="Review due cards screen"
        testID="review-index-screen"
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <View style={[styles.page, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.header}>
            <View style={styles.headerNav}>
              <Pressable accessibilityRole="button" accessibilityLabel="Back home" onPress={onHome} testID="review-index-home" style={({ pressed }) => [styles.home, pressed && styles.pressed]}>
                <ReviewArrow back color="#34312A" small />
                <Text style={styles.homeText}>Back home</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Review stats" onPress={onStats} testID="review-index-stats" style={({ pressed }) => [styles.stats, pressed && styles.pressed]}>
                <Text style={styles.statsText}>Stats</Text>
              </Pressable>
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>REVIEW</Text>
              <Text accessibilityRole="header" style={styles.title}>Due Cards</Text>
              <Text style={styles.subtitle}>Cards that are ready for review.</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Start review, ${summary.totalDue} ${summary.totalDue === 1 ? 'card' : 'cards'} due now`}
            accessibilityHint={canStart ? 'Opens a due deck or lets you choose one to review' : 'No cards are currently due'}
            accessibilityState={{ disabled: !canStart }}
            disabled={!canStart}
            onPress={onStart}
            testID="review-index-start"
            style={({ pressed }) => [styles.action, !canStart && styles.disabledAction, pressed && styles.pressed]}>
            {canStart ? <HomePanelFill source={yellow} opacity={0.8} /> : null}
            <View style={[styles.actionContent, narrow && styles.compactAction]}>
              <ReviewPlay disabled={!canStart} />
              <View style={styles.actionCopy}>
                <Text style={[styles.actionTitle, narrow && styles.compactActionTitle, !canStart && styles.disabledText]}>Start Review</Text>
                <Text style={[styles.actionSubtitle, !canStart && styles.disabledText]}>
                  {canStart ? `${summary.totalDue} ${summary.totalDue === 1 ? 'card' : 'cards'} due now.` : 'No cards due right now.'}
                </Text>
              </View>
              <ReviewArrow color={canStart ? '#886616' : '#8A8271'} />
            </View>
          </Pressable>

          <View style={styles.decks} onLayout={({ nativeEvent }) => { deckSectionY.current = nativeEvent.layout.y; }}>
            <View style={styles.sectionHeading}>
              <Text accessibilityRole="header" style={styles.sectionLabel}>{choosingDeck && canStart ? 'CHOOSE A DECK' : 'DECKS'}</Text>
              <View style={styles.divider} />
            </View>
            {choosingDeck && canStart ? <Text accessibilityLiveRegion="polite" style={styles.chooseHint}>Tap a deck below to start its review.</Text> : null}
            {summary.decks.map(({ deck, dueCount }) => (
              <Pressable
                key={deck.id}
                accessibilityRole="button"
                accessibilityLabel={`Review ${deck.name}, ${dueCount} ${dueCount === 1 ? 'card' : 'cards'} due`}
                onPress={() => onOpenDeck(deck.id)}
                testID={`review-index-open-deck-${deck.id}`}
                style={({ pressed }) => [styles.deckRow, !dueCount && styles.deckRowQuiet, narrow && styles.compactRow, pressed && styles.pressed]}>
                <DeckBook deckId={deck.id} />
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.deckName, narrow && styles.compactName, !dueCount && styles.quietText]}>{deck.name}</Text>
                <View style={styles.countPill}><Text style={[styles.count, !dueCount && styles.quietText]}>{dueCount} due</Text></View>
                <ReviewArrow small color={dueCount ? '#494539' : '#9D9687'} />
              </Pressable>
            ))}
            {!summary.decks.length ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>A little space to begin.</Text>
                <Text style={styles.emptyText}>Create your first deck, then come back when you are ready to review.</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Create cards" testID="review-index-create-cards" onPress={onHome} style={styles.create}>
                  <Text style={styles.createText}>Create a deck</Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel="Browse decks" onPress={onBrowse} testID="review-index-browse-decks" style={({ pressed }) => [styles.action, styles.browse, pressed && styles.pressed]}>
            <HomePanelFill source={mint} opacity={0.65} />
            <View style={[styles.actionContent, narrow && styles.compactAction]}>
              <BrowseCardStack />
              <View style={styles.actionCopy}>
                <Text style={[styles.actionTitle, narrow && styles.compactActionTitle]}>Browse Decks</Text>
                <Text style={[styles.actionSubtitle, styles.browseSubtitle]}>Explore and study any deck.</Text>
              </View>
              <ReviewArrow color="#326B50" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

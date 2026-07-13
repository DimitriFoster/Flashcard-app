import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AppState,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';
import { FolioAssetButton } from '@/folio-review/FolioAssetButton';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import { folioReviewAssets } from '@/folio-review/folioReviewAssets';
import {
  canRestartReviewSession,
  summarizeSessionRecap,
  type ReviewGradeCounts,
  type SessionRecapSection,
  type SessionRecapSummary,
} from '@/lib/session-recap';
import { getFlashcardsByDeck, getReviewLogs } from '@/storage/flashcards';
import type { ReviewGrade } from '@/types/flashcard';

const reviewPanelSwatch = require('../../../assets/folio-ui/home-page/swatches/home_review_panel_swatch.png');

type SessionRecapProps = {
  deckId: string;
  deckName?: string;
  reviewedCount: number;
  uniqueReviewedCount: number;
  gradeCounts: ReviewGradeCounts;
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
  onBackToReview: () => void;
};

const gradeLabels: { grade: ReviewGrade; label: string }[] = [
  { grade: 'again', label: 'Again' },
  { grade: 'hard', label: 'Hard' },
  { grade: 'good', label: 'Good' },
  { grade: 'easy', label: 'Easy' },
];

function countLabel(count: number) {
  return `${count} ${count === 1 ? 'card' : 'cards'}`;
}

function getInitialSummary(deckId: string): SessionRecapSummary {
  return summarizeSessionRecap(deckId, getFlashcardsByDeck(deckId), {
    now: new Date(),
    reviewLogs: getReviewLogs(),
  });
}

function SectionRow({ section }: { section: SessionRecapSection }) {
  return (
    <View
      accessible
      accessibilityLabel={`${section.label}, ${countLabel(section.count)}, ${section.detail}`}
      style={styles.sectionRow}
    >
      <View style={styles.sectionLabelWrap}>
        <Text style={styles.sectionLabel}>{section.label}</Text>
        <View style={styles.sectionUnderline} />
      </View>
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionCount}>{countLabel(section.count)}</Text>
        <Text style={styles.sectionDetail}>{section.detail}</Text>
      </View>
    </View>
  );
}

export function SessionRecap({
  deckId,
  deckName = 'this deck',
  reviewedCount,
  uniqueReviewedCount,
  gradeCounts,
  canUndo,
  onUndo,
  onRestart,
  onBackToReview,
}: SessionRecapProps) {
  const [summary, setSummary] = useState<SessionRecapSummary>(() => getInitialSummary(deckId));

  const refresh = useCallback(() => {
    const now = new Date();
    setSummary(
      summarizeSessionRecap(deckId, getFlashcardsByDeck(deckId), {
        now,
        reviewLogs: getReviewLogs(),
      }),
    );
  }, [deckId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    const refreshTimer = setInterval(refresh, 30_000);
    return () => clearInterval(refreshTimer);
  }, [refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refresh();
      }
    });

    return () => subscription.remove();
  }, [refresh]);

  const currentDueCount = summary.currentDueCount;
  const canRestart = canRestartReviewSession(currentDueCount);
  const restartLabel = canRestart ? `Restart session - ${currentDueCount} due` : 'No cards due yet';
  const recapLabel = `Session complete recap for ${deckName}`;

  return (
    <ImageBackground
      accessible
      accessibilityLabel={recapLabel}
      source={folioReviewAssets.background.pagePaper}
      resizeMode="cover"
      style={styles.screen}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.frame}>
          <View style={styles.header}>
            <FolioAssetButton
              source={folioReviewAssets.header.back}
              accessibilityLabel="Back to Review"
              testID="session-recap-back-header"
              onPress={onBackToReview}
              style={styles.backButton}
            />
            <Image source={folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark} />
            <FolioAssetButton
              source={folioReviewAssets.header.undo}
              accessibilityLabel="Undo last review"
              testID="session-recap-undo"
              disabled={!canUndo}
              onPress={canUndo ? onUndo : undefined}
              style={styles.undoButton}
            />
          </View>

          <ScrollView
            accessibilityLabel="Completed session recap"
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.recapHeader}>
              <HomePanelFill source={reviewPanelSwatch} opacity={1} />
              <View style={styles.recapHeaderContent}>
                <Text style={styles.eyebrow}>SESSION COMPLETE</Text>
                <Text style={styles.title}>Nice work.</Text>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={styles.supportingLine}
                >
                  You reviewed {countLabel(reviewedCount)} from {deckName}.
                </Text>
                {uniqueReviewedCount !== reviewedCount ? (
                  <Text style={styles.uniqueLine}>{uniqueReviewedCount} unique cards in this session</Text>
                ) : null}

                <View style={styles.gradeSummary} accessibilityLabel="Session grade totals">
                  {gradeLabels.map(({ grade, label }) => (
                    <View key={grade} style={styles.gradeItem}>
                      <Text style={styles.gradeCount}>{gradeCounts[grade]}</Text>
                      <Text style={styles.gradeLabel}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.schedulePanel} accessibilityLabel="Upcoming scheduling sections">
              <Text style={styles.scheduleTitle}>What happens next</Text>
              <Text style={styles.scheduleSubtitle}>Your cards are sorted by their next step.</Text>
              <View
                accessible
                accessibilityLabel={`Recommended next study: ${summary.recommendedNextStudy}`}
                style={styles.recommendation}
              >
                <Text style={styles.recommendationLabel}>
                  Recommended next study: {summary.recommendedNextStudy}
                </Text>
                {summary.recommendedNextStudyCardCount > 0 ? (
                  <Text style={styles.recommendationCount}>
                    {countLabel(summary.recommendedNextStudyCardCount)} will be ready.
                  </Text>
                ) : null}
              </View>
              <View style={styles.sectionList}>
                {summary.sections.map((section) => (
                  <SectionRow key={section.key} section={section} />
                ))}
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={restartLabel}
              accessibilityState={{ disabled: !canRestart }}
              testID="session-recap-restart"
              disabled={!canRestart}
              onPress={onRestart}
              style={({ pressed }) => [styles.restartButton, !canRestart && styles.disabledButton, pressed && canRestart && styles.pressed]}
            >
              {canRestart ? <HomePanelFill source={reviewPanelSwatch} opacity={1} /> : null}
              <View style={styles.restartButtonContent}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={[styles.restartButtonText, !canRestart && styles.disabledButtonText]}
                >
                  {restartLabel}
                </Text>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Review"
              testID="session-recap-back"
              onPress={onBackToReview}
              style={({ pressed }) => [styles.backToReviewButton, pressed && styles.pressed]}
            >
              <Text style={styles.backToReviewText}>Back to Review</Text>
            </Pressable>
          </ScrollView>
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
  },
  frame: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 64,
  },
  backButton: {
    height: 58,
    width: 58,
  },
  undoButton: {
    height: 51,
    width: 51,
  },
  wordmark: {
    height: 42,
    width: 150,
  },
  content: {
    gap: SPACING.md,
    paddingBottom: 24,
  },
  recapHeader: {
    backgroundColor: COLORS.reviewPaper,
    borderColor: COLORS.reviewCrayon,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    minHeight: 236,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 22,
    position: 'relative',
    width: '100%',
    ...SHADOWS.card,
  },
  recapHeaderContent: {
    flex: 1,
    flexShrink: 1,
    maxWidth: '100%',
    minWidth: 0,
    width: '100%',
  },
  eyebrow: {
    color: COLORS.reviewDeep,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  title: {
    color: COLORS.ink,
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 38,
    lineHeight: 44,
    marginTop: 3,
  },
  supportingLine: {
    color: COLORS.ink,
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 23,
    maxWidth: '100%',
    marginTop: 5,
  },
  uniqueLine: {
    color: COLORS.muted,
    flexShrink: 1,
    fontSize: 13,
    maxWidth: '100%',
    marginTop: 4,
  },
  gradeSummary: {
    borderTopColor: COLORS.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 12,
  },
  gradeItem: {
    alignItems: 'center',
    minWidth: 52,
  },
  gradeCount: {
    color: COLORS.reviewDeep,
    fontSize: 20,
    fontWeight: '900',
  },
  gradeLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },
  schedulePanel: {
    backgroundColor: 'rgba(255, 254, 248, 0.9)',
    borderColor: COLORS.line,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 18,
    ...SHADOWS.soft,
  },
  scheduleTitle: {
    color: COLORS.ink,
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 24,
  },
  scheduleSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 2,
  },
  recommendation: {
    backgroundColor: 'rgba(245, 235, 204, 0.72)',
    borderColor: COLORS.line,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  recommendationLabel: {
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  recommendationCount: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 3,
  },
  sectionList: {
    marginTop: 8,
  },
  sectionRow: {
    alignItems: 'center',
    borderTopColor: COLORS.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 57,
    paddingVertical: 9,
  },
  sectionLabelWrap: {
    width: 68,
  },
  sectionLabel: {
    color: COLORS.reviewDeep,
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 18,
  },
  sectionUnderline: {
    backgroundColor: COLORS.reviewCrayon,
    height: 2,
    marginTop: 1,
    width: 31,
  },
  sectionCopy: {
    flex: 1,
    paddingLeft: 8,
  },
  sectionCount: {
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  sectionDetail: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  restartButton: {
    alignItems: 'center',
    backgroundColor: COLORS.reviewPaper,
    borderColor: COLORS.reviewCrayon,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 54,
    overflow: 'hidden',
    paddingHorizontal: 18,
    position: 'relative',
    width: '100%',
    ...SHADOWS.soft,
  },
  restartButtonContent: {
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: '100%',
    minWidth: 0,
    paddingVertical: 2,
  },
  restartButtonText: {
    color: COLORS.reviewDeep,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '900',
    maxWidth: '100%',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.line,
  },
  disabledButtonText: {
    color: COLORS.muted,
  },
  backToReviewButton: {
    alignItems: 'center',
    borderColor: COLORS.reviewCrayon,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  backToReviewText: {
    color: COLORS.reviewDeep,
    fontSize: 15,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
});

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, ImageBackground, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { AnimatedFlashcard } from './AnimatedFlashcard';
import { BottomTabBar } from './BottomTabBar';
import { DeckSummaryPanel } from './DeckSummaryPanel';
import { FolioAssetButton } from './FolioAssetButton';
import { folioReviewAssets } from './folioReviewAssets';
import { GradeButtonRow } from './GradeButtonRow';
import { applyAndroidImmersiveNavigation } from '@/hooks/use-android-immersive-navigation';
import { FolioReviewScreenProps, SessionTokenStatus } from './types';

const DEFAULT_TOKENS: SessionTokenStatus[] = [
  'new',
  'new',
  'new',
  'again',
  'hard',
  'good',
  'good',
  'empty',
  'empty',
  'empty',
  'good',
  'easy',
  'again',
  'hard',
  'new',
];

export function FolioReviewScreen({
  deckTitle,
  deckSubtitle = 'Master Deck',
  dueCount,
  totalCards,
  cardsLeft,
  currentCardNumber,
  sessionTotalCards,
  card,
  sessionTokens = DEFAULT_TOKENS,
  activeTokenIndex = 6,
  onBack,
  onUndo,
  onEdit,
  onHelp,
  onGrade,
  onNavigateTab,
}: FolioReviewScreenProps) {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return;
      }

      const delays = [0, 150, 500, 1200, 2500];
      const timers = delays.map((delay) =>
        setTimeout(() => {
          void applyAndroidImmersiveNavigation();
        }, delay),
      );

      return () => {
        timers.forEach(clearTimeout);
      };
    }, []),
  );

  return (
    <ImageBackground source={folioReviewAssets.background.pagePaper} resizeMode="cover" style={styles.screen} onLayout={() => void applyAndroidImmersiveNavigation()}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.pageInner}>
          <View style={styles.headerRow}>
            <FolioAssetButton source={folioReviewAssets.header.back} accessibilityLabel="Back" onPress={onBack} style={styles.backButton} />
            <Image source={folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark} />
            <View style={styles.headerActions}>
              <FolioAssetButton source={folioReviewAssets.header.undo} accessibilityLabel="Undo last answer" onPress={onUndo} style={styles.actionButton} />
              <FolioAssetButton source={folioReviewAssets.header.edit} accessibilityLabel="Edit current card" onPress={onEdit} style={styles.actionButton} />
              <FolioAssetButton source={folioReviewAssets.header.help} accessibilityLabel="Help" onPress={onHelp} style={styles.helpButton} />
            </View>
          </View>

          <DeckSummaryPanel
            deckTitle={deckTitle}
            deckSubtitle={deckSubtitle}
            dueCount={dueCount}
            totalCards={totalCards}
            cardsLeft={cardsLeft}
            tokens={sessionTokens}
            activeTokenIndex={activeTokenIndex}
          />

          <AnimatedFlashcard card={card} currentCardNumber={currentCardNumber} sessionTotalCards={sessionTotalCards} />
          <GradeButtonRow onGrade={onGrade} />
          <View style={styles.navSpacer} />
        </View>
        <View style={styles.navWrap}>
          <BottomTabBar onNavigateTab={onNavigateTab} />
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
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  pageInner: {
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 430,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    height: 58,
    width: 58,
  },
  wordmark: {
    flex: 1,
    height: 62,
    marginHorizontal: 6,
    maxWidth: 132,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  actionButton: {
    height: 51,
    width: 51,
  },
  helpButton: {
    height: 52,
    width: 52,
  },
  navSpacer: {
    flex: 1,
    minHeight: 8,
  },
  navWrap: {
    alignSelf: 'center',
    marginBottom: Platform.OS === 'android' ? 8 : 0,
    paddingHorizontal: 8,
    width: '100%',
    maxWidth: 430,
  },
});

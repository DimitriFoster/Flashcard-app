import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { applyAndroidImmersiveNavigation } from '@/hooks/use-android-immersive-navigation';
import { BottomTabBar } from '@/folio-review/BottomTabBar';
import { FolioAssetButton } from '@/folio-review/FolioAssetButton';
import type { FolioTab } from '@/folio-review/types';

import { BrowseFlashcard } from './BrowseFlashcard';
import { folioBrowseAssets } from './folioBrowseAssets';

type Props = {
  question: string;
  answer: string;
  currentCardNumber: number;
  totalCards: number;
  revealed: boolean;
  onToggleReveal: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onBack?: () => void;
  onUndo?: () => void;
  onEdit?: () => void;
  onHelp?: () => void;
  onNavigateTab?: (tab: FolioTab) => void;
};

export function FolioBrowseScreen({
  answer,
  currentCardNumber,
  onBack,
  onEdit,
  onHelp,
  onNavigateTab,
  onNext,
  onPrevious,
  onToggleReveal,
  onUndo,
  question,
  revealed,
  totalCards,
}: Props) {
  useFocusEffect(
    useCallback(() => {
      const delays = [0, 150, 500, 1200];
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
    <ImageBackground source={folioBrowseAssets.background.pagePaper} resizeMode="cover" style={styles.screen} onLayout={() => void applyAndroidImmersiveNavigation()}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageInner}>
          <View style={styles.headerRow}>
            <FolioAssetButton source={folioBrowseAssets.header.back} accessibilityLabel="Back" onPress={onBack} style={styles.backButton} />
            <Image source={folioBrowseAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark} />
            <View style={styles.headerActions}>
              <FolioAssetButton source={folioBrowseAssets.header.undo} accessibilityLabel="Undo" onPress={onUndo} style={styles.actionButton} />
              <FolioAssetButton source={folioBrowseAssets.header.edit} accessibilityLabel="Edit" onPress={onEdit} style={styles.actionButton} />
              <FolioAssetButton source={folioBrowseAssets.header.help} accessibilityLabel="Help" onPress={onHelp} style={styles.helpButton} />
            </View>
          </View>

          <Image source={folioBrowseAssets.topPanel} resizeMode="stretch" style={styles.topPanel} />
          <Image source={folioBrowseAssets.matchesStrip} resizeMode="stretch" style={styles.matchesStrip} />

          <BrowseFlashcard
            answer={answer}
            currentCardNumber={currentCardNumber}
            onToggleReveal={onToggleReveal}
            question={question}
            revealed={revealed}
            totalCards={totalCards}
          />

          <View style={styles.controlsRow}>
            <Pressable accessibilityLabel="Previous card" accessibilityRole="button" onPress={onPrevious} style={({ pressed }) => [styles.sideControl, pressed && styles.pressed]}>
              <Image source={folioBrowseAssets.controls.previous} resizeMode="stretch" style={styles.sideControlImage} />
            </Pressable>
            <Pressable accessibilityLabel={revealed ? 'Show prompt' : 'Flip card'} accessibilityRole="button" onPress={onToggleReveal} style={({ pressed }) => [styles.flipControl, pressed && styles.pressed]}>
              <Image source={folioBrowseAssets.controls.flip} resizeMode="stretch" style={styles.flipControlImage} />
            </Pressable>
            <Pressable accessibilityLabel="Next card" accessibilityRole="button" onPress={onNext} style={({ pressed }) => [styles.sideControl, pressed && styles.pressed]}>
              <Image source={folioBrowseAssets.controls.next} resizeMode="stretch" style={styles.sideControlImage} />
            </Pressable>
          </View>

          <Image source={folioBrowseAssets.footer.noteBar} resizeMode="stretch" style={styles.noteBar} />
          <View style={styles.bottomNavWrap}>
            <BottomTabBar activeTab="browse" onNavigateTab={onNavigateTab} />
          </View>
        </View>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 18,
  },
  pageInner: {
    alignSelf: 'center',
    maxWidth: 430,
    paddingHorizontal: 16,
    width: '100%',
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
  topPanel: {
    height: 118,
    marginTop: 6,
    width: '100%',
  },
  matchesStrip: {
    height: 86,
    marginTop: 10,
    width: '100%',
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  sideControl: {
    flex: 1,
    height: 70,
    overflow: 'visible',
  },
  sideControlImage: {
    height: '100%',
    overflow: 'visible',
    width: '100%',
  },
  flipControl: {
    flex: 1.58,
    height: 74,
    overflow: 'visible',
  },
  flipControlImage: {
    height: '100%',
    overflow: 'visible',
    width: '100%',
  },
  noteBar: {
    height: 56,
    marginTop: 14,
    width: '100%',
  },
  bottomNavWrap: {
    marginTop: 10,
    width: '100%',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { COLORS, RADIUS, SHADOWS } from '@/constants/design';

const reviewIcon = require('../../../assets/folio-ui/home-page/home_review_icon.png');
const homeArrowIcon = require('../../../assets/folio-ui/home-page/home_arrow_icon.png');
const reviewPanelSwatch = require('../../../assets/folio-ui/home-page/swatches/home_review_panel_swatch.png');

type HomeReviewSectionProps = {
  onPressReview: () => void;
};

export function HomeReviewSection({ onPressReview }: HomeReviewSectionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open review workspace"
      testID="home-review-section"
      onPress={onPressReview}
      style={({ pressed }) => [styles.section, pressed && styles.pressed]}>
      <HomePanelFill source={reviewPanelSwatch} opacity={1} />

      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Image source={reviewIcon} style={styles.icon} resizeMode="contain" />
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.title}>review</Text>
          <Text style={styles.subtitle}>Jump into spaced repetition{`\n`}when you’re ready.</Text>
        </View>

        <Image
          source={homeArrowIcon}
          style={[styles.arrow, { tintColor: COLORS.reviewDeep }]}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 118,
    borderRadius: RADIUS.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.reviewPaper,
    borderWidth: 1,
    borderColor: COLORS.reviewCrayon,
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    width: 56,
    height: 56,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#2839C7',
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.reviewDeep,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  arrow: {
    width: 26,
    height: 26,
    flexShrink: 0,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});

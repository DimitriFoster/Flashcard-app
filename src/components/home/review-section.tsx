import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { COLORS, RADIUS, SHADOWS } from '@/constants/design';

const reviewIcon = require('../../../assets/folio-ui/home-page/home_review_icon.png');
const homeArrowIcon = require('../../../assets/folio-ui/home-page/home_arrow_icon.png');
const reviewPanelSwatch = require('../../../assets/folio-ui/home-page/swatches/home_review_panel_swatch.png');

type HomeReviewSectionProps = {
  onPressReview: () => void;
  tabletLayout?: boolean;
};

export function HomeReviewSection({ onPressReview, tabletLayout = false }: HomeReviewSectionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open review workspace"
      testID="home-review-section"
      onPress={onPressReview}
      style={({ pressed }) => [styles.section, tabletLayout && styles.sectionTablet, pressed && styles.pressed]}>
      <HomePanelFill source={reviewPanelSwatch} opacity={1} />

      {tabletLayout ? (
        <View style={[styles.row, styles.rowTablet]}>
          <View style={styles.tabletTitleLine}>
            <Image source={reviewIcon} style={styles.tabletInlineIcon} resizeMode="contain" />
            <Text style={[styles.title, styles.titleTablet]}>review</Text>
          </View>
          <Text style={[styles.subtitle, styles.subtitleTablet]}>Jump into spaced repetition when you’re ready.</Text>
        </View>
      ) : (
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
      )}
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
  sectionTablet: {
    alignItems: 'center',
    minHeight: 108,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTablet: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6,
  },
  tabletTitleLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  tabletInlineIcon: {
    width: 42,
    height: 42,
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
  titleTablet: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.reviewDeep,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  subtitleTablet: {
    maxWidth: 340,
    textAlign: 'center',
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

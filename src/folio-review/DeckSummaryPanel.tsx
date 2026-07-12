import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { folioReviewAssets } from './folioReviewAssets';
import { FOLIO_HAND_FONT } from './folioFonts';
import { SessionFlowStrip } from './SessionFlowStrip';
import { ReviewGrade, SessionTokenStatus } from './types';

type Props = {
  deckTitle: string;
  deckSubtitle?: string;
  dueCount: number;
  totalCards: number;
  cardsLeft: number;
  tokens: SessionTokenStatus[];
  activeTokenIndex: number;
  layoutScale?: number;
  placementGrade?: ReviewGrade | null;
  placementAnimationKey?: number;
};

export function DeckSummaryPanel({
  deckTitle,
  deckSubtitle = 'Master Deck',
  dueCount,
  totalCards,
  cardsLeft,
  tokens,
  activeTokenIndex,
  layoutScale = 1,
  placementGrade = null,
  placementAnimationKey = 0,
}: Props) {
  const scale = Math.max(0.72, Math.min(layoutScale, 1));
  const compact = scale < 0.95;
  const shellHeight = Math.round(200 * scale);
  const deckSectionHeight = Math.round(101 * scale);
  const horizontalPadding = Math.round(39 * scale);
  const brainSize = Math.round(50 * scale);
  const titleFontSize = Math.round(21 * scale);
  const titleLineHeight = Math.round(23 * scale);

  return (
    <ImageBackground source={folioReviewAssets.deckPanel.shell} resizeMode="stretch" style={[styles.shell, { height: shellHeight }]} imageStyle={styles.shellImage}>
      <View style={[styles.deckSection, { height: deckSectionHeight, paddingHorizontal: horizontalPadding, paddingTop: Math.round(8 * scale) }]}>
        <Image source={folioReviewAssets.deckPanel.brainCloud} resizeMode="contain" style={[styles.brainIcon, { height: brainSize, marginRight: Math.round(16 * scale), width: brainSize }]} />
        <View style={styles.deckTextBlock}>
          <Text allowFontScaling={false} numberOfLines={compact ? 1 : 2} ellipsizeMode="tail" style={[styles.deckTitle, { fontSize: titleFontSize, lineHeight: titleLineHeight }]}>{deckTitle}</Text>
          <Text allowFontScaling={false} numberOfLines={1} style={[styles.deckSubtitle, { fontSize: titleFontSize, lineHeight: titleLineHeight }]}>{deckSubtitle}</Text>
          <Text allowFontScaling={false} numberOfLines={1} style={[styles.countsLine, { fontSize: 13.7 * scale, lineHeight: Math.round(16 * scale) }]}>
            <Text style={styles.blueCount}>{dueCount} due</Text>
            <Text style={styles.dot}>  •  </Text>
            <Text>{totalCards} total cards</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.flowSection, { paddingBottom: Math.round(10 * scale), paddingHorizontal: Math.round(35 * scale), paddingTop: compact ? 0 : Math.round(5 * scale) }]}>
        <View style={styles.flowHeaderRow}>
          <View>
            <Text allowFontScaling={false} style={[styles.flowTitle, { fontSize: Math.round(16 * scale) }]}>Session flow</Text>
            <Image source={folioReviewAssets.deckPanel.sessionFlowUnderline} resizeMode="stretch" style={[styles.flowUnderline, { height: Math.max(6, Math.round(9 * scale)), width: Math.round(92 * scale) }]} />
          </View>
          <Text allowFontScaling={false} style={[styles.cardsLeft, { fontSize: Math.round(13 * scale) }]}><Text style={styles.blueCount}>{cardsLeft}</Text> cards left</Text>
        </View>
        <SessionFlowStrip
          tokens={tokens}
          activeIndex={activeTokenIndex}
          layoutScale={scale}
          placementGrade={placementGrade}
          placementAnimationKey={placementAnimationKey}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignSelf: 'center',
    height: 200,
    marginTop: 3,
    overflow: 'hidden',
    width: '100%',
  },
  shellImage: {
    resizeMode: 'stretch',
  },
  deckSection: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 101,
    paddingHorizontal: 39,
    paddingTop: 8,
  },
  brainIcon: {
    height: 50,
    marginRight: 16,
    width: 50,
  },
  deckTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  deckTitle: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 21,
    fontWeight: '400',
    lineHeight: 23,
  },
  deckSubtitle: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 21,
    fontWeight: '400',
    lineHeight: 23,
  },
  countsLine: {
    color: '#766F65',
    fontSize: 13.7,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: -1,
  },
  blueCount: {
    color: '#0C73DB',
    fontWeight: '900',
  },
  dot: {
    color: '#766F65',
  },
  flowSection: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 35,
    paddingTop: 5,
  },
  flowHeaderRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  flowTitle: {
    color: '#26211C',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 16,
    fontWeight: '400',
  },
  flowUnderline: {
    height: 9,
    marginTop: -1,
    width: 92,
  },
  cardsLeft: {
    color: '#6F6860',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
});

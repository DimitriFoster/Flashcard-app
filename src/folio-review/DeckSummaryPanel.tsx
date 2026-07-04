import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { folioReviewAssets } from './folioReviewAssets';
import { FOLIO_HAND_FONT } from './folioFonts';
import { SessionFlowStrip } from './SessionFlowStrip';
import { SessionTokenStatus } from './types';

type Props = {
  deckTitle: string;
  deckSubtitle?: string;
  dueCount: number;
  totalCards: number;
  cardsLeft: number;
  tokens: SessionTokenStatus[];
  activeTokenIndex: number;
};

export function DeckSummaryPanel({
  deckTitle,
  deckSubtitle = 'Master Deck',
  dueCount,
  totalCards,
  cardsLeft,
  tokens,
  activeTokenIndex,
}: Props) {
  return (
    <ImageBackground source={folioReviewAssets.deckPanel.shell} resizeMode="stretch" style={styles.shell} imageStyle={styles.shellImage}>
      <View style={styles.deckSection}>
        <Image source={folioReviewAssets.deckPanel.brainCloud} resizeMode="contain" style={styles.brainIcon} />
        <View style={styles.deckTextBlock}>
          <Text allowFontScaling={false} numberOfLines={2} ellipsizeMode="tail" style={styles.deckTitle}>{deckTitle}</Text>
          <Text allowFontScaling={false} numberOfLines={1} style={styles.deckSubtitle}>{deckSubtitle}</Text>
          <Text allowFontScaling={false} style={styles.countsLine}>
            <Text style={styles.blueCount}>{dueCount} due</Text>
            <Text style={styles.dot}>  •  </Text>
            <Text>{totalCards} total cards</Text>
          </Text>
        </View>
      </View>

      <View style={styles.flowSection}>
        <View style={styles.flowHeaderRow}>
          <View>
            <Text allowFontScaling={false} style={styles.flowTitle}>Session flow</Text>
            <Image source={folioReviewAssets.deckPanel.sessionFlowUnderline} resizeMode="stretch" style={styles.flowUnderline} />
          </View>
          <Text allowFontScaling={false} style={styles.cardsLeft}><Text style={styles.blueCount}>{cardsLeft}</Text> cards left</Text>
        </View>
        <SessionFlowStrip tokens={tokens} activeIndex={activeTokenIndex} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignSelf: 'center',
    height: 190,
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

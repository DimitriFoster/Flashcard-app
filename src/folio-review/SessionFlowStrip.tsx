import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { folioReviewAssets } from './folioReviewAssets';
import { FOLIO_HAND_FONT } from './folioFonts';
import { SessionTokenStatus } from './types';

type Props = {
  tokens: SessionTokenStatus[];
  activeIndex: number;
};

const tokenSourceMap: Record<SessionTokenStatus, ImageSourcePropType> = {
  new: folioReviewAssets.sessionFlow.new,
  again: folioReviewAssets.sessionFlow.again,
  hard: folioReviewAssets.sessionFlow.hard,
  good: folioReviewAssets.sessionFlow.good,
  easy: folioReviewAssets.sessionFlow.easy,
  empty: folioReviewAssets.sessionFlow.emptyDashed,
};

export function SessionFlowStrip({ tokens, activeIndex }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.tokenRow}>
        {tokens.map((status, index) => {
          const isActive = index === activeIndex;
          return (
            <View key={`${status}-${index}`} style={styles.tokenSlot}>
              {isActive ? <Image source={folioReviewAssets.sessionFlow.activeRays} resizeMode="contain" style={styles.rays} /> : null}
              <Image
                source={isActive ? folioReviewAssets.sessionFlow.activeGood : tokenSourceMap[status]}
                resizeMode="contain"
                style={isActive ? styles.activeToken : styles.token}
              />
              {isActive ? <Image source={folioReviewAssets.sessionFlow.activeTriangle} resizeMode="contain" style={styles.triangle} /> : null}
            </View>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <LegendItem source={folioReviewAssets.sessionFlow.new} label="New" />
        <LegendItem source={folioReviewAssets.sessionFlow.again} label="Again" />
        <LegendItem source={folioReviewAssets.sessionFlow.hard} label="Hard" />
        <LegendItem source={folioReviewAssets.sessionFlow.good} label="Good" />
        <LegendItem source={folioReviewAssets.sessionFlow.easy} label="Easy" />
      </View>
    </View>
  );
}

function LegendItem({ source, label }: { source: ImageSourcePropType; label: string }) {
  return (
    <View style={styles.legendItem}>
      <Image source={source} resizeMode="contain" style={styles.legendToken} />
      <Text allowFontScaling={false} style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  tokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 36,
  },
  tokenSlot: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    marginHorizontal: 1,
    width: 20,
  },
  token: {
    height: 24,
    width: 15,
  },
  activeToken: {
    height: 30,
    width: 22,
  },
  rays: {
    height: 12,
    position: 'absolute',
    top: 0,
    width: 24,
  },
  triangle: {
    bottom: 0,
    height: 9,
    position: 'absolute',
    width: 12,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -3,
    paddingHorizontal: 4,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  legendToken: {
    height: 17,
    width: 11,
  },
  legendText: {
    color: '#766F65',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 12.5,
    fontWeight: '400',
  },
});

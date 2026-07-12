import React from 'react';
import { Animated, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { folioReviewAssets } from './folioReviewAssets';
import { FOLIO_HAND_FONT } from './folioFonts';
import { ReviewGrade, SessionTokenStatus } from './types';

type Props = {
  tokens: SessionTokenStatus[];
  activeIndex: number;
  layoutScale?: number;
  placementGrade?: ReviewGrade | null;
  placementAnimationKey?: number;
};

type BucketZone = {
  key: 'now' | 'new' | 'soon' | 'later' | 'far';
  label: string;
  start: number;
  end: number;
  highlightColor: string;
  grades?: ReviewGrade[];
};

const tokenSourceMap: Record<SessionTokenStatus, ImageSourcePropType> = {
  new: folioReviewAssets.sessionFlow.new,
  again: folioReviewAssets.sessionFlow.again,
  hard: folioReviewAssets.sessionFlow.hard,
  good: folioReviewAssets.sessionFlow.good,
  easy: folioReviewAssets.sessionFlow.easy,
  empty: folioReviewAssets.sessionFlow.emptyDashed,
};

const targetIndexByGrade: Record<ReviewGrade, number> = {
  again: 3,
  hard: 4,
  good: 7,
  easy: 10,
};

const legendHighlightByGrade: Record<ReviewGrade, string> = {
  again: 'rgba(255, 177, 70, 0.24)',
  hard: 'rgba(246, 105, 92, 0.20)',
  good: 'rgba(88, 161, 240, 0.24)',
  easy: 'rgba(117, 179, 104, 0.20)',
};

const bucketZones: BucketZone[] = [
  {
    key: 'now',
    label: 'Now',
    start: 0,
    end: 0,
    highlightColor: 'rgba(126, 116, 104, 0.12)',
  },
  {
    key: 'new',
    label: 'New',
    start: 1,
    end: 2,
    highlightColor: 'rgba(126, 116, 104, 0.10)',
  },
  {
    key: 'soon',
    label: 'Soon',
    start: 3,
    end: 5,
    grades: ['again', 'hard'],
    highlightColor: 'rgba(255, 148, 84, 0.18)',
  },
  {
    key: 'later',
    label: 'Later',
    start: 6,
    end: 8,
    grades: ['good'],
    highlightColor: 'rgba(88, 161, 240, 0.18)',
  },
  {
    key: 'far',
    label: 'Far',
    start: 9,
    end: 11,
    grades: ['easy'],
    highlightColor: 'rgba(117, 179, 104, 0.16)',
  },
];

export function SessionFlowStrip({ tokens, activeIndex, layoutScale = 1, placementGrade = null, placementAnimationKey = 0 }: Props) {
  const scale = Math.max(0.72, Math.min(layoutScale, 1));
  const slotOuterWidth = Math.round(21 * scale);
  const tokenSlotHeight = Math.round(34 * scale);
  const activeTokenHeight = Math.round(29 * scale);
  const activeTokenWidth = Math.round(21 * scale);
  const trackWidth = slotOuterWidth * tokens.length;
  const placementSource = placementGrade ? tokenSourceMap[placementGrade] : null;
  const rawTargetIndex = placementGrade ? targetIndexByGrade[placementGrade] : activeIndex;
  const targetIndex = Math.min(Math.max(rawTargetIndex, 0), Math.max(tokens.length - 1, 0));
  const activeBucketKey = placementGrade
    ? bucketZones.find((zone) => zone.grades?.includes(placementGrade))?.key
    : 'now';
  const startX = activeIndex * slotOuterWidth + (slotOuterWidth - activeTokenWidth) / 2;
  const targetX = targetIndex * slotOuterWidth + (slotOuterWidth - activeTokenWidth) / 2;
  const animatedProgress = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!placementGrade) {
      animatedProgress.setValue(1);
      return;
    }

    animatedProgress.setValue(0);
    Animated.sequence([
      Animated.timing(animatedProgress, {
        toValue: 0.12,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(animatedProgress, {
        toValue: 0.88,
        duration: 430,
        useNativeDriver: true,
      }),
      Animated.spring(animatedProgress, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animatedProgress, placementAnimationKey, placementGrade]);

  const translateX = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, targetX],
  });
  const ghostTranslateX = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, startX + (targetX - startX) * 0.55],
  });
  const ghostOpacity = animatedProgress.interpolate({
    inputRange: [0, 0.18, 0.76, 1],
    outputRange: [0, 0.28, 0.16, 0],
  });
  const overlayScale = animatedProgress.interpolate({
    inputRange: [0, 0.12, 0.88, 1],
    outputRange: [0.92, 1.08, 1, 1],
  });

  return (
    <View style={[styles.wrap, { paddingBottom: Math.round(6 * scale) }]}>
      <View style={[styles.bucketLabelTrack, { height: Math.round(13 * scale), width: trackWidth }]}> 
        {bucketZones.map((zone) => (
          <Text
            allowFontScaling={false}
            key={zone.key}
            numberOfLines={1}
            style={[
              styles.bucketLabel,
              {
                fontSize: 8.7 * scale,
                left: zone.start * slotOuterWidth,
                lineHeight: Math.round(11 * scale),
                opacity: activeBucketKey === zone.key ? 1 : 0.72,
                width: Math.max(slotOuterWidth, (zone.end - zone.start + 1) * slotOuterWidth),
              },
              activeBucketKey === zone.key && styles.bucketLabelActive,
            ]}
          >
            {zone.label}
          </Text>
        ))}
      </View>

      <View style={[styles.tokenRow, { minHeight: Math.round(33 * scale) }]}> 
        <View style={[styles.tokenTrack, { height: tokenSlotHeight, width: trackWidth }]}> 
          {bucketZones.map((zone) => {
            const zoneIsActive = activeBucketKey === zone.key;
            return (
              <View
                key={zone.key}
                pointerEvents="none"
                style={[
                  styles.bucketBand,
                  {
                    backgroundColor: zoneIsActive ? zone.highlightColor : 'rgba(118, 108, 96, 0.04)',
                    borderColor: zoneIsActive ? zone.highlightColor : 'rgba(118, 108, 96, 0.08)',
                    height: Math.round(28 * scale),
                    left: zone.start * slotOuterWidth + Math.round(1 * scale),
                    top: Math.round(3 * scale),
                    width: Math.max(slotOuterWidth - 2, (zone.end - zone.start + 1) * slotOuterWidth - Math.round(2 * scale)),
                  },
                ]}
              />
            );
          })}

          {tokens.map((status, index) => {
            const isActive = index === activeIndex;
            const showSettledTarget = Boolean(placementSource && index === targetIndex);
            const source = isActive ? folioReviewAssets.sessionFlow.emptyDashed : showSettledTarget && placementSource ? placementSource : tokenSourceMap[status];
            const tokenStyle = isActive || showSettledTarget
              ? [styles.activeToken, { height: activeTokenHeight, opacity: placementGrade && isActive ? 0.42 : 1, width: activeTokenWidth }]
              : [styles.token, { height: Math.round(22 * scale), width: Math.round(14 * scale) }];

            return (
              <View key={`${status}-${index}`} style={[styles.tokenSlot, { height: tokenSlotHeight, width: slotOuterWidth }]}> 
                {isActive && !placementGrade ? <Image source={folioReviewAssets.sessionFlow.activeRays} resizeMode="contain" style={[styles.rays, { height: Math.round(11 * scale), width: Math.round(23 * scale) }]} /> : null}
                <Image source={source} resizeMode="contain" style={tokenStyle} />
                {isActive && !placementGrade ? <Image source={folioReviewAssets.sessionFlow.activeTriangle} resizeMode="contain" style={[styles.triangle, { height: Math.round(8 * scale), width: Math.round(11 * scale) }]} /> : null}
              </View>
            );
          })}

          {placementGrade ? (
            <>
              <Animated.Image
                pointerEvents="none"
                source={placementSource ?? folioReviewAssets.sessionFlow.good}
                resizeMode="contain"
                style={[
                  styles.motionGhostToken,
                  {
                    height: activeTokenHeight,
                    opacity: ghostOpacity,
                    transform: [{ translateX: ghostTranslateX }, { scale: 0.92 }],
                    width: activeTokenWidth,
                  },
                ]}
              />
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.motionTokenWrap,
                  {
                    height: tokenSlotHeight,
                    transform: [{ translateX }, { scale: overlayScale }],
                    width: activeTokenWidth,
                  },
                ]}
              >
                <Image source={folioReviewAssets.sessionFlow.activeRays} resizeMode="contain" style={[styles.rays, { height: Math.round(11 * scale), width: Math.round(23 * scale) }]} />
                <Image source={placementSource ?? folioReviewAssets.sessionFlow.good} resizeMode="contain" style={[styles.activeToken, { height: activeTokenHeight, width: activeTokenWidth }]} />
                <Image source={folioReviewAssets.sessionFlow.activeTriangle} resizeMode="contain" style={[styles.triangle, { height: Math.round(8 * scale), width: Math.round(11 * scale) }]} />
              </Animated.View>
            </>
          ) : null}
        </View>
      </View>

      <View style={[styles.legendRow, { marginTop: Math.round(-1 * scale) }]}> 
        <LegendItem source={folioReviewAssets.sessionFlow.new} label="New" layoutScale={scale} />
        <LegendItem source={folioReviewAssets.sessionFlow.again} label="Again" layoutScale={scale} active={placementGrade === 'again'} highlightColor={legendHighlightByGrade.again} />
        <LegendItem source={folioReviewAssets.sessionFlow.hard} label="Hard" layoutScale={scale} active={placementGrade === 'hard'} highlightColor={legendHighlightByGrade.hard} />
        <LegendItem source={folioReviewAssets.sessionFlow.good} label="Good" layoutScale={scale} active={placementGrade === 'good'} highlightColor={legendHighlightByGrade.good} />
        <LegendItem source={folioReviewAssets.sessionFlow.easy} label="Easy" layoutScale={scale} active={placementGrade === 'easy'} highlightColor={legendHighlightByGrade.easy} />
      </View>
    </View>
  );
}

function LegendItem({
  source,
  label,
  layoutScale = 1,
  active = false,
  highlightColor = 'rgba(88, 161, 240, 0.18)',
}: {
  source: ImageSourcePropType;
  label: string;
  layoutScale?: number;
  active?: boolean;
  highlightColor?: string;
}) {
  const scale = Math.max(0.72, Math.min(layoutScale, 1));

  return (
    <View
      style={[
        styles.legendItem,
        { gap: Math.round(4 * scale), paddingHorizontal: Math.round(4 * scale), paddingVertical: Math.round(2 * scale) },
        active && { backgroundColor: highlightColor },
      ]}
    >
      <Image source={source} resizeMode="contain" style={[styles.legendToken, { height: Math.round(16 * scale), width: Math.round(10 * scale) }]} />
      <Text allowFontScaling={false} style={[styles.legendText, { fontSize: 12 * scale }, active && styles.legendTextActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 6,
    width: '100%',
  },
  bucketLabelTrack: {
    alignSelf: 'center',
    position: 'relative',
  },
  bucketLabel: {
    color: '#7B7168',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 8.7,
    fontWeight: '400',
    position: 'absolute',
    textAlign: 'center',
    top: 0,
  },
  bucketLabelActive: {
    color: '#0D75D9',
    fontWeight: '700',
  },
  tokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 33,
  },
  tokenTrack: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  bucketBand: {
    borderRadius: 8,
    borderWidth: 1,
    position: 'absolute',
  },
  tokenSlot: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 20,
  },
  token: {
    height: 22,
    width: 14,
  },
  activeToken: {
    height: 29,
    width: 21,
  },
  rays: {
    height: 11,
    position: 'absolute',
    top: 0,
    width: 23,
  },
  triangle: {
    bottom: 0,
    height: 8,
    position: 'absolute',
    width: 11,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -1,
    paddingHorizontal: 1,
  },
  motionGhostToken: {
    left: 0,
    position: 'absolute',
    top: 3,
  },
  motionTokenWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  legendItem: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
  },
  legendToken: {
    height: 16,
    width: 10,
  },
  legendText: {
    color: '#766F65',
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 12,
    fontWeight: '400',
  },
  legendTextActive: {
    color: '#3B65A3',
    fontWeight: '700',
  },
});

import React, { useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { folioReviewAssets } from './folioReviewAssets';
import { ReviewCard } from './types';

type Props = {
  card: ReviewCard;
  currentCardNumber: number;
  sessionTotalCards: number;
};

export function AnimatedFlashcard({ card, currentCardNumber, sessionTotalCards }: Props) {
  const flip = useRef(new Animated.Value(0)).current;
  const [revealed, setRevealed] = useState(false);

  const frontRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  const toggleReveal = () => {
    const next = revealed ? 0 : 1;
    setRevealed(!revealed);
    Animated.spring(flip, {
      toValue: next,
      friction: 9,
      tension: 70,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.wrap}>
      <Image source={folioReviewAssets.card.stackBackLayers} resizeMode="stretch" style={styles.stackLayers} />

      <Animated.View style={[styles.cardFace, styles.frontFace, { transform: [{ perspective: 1100 }, { rotateY: frontRotation }] }]}>
        <CardSurface
          accessibilityLabel="Reveal answer"
          onPress={toggleReveal}
          progressText={`${currentCardNumber} / ${sessionTotalCards}`}
          mainText={card.question}
          footerText="Tap to reveal answer"
          showIllustration
        />
      </Animated.View>

      <Animated.View style={[styles.cardFace, styles.backFace, { transform: [{ perspective: 1100 }, { rotateY: backRotation }] }]}>
        <CardSurface
          accessibilityLabel="Show question"
          onPress={toggleReveal}
          progressText={`${currentCardNumber} / ${sessionTotalCards}`}
          mainText={card.answer}
          footerText="Tap to return to question"
          showIllustration={false}
        />
      </Animated.View>
    </View>
  );
}

function CardSurface({
  accessibilityLabel,
  onPress,
  progressText,
  mainText,
  footerText,
  showIllustration,
}: {
  accessibilityLabel: string;
  onPress: () => void;
  progressText: string;
  mainText: string;
  footerText: string;
  showIllustration: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={styles.pressableFill}>
      <ImageBackground source={folioReviewAssets.card.frontSurface} resizeMode="stretch" style={styles.surface} imageStyle={styles.surfaceImage}>
        <Image source={folioReviewAssets.card.favoriteStar} resizeMode="contain" style={styles.star} />
        <Text style={styles.progress}>{progressText}</Text>
        <Text adjustsFontSizeToFit numberOfLines={showIllustration ? 4 : 7} style={[styles.mainText, !showIllustration && styles.answerText]}>
          {mainText}
        </Text>
        <Image source={folioReviewAssets.card.questionUnderline} resizeMode="stretch" style={styles.underline} />
        {showIllustration ? <Image source={folioReviewAssets.card.retrievalGenerationIllustration} resizeMode="contain" style={styles.illustration} /> : null}
        <Text style={styles.footerText}>{footerText}</Text>
      </ImageBackground>
    </Pressable>
  );
}

const CARD_HEIGHT = 344;

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    height: CARD_HEIGHT + 18,
    marginTop: 16,
    width: '100%',
  },
  stackLayers: {
    height: CARD_HEIGHT,
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  cardFace: {
    height: CARD_HEIGHT,
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  frontFace: {
    backfaceVisibility: 'hidden',
    zIndex: 2,
  },
  backFace: {
    backfaceVisibility: 'hidden',
    zIndex: 1,
  },
  pressableFill: {
    flex: 1,
  },
  surface: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 34,
  },
  surfaceImage: {
    resizeMode: 'stretch',
  },
  star: {
    height: 36,
    left: 25,
    position: 'absolute',
    top: 28,
    width: 36,
  },
  progress: {
    color: '#766F65',
    fontSize: 24,
    fontWeight: '800',
    position: 'absolute',
    right: 30,
    top: 34,
  },
  mainText: {
    color: '#26211C',
    fontFamily: Platform.select({ ios: 'Marker Felt', android: 'sans-serif', default: 'sans-serif' }),
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 38,
    marginTop: 78,
    textAlign: 'center',
  },
  answerText: {
    fontSize: 22,
    lineHeight: 31,
    marginTop: 88,
  },
  underline: {
    alignSelf: 'center',
    height: 12,
    marginTop: 14,
    width: '58%',
  },
  illustration: {
    alignSelf: 'center',
    height: 88,
    marginTop: 10,
    width: '62%',
  },
  footerText: {
    bottom: 31,
    color: '#8A8177',
    fontSize: 18,
    fontWeight: '800',
    left: 0,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
  },
});

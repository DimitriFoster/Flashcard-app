import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import { folioBrowseAssets } from './folioBrowseAssets';

type Props = {
  question: string;
  answer: string;
  currentCardNumber: number;
  totalCards: number;
  revealed: boolean;
  onToggleReveal: () => void;
};

export function BrowseFlashcard({
  question,
  answer,
  currentCardNumber,
  totalCards,
  revealed,
  onToggleReveal,
}: Props) {
  const flip = useRef(new Animated.Value(revealed ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(flip, {
      toValue: revealed ? 1 : 0,
      friction: 9,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [flip, revealed]);

  const frontRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <View style={styles.wrap}>
      <Image source={folioBrowseAssets.card.stackBackLayers} resizeMode="stretch" style={styles.stackLayers} />

      <Animated.View style={[styles.cardFace, styles.frontFace, { transform: [{ perspective: 1100 }, { rotateY: frontRotation }] }]}>
        <CardSurface
          accessibilityLabel="Reveal answer"
          footerText="Tap to reveal answer"
          mainText={question}
          onPress={onToggleReveal}
          progressText={`${currentCardNumber} / ${totalCards}`}
          showIllustration
        />
      </Animated.View>

      <Animated.View style={[styles.cardFace, styles.backFace, { transform: [{ perspective: 1100 }, { rotateY: backRotation }] }]}>
        <CardSurface
          accessibilityLabel="Show question"
          footerText="Tap to reveal prompt"
          mainText={answer}
          onPress={onToggleReveal}
          progressText={`${currentCardNumber} / ${totalCards}`}
          showIllustration={false}
        />
      </Animated.View>
    </View>
  );
}

function CardSurface({
  accessibilityLabel,
  footerText,
  mainText,
  onPress,
  progressText,
  showIllustration,
}: {
  accessibilityLabel: string;
  footerText: string;
  mainText: string;
  onPress: () => void;
  progressText: string;
  showIllustration: boolean;
}) {
  return (
    <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" onPress={onPress} style={styles.pressableFill}>
      <ImageBackground source={folioBrowseAssets.card.frontSurface} resizeMode="stretch" style={styles.surface} imageStyle={styles.surfaceImage}>
        <Image source={folioBrowseAssets.card.favoriteStar} resizeMode="contain" style={styles.star} />
        <Text allowFontScaling={false} style={styles.progress}>{progressText}</Text>
        <Text
          adjustsFontSizeToFit
          allowFontScaling={false}
          minimumFontScale={0.72}
          numberOfLines={showIllustration ? 4 : 7}
          style={[styles.mainText, !showIllustration ? styles.answerText : null]}>
          {mainText}
        </Text>
        <Image source={folioBrowseAssets.card.questionUnderline} resizeMode="stretch" style={styles.underline} />
        {showIllustration ? (
          <Image source={folioBrowseAssets.card.retrievalGenerationIllustration} resizeMode="contain" style={styles.illustration} />
        ) : null}
        <Text allowFontScaling={false} style={styles.footerText}>{footerText}</Text>
      </ImageBackground>
    </Pressable>
  );
}

const CARD_HEIGHT = 344;

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    height: CARD_HEIGHT + 18,
    marginTop: 14,
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
    fontFamily: FOLIO_HAND_FONT,
    fontSize: 28,
    lineHeight: 38,
    marginTop: 78,
    textAlign: 'center',
  },
  answerText: {
    fontSize: 22,
    lineHeight: 30,
    marginTop: 86,
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
    bottom: Platform.OS === 'android' ? 28 : 31,
    color: '#8A8177',
    fontSize: 17,
    fontWeight: '800',
    left: 0,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
  },
});

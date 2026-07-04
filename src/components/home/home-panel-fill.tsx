import React from 'react';
import { Image, StyleSheet, type ImageSourcePropType } from 'react-native';

type HomePanelFillProps = {
  source: ImageSourcePropType;
  opacity?: number;
};

export function HomePanelFill({ source, opacity = 1 }: HomePanelFillProps) {
  return (
    <Image
      pointerEvents="none"
      source={source}
      resizeMode="cover"
      fadeDuration={0}
      style={[styles.fill, { opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});

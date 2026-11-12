import React, { useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { getNotebookAppearance, type NotebookCoverKey } from '@/lib/notebook-appearance';

type Artwork = {
  source: ImageSourcePropType;
  sourceWidth: number;
  sourceHeight: number;
  window: { x: number; y: number; width: number; height: number };
};

const bookcase = require('./assets/bookcase/wooden-bookcase.png');
const wood = (y: number, height: number): Artwork => ({
  source: bookcase, sourceWidth: 1086, sourceHeight: 1448,
  window: { x: 50, y, width: 990, height },
});
const topRail = wood(76, 72);
const cavity = wood(148, 252);
const divider = wood(400, 60);
const bottomRail = wood(1300, 84);
const plaque: Artwork = {
  source: require('./assets/bookcase/wooden-plaque.png'),
  sourceWidth: 2172, sourceHeight: 724,
  window: { x: 333, y: 172, width: 1504, height: 370 },
};

const cover = (source: ImageSourcePropType, x: number, y: number, width: number, height: number): Artwork => ({
  source, sourceWidth: 1254, sourceHeight: 1254, window: { x, y, width, height },
});
const covers: Record<NotebookCoverKey, Artwork> = {
  ideas: cover(require('./assets/bookcase/cover-ideas.png'), 222, 150, 810, 981),
  flowers: cover(require('./assets/bookcase/cover-flowers.png'), 200, 126, 854, 1033),
  clouds: cover(require('./assets/bookcase/cover-clouds.png'), 224, 149, 820, 988),
  sun: cover(require('./assets/bookcase/cover-sun.png'), 227, 175, 801, 928),
  moon: cover(require('./assets/bookcase/cover-moon.png'), 265, 199, 744, 907),
  feather: cover(require('./assets/bookcase/cover-feather.png'), 209, 150, 838, 1005),
  leaves: cover(require('./assets/bookcase/cover-leaves.png'), 251, 184, 755, 929),
  checklist: cover(require('./assets/bookcase/cover-checklist.png'), 202, 151, 861, 977),
};

// Display windows remove empty export padding in layout only. The supplied PNGs
// stay untouched; rails and covers retain their proportions and soft edges.
function ArtworkWindow({ artwork, width, height }: { artwork: Artwork; width: number; height?: number }) {
  const frameHeight = height ?? width * artwork.window.height / artwork.window.width;
  const scaleX = width / artwork.window.width;
  const scaleY = frameHeight / artwork.window.height;
  return (
    <View pointerEvents="none" accessible={false} style={{ width, height: frameHeight, overflow: 'hidden' }}>
      <Image
        accessible={false}
        source={artwork.source}
        resizeMode="stretch"
        fadeDuration={0}
        style={{
          position: 'absolute',
          width: artwork.sourceWidth * scaleX,
          height: artwork.sourceHeight * scaleY,
          left: -artwork.window.x * scaleX,
          top: -artwork.window.y * scaleY,
        }}
      />
    </View>
  );
}

export function ShelfRail({ width, kind }: { width: number; kind: 'top' | 'divider' | 'bottom' }) {
  return <ArtworkWindow artwork={kind === 'top' ? topRail : kind === 'bottom' ? bottomRail : divider} width={width} />;
}

export function ShelfCavity() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={({ nativeEvent }) => setSize(nativeEvent.layout)}>
      {/* Only the wood interior extends when an in-shelf form needs more room. */}
      {size.width > 0 ? <ArtworkWindow artwork={cavity} width={size.width} height={size.height} /> : null}
    </View>
  );
}

export function ShelfPlaque({ width }: { width: number }) {
  return <ArtworkWindow artwork={plaque} width={width} />;
}

export function NotebookCover({ notebookId, height }: { notebookId: string; height: number }) {
  const artwork = covers[getNotebookAppearance(notebookId).key];
  return <ArtworkWindow artwork={artwork} width={height * artwork.window.width / artwork.window.height} />;
}

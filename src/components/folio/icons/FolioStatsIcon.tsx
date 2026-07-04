import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioStatsIcon({
  size = 44,
  color = '#A36B10',
  strokeWidth = 2.8,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M15 50C26.7 50.7 38.6 50.6 50.2 49.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M21 44C21.3 38.9 21.4 33.4 21.1 28.6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M32 44C32.1 34.4 32.2 25.9 32 17.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M43 44C43.3 37 43.2 30.3 43 24.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

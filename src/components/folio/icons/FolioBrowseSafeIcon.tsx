import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioBrowseSafeIcon({
  size = 26,
  color = '#24725C',
  strokeWidth = 2.8,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M8.1 17.1C10.3 19.2 12.5 21.1 14.7 23.2C18.4 18.3 21.6 13.8 24.6 8.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7.9 23.4C13.3 25.4 19.6 25.1 24.4 22.8" stroke={color} strokeWidth={strokeWidth - 0.6} strokeLinecap="round" opacity={0.55} />
    </Svg>
  );
}

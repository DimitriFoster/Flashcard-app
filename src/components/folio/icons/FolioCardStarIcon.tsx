import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioCardStarIcon({
  size = 28,
  color = '#91B8FF',
  strokeWidth = 3.1,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M16 5.8C15.9 12.6 16 19 16.2 25.7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M6.8 16.1C12.8 15.9 19.3 16.1 25.3 15.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M9.8 9.1C13.8 13.1 18.4 18.2 22.5 22.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M22.5 9.2C18.5 13.7 13.8 18.2 9.5 22.7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

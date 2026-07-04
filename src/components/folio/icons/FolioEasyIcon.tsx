import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioEasyIcon({
  size = 28,
  color = '#24725C',
  strokeWidth = 3.2,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M16.1 5.8C15.9 12.3 16 18.7 16.1 25.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M6.4 16C13.1 15.9 19.2 16 25.6 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M9.2 9.2C13.4 13.2 18.5 18.5 22.8 22.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M22.8 9.2C18.2 13.6 13.8 18.1 9.2 22.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

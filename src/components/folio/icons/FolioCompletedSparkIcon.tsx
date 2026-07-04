import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioCompletedSparkIcon({
  size = 30,
  color = '#24725C',
  secondaryColor = '#83D3A6',
  strokeWidth = 2.6,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M16 5.8C15.8 10.1 16 14.1 16.1 18.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M8.2 16C12.8 15.7 17.1 15.9 21.6 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M11.1 10.9C13.6 13.2 16.1 15.9 18.5 18.7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M20.4 8.9C18.4 11.1 16.4 13.3 14.3 15.6" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="23.7" cy="22.6" r="2" fill={secondaryColor} />
      <Circle cx="7.5" cy="23.8" r="1.5" fill={secondaryColor} />
    </Svg>
  );
}

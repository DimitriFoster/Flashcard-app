import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioGoodIcon({
  size = 28,
  color = '#2F5FB8',
  strokeWidth = 2.7,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx="16" cy="16" r="10" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M11.7 14.3L11.9 14.3" stroke={color} strokeWidth={strokeWidth + 0.8} strokeLinecap="round" />
      <Path d="M20.1 14.3L20.3 14.3" stroke={color} strokeWidth={strokeWidth + 0.8} strokeLinecap="round" />
      <Path d="M11.8 19.2C14.2 21.3 18 21.4 20.6 19.1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioSearchIcon({
  size = 26,
  color = '#2F5FB8',
  strokeWidth = 3,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx="14.2" cy="14" r="6.5" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M19.2 19.1C21.2 21 23.1 23.1 25 25.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

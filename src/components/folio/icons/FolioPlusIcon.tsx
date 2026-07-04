import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioPlusIcon({
  size = 26,
  color = '#2F5FB8',
  strokeWidth = 3.5,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M16 7.2C16.1 13.1 15.9 18.9 16.2 24.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M7.3 16.2C13 15.8 18.9 16 24.7 15.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

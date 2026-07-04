import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioHardIcon({
  size = 28,
  color = '#D15A4C',
  strokeWidth = 3.4,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M7.4 11.3C11.5 10.6 15.7 9.8 20.2 9.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M10.5 16C15.1 15.2 19.8 14.4 24.4 14.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M8.2 20.8C12.8 21.1 17.3 20.7 22.3 19.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

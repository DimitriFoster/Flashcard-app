import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioDeckGeneralIcon({
  size = 44,
  color = '#2F5FB8',
  secondaryColor = '#E8B747',
  strokeWidth = 2.6,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 14C28.5 12.5 38.6 12.9 47.5 15.2C48.8 25.3 48.3 37.3 46 48.6C37 50.7 27.1 50.2 18.4 47.4C17.1 36.9 17.6 24.5 20 14Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M27.6 22.4C31.8 22 36.2 22 40.4 22.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M27.5 30.7C32.7 30.2 37.7 30.4 42.3 30.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M32.2 36.2L34.3 40.2L38.8 40.7L35.5 43.7L36.3 48.1L32.2 45.9L28.3 48.2L29.1 43.7L25.8 40.8L30.2 40.2L32.2 36.2Z" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}

import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioNotesIcon({
  size = 44,
  color = '#A36B10',
  secondaryColor = '#E8B747',
  strokeWidth = 2.6,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 10.8C27.6 9.8 39.4 10.1 48.8 11.5C50.2 24.4 49.8 39.6 47.7 52C37.7 53.4 26 53.2 16.2 51.5C15.1 39.2 15.5 23.4 18 10.8Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M24.5 22.8C30.5 22.2 37.3 22.2 43.2 22.8M24.3 31.4C31.8 30.9 37.9 31 43.4 31.5M24.4 39.8C29.9 39.4 36.8 39.5 42.3 40" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M23.2 10.8C22.6 24.4 22.5 38.1 23.2 51.6" stroke={color} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" opacity={0.55} />
    </Svg>
  );
}

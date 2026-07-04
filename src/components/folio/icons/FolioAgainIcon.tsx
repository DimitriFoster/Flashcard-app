import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioAgainIcon({
  size = 28,
  color = '#B97512',
  strokeWidth = 3.1,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M21.9 8.8C18.3 7.1 13.4 7.8 10.8 11.1C8.3 14.2 8.7 19.4 11.7 22C14.3 24.2 18.6 24.4 21.7 22.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M21.6 8.7C19.7 8.4 18 8.5 16.1 8.9C17.5 10.2 18.7 11.5 19.8 13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

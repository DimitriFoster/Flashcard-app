import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioTrashIcon({
  size = 26,
  color = '#D15A4C',
  strokeWidth = 2.8,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M8.4 10.2C13.8 9.9 19.1 9.9 24.2 10.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M13.1 8.4C15.1 7.8 17.1 7.8 19 8.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M10.6 12.7C10.9 17.3 11.2 21.6 11.7 25.2C14.6 26.1 18.3 26.1 21.1 25.2C21.7 21 22 16.6 22.4 12.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 14.6C15.1 17.2 15.1 19.9 15.2 22.4" stroke={color} strokeWidth={strokeWidth - 0.6} strokeLinecap="round" />
      <Path d="M18.4 14.6C18.4 17.2 18.2 19.8 18.1 22.4" stroke={color} strokeWidth={strokeWidth - 0.6} strokeLinecap="round" />
    </Svg>
  );
}

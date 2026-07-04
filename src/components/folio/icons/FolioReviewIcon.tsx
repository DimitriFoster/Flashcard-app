import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioReviewIcon({
  size = 44,
  color = '#2F5FB8',
  secondaryColor = '#91B8FF',
  strokeWidth = 2.7,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M22 18C29.9 15.5 40.6 16.7 46.2 23.2C52.1 30.1 49.4 41 41.5 45.4C34.1 49.5 24.3 46.8 20.2 39.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M22 18C24.9 17.4 27.8 17.2 30.9 17.6C28.7 20.2 27.1 22.8 25.7 26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M27.4 31.8C30.3 34.2 33.2 36.6 36 39.3C39.1 34.8 41.7 30.8 44.2 26.4" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

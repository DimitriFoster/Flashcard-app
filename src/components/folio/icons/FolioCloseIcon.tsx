import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioCloseIcon({
  size = 24,
  color = '#2E281F',
  strokeWidth = 3,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M8.4 8.8C13.1 13.4 18.2 18.2 23.4 23.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M23.4 8.9C18.8 13.5 14.1 18.1 8.7 23.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

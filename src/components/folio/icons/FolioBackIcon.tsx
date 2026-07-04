import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioBackIcon({
  size = 28,
  color = '#2E281F',
  strokeWidth = 4.4,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M20.6 6.8C16.8 9.2 13.4 12.2 9.5 16C13.2 19.6 16.9 22.6 21.8 25.4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.8 16.2C15.1 16.2 20.2 15.8 25.2 15.9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

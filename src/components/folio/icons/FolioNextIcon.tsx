import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioNextIcon({
  size = 28,
  color = '#2F5FB8',
  strokeWidth = 4.2,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M11.4 6.8C15.2 9.2 18.6 12.2 22.5 16C18.8 19.6 15.1 22.6 10.2 25.4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.2 16.2C16.9 16.2 11.8 15.8 6.8 15.9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

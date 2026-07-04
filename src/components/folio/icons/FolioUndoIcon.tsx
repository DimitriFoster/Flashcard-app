import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioUndoIcon({
  size = 28,
  color = '#7651B2',
  strokeWidth = 3.2,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M13.4 8.1C9.8 9.2 7.4 12.1 7.2 15.8C6.9 20.6 10.5 24.1 15.6 24.1C19.2 24.1 22.3 22.3 23.7 19.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.3 8.2C11.9 7.8 10.5 7.6 8.9 7.6C9.8 9.1 10.6 10.5 11.4 12.1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

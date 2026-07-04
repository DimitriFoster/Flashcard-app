import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioHelpIcon({
  size = 30,
  color = '#2F5FB8',
  strokeWidth = 3.4,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M10.4 11.1C11.1 7.9 13.5 6.2 16.7 6.3C20.3 6.4 22.4 8.5 22.1 11.5C21.8 14.6 18.8 15.5 17.2 17.4C16.2 18.6 16.1 19.5 16.1 20.7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 25.2L16.2 25.2"
        stroke={color}
        strokeWidth={strokeWidth + 1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

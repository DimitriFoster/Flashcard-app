import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioSettingsIcon({
  size = 28,
  color = '#756B5E',
  strokeWidth = 2.6,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx="16" cy="16" r="3.4" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M16 6.4L16.2 9.4M16 22.6L16.1 25.6M6.4 16L9.5 16.1M22.5 15.9L25.6 16M9.2 9.3L11.3 11.4M20.8 20.7L23 22.8M22.7 9.3L20.6 11.3M11.4 20.7L9.1 22.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

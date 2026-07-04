import React from 'react';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioDeckProgrammingIcon({
  size = 44,
  color = '#24725C',
  secondaryColor = '#91B8FF',
  strokeWidth = 2.8,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M14 14C24.5 12.8 39.6 13.1 50 14.5C51.5 25.3 51.2 39.2 49.7 49.8C38.8 51.1 25.2 51.2 14.3 49.7C12.8 38.9 12.9 25.3 14 14Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <SvgText x="32" y="39" textAnchor="middle" fontSize="18" fontWeight="900" fill={color}>{'<>'}</SvgText>
      <Path d="M20.5 22.4C27.5 21.8 36.2 21.9 43.4 22.4" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

import React from 'react';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioDeckLanguageIcon({
  size = 44,
  color = '#B97512',
  secondaryColor = '#2F5FB8',
  strokeWidth = 2.8,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M14 18C23.8 15.6 39.4 15.8 49 18.3C50.5 25.9 50.2 35.3 48.4 42.8C40.6 44.8 26 44.7 17.3 42.6C15.7 46.1 13.5 48.6 10.5 50.5C11.6 46.6 12.3 42.9 12.6 39.4C11.7 32.6 12 24.6 14 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <SvgText x="31.5" y="36" textAnchor="middle" fontSize="17" fontWeight="900" fill={color}>hi</SvgText>
      <Path d="M43.4 24.6L43.7 24.6" stroke={secondaryColor} strokeWidth={strokeWidth + 1.2} strokeLinecap="round" />
      <Path d="M43.6 30.3L43.6 38" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

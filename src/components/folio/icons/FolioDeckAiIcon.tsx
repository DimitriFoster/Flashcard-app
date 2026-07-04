import React from 'react';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioDeckAiIcon({
  size = 44,
  color = '#2F5FB8',
  secondaryColor = '#91B8FF',
  strokeWidth = 2.6,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M14 18C25 17.2 38 17.5 50 18" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M14 46C25 45.2 38 45.5 50 46" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M19 32C27 31.8 37 31.9 45 32" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="13" cy="18" r="4" fill={secondaryColor} />
      <Circle cx="51" cy="18" r="4" fill={secondaryColor} />
      <Circle cx="19" cy="46" r="4" fill={secondaryColor} />
      <Circle cx="45" cy="46" r="4" fill={secondaryColor} />
      <SvgText x="32" y="38" textAnchor="middle" fontSize="21" fontWeight="900" fill={color}>AI</SvgText>
    </Svg>
  );
}

import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { FolioSvgIconProps } from './types';

export function FolioSaveIcon({
  size = 26,
  color = '#A36B10',
  strokeWidth = 2.8,
}: FolioSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M8.4 7.8C13.3 7.6 18.6 7.7 23.4 8.1C24.1 13.2 24.2 19.4 23.7 24.4C18.8 25.1 13.1 25 8.4 24.4C7.7 19.4 7.7 12.8 8.4 7.8Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12.1 8.2C12.2 10.5 12.2 12.5 12.4 14.3C15.2 14.7 18.1 14.7 20.4 14.2C20.5 12.3 20.6 10.3 20.5 8.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M12.1 24.3C12.2 21.7 12.5 19.7 13 18.1C15.2 17.8 17.7 17.8 19.8 18.1C20.4 19.7 20.7 21.8 20.8 24.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

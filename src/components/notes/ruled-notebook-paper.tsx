import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { getNotebookRulePath } from '@/lib/notebook-ruling';

type RuledNotebookPaperProps = {
  height: number;
  lineHeight: number;
  textTop: number;
};

export function RuledNotebookPaper({ height, lineHeight, textTop }: RuledNotebookPaperProps) {
  const [width, setWidth] = useState(0);
  const rulePath = useMemo(
    () => getNotebookRulePath(width, height, textTop, lineHeight),
    [height, lineHeight, textTop, width]
  );

  return (
    <View
      accessible={false}
      pointerEvents="none"
      onLayout={(event) => {
        const nextWidth = event.nativeEvent.layout.width;
        setWidth((currentWidth) => currentWidth === nextWidth ? currentWidth : nextWidth);
      }}
      style={StyleSheet.absoluteFill}>
      {width > 0 ? (
        <Svg width={width} height={height} pointerEvents="none">
          <Path d={rulePath} fill="none" stroke="#C5D6D7" strokeWidth={0.8} />
        </Svg>
      ) : null}
    </View>
  );
}

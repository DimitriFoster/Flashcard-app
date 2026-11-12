import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const looseNotes = require('./assets/notebook-picker/loose-notes.png');
const notebooks = [
  require('./assets/notebook-picker/notebook-ideas.png'),
  require('./assets/notebook-picker/notebook-stories.png'),
  require('./assets/notebook-picker/notebook-study.png'),
  require('./assets/notebook-picker/notebook-plans.png'),
];
const surfaces = {
  menu: { source: require('./assets/notebook-picker/menu-paper.png'), width: 832, height: 837, cap: 64, corner: 24 },
  field: { source: require('./assets/notebook-picker/field-paper.png'), width: 1114, height: 144, cap: 48, corner: 16 },
  selected: { source: require('./assets/notebook-picker/selected-row.png'), width: 1067, height: 168, cap: 60, corner: 20 },
};

/** Nine-slice the paper so Android and web retain the same unwarped corners. */
export function NotebookPickerSurface({ kind }: { kind: keyof typeof surfaces }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const art = surfaces[kind];
  const corner = Math.min(art.corner, size.width / 2, size.height / 2);
  const columns = [corner, Math.max(0, size.width - corner * 2), corner];
  const rows = [corner, Math.max(0, size.height - corner * 2), corner];
  const sourceColumns = [art.cap, art.width - art.cap * 2, art.cap];
  const sourceRows = [art.cap, art.height - art.cap * 2, art.cap];
  return (
    <View
      testID={`notebook-picker-surface-${kind}`}
      accessible={false}
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={({ nativeEvent: { layout } }) => setSize((old) =>
        old.width === layout.width && old.height === layout.height
          ? old : { width: layout.width, height: layout.height })}>
      {size.width > 0 && size.height > 0 ? rows.flatMap((height, row) => columns.map((width, column) => {
        const x = columns.slice(0, column).reduce((sum, value) => sum + value, 0);
        const y = rows.slice(0, row).reduce((sum, value) => sum + value, 0);
        const sourceX = sourceColumns.slice(0, column).reduce((sum, value) => sum + value, 0);
        const sourceY = sourceRows.slice(0, row).reduce((sum, value) => sum + value, 0);
        const scaleX = width / sourceColumns[column];
        const scaleY = height / sourceRows[row];
        return (
          <View key={`${row}-${column}`} style={{ position: 'absolute', left: x, top: y, width, height, overflow: 'hidden' }}>
            <Image
              accessible={false}
              source={art.source}
              fadeDuration={0}
              resizeMode="stretch"
              style={{ position: 'absolute', left: -sourceX * scaleX, top: -sourceY * scaleY, width: art.width * scaleX, height: art.height * scaleY }}
            />
          </View>
        );
      })) : null}
    </View>
  );
}

export function PickerNotebookIcon({ notebookId, small = false }: { notebookId?: string; small?: boolean }) {
  let hash = 0;
  for (const character of notebookId ?? '') hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return <Image accessible={false} source={notebookId ? notebooks[hash % notebooks.length] : looseNotes} resizeMode="contain" fadeDuration={0} style={{ width: small ? 28 : 40, height: small ? 32 : 44 }} />;
}

export function PickerSymbol({ name, color = '#503B29' }: { name: 'search' | 'check' | 'plus' | 'up' | 'down' | 'trash'; color?: string }) {
  return (
    <View accessible={false} pointerEvents="none" style={{ zIndex: 1 }}>
    <Svg width={22} height={22} viewBox="0 0 24 24">
      {name === 'search' ? <Circle cx={10} cy={10} r={6.5} stroke={color} strokeWidth={2} fill="none" /> : null}
      <Path
        d={{ search: 'M15 15 L21 21', check: 'M4 12 L10 18 L20 5', plus: 'M12 4 V20 M4 12 H20', up: 'M5 15 L12 8 L19 15', down: 'M5 9 L12 16 L19 9', trash: 'M4 6 H20 M9 6 V3 H15 V6 M6 6 L7 21 H17 L18 6 M10 10 V17 M14 10 V17' }[name]}
        stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
    </View>
  );
}

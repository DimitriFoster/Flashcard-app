import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

const notebooks = [
  require('./assets/deck-icons/notebook-blue.png'),
  require('./assets/deck-icons/notebook-green.png'),
  require('./assets/deck-icons/notebook-coral.png'),
  require('./assets/deck-icons/notebook-purple.png'),
  require('./assets/deck-icons/notebook-yellow.png'),
  require('./assets/deck-icons/notebook-mint.png'),
];

const styles = StyleSheet.create({
  notebookFrame: { width: 54, height: 68, flexShrink: 0, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
  // Include the full export canvas while compensating for its transparent padding.
  notebookImage: { width: 80, height: 80, flexShrink: 0 },
});

export function DeckBook({ deckId }: { deckId: string }) {
  let hash = 0;
  for (const character of deckId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  const source = notebooks[hash % notebooks.length];
  return (
    <View aria-hidden style={styles.notebookFrame}>
      <Image source={source} resizeMode="contain" fadeDuration={0} accessible={false} style={styles.notebookImage} />
    </View>
  );
}

export function ReviewArrow({ color = '#725418', back = false, small = false }: { color?: string; back?: boolean; small?: boolean }) {
  return (
    <Svg aria-hidden width={small ? 18 : 24} height={24} viewBox="0 0 28 28">
      <G transform={back ? 'rotate(180 14 14)' : undefined}>
        <Path d={small ? 'M10 6 L18 14 L10 22' : 'M4 14 L24 14 M16 5 L25 14 L16 23'} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}

export function ReviewPlay({ disabled }: { disabled?: boolean }) {
  return (
    <Svg aria-hidden width={57} height={62} viewBox="0 0 64 68">
      <Circle cx={32} cy={34} r={28} fill="#FFFCF3" stroke="#34312A" strokeWidth={2.5} />
      <Path d="M26 22 L45 34 L26 46 Z" fill={disabled ? '#C8C0B0' : '#8CD8AC'} stroke="#34312A" strokeWidth={2.4} strokeLinejoin="round" />
    </Svg>
  );
}

export function BrowseCardStack() {
  return (
    <Svg aria-hidden width={62} height={68} viewBox="0 0 76 80">
      <G stroke="#38382D" strokeWidth={2.5} strokeLinejoin="round">
        <Path d="M35 9 Q35 6 39 7 L64 11 Q68 12 67 17 L60 65 Q59 69 55 68 L30 64 Z" fill="#9BCADB" />
        <Path d="M23 10 Q23 7 27 7 L50 6 Q54 6 54 11 L56 62 Q56 65 52 66 L26 67 Z" fill="#EEA49C" />
        <Path d="M9 22 Q7 18 12 17 L34 12 Q39 11 40 16 L51 64 Q52 69 47 70 L22 76 Q18 77 17 72 Z" fill="#F9D779" />
        <Path d="M19 29 L31 26 L32 29 L20 32 Z" fill="none" stroke="#B29243" strokeWidth={1.5} />
      </G>
    </Svg>
  );
}

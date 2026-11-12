import { Image, StyleSheet, View } from 'react-native';

const papers = {
  quick: [
    [require('./assets/loose-notes/quick-note-paper-stack-0-0.png'), require('./assets/loose-notes/quick-note-paper-stack-0-1.png'), require('./assets/loose-notes/quick-note-paper-stack-0-2.png')],
    [require('./assets/loose-notes/quick-note-paper-stack-1-0.png'), require('./assets/loose-notes/quick-note-paper-stack-1-1.png'), require('./assets/loose-notes/quick-note-paper-stack-1-2.png')],
    [require('./assets/loose-notes/quick-note-paper-stack-2-0.png'), require('./assets/loose-notes/quick-note-paper-stack-2-1.png'), require('./assets/loose-notes/quick-note-paper-stack-2-2.png')],
  ],
  blush: [
    [require('./assets/loose-notes/loose-note-paper-blush-0-0.png'), require('./assets/loose-notes/loose-note-paper-blush-0-1.png'), require('./assets/loose-notes/loose-note-paper-blush-0-2.png')],
    [require('./assets/loose-notes/loose-note-paper-blush-1-0.png'), require('./assets/loose-notes/loose-note-paper-blush-1-1.png'), require('./assets/loose-notes/loose-note-paper-blush-1-2.png')],
    [require('./assets/loose-notes/loose-note-paper-blush-2-0.png'), require('./assets/loose-notes/loose-note-paper-blush-2-1.png'), require('./assets/loose-notes/loose-note-paper-blush-2-2.png')],
  ],
  blue: [
    [require('./assets/loose-notes/loose-note-paper-blue-0-0.png'), require('./assets/loose-notes/loose-note-paper-blue-0-1.png'), require('./assets/loose-notes/loose-note-paper-blue-0-2.png')],
    [require('./assets/loose-notes/loose-note-paper-blue-1-0.png'), require('./assets/loose-notes/loose-note-paper-blue-1-1.png'), require('./assets/loose-notes/loose-note-paper-blue-1-2.png')],
    [require('./assets/loose-notes/loose-note-paper-blue-2-0.png'), require('./assets/loose-notes/loose-note-paper-blue-2-1.png'), require('./assets/loose-notes/loose-note-paper-blue-2-2.png')],
  ],
  sage: [
    [require('./assets/loose-notes/loose-note-paper-sage-0-0.png'), require('./assets/loose-notes/loose-note-paper-sage-0-1.png'), require('./assets/loose-notes/loose-note-paper-sage-0-2.png')],
    [require('./assets/loose-notes/loose-note-paper-sage-1-0.png'), require('./assets/loose-notes/loose-note-paper-sage-1-1.png'), require('./assets/loose-notes/loose-note-paper-sage-1-2.png')],
    [require('./assets/loose-notes/loose-note-paper-sage-2-0.png'), require('./assets/loose-notes/loose-note-paper-sage-2-1.png'), require('./assets/loose-notes/loose-note-paper-sage-2-2.png')],
  ],
};

export type LoosePaperTone = Exclude<keyof typeof papers, 'quick'>;

export function LooseNotePaper({ kind }: { kind: keyof typeof papers }) {
  const cap = kind === 'quick' ? 44 : 32;
  return (
    <View accessible={false} pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Fixed folds and corners; only blank centers and straight edges stretch. */}
      {papers[kind].map((row, r) => (
        <View key={r} style={[styles.row, r === 1 ? styles.flex : { height: cap }]}>
          {row.map((source, c) => (
            <Image key={c} accessible={false} source={source} fadeDuration={0} resizeMode="stretch"
              style={[styles.piece, c === 1 ? styles.flex : { width: cap }]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', minHeight: 0 },
  flex: { flex: 1, minWidth: 0, minHeight: 0 },
  piece: { height: '100%' },
});

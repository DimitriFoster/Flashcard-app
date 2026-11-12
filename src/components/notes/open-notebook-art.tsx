import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const frame = [
  [require('./assets/open-notebook/frame-0-0.png'), require('./assets/open-notebook/frame-0-1.png'), require('./assets/open-notebook/frame-0-2.png')],
  [require('./assets/open-notebook/frame-1-0.png'), require('./assets/open-notebook/frame-1-1.png'), require('./assets/open-notebook/frame-1-2.png')],
  [require('./assets/open-notebook/frame-2-0.png'), require('./assets/open-notebook/notebook-page-edges.png'), require('./assets/open-notebook/frame-2-2.png')],
];
const loop = require('./assets/open-notebook/notebook-binding-loop.png');
const bookmark = require('./assets/open-notebook/notebook-bookmark.png');
const button = [
  require('./assets/open-notebook/button-left.png'),
  require('./assets/open-notebook/button-center.png'),
  require('./assets/open-notebook/button-right.png'),
];
export const notebookNoteIcon = require('./assets/open-notebook/note-page-icon.png');

export function OpenNotebookArt({ color }: { color: string }) {
  return (
    <View accessible={false} pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View testID="open-notebook-cover-fill" style={[styles.cover, { backgroundColor: color }]} />
      {/* Fixed corners; only the blank center and straight edges adapt in size. */}
      <View style={StyleSheet.absoluteFill}>
        {frame.map((row, r) => (
          <View key={r} style={[styles.frameRow, r === 1 ? styles.flex : styles.capHeight]}>
            {row.map((source, c) => (
              <Image key={c} source={source} accessible={false} fadeDuration={0} resizeMode="stretch"
                style={[styles.piece, c === 1 ? styles.flex : styles.capWidth]} />
            ))}
          </View>
        ))}
      </View>
      {[14, 38, 62, 86].map((position) => (
        <Image key={position} source={loop} accessible={false} fadeDuration={0} resizeMode="contain"
          style={[styles.loop, { top: `${position}%` }]} />
      ))}
      <Image source={bookmark} accessible={false} fadeDuration={0} resizeMode="contain" style={styles.bookmark} />
    </View>
  );
}

export function NewNoteButtonArt() {
  const [height, setHeight] = useState(54);
  return (
    <View accessible={false} pointerEvents="none" style={[StyleSheet.absoluteFill, styles.frameRow]}
      onLayout={({ nativeEvent }) => setHeight(nativeEvent.layout.height)}>
      {button.map((source, index) => (
        <Image key={index} source={source} accessible={false} fadeDuration={0} resizeMode="stretch"
          style={[styles.piece, index === 1 ? styles.flex : { width: height / 2 }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { ...StyleSheet.absoluteFillObject, margin: 1, borderRadius: 22 },
  frameRow: { flexDirection: 'row', minHeight: 0 },
  flex: { flex: 1, minWidth: 0, minHeight: 0 },
  capHeight: { height: 32 },
  capWidth: { width: 32 },
  piece: { height: '100%' },
  loop: { position: 'absolute', left: -2, width: 24, height: 12 },
  bookmark: { position: 'absolute', right: 22, top: -3, width: 25, height: 44 },
});

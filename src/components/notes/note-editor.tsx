import { Platform, StyleSheet, Text, UIManager, View } from 'react-native';
import { COLORS } from '@/constants/design';
import { PlainNoteEditor } from './plain-note-editor';
import type { NoteEditorProps } from './note-editor.types';

export type { NoteEditorHandle } from './note-editor.types';

export function NoteEditor(props: NoteEditorProps) {
  const available = Platform.OS !== 'web' && Boolean(UIManager.getViewManagerConfig('EnrichedTextInputView'));
  if (available) {
    // Avoid evaluating native bindings on older APKs or on the web fallback.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { RichNoteEditor } = require('./rich-note-editor') as typeof import('./rich-note-editor');
    return <RichNoteEditor {...props} />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.notice}>{props.richText ? 'Open this formatted note in the updated mobile app to edit it.' : 'Formatting tools are available in the updated mobile app.'}</Text>
      <PlainNoteEditor {...props} armed={!props.richText && props.armed} onSurfacePress={props.richText ? () => {} : props.onSurfacePress} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  notice: { padding: 10, color: COLORS.ink, backgroundColor: '#F8EDCE', fontSize: 12 },
});

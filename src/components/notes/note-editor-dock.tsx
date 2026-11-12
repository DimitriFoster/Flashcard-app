import { createContext, useContext, useLayoutEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Platform, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getEditorVisibleHeight } from '@/lib/note-editor-scroll';

const ToolbarContent = createContext<ReactNode>(null);
const ToolbarRegistration = createContext<Dispatch<SetStateAction<ReactNode>> | null>(null);

export function NoteEditorToolbarProvider({ children }: { children: ReactNode }) {
  const [toolbar, setToolbar] = useState<ReactNode>(null);
  return (
    <ToolbarRegistration.Provider value={setToolbar}>
      <ToolbarContent.Provider value={toolbar}>{children}</ToolbarContent.Provider>
    </ToolbarRegistration.Provider>
  );
}

export function useNoteEditorToolbar() {
  return useContext(ToolbarRegistration);
}

export function NoteEditorToolbarDock({ keyboardVisible }: { keyboardVisible: boolean }) {
  const toolbar = useContext(ToolbarContent);
  const insets = useSafeAreaInsets();
  if (!toolbar) return <View style={{ height: keyboardVisible ? 0 : insets.bottom }} />;
  return (
    <View testID="note-editor-toolbar-dock" style={[styles.dock, {
      paddingBottom: keyboardVisible ? 0 : insets.bottom,
      paddingLeft: insets.left, paddingRight: insets.right,
    }]}>
      {toolbar}
    </View>
  );
}

// Resize the whole editor workspace, not just its text. The dock remains in normal
// layout, so its actual height is excluded from the native input's caret viewport.
export function NoteKeyboardFrame({ keyboardTop, children }: { keyboardTop?: number; children: ReactNode }) {
  const container = useRef<View>(null);
  const { width, height } = useWindowDimensions();
  const [viewport, setViewport] = useState({ top: 0, height: 0 });
  function measure() {
    container.current?.measureInWindow((_x, top, _width, measuredHeight) => {
      setViewport((current) => current.top === top && current.height === measuredHeight ? current : { top, height: measuredHeight });
    });
  }
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [keyboardTop, width, height]);
  const top = viewport.top + (Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0);
  const visibleHeight = getEditorVisibleHeight(viewport.height, top, keyboardTop);
  return (
    <View ref={container} collapsable={false} onLayout={measure} style={styles.fill}>
      <View testID="note-keyboard-frame" style={[styles.fill, viewport.height > 0 && { flex: 0, height: visibleHeight }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, minHeight: 0 },
  dock: { flexShrink: 0, backgroundColor: '#FCF5E7' },
});

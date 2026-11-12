import { useImperativeHandle, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import {
  PixelRatio, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput,
  useWindowDimensions, View,
} from 'react-native';

import { COLORS } from '@/constants/design';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import {
  getCaretLine, getCaretScrollOffset, getEditorVisibleHeight, getSelectionAfterEdit,
  type EditorTextLine,
} from '@/lib/note-editor-scroll';

import { RuledNotebookPaper } from './ruled-notebook-paper';

const TEXT_TOP = 47;
const TEXT_BOTTOM = 38;
const LINE_HEIGHT = 28;
// Keeps the final empty row measurable after Enter without changing the saved text.
const MEASUREMENT_END = '\u200B';

type Props = {
  value: string;
  inputRef: RefObject<Pick<TextInput, 'focus' | 'blur'> | null>;
  armed: boolean;
  keyboardTop?: number;
  placeholder: string;
  onChangeText: (value: string) => void;
  onSurfacePress: () => void;
  onBlur: () => void;
};

export function PlainNoteEditor({ value, inputRef, armed, keyboardTop, placeholder, onChangeText, onSurfacePress, onBlur }: Props) {
  const nativeInputRef = useRef<TextInput>(null);
  useImperativeHandle(inputRef, () => ({ focus: () => nativeInputRef.current?.focus(), blur: () => nativeInputRef.current?.blur() }), []);
  const { fontScale, width, height } = useWindowDimensions();
  const lineHeight = PixelRatio.roundToNearestPixel(LINE_HEIGHT * fontScale);
  const fontSize = PixelRatio.roundToNearestPixel(17 * fontScale);
  const scrollRef = useRef<ScrollView>(null);
  const viewportRef = useRef<View>(null);
  const textMeasureRef = useRef<Text>(null);
  const caretMeasureRef = useRef<Text>(null);
  const offsetRef = useRef(0);
  const pendingRevealRef = useRef(false);
  const valueRef = useRef(value);
  const [focused, setFocused] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const selectionRef = useRef(selection);
  const [viewport, setViewport] = useState({ top: 0, height: 0, width: 0 });
  const [renderedHeight, setRenderedHeight] = useState(0);
  const [measurement, setMeasurement] = useState({ value: '', width: 0, fontSize: 0, height: 0, lines: [] as EditorTextLine[] });
  const [webCaret, setWebCaret] = useState({ prefix: '', width: 0, fontSize: 0, height: 0 });
  const measuredText = value + MEASUREMENT_END;
  const caretPrefix = value.slice(0, selection.end) + MEASUREMENT_END;
  // Android's window measurement excludes the status bar, but keyboard screenY includes it.
  const screenTop = viewport.top + (Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0);
  const visibleHeight = getEditorVisibleHeight(viewport.height, screenTop, keyboardTop);
  const overlap = viewport.height - visibleHeight;
  const surfaceHeight = Math.ceil(Math.max(viewport.height, TEXT_TOP + measurement.height + TEXT_BOTTOM + overlap) / lineHeight) * lineHeight;
  const typography = { fontSize, lineHeight };

  function measureViewport() {
    viewportRef.current?.measureInWindow((_x, top, measuredWidth, measuredHeight) => {
      setViewport((current) => {
        if (current.top === top && current.height === measuredHeight && current.width === measuredWidth) return current;
        pendingRevealRef.current = true;
        return { top, height: measuredHeight, width: measuredWidth };
      });
    });
  }

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  useLayoutEffect(() => {
    pendingRevealRef.current = true;
    const frame = requestAnimationFrame(measureViewport);
    return () => cancelAnimationFrame(frame);
  }, [keyboardTop, width, height]);

  useLayoutEffect(() => {
    if (Platform.OS !== 'web') return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      textMeasureRef.current?.measure((_x, _y, _width, measuredHeight) => {
        if (!cancelled) setMeasurement({ value, width: viewport.width, fontSize, height: measuredHeight, lines: [] });
      });
      caretMeasureRef.current?.measure((_x, _y, _width, measuredHeight) => {
        if (!cancelled) setWebCaret({ prefix: caretPrefix, width: viewport.width, fontSize, height: measuredHeight });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [value, caretPrefix, viewport.width, fontSize]);

  useLayoutEffect(() => {
    if (!focused || !armed || !pendingRevealRef.current || visibleHeight <= 0) return;
    if (measurement.value !== value || measurement.width !== viewport.width || measurement.fontSize !== fontSize) return;
    // Wait for the ScrollView to commit its new extent before revealing a new row.
    if (renderedHeight + 1 < surfaceHeight) return;
    const line = getCaretLine(measurement.lines, selection.end);
    if (Platform.OS === 'web' && (webCaret.prefix !== caretPrefix || webCaret.width !== viewport.width || webCaret.fontSize !== fontSize)) return;
    if (Platform.OS !== 'web' && !line) return;
    const caretTop = TEXT_TOP + (Platform.OS === 'web' ? Math.max(0, webCaret.height - lineHeight) : line!.y);
    const caretBottom = caretTop + Math.max(lineHeight, line?.height ?? lineHeight);
    const frame = requestAnimationFrame(() => {
      if (!pendingRevealRef.current) return;
      pendingRevealRef.current = false;
      const next = getCaretScrollOffset({
        caretTop, caretBottom, offset: offsetRef.current, viewportHeight: viewport.height,
        visibleHeight, contentHeight: surfaceHeight, margin: lineHeight,
      });
      if (Math.abs(next - offsetRef.current) < 1) return;
      offsetRef.current = next;
      scrollRef.current?.scrollTo({ y: next, animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [armed, focused, value, measurement, selection, viewport, visibleHeight, surfaceHeight, renderedHeight, lineHeight, fontSize, caretPrefix, webCaret]);

  return (
    <View style={styles.page} testID="note-editor-surface">
      <View ref={viewportRef} collapsable={false} style={styles.clip} onLayout={measureViewport}>
        <ScrollView
          ref={scrollRef}
          testID="note-editor-scroll"
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          automaticallyAdjustKeyboardInsets={false}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={surfaceHeight > viewport.height + lineHeight}
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => { offsetRef.current = nativeEvent.contentOffset.y; }}
          onScrollBeginDrag={() => { pendingRevealRef.current = false; }}
          onContentSizeChange={(_width, contentHeight) => setRenderedHeight(contentHeight)}
          contentContainerStyle={{ minHeight: viewport.height }}>
          <Pressable onPress={onSurfacePress} style={{ height: surfaceHeight, overflow: 'hidden' }}>
            <RuledNotebookPaper height={surfaceHeight} lineHeight={lineHeight} textTop={TEXT_TOP} />
            <Text
              key={`${viewport.width}:${fontSize}`}
              ref={textMeasureRef}
              accessible={false}
              aria-hidden
              importantForAccessibility="no-hide-descendants"
              pointerEvents="none"
              allowFontScaling={false}
              textBreakStrategy="simple"
              lineBreakStrategyIOS="none"
              onTextLayout={Platform.OS === 'web' ? undefined : ({ nativeEvent: { lines } }) => {
                // Ignore an older native layout event delivered after another edit.
                if (lines.map((line) => line.text).join('') !== measuredText) return;
                const last = lines[lines.length - 1];
                setMeasurement({ value, width: viewport.width, fontSize, height: last ? last.y + Math.max(lineHeight, last.height) : lineHeight, lines });
              }}
              style={[styles.measure, styles.typography, typography]}>
              {measuredText}
            </Text>
            {Platform.OS === 'web' ? (
              <Text ref={caretMeasureRef} accessible={false} aria-hidden pointerEvents="none" allowFontScaling={false}
                style={[styles.measure, styles.typography, typography]}>
                {caretPrefix}
              </Text>
            ) : null}
            <TextInput
              ref={nativeInputRef}
              testID="note-editor-input"
              accessibilityLabel="Note text"
              allowFontScaling={false}
              multiline
              scrollEnabled={false}
              textBreakStrategy="simple"
              lineBreakStrategyIOS="none"
              underlineColorAndroid="transparent"
              editable={armed}
              pointerEvents={armed ? 'auto' : 'none'}
              showSoftInputOnFocus={armed}
              value={value}
              onChangeText={(nextValue) => {
                const nextSelection = getSelectionAfterEdit(valueRef.current, nextValue, selectionRef.current);
                valueRef.current = nextValue;
                selectionRef.current = nextSelection;
                pendingRevealRef.current = true;
                setSelection(nextSelection);
                onChangeText(nextValue);
              }}
              onSelectionChange={({ nativeEvent }) => {
                if (!nativeEvent.selection) return;
                selectionRef.current = nativeEvent.selection;
                pendingRevealRef.current = true;
                setSelection(nativeEvent.selection);
              }}
              onFocus={() => { pendingRevealRef.current = true; setFocused(true); }}
              onBlur={() => { pendingRevealRef.current = false; setFocused(false); onBlur(); }}
              onPressIn={onSurfacePress}
              placeholder={placeholder}
              placeholderTextColor={COLORS.muted}
              selectionColor={COLORS.note}
              style={[styles.input, styles.typography, typography, { height: surfaceHeight }]}
              textAlignVertical="top"
            />
          </Pressable>
        </ScrollView>
      </View>
      <View pointerEvents="none" style={styles.bindingShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  clip: { flex: 1, overflow: 'hidden' },
  input: {
    color: COLORS.ink, backgroundColor: 'transparent', padding: 0,
    paddingTop: TEXT_TOP, paddingBottom: TEXT_BOTTOM, paddingHorizontal: 24,
  },
  measure: { position: 'absolute', top: TEXT_TOP, left: 24, right: 24, opacity: 0 },
  typography: { fontFamily: FOLIO_HAND_FONT, fontWeight: '400', includeFontPadding: false },
  bindingShadow: {
    position: 'absolute', top: 0, bottom: 0, left: 0, width: 12,
    backgroundColor: 'rgba(42, 36, 31, 0.035)', borderRightColor: 'rgba(42, 36, 31, 0.055)', borderRightWidth: 1,
  },
});

export type EditorSelection = { start: number; end: number };
export type EditorTextLine = { text: string; y: number; height: number };

export function getEditorVisibleHeight(height: number, top: number, keyboardTop?: number) {
  return Math.max(0, Math.min(height, keyboardTop === undefined ? height : keyboardTop - top));
}

export function getCaretLine(lines: readonly EditorTextLine[], selectionEnd: number) {
  let end = 0;
  for (let index = 0; index < lines.length; index += 1) {
    end += lines[index].text.length;
    if (selectionEnd < end || index === lines.length - 1) return lines[index];
  }
  return undefined;
}

export function getCaretScrollOffset({
  caretTop, caretBottom, offset, viewportHeight, visibleHeight, contentHeight, margin,
}: {
  caretTop: number;
  caretBottom: number;
  offset: number;
  viewportHeight: number;
  visibleHeight: number;
  contentHeight: number;
  margin: number;
}) {
  if (visibleHeight <= 0) return offset;
  const gap = Math.min(margin, Math.max(0, (visibleHeight - (caretBottom - caretTop)) / 2));
  let next = offset;
  if (caretBottom > offset + visibleHeight - gap) {
    next = caretBottom - visibleHeight + gap;
  } else if (caretTop < offset + gap) {
    next = caretTop - gap;
  }
  return Math.max(0, Math.min(next, Math.max(0, contentHeight - viewportHeight)));
}

// Text and selection events can arrive separately. Predict only the changed range,
// never the end of the document, until the native selection event catches up.
export function getSelectionAfterEdit(previous: string, next: string, selection: EditorSelection): EditorSelection {
  if (previous === next) return selection;
  const insertedLength = next.length - previous.length + selection.end - selection.start;
  if (insertedLength >= 0 &&
      next.slice(0, selection.start) === previous.slice(0, selection.start) &&
      next.slice(selection.start + insertedLength) === previous.slice(selection.end)) {
    const end = selection.start + insertedLength;
    return { start: end, end };
  }
  let prefix = 0;
  while (prefix < previous.length && prefix < next.length && previous[prefix] === next[prefix]) prefix += 1;
  let suffix = 0;
  while (suffix < previous.length - prefix && suffix < next.length - prefix &&
      previous[previous.length - suffix - 1] === next[next.length - suffix - 1]) suffix += 1;
  const end = next.length - suffix;
  return { start: end, end };
}

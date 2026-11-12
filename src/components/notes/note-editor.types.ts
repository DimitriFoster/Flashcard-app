import type { RefObject } from 'react';
import type { RichNoteText } from '@/types/note';

export type NoteEditorHandle = { focus: () => void; blur: () => void };
export type NoteEditorProps = {
  value: string;
  richText?: RichNoteText;
  inputRef: RefObject<NoteEditorHandle | null>;
  armed: boolean;
  keyboardTop?: number;
  placeholder: string;
  onChangeText: (value: string, richText?: RichNoteText) => void;
  onSurfacePress: () => void;
  onBlur: () => void;
};

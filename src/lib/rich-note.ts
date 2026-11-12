import { Parser } from 'htmlparser2';

import type { RichNoteText } from '@/types/note';

export const MAX_NOTE_HTML = 1024 * 1024;
export const MAX_NOTE_TEXT = 256 * 1024;
const INLINE = new Set(['b', 'i', 'u', 's', 'code']);
const BLOCK = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']);
const CONTAINER = new Set(['html', 'ul', 'ol', 'blockquote', 'codeblock']);
const DROP = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'template']);
const ALIASES: Record<string, string> = { strong: 'b', em: 'i', strike: 's', div: 'p' };

export function escapeNoteText(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function plainNoteHtml(text: string) {
  // Explicit empty paragraphs preserve blank lines and never interpret old notes as HTML.
  return '<html>' + text.split('\n').map((line) => `<p>${escapeNoteText(line) || '<br>'}</p>`).join('') + '</html>';
}

/** Rebuild a small formatting-only language. No URLs, CSS, images, or event attributes survive. */
export function sanitizeNoteHtml(input: string): { html: string; body: string } {
  if (input.length > MAX_NOTE_HTML) throw new Error('This note is too large to format. Split it into smaller notes.');
  const html: string[] = [];
  const lines: string[] = [];
  let line = '';
  let blockDepth = 0;
  let breaksInBlock = 0;
  let dropped = 0;
  let tags = 0;
  let depth = 0;
  const stack: { tag: string; emit: boolean; drop: boolean }[] = [];
  const parser = new Parser({
    onopentag(raw, attrs) {
      if (++tags > 50000 || ++depth > 64) throw new Error('This note has too much nested formatting.');
      const tag = Object.hasOwn(ALIASES, raw) ? ALIASES[raw] : raw;
      const drop = DROP.has(tag);
      if (drop) dropped++;
      const emit = !dropped && (INLINE.has(tag) || BLOCK.has(tag) || CONTAINER.has(tag) || tag === 'br');
      stack.push({ tag, emit, drop });
      if (!emit) return;
      if (BLOCK.has(tag)) {
        if (line) { lines.push(line); line = ''; }
        blockDepth++;
        breaksInBlock = 0;
      }
      let attributes = '';
      if (tag === 'ul' && attrs['data-type'] === 'checkbox') attributes = ' data-type="checkbox"';
      if (tag === 'li' && Object.hasOwn(attrs, 'checked') && attrs.checked !== 'false') attributes = ' checked';
      const alignment = attrs.style?.match(/^\s*text-align\s*:\s*(left|center|right)\s*;?\s*$/i)?.[1]?.toLowerCase();
      if (BLOCK.has(tag) && alignment) attributes += ` style="text-align: ${alignment}"`;
      if (tag !== 'html') html.push(`<${tag}${attributes}>`);
      if (tag === 'br') {
        if (blockDepth) { if (line || breaksInBlock > 0) { lines.push(line); line = ''; } breaksInBlock++; }
        else { lines.push(line); line = ''; }
      }
    },
    ontext(text) {
      if (dropped) return;
      // Inter-tag pretty-printing whitespace is not note content.
      if (!blockDepth && !line && /^\s+$/.test(text)) return;
      html.push(escapeNoteText(text));
      line += text;
    },
    onclosetag() {
      const entry = stack.pop();
      if (!entry) return;
      depth--;
      if (entry.emit) {
        if (BLOCK.has(entry.tag)) { lines.push(line); line = ''; blockDepth--; }
        if (entry.tag !== 'html' && entry.tag !== 'br') html.push(`</${entry.tag}>`);
      }
      if (entry.drop) dropped--;
    },
  }, { decodeEntities: true });
  parser.end(input);
  if (line) lines.push(line);
  const body = lines.join('\n');
  if (body.length > MAX_NOTE_TEXT) throw new Error('This note is too long. Split it into smaller notes.');
  return { html: `<html>${html.join('')}</html>`, body };
}

export function normalizeRichNote(value: unknown, body: string): RichNoteText | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const candidate = value as Partial<RichNoteText>;
  if (candidate.version !== 1 || typeof candidate.html !== 'string') return undefined;
  try {
    const safe = sanitizeNoteHtml(candidate.html);
    // Never let stale or corrupt formatting replace the plain-text source of truth.
    return safe.body === body ? { version: 1, html: safe.html } : undefined;
  } catch { return undefined; }
}

# Folio native editor policy

The mobile Focused Editor uses `react-native-enriched-html` 1.1.1, not a WebView.
The version is pinned because `postinstall.mjs` applies audited native patches:

- Clipboard paste accepts bounded plain text only, not HTML, RTF, or images.
- Android rich-content URI input is consumed without reading or copying it.
- iOS text-view drops are rejected instead of entering UIKit's rich-content path.
- A paste cannot grow the note past 262,144 UTF-16 code units.

The patch is idempotent and fails installation if its expected source changes.
Re-review native paste and drag/drop paths before upgrading the editor. Do not
remove the patch to make an upgrade pass. Do not enable images or link handling
without reviewing local-file and network access.

`src/lib/rich-note.ts` independently allowlists stored formatting and strips
attributes, URLs, scripts, and unsupported elements. Plain text is retained for
search, previews, and compatibility. Older APKs and web use a plain-text fallback;
formatted notes are read-only there so editing cannot silently discard formatting.

The toolbar supports emphasis, headings, lists, checklists, quotes, and alignment.
Multicolor highlighting is intentionally not supported by this native editor.

## Verification

Run `node packages/folio-editor-hardening/postinstall.mjs` twice to check
idempotence, then run lint, TypeScript, and the note/import tests. Native changes
require rebuilding the app, not just refreshing Metro.

On Android and iOS, check selection formatting, save/reopen, formatting-only saves,
Enter/wrapping after manual scrolling, and keyboard dismissal. Confirm that HTML
paste remains plain text and images/URI content cannot enter the editor.

Deck imports are separate from note paste. Their native pickers bound reads to
1 MiB and release document access after reading. Backups are schema-validated
before confirmation and committed with a rollback journal. PDF-backed notes are
not restored from JSON metadata; import their actual files separately.

The iOS drop restriction uses Apple's
[text-drop delegate](https://developer.apple.com/documentation/uikit/uitextdropdelegate)
to reject drops before UIKit processes their content. iOS still requires a native
build and physical-device verification; Android verification does not cover it.

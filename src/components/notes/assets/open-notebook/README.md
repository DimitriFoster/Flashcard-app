# Open Notebook Artwork

Generated from the approved Folio open-notebook mockup with the built-in image
generation tool. All five master PNGs have true alpha transparency. Text and
interactions are native React Native controls, not part of the artwork.

## Assets

- `notebook-frame-ink.png`: empty paper, brown contours, transparent cover rim.
- `frame-0-*.png`, `frame-1-*.png`, `frame-2-0.png`, `frame-2-2.png`:
  frame slices; corners are fixed, straight edges adapt in one direction.
- `notebook-page-edges.png`: bottom-center frame slice with layered paper detail.
- `notebook-binding-loop.png`: one loop, used four times along the spine.
- `notebook-bookmark.png`: mint bookmark, rendered independently at the top.
- `note-page-icon.png`: folded page illustration for note rows and empty state.
- `new-note-button-shell.png`: mint button without text or symbols.
- `button-left.png`, `button-center.png`, `button-right.png`: button slices.

The frame master is 1000 x 1336; source caps are 100 x 100 and display at 32 dp.
The button master is 1000 x 154; 77 px end caps preserve their proportions.
Only blank centers and straight edges stretch. No repeating image textures.

## Color Matching

Instead of a separate cover-fill bitmap, a native colored View sits underneath
the transparent frame rim. This is simpler and keeps color changes exact without
tinting the paper or ink. `getNotebookAppearance(id)` supplies both the existing
bookshelf cover key and its representative pastel color. Its hash and eight-key
order preserve existing assignments. Names and shelf membership do not affect it.
No storage migration or native dependency was added. The bookmark stays mint.

## Generation Prompts

Each asset was generated separately using the approved mockup as a reference:

1. Extract the empty notebook shell: remove all content, binding loops and ribbon;
   retain white paper and brown contours; make the cover rim and exterior truly
   transparent, with no yellow fill or text.
2. Extract one short curved tan binding loop, dark brown fine outlines, isolated
   on transparency, no notebook or other objects.
3. Extract the mint ribbon with folded top and V-cut bottom, preserve the original
   stationery style, isolated on transparency.
4. Extract one ivory folded-page icon with yellow corner and three placeholder
   strokes, no text, isolated on transparency.
5. Extract the long mint button shell, remove text and plus, preserve the outline
   and rounded corners, transparent exterior, nearly straight stretchable middle.

Exports only trim empty padding, resize, and slice the generated art. The master
PNGs remain available here for future resizing. The repository-local preparation
script is `tools/prepare-open-notebook-art.cjs` (tools are ignored by this repo).

## Verification

- `npm run lint`: no errors; eight pre-existing project warnings.
- `npx tsc --noEmit`: passed.
- 22 focused tests: appearance/hash compatibility, note drafts/storage, shelves.
- Browser interaction checks: rename, sort, open existing note, create/save in
  the correct notebook, move to Loose notes without pruning other notebooks,
  all eight cover colors, empty state, and a long notebook title.
- Viewports: 320x568, 360x640, 393x873, 430x932, 768x1024, 873x393.
- Android bundle and Hermes bytecode export passed; this is not a new APK.
- Native keyboard, safe-area, and long-press behavior still need device testing;
  no Android device/emulator was attached during this implementation.

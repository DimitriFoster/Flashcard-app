# Loose Notes Artwork

Four blank paper masters generated with the built-in image generation tool from
the approved Loose notes mockup. Each has real alpha transparency outside the
paper. There is no baked-in text, icon, field, button, or repeated texture.

| Master | Size | Source corner cap | Display corner |
| --- | --- | --- | --- |
| quick-note-paper-stack.png | 1080 x 777 | 160 px | 44 dp |
| loose-note-paper-blush.png | 1080 x 339 | 108 px | 32 dp |
| loose-note-paper-blue.png | 1080 x 345 | 108 px | 32 dp |
| loose-note-paper-sage.png | 1080 x 346 | 108 px | 32 dp |

The 36 `*-row-column.png` derivatives are nine-slice exports. Corners and folds
stay fixed; straight edges stretch in one direction and blank centers in two.
`loose-note-paper.tsx` consumes those slices rather than scaling whole sheets.
The masters are retained for future exports but are not bundled by the UI.
Preparation: `node tools/prepare-loose-note-art.cjs` (local tools are gitignored).

## Native Layers

- The cream background, titles, previews, dates, count and helper text are native.
- Quick note is a real multiline TextInput above the decorative layer.
- The mint button reuses the existing open-notebook button slices.
- Icons reuse the existing SVG dependency and Folio stroke treatment.
- All actions use real Pressables with accessibility labels and stable test IDs.
- Note IDs determine decorative paper colors so they do not change on reordering.
- Existing persistence, assignment, new-notebook and delete-confirmation handlers
  are retained. The full editor and notebook overview are unchanged.

## Generation Prompts

All four were created with the built-in image tool, not the CLI. Only transparent
padding trimming, resizing and slicing were performed afterward.

1. Quick note: Extract/recreate ONLY the blank Quick note paper stack artwork from
   the supplied Folio mobile mockup. Remove ALL text, pencil icon, check, green
   button and any other contents. Preserve the near-white front paper, small
   buttery yellow folded top-right corner, thin warm brown slightly organic
   outline, two slightly offset pale yellow backing sheets and very subtle soft
   shadow. Transparent exterior with real alpha, no cream rectangle behind it,
   no checkerboard drawn into pixels. Front-facing, upright, square-ish wide
   rectangle around 1080 wide by 800 tall. Front sheet straight almost horizontal
   and vertical sides with rounded corners; backing sheet offsets restrained to
   a narrow perimeter so the large center is completely blank, near-white and
   uniform. This is a reusable UI background that will be nine-sliced: keep all
   folds and distinct detail within the outer 90 pixels and avoid long diagonal
   paper lines crossing the center. Include entire art with a tiny transparent
   margin, no clipping. No lettering, icons, lines, watermark or other objects.
   Preserve the clean warm stationery aesthetic, not crayon texture.
2. Blush: Extract/recreate ONLY the FIRST SAVED NOTE paper card artwork below
   YOUR LOOSE NOTES from the reference app mockup, as a completely blank reusable
   UI background. Preserve thin warm dark brown hand-inked outline, nearly white
   paper fill, very small pale blush pink folded TOP RIGHT corner, softly rounded
   other corners and a subtle warm shadow. Remove ALL title, body, date, chevron,
   ellipsis and every mark from interior. One single front-facing horizontal
   paper rectangle about 1080px wide by 330px tall, not skewed or rotated, no extra
   backing sheets. Large center perfectly blank, almost uniform near-white. Fold
   and rounded corner details confined within outer 70px to allow nine-slice
   scaling. Real alpha transparency outside artwork including around shadow, no
   opaque backdrop, no checkerboard pixels. Entire outline inside canvas with
   small margin. No text, icon, ruled lines or border decoration. Clean warm
   Folio stationery aesthetic, not rough crayon texture.
3. Blue: Precise variant edit of the supplied blank Folio paper card. Change ONLY
   the small blush pink folded top-right triangle to soft pale powder blue
   #DCEAF3. Preserve EVERYTHING else: exact framing, dimensions and aspect ratio,
   white blank paper, thin warm brown outline, fold shape, rounded corners,
   gentle shadow and genuine transparent exterior. Do not add text, icons,
   lines, backing sheets or objects. The interior stays completely blank white.
4. Sage: Same precise variant prompt as blue, using soft pale sage green #DFE9D3
   for the folded triangle and leaving the paper, outline and shadow unchanged.

## Verification

- TypeScript passed; lint has no errors and eight pre-existing warnings.
- Android production bundle and Hermes bytecode export succeeded.
- 28 focused tests passed (drafts, storage, reopening, notebook appearance/shelves).
- Browser checks passed at 320x568, 360x640, 393x873, 430x932, 768x1024 and 873x393:
  48dp controls, blank-save guard, save/reload/open, notebook assignment/creation,
  empty state and long titles. No runtime or console errors.
- Native keyboard and deletion-confirmation testing still requires a device.
- Local browser checks: `node tools/check-loose-notes.cjs`.

# Folio review page mockup update — Round 7

This round focuses on the remaining clipping around the **Undo** header button and the **Easy** grade button.

## What changed

- Re-sliced the header action PNGs from the saved disassembled mockup sheet using a stricter transparency-matte process:
  - `assets/folio-ui/review/header/undo_button_round7.png`
  - `assets/folio-ui/review/header/edit_button_round7.png`
  - `assets/folio-ui/review/header/help_button_round7.png`
- Re-sliced the full grade button row from the saved disassembled mockup sheet using the same matte process:
  - `assets/folio-ui/review/grade/again_button_round7.png`
  - `assets/folio-ui/review/grade/hard_button_round7.png`
  - `assets/folio-ui/review/grade/good_button_round7.png`
  - `assets/folio-ui/review/grade/easy_button_round7.png`
- Updated `src/folio-review/folioReviewAssets.ts` to reference the round 7 filenames. This avoids stale Expo/Metro image caching on the old filenames.
- Updated `src/folio-review/FolioAssetButton.tsx` so asset buttons explicitly render with `overflow: 'visible'`.

## Why this should fix the issue

The previous `undo_button.png` and `easy_button.png` files were not being regenerated, but the matte/crop pass had removed or clipped a few pixels too aggressively. The visual clipping was in the PNG prep, not the page layout.

This update keeps the saved mockup art, re-slices the assets with more generous crop bounds, fills accidental transparent holes inside the button art, and uses new filenames to force Expo/Metro to pick up the corrected images.

## Important when testing

Run Expo with cache cleared after applying this update:

```bash
npx expo start -c
```

Then reload the app in Expo Go.

## Validation

See:

`Docs/folio-review-page-mockup-update/PNG_MATTE_VALIDATION_ROUND_7.md`

That file lists each corrected PNG canvas, opaque bounding box, and margin values.

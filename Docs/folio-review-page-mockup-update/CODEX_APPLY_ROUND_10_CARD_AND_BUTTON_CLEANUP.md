# Round 10 — card cleanup, Review icon padding, square difficulty buttons

Apply this package over the current Folio project.

## What changed

- `folioReviewAssets.ts` now points at new round 10 asset filenames so Metro/Expo does not reuse old cached PNGs.
- Added `review_active_icon_round10.png` with extra transparent canvas around the active Review icon to prevent the right edge from appearing cut off.
- Added `card_front_surface_round10.png` and `card_stack_back_layers_round10.png` with leftover checkerboard/matte pixels cleaned from the lower card/shadow area.
- Added square difficulty-button assets: `again_button_round10_square.png`, `hard_button_round10_square.png`, `good_button_round10_square.png`, and `easy_button_round10_square.png`. These are derived from the saved disassembled PNGs, not regenerated.
- Updated `GradeButtonRow.tsx` so the difficulty buttons use more of the vertical space and render closer to square with rounded edges.
- Slightly increased the bottom Review icon render size while using the safer padded asset.

## After applying

Clear Metro cache so the new PNG filenames and layout changes are used:

```powershell
npx expo start --dev-client -c
```

If the dev client is already open, fully close and reopen it after the cache clear.

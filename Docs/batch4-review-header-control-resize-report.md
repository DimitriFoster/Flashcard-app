# Batch 4 Review Header-Control PNG Resize Report

Date: 2026-07-13
Status: **Blocked before image processing**

## Blocking Discrepancy

The requested safety gate found current rendered uses substantially larger than the expected header-control sizes. `FolioAssetButton` applies the passed `height` and `width` to the image itself, so these are rendered image dimensions rather than touch-target-only dimensions.

| Asset | Expected maximum | Largest current rendered size | Difference | Result |
| --- | ---: | ---: | ---: | --- |
| `back_button.png` | approximately 50 x 50 dp | 58 x 58 dp | +16.0% per dimension | Blocked |
| `undo_button_round7.png` | approximately 43 x 43 dp | 51 x 51 dp | +18.6% per dimension | Blocked |
| `edit_button_round7.png` | approximately 43 x 43 dp | 51 x 51 dp | +18.6% per dimension | Blocked |
| `help_button_round7.png` | approximately 43 x 43 dp | 52 x 52 dp | +20.9% per dimension | Blocked |

The expected sizes are used by the newer `DeckReviewSession` path: back `50 x 50`, action buttons `43 x 43`, and help `43 x 43`. However, the current `FolioReviewScreen` Review path still renders back at `58 x 58`, undo/edit at `51 x 51`, and help at `52 x 52`. The Browse page also renders the shared back asset at `58 x 58`. Because the project contains these larger current uses, no Batch 4 resize was performed.

## Rendered Uses Inspected

- `src/folio-review/FolioReviewScreen.tsx` and its checked-in generated JS: Review back `58 x 58`, undo/edit `51 x 51`, help `52 x 52`.
- `src/components/review/deck-review-session.tsx` and its checked-in generated JS: Review back `50 x 50`, undo/edit `43 x 43`, help `43 x 43`; Browse back `50 x 50`, edit `43 x 43`, help `43 x 43`.
- `src/app/review/browse.tsx`: Browse back image `58 x 58` inside a `58 x 58` pressable.
- `src/folio-review/FolioAssetButton.tsx`: the supplied button style sets the contained image to `height: 100%` and `width: 100%`.

## Original Asset Inspection

| File | Original dimensions | Original file size | Color mode | Alpha status | Alpha bounding box | Transparent margins (L/T/R/B) |
| --- | ---: | ---: | --- | --- | --- | ---: |
| `assets/folio-ui/review/header/back_button.png` | 269 x 271 | 131,120 bytes | RGBA | Present, extrema `0..255` | `(6, 6) - (263, 265)` | 6 / 6 / 6 / 6 px |
| `assets/folio-ui/review/header/undo_button_round7.png` | 269 x 293 | 127,268 bytes | RGBA | Present, extrema `0..255` | `(24, 24) - (269, 269)` | 24 / 24 / 0 / 24 px |
| `assets/folio-ui/review/header/edit_button_round7.png` | 295 x 294 | 138,432 bytes | RGBA | Present, extrema `0..255` | `(24, 24) - (271, 270)` | 24 / 24 / 24 / 24 px |
| `assets/folio-ui/review/header/help_button_round7.png` | 249 x 254 | 76,782 bytes | RGBA | Present, extrema `0..255` | `(24, 24) - (225, 230)` | 24 / 24 / 24 / 24 px |

## Processing Result

| File | Calculated final dimensions | Final file size | Reduction | Final mode | Final alpha | Aspect-ratio comparison | Validation |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `assets/folio-ui/review/header/back_button.png` | Not processed | Not created | N/A | N/A | N/A | Not applicable | Not run because of size gate |
| `assets/folio-ui/review/header/undo_button_round7.png` | Not processed | Not created | N/A | N/A | N/A | Not applicable | Not run because of size gate |
| `assets/folio-ui/review/header/edit_button_round7.png` | Not processed | Not created | N/A | N/A | N/A | Not applicable | Not run because of size gate |
| `assets/folio-ui/review/header/help_button_round7.png` | Not processed | Not created | N/A | N/A | N/A | Not applicable | Not run because of size gate |

No temporary outputs were created, no originals were replaced, and no Batch 4 backup directory was created because the pre-processing safety gate blocked the batch.

## Totals

| Metric | Value |
| --- | ---: |
| Combined original file size | 473,602 bytes |
| Combined final file size | N/A |
| Combined percentage reduction | N/A |

## Warnings

- Batch 4 cannot safely proceed until the larger Review and Browse image dimensions are resolved or explicitly accepted.
- `folio_wordmark.png` and every PNG outside the four requested header-control assets were left untouched.
- No TypeScript, TSX, styles, imports, filenames, paths, package files, or application logic were changed.

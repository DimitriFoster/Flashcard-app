# Folio Browse Card Mockup Update — Round 12

This package converts the current `/review/browse` screen into a Folio browse-card page that matches the provided mockup more closely.

## What changed

- Replaced `src/app/review/browse.tsx` with a dedicated Folio browse page.
- Added `src/folio-browse/` components.
- Added browse-page PNG assets under `assets/folio-ui/browse/`.
- Reused saved review assets where they already matched:
  - paper background
  - header buttons
  - Folio wordmark
  - flashcard front and stack
  - favorite star, underline, and illustration
- Added mockup-derived browse assets:
  - top browse deck panel
  - matches/search strip
  - previous / flip / next button skins
  - browse mode note bar

## Notes

- The browse header panel and the matches strip are currently image-driven slices from the approved mockup so the screen stays visually close to the target.
- The flashcard prompt/answer remains live text from the real deck data.
- Browse mode navigation is intentionally non-destructive and does not schedule cards.
- Header Undo/Edit/Help are currently visual shell buttons only.

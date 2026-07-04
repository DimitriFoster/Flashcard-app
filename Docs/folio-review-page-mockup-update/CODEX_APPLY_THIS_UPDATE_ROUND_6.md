# Folio review page mockup update — round 6

Applied after the 4:30 PM Android screenshot.

## Changes

- Pulled the difficulty buttons closer together by changing the grade row from `space-between` to centered layout with a smaller explicit gap.
- Moved the Easy button away from the right edge without shrinking the button art into a new design.
- Slightly reduced and nudged the header action buttons so Undo has more breathing room and sits closer to the Folio wordmark.
- Added more inner horizontal padding inside the deck title / session-flow panel.
- Reduced the vertical gap between the deck title/subtitle and the due/total card count.
- Kept using the saved PNG assets from the disassembled mockup. No UI elements were regenerated.

## Files changed

- `src/components/review/deck-review-session.tsx`
- `src/folio-review/DeckSummaryPanel.tsx`
- `src/folio-review/GradeButtonRow.tsx`

## Notes for Codex

Do not replace the PNG assets with newly generated images. The current assets under `assets/folio-ui/review/` are still the visual source of truth.

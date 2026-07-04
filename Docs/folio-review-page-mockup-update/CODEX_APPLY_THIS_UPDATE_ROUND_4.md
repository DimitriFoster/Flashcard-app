# Folio review mockup update — round 4

This round tightens spacing after the review page got close to the mockup.

## Changes made

- Increased the interactive flashcard height and grade button height so the card/difficulty sections use more of the available space.
- Kept the Review/Notes/Progress/Browse tab bar low on the screen while moving the review content closer to it.
- Added a small right-side asset cushion to the Undo button so its crayon art is no longer visually clipped.
- Removed the stray vertical blue artifact from the Easy grade button PNG.
- Added right-side asset padding to the grade buttons so their crayon borders do not clip when rendered in tight slots.
- Kept using the existing saved PNG assets from the disassembled mockup. No UI elements were regenerated.

## Files changed

- `src/components/review/deck-review-session.tsx`
- `src/folio-review/DeckSummaryPanel.tsx`
- `src/folio-review/GradeButtonRow.tsx`
- `assets/folio-ui/review/header/undo_button.png`
- `assets/folio-ui/review/grade/again_button.png`
- `assets/folio-ui/review/grade/hard_button.png`
- `assets/folio-ui/review/grade/good_button.png`
- `assets/folio-ui/review/grade/easy_button.png`

## Android navigation bar note

This update does not add a new navbar-hiding dependency. The app still uses the current Android navbar behavior. If you want true immersive mode later, add and configure `expo-navigation-bar` in a separate dependency-focused pass.

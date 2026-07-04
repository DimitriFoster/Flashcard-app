# Folio Review Page Mockup Update

This package directly updates the focused deck review route so it uses the approved PNG source-of-truth assets from `assets/folio-ui/review`.

## What changed

### Main replacement
- `src/components/review/deck-review-session.tsx`
  - Rebuilt the review session around PNG image backgrounds.
  - Uses the saved Folio header, deck panel, session-flow tokens, card surfaces, grade buttons, and bottom nav assets.
  - Keeps React Native responsible for data, text, press handlers, edit mode, swipe animation, and review scheduling.

### Route data fix
- `src/app/review/[deckId].tsx`
  - Tracks `totalDeckCards` separately from the current review queue.
  - Passes that into the review page so the large deck panel can show total card count rather than only the current due/session array.

## Important implementation notes

The top card and the card stack are deliberately separate:

- `card_stack_back_layers.png` is static and stays behind the card.
- `card_front_surface.png` is used as the actual animated flashcard background.
- The animated card still receives the existing `translateX` and `panHandlers`, so the top card can swipe independently of the stack.

Dynamic text remains live React Native text:

- deck name
- due / total counts
- current card count
- question / answer
- tap hint

Do not replace the whole page with one screenshot. That would break animation, review state, editing, accessibility, and scheduling.

## Files Codex should replace

Replace these files in the working repo with the versions from this zip:

```txt
src/components/review/deck-review-session.tsx
src/app/review/[deckId].tsx
```

Keep the existing `assets/folio-ui/review` folder from this zip. Those PNGs are the visual source of truth.

## Manual check after applying

1. Run the app.
2. Open Review -> a due deck.
3. Confirm the header shows the PNG Back / Folio / Undo / Edit / Help row.
4. Confirm the deck panel uses the large blue panel with the lighter inner session-flow section.
5. Confirm the session-flow row uses PNG tokens, not plain colored rectangles.
6. Confirm the top card can still be tapped/flipped and swiped while the stack stays visually behind it.
7. Confirm the grade buttons use the full PNG faces.
8. Confirm the bottom nav is visible and the Help button is not pushed off the right side.

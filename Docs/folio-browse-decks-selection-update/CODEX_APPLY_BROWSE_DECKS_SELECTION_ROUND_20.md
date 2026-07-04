# Folio Browse Decks Selection — Round 20

This update tightens the Browse Decks deck-selection page after the round 19 screenshot review.

## Changes

- Replaced the rough React Native deck-card backgrounds with PNG deck-shell assets that have no baked-in topic icons.
- Added multiple deck-shell color variants:
  - blue
  - green
  - yellow
  - peach
  - purple
  - mint
- Kept the selected deck larger and the side decks smaller.
- Kept the Open deck button as a separate overlay that only appears on the selected deck.
- Re-cropped/padded the Review due cards PNG so its bottom edge is not cut off.
- Moved the Browse Decks header structure closer to the open-deck browse-card header:
  - same Folio wordmark size
  - same 72px header row idea
  - same back-button sizing
- Made the Preview cards section collapsible and closed by default.
- When expanded, the preview window is taller so the first three card previews should be visible before scrolling.
- Limited preview rendering to the first 30 matching cards to reduce carousel selection slowdown.

## Important behavior

The Browse Decks page stays at:

`src/app/review/browse.tsx`

The open-deck browse-card page stays separate at:

`src/app/review/[deckId].tsx`

Run after applying:

```powershell
npx expo start --dev-client -c
```

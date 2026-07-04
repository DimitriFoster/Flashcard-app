# Folio Browse Decks Selection — Round 18

This package applies the Browse Decks deck-selection mockup to `src/app/review/browse.tsx`.

## What changed

- Replaced the old utilitarian Browse Decks screen with a Folio-styled deck-selection page.
- Added mockup-derived PNG assets under `assets/folio-ui/browse-selection/`.
- Removed Undo and Edit from this deck-selection page header.
- Added the Review Due Cards header button from the mockup.
- Added a Browse Decks hero/search panel based on the mockup.
- Added a three-deck carousel layout with the center deck larger and side decks smaller.
- Kept the bottom nav with Browse active.
- Kept deck/card search behavior and routes into the open-deck browse-card page.

## Test

Run:

```powershell
npx expo start --dev-client -c
```

Then open Browse from the bottom nav and compare the deck-selection page against the saved mockup.

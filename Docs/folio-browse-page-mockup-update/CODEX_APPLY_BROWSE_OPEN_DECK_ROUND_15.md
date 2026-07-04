# Folio Browse Open Deck — Round 15

This update polishes the open-deck Browse page after the round 14 phone screenshot.

## Fixes included

- Keeps the original Browse Decks deck-selection page in place.
- Keeps the PNG-driven open-deck Browse page under `/review/[deckId]` when not in due-review mode.
- Replaced the Browse page card-management PNGs with round 15 transparent/padded versions:
  - `previous_button_round15.png`
  - `flip_button_round15.png`
  - `next_button_round15.png`
- Replaced the Browse search icon with a transparent round 15 asset so its background no longer clashes with the panel.
- Replaced the Browse mode note bar with a safer padded round 15 asset and moved it slightly away from the bottom nav.
- Shrunk the search icon and mini card-position tokens in the Showing matches panel so the text and token row stop colliding.
- Added a true flip animation for the open-deck Browse card faces while preserving existing swipe navigation.
- Added an inactive Review tab icon so Review does not stay blue when Browse is the active tab.
- Passes `browseSearchLabel` separately from card filtering so `Search: ...` can show the actual term from the Browse Decks search bar.

## After applying

Run:

```powershell
npx expo start --dev-client -c
```

The `-c` cache clear matters because several PNG asset filenames changed.

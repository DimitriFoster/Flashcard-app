# Folio Browse Decks Selection Round 19

Baseline: starts from the user's current uploaded project and the round 18 browse-decks selection redesign.

## Fixed in this pass

- Standardized the Folio header placement on this page:
  - Back button left
  - Folio wordmark centered at the same 132x62 sizing used by the Folio review screen
  - Review due cards button on the right
- Removed Undo and Edit from the top-right header asset.
- Enlarged the Review due cards button and cropped it as its own PNG.
- Replaced the static three-card deck mockup with a real horizontally scrolling deck carousel.
- Selected deck renders larger than unselected decks.
- The Open deck button only appears on the selected deck.
- Deck cards are driven by saved deck data, not hardcoded Spanish/AI/Python screenshots.
- Preview cards now update based on the currently selected deck and render inside a real scrollable preview window.
- Search still filters decks/cards and passes the search label into the open-deck browse-card page.

## New/updated PNG assets

- `assets/folio-ui/browse-selection/header/review_due_cards_button_round19.png`
- `assets/folio-ui/browse-selection/cards/deck_card_selected_shell_round19.png`
- `assets/folio-ui/browse-selection/cards/deck_card_side_yellow_shell_round19.png`
- `assets/folio-ui/browse-selection/cards/deck_card_side_green_shell_round19.png`
- `assets/folio-ui/browse-selection/cards/open_deck_button_shell_round19.png`

## Main changed file

- `src/app/review/browse.tsx`

After applying, clear Metro cache:

```powershell
npx expo start --dev-client -c
```

# Folio Browse Open Deck Update — Round 14

This update corrects the browse-page wiring:

- Restores the original `/review/browse` deck-selection page.
- Applies the mockup-style redesign to the **open deck browse screen** at `/review/[deckId]` when it is opened without `mode=due`.
- Keeps the normal Review page unchanged when opened with `mode=due`.

## User-facing changes

- The open deck browse screen now uses the Folio browse mockup layout.
- The Undo button is removed from the browse-open-deck header.
- Edit now opens the existing card edit form.
- The question/help button opens the Folio guide modal.
- Previous / Flip / Next are connected to the existing browse navigation and flip handlers.
- The “Showing matches only” section no longer includes a hardcoded `Card 4 of 27` label.
- The search line displays the actual `cardSearch` route param: `Search: <term>`.
- The original deck-selection page is back in place.

## Asset notes

New browse-open-deck assets are under:

`assets/folio-ui/browse/`

The browse buttons and panels were re-cropped with extra safe canvas to avoid the same clipping issue previously seen on the Undo/Easy assets.

## Testing

After applying:

```powershell
npx expo start --dev-client -c
```

Then test:

1. Open Browse Decks.
2. Search for a term.
3. Open a matching deck.
4. Confirm the open deck page shows `Search: <your term>`.
5. Test Previous, Flip card, Next, Edit, and Help.
6. Confirm the page fits without scrolling on the phone.

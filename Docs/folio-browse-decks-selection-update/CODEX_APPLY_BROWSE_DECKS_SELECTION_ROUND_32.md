# Folio Browse Decks Selection Round 32

This pass fixes the recurring crop/position issue by returning the deck cards to the Round 29 layout and using precomposited PNG card shells.

## What changed

- Reverted the Browse Decks deck selector card layout/size behavior to the Round 29 implementation.
- Replaced the layered `View + fill image + outline image` card rendering from Round 31 with single `ImageBackground` card shell PNGs again.
- Added new swatch-filled card shell assets under:
  - `assets/folio-ui/browse-selection/cards/swatch-shells-round32/`
- Each new card shell keeps the old Round 29 card dimensions and alpha mask:
  - selected cards: `420x500`
  - side cards: `330x455`
- The crayon texture is now baked into the card silhouette, so it should not bleed outside the card shape.
- The preview card dropdown now uses an absolute full-panel swatch image behind the content, so the texture should fill through the chevron side.
- The expanded preview window uses the same full-panel swatch fill method.

## Reason for this change

The Round 31 implementation separated the card into multiple live layers. That made the texture easier to swap, but it also made sizing/cropping more fragile in React Native. This version moves the crop/mask work back into PNG assets so the app only has to place one correctly-sized card image.

# Folio Browse Decks Selection Round 30

This pass fixes the color/texture system for the Browse Decks deck-selection page.

## Changes

- Converted the deck selector card shells into transparent outline overlays.
- Applied the generated crayon swatch textures as the actual deck card backgrounds.
- Kept the drawn card borders/scribbles as overlays so the cards still feel like the mockup.
- Updated the closed Preview cards panel so the selected swatch texture fills the whole panel, including the chevron area.
- Updated the expanded Preview cards window so the selected swatch texture fills the whole background.
- Kept deck colors linked to carousel position.

## New assets

Added outline overlays under:

`assets/folio-ui/browse-selection/cards/outline-overlays-round30/`

These are derived from the existing round 20 card shells, but with the baked-in fill removed so the crayon texture can show through.

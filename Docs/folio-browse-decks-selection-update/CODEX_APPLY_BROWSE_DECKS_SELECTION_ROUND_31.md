# Folio Browse Decks Selection Round 31

This update fixes the texture swatch application after round 30.

## Changes

- Replaced raw full-rectangle swatch backgrounds on deck carousel cards with masked PNG card-fill assets.
- Masked fills use the original deck-card alpha shape, so the swatch no longer bleeds outside the drawn card.
- Kept the transparent outline overlays from round 30 so the crayon border/scribble remains visible.
- Normalized the generated swatch textures with center crops to avoid edge artifacts.
- Applied the normalized selected swatch texture under the full preview cards panel, including the chevron area.
- Applied the same selected swatch texture to the expanded preview window and Open deck button.

## New asset folders

- `assets/folio-ui/browse-selection/textures/normalized-round31/`
- `assets/folio-ui/browse-selection/cards/texture-fills-round31/`

## Main file changed

- `src/app/review/browse.tsx`

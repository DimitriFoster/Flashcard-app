# Folio Browse Decks Selection Round 29

This round replaces the flat color-fill system for the selected deck-linked UI pieces with the generated crayon texture swatches.

## What changed
- Added six crayon texture swatches under `assets/folio-ui/browse-selection/textures/`.
- Added `browseDeckAssets.crayonTextures` in `src/app/review/browse.tsx`.
- The currently selected carousel index now chooses both:
  - the old fallback fill color
  - the matching crayon texture image
- The Open deck button now uses the matching crayon texture as an `ImageBackground`.
- The closed Preview cards panel now uses the matching crayon texture as an `ImageBackground`.
- The expanded preview cards carousel/window now uses the matching crayon texture as an `ImageBackground`.
- Preview rows remain readable with a translucent warm-paper layer over the texture.

The deck card shell PNGs still provide the drawn card outlines and selected/side sizing behavior.

# Folio review page mockup update — round 3

Apply this project as the replacement for the current Folio app state.

## What changed

1. Tightened the deck summary panel layout:
   - smaller deck title/subtitle text
   - smaller brain icon
   - reduced panel height
   - tighter session-flow row and legend

2. Cleaned PNG assets so fake checkerboard preview pixels are transparent:
   - card stack background
   - card front surface corners
   - header buttons
   - session-flow tokens
   - bottom-nav assets
   - grade buttons

3. Improved bottom spacing:
   - shorter card height on phone-sized screens
   - smaller grade buttons
   - shorter bottom navigation bar
   - Android bottom safe-area padding removed from the custom tab bar so the design gets more usable vertical space

4. Undo button remains visually present:
   - the button is not visually faded when undo is unavailable
   - no new Undo art was generated; this uses the saved disassembled mockup asset

5. Android navigation bar note:
   - `app.json` now sets the Android navigation bar color to the Folio paper color, so if the system nav bar is visible it blends better.
   - Fully hiding the Android system navigation bar requires adding `expo-navigation-bar` and using immersive/sticky behavior. Do that as a separate intentional change so it does not break the current Expo build.

## Important implementation rules

Do not recreate the crayon UI in React Native views.
Use the PNGs under:

```txt
assets/folio-ui/review/
```

The top interactive flashcard should stay separate from the static card stack:

```txt
card/card_stack_back_layers.png  -> static behind layer
card/card_front_surface.png      -> animated ImageBackground for the actual interactive card
```

## Optional Android immersive mode

There is a way to hide the Android navbar, but it should be done with Expo's navigation-bar module instead of layout hacks.

Recommended next Codex task:

```txt
Install expo-navigation-bar using `npx expo install expo-navigation-bar`.
On Android only, hide the navigation bar on the review screen with sticky/immersive behavior and restore it when leaving the screen if needed.
Do not change the Folio PNG assets while doing this.
```

This was left as documentation rather than a hard dependency so the zip remains build-safe with the existing `package.json`.

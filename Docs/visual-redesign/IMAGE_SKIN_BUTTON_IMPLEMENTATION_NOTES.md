# Image-Skin Button Implementation Notes

This patch is a correction to the earlier full-PNG-button approach.

## Why this approach is better

Full PNG buttons are visually exact but brittle:

```txt
- text is baked into the asset
- icons are baked into the asset
- labels cannot change cleanly
- disabled states are harder
- accessibility is worse
- resizing can blur text
```

Image-skin buttons are more maintainable:

```txt
- PNG provides paper/crayon button surface
- SVG provides crisp centered icon
- React Native Text provides real label/hint
- Pressable keeps behavior and accessibility
- Animated spring gives solid press feel
```

## Layer order

```txt
Pressable
  Animated.View
    View face
      Image background skin
      View content
        FolioSvgIcon
        Text label
        Text hint
```

## Start small

Only install this on the review deck page buttons first.

If it feels right, reuse `FolioImageSkinButton` on Home, Browse Decks, Notes, and modals later.

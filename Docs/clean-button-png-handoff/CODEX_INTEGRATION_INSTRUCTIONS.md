# CODEX_INTEGRATION_INSTRUCTIONS.md

## Non-negotiable rules
1. **Use the exact PNG files in `assets/review-page-buttons/` as the visible button surfaces.**
2. **Do not redraw, reinterpret, or rebuild these buttons.**
3. **Do not reconstruct the icon, texture, border, label, or timing text with SVG or React Native Text.**
4. **Do not make design decisions.** Preserve the current working layout and logic. Only swap the visible art for the specified buttons.
5. **Do not add a second drop shadow.** The button PNGs already include a soft baked-in shadow.
6. **Preserve the working touch behavior.** The PNG is visual only; interaction still comes from `Pressable`.

## Design philosophy context
Folio should feel like:
- tactile stationery
- softly hand-drawn and friendly
- calm, readable, warm, and slightly playful
- snappy and responsive, never mushy
- visually guided by the provided art, not by improvised component styling

Codex should treat these PNGs as fixed pieces of UI art from the mockup.

## Technical implementation rules
- Wrap each button art asset in a real `Pressable`.
- Put the `Image` inside an `Animated.View` (or Reanimated animated container) so press feedback stays snappy.
- Use a transparent wrapper background.
- Use `resizeMode="contain"`.
- Keep `overflow: 'visible'` so the baked shadow is not clipped.
- Respect the asset aspect ratio.
- Keep accessibility labels and existing handlers.

## Preferred structure
```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Go back"
  onPress={onBack}
  onPressIn={handlePressIn}
  onPressOut={handlePressOut}
  hitSlop={8}
  style={styles.backButtonTouch}
>
  <Animated.View style={[styles.pressAnim, animatedStyle]}>
    <Image
      source={require('../assets/review-page-buttons/back_button_transparent.png')}
      resizeMode="contain"
      style={styles.backButtonImage}
    />
  </Animated.View>
</Pressable>
```

## Press feel requirements
The buttons should feel **solid, snappy, and deliberate**.

Recommended press-down behavior:
- on press in: scale to `0.965`
- translateY to `1.5`
- duration about `70ms`
- on press out: spring back to `1`
- spring stiffness about `380`
- damping about `24`
- no long bounce
- no fade-out

If the project already has a shared press animation helper, use that helper **only if** it can match the above feel.

## Exact review-page scope for this handoff
Only update these two visible surfaces for now:
- top-left back button -> `back_button_transparent.png`
- bottom Good difficulty button -> `good_button_transparent.png`

Do not change the other buttons yet, except as needed to keep row alignment consistent.

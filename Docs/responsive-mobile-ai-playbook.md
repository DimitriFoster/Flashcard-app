# Folio Responsive Mobile + AI Design Playbook

Last updated: 2026-07-05

Purpose: keep Folio's warm PNG-heavy UI usable across phone sizes while giving ChatGPT/Codex a stable reference for future responsive-design passes.

## Core rule for Folio

Folio should not be tuned only for the current test phone. Every visual pass should account for:

- narrow/short Android phones
- common modern Android phones
- large phones
- iPhone safe-area behavior
- tablet-ish widths if the app ever expands beyond portrait phones
- keyboard-visible states on import/search/edit screens

Because Folio uses illustrated PNG surfaces, responsive design means preserving the art while changing the frame, spacing, scale, scroll behavior, and touch area around it.

## Research-backed principles

### 1. Measure the actual window, not the assumed device

React Native recommends `useWindowDimensions` for component layout because it updates when the application window changes. `Dimensions` is still useful outside components, but React Native calls `useWindowDimensions` the preferred API for React components.

Use this as the default pattern:

```tsx
const { width, height, fontScale, scale } = useWindowDimensions();
```

Prefer breakpoints based on the current app window:

```ts
const isTinyWidth = width < 340;
const isNarrowWidth = width < 360;
const isShortHeight = height < 700;
const contentWidth = Math.min(width - 32, 430);
const compactScale = Math.min(1, Math.max(0.84, width / 393));
```

Avoid assuming a minimum height like `Math.max(height, 700)` unless the screen is scrollable.

Sources:
- https://reactnative.dev/docs/usewindowdimensions
- https://reactnative.dev/docs/dimensions

### 2. Respect safe areas everywhere content can be hidden

Expo recommends safe areas to prevent content being covered by notches, status bars, home indicators, rounded corners, and OS-controlled interface areas. Expo uses `react-native-safe-area-context`; wrap screens or use `useSafeAreaInsets()` for exact spacing.

Recommended Folio pattern:

```tsx
const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }} />
```

Do not place important buttons at `top: 0`, `bottom: 0`, or outside the measured content width unless safe-area padding is included.

Source:
- https://docs.expo.dev/develop/user-interface/safe-areas/

### 3. Use scroll as a safety valve on short screens

Short phones and large font settings expose clipping. React Native ScrollViews need bounded height, usually by passing `flex: 1` down the parent stack.

Folio rule:

- screens with fixed artwork can be non-scrollable only after proving they fit on 360x640 and 320x568 style heights
- any screen with optional expanded content, keyboard states, or import preview should scroll
- use `contentContainerStyle` for layout spacing, not random bottom padding on nested children

Source:
- https://reactnative.dev/docs/scrollview

### 4. Prefer adaptive breakpoints over one-off nudges

Material Design frames responsive/adaptive layout around breakpoints: a breakpoint is where the layout changes to match available space, device conventions, and ergonomics. Android window-size-class guidance is the same broad idea: test and adapt by viewport, not by hardcoded device model.

Folio breakpoints:

```ts
export const FOLIO_BREAKPOINTS = {
  tinyWidth: 340,
  narrowWidth: 360,
  baselineWidth: 393,
  widePhone: 430,
  tablet: 600,
  shortHeight: 700,
  veryShortHeight: 640,
};
```

Use named breakpoints instead of mystery offsets like `top: 37` unless the offset is clearly tied to a measured asset.

Sources:
- https://m3.material.io/foundations/adaptive-design/overview
- https://m3.material.io/foundations/layout/applying-layout
- https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes

### 5. Keep art intact; adapt the container

React Native `Image.resizeMode` controls how art responds when the rendered frame differs from the source aspect ratio.

- `contain`: preserves the entire image and aspect ratio; best for Folio's illustrated panels/buttons when the full art must remain visible.
- `cover`: fills the frame but may crop; use only when cropping is acceptable.
- `stretch`: changes aspect ratio; avoid for button/panel art unless the asset was designed as a stretchable background.
- `center`: useful when the asset should not scale up, but can leave extra space.

Folio rule: PNG source-of-truth assets should usually use `resizeMode="contain"`. If a button needs to stretch wider, generate a proper wider asset or split art into background/text/icon layers instead of stretching hand-drawn art.

Source:
- https://reactnative.dev/docs/image

### 6. Keep touch targets larger than the art when necessary

Google/Material recommends touch targets around 48x48dp. Android accessibility guidance also recommends at least 48x48dp with spacing. WCAG is a broader accessibility standard that can apply to mobile and native software. For iOS, Apple emphasizes enough control space and safe layout; 44pt is the common iOS target convention.

Folio rule:

- visual PNG button can be smaller than 48px if the `Pressable` wrapper is still at least 48x48
- use padding or `hitSlop` for small icons
- do not rely on transparent pixels inside the PNG as the tappable area; wrap the asset in a real press target

Example:

```tsx
<Pressable
  hitSlop={10}
  style={{ minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}
>
  <Image source={asset} style={{ width: 38, height: 38 }} resizeMode="contain" />
</Pressable>
```

Sources:
- https://m3.material.io/foundations/designing/structure
- https://support.google.com/accessibility/android/answer/7101858
- https://www.w3.org/WAI/standards-guidelines/wcag/
- https://developer.apple.com/design/human-interface-guidelines/buttons

### 7. Use accessibility as a layout stress test

Accessibility and responsiveness overlap. Screens that break with slightly larger text, smaller devices, or safe-area insets are fragile.

Folio currently uses a lot of `allowFontScaling={false}` to preserve mockup fidelity. That may be acceptable for some decorative art text, but it should be intentional.

Recommended split:

- decorative PNG text: can stay fixed because the art is the text
- real instructions, deck names, card content, import errors: should support scaling or have a planned truncation/scroll behavior
- pressables: should keep accessible labels even if the visual text is inside an image

Example:

```tsx
<Pressable accessibilityRole="button" accessibilityLabel="Open previous card">
```

### 8. Responsive testing is not one screenshot

A good Folio test matrix:

| Size | Purpose |
|---|---|
| 320x568 | harsh small/short phone stress test |
| 360x640 | small Android / older compact phone |
| 360x800 | common narrow Android |
| 393x873 | common modern Android-ish baseline |
| 412x915 | larger Android |
| 375x667 | iPhone SE style |
| 390x844 | modern iPhone baseline |
| 430x932 | large iPhone |
| 768x1024 | tablet-ish expansion check |

Screens to capture:

- Browse Decks landing
- Browse Decks with preview expanded
- Browse open-session page
- Review session page
- Add/import screen
- Search focused with keyboard open
- Empty states
- Long deck/card names

### 9. Use visual regression once the look stabilizes

Functional tests catch broken buttons and failed screens, but visual regression catches layout changes like overlap, drift, clipping, and unintended spacing shifts. Maestro's visual testing compares screenshots against baselines and supports cropped screenshot assertions around a component.

Folio should eventually use visual snapshots for:

- Browse Decks hero header
- open-session header mini-card strip
- review card surface
- footer controls
- import preview card

Source:
- https://maestro.dev/blog/visual-testing

## AI-assisted responsive-design workflow

AI is useful for responsive design when the work is constrained and evidence-based. It is weak when asked to “make it responsive” without device dimensions, screenshots, or acceptance checks.

### The Folio AI loop

1. Pick one screen.
2. Identify the source files and visual source-of-truth PNGs.
3. State the current screen size where it looks correct.
4. State target test sizes.
5. Run static audit: fixed sizes, absolute positioning, min heights, non-scrollable overflow, small touch targets, `resizeMode` issues.
6. Make breakpoint-aware code changes.
7. Build a zip.
8. Test on device/emulator.
9. Send screenshots with dimensions/debug overlay.
10. Repeat only on the failing screen area.

### Prompt template for future AI layout passes

```text
We are working on Folio, an Expo React Native flashcard app with PNG-based UI art.
Do not redraw the PNG buttons/panels. Wrap PNG art in real Pressables.
Keep existing logic unchanged unless needed for layout.
Target screen: [screen name]
Relevant files: [paths]
Current problem: [describe overlap/clipping]
Known-good screenshot size: [width x height]
Target sizes to support: 320x568, 360x640, 393x873, 430x932.
Audit for fixed dimensions, unsafe absolute positioning, min-height traps, touch targets, safe areas, and image resize behavior.
Apply breakpoint-aware changes, then summarize exact files changed.
```

### Acceptance criteria for AI-generated responsive changes

A change is not “done” until:

- no important UI is clipped at 360x640
- no interactive control is under 48x48 unless it has wrapper padding/hitSlop
- safe-area top/bottom is respected
- scroll is available when content can exceed screen height
- PNG art is not distorted by `stretch`
- long text truncates or wraps intentionally
- the change does not alter deck/review/import business logic
- the patch explains which breakpoint or screen condition each size change serves

### AI anti-patterns to avoid

- repeated pixel nudges without checking smaller/larger screens
- adding `Math.max(height, 700)` on a non-scrollable screen
- using a screenshot as the only asset when transparent PNG layers exist
- stretching hand-drawn PNGs to fill a new shape
- rebuilding approved PNG buttons with View/Text/SVG unless explicitly requested
- assuming iOS is fine because Android looks fine
- claiming responsiveness without a device matrix

## Folio-specific implementation guidelines

### Recommended helper file

Create or extend a helper like:

```ts
// src/theme/responsive.ts
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useFolioResponsive() {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const safeHeight = window.height - insets.top - insets.bottom;
    const contentWidth = Math.min(window.width - 32, 430);
    const compactScale = Math.min(1, Math.max(0.84, window.width / 393));

    return {
      width: window.width,
      height: window.height,
      safeHeight,
      insets,
      contentWidth,
      compactScale,
      isTinyWidth: window.width < 340,
      isNarrowWidth: window.width < 360,
      isShortHeight: safeHeight < 700,
      isVeryShortHeight: safeHeight < 640,
      isTabletWidth: window.width >= 600,
    };
  }, [window.width, window.height, insets.top, insets.bottom]);
}
```

### Pattern for art-heavy headers

```tsx
const heroWidth = contentWidth;
const heroHeight = Math.round(heroWidth * HERO_ASPECT_RATIO);
const searchWidth = Math.round(heroWidth * (isNarrowWidth ? 0.68 : 0.74));
const searchHeight = isShortHeight ? 34 : 40;
```

### Pattern for short-screen fallback

```tsx
const shouldScroll = isShortHeight || previewExpanded || keyboardVisible;

return shouldScroll ? (
  <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
    {screenContent}
  </ScrollView>
) : (
  <View style={styles.content}>{screenContent}</View>
);
```

### Pattern for colored mini-card strips

```tsx
const visibleMiniCards = isTinyWidth ? 5 : isNarrowWidth ? 7 : 9;
const miniCardSize = isTinyWidth ? 13 : isNarrowWidth ? 15 : 17;
```

## Current Folio risk list to remember

Based on the static audit before this document:

1. `src/components/review/deck-review-session.tsx` browse mode uses a minimum height around 700 on a non-scrollable screen. This can clip on short phones.
2. `src/app/review/index.tsx` review landing disables scrolling while forcing a tall minimum layout. This can clip on short phones.
3. `src/app/review/browse.tsx` Browse Decks preview expansion can exceed short-screen height.
4. The Browse Decks top-right review-due button has fragile right-edge positioning on narrow screens.
5. The open-session colored mini-card strip should shrink or reduce token count below 360px width.

## Quick checklist before Play Store readiness

- [ ] Add/use `useFolioResponsive()` helper.
- [ ] Remove non-scrollable min-height traps.
- [ ] Capture screenshot matrix for Browse Decks, browse session, review session, import/search.
- [ ] Add accessibility labels for PNG-only controls.
- [ ] Verify 48x48 press targets on Android.
- [ ] Verify safe-area behavior on iPhone-like dimensions.
- [ ] Add at least one visual regression path after screens stabilize.
- [ ] Keep PNG source-of-truth art clean and transparent.

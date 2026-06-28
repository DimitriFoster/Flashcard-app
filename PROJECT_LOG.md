# Flashcard App - Project Log

---

# 2026-06-18

## Navigation Architecture Investigation

### Problem

The "Open This Deck" button on the Review screen appeared to work but did not navigate to the deck review page.

The button would visually flash when pressed, indicating that the press event was firing successfully, but the application remained on the same screen.

---

### Initial Assumption

Codex's first suspicion was that the button handler itself was broken.

The review screen was attempting to navigate to:

```tsx
router.push({
  pathname: '/review/[deckId]',
  params: { deckId },
});
```

Because no navigation occurred, it appeared that either:

* The route path was incorrect
* The deck ID was invalid
* The button press handler was not executing

---

### Investigation

Further inspection revealed that the route file existed:

```txt
src/app/review/[deckId].tsx
```

The deck review page was present and correctly named.

The problem was not the route file itself.

The issue originated from the application's navigation architecture.

---

### Root Cause

The application was using a NativeTabs-based navigation setup.

The root layout rendered:

```tsx
<AppTabs />
```

instead of a normal Expo Router Stack.

Inside AppTabs only a small set of routes were explicitly registered:

```txt
index
explore
review/index
```

The dynamic review route:

```txt
review/[deckId]
```

was not part of the registered navigation tree.

As a result:

1. The button press executed successfully.
2. Expo Router attempted navigation.
3. The NativeTabs navigator did not recognize the destination.
4. Navigation silently failed.

This produced the confusing symptom where the button visibly reacted but the screen never changed.

---

### Secondary Issue

After the dynamic route was added to the navigation tree, the review page opened but displayed:

"No cards in this deck"

even when cards existed.

This occurred because the deck review route was receiving incomplete or incorrect route state.

The page loaded successfully but was unable to identify the selected deck.

The review screen therefore attempted to load cards for an undefined deck.

---

### Architectural Decision

After investigating the issue, it became clear that NativeTabs was adding unnecessary complexity to the application.

The flashcard app follows a workflow pattern:

```txt
Home
  → Review Decks
    → Review Session
```

rather than a traditional multi-section application.

The review experience is intended to be:

* Full screen
* Focused
* Gesture-driven
* Compatible with landscape mode
* Free from navigation clutter

NativeTabs was working against these goals.

---

### Decision

Move toward a Stack-based Expo Router architecture.

Desired structure:

```txt
src/app/
  _layout.tsx
  index.tsx

  review/
    index.tsx
    [deckId].tsx
```

Using:

```tsx
<Stack />
```

instead of:

```tsx
<NativeTabs />
```

Benefits:

* Simpler routing
* Cleaner navigation model
* Better support for fullscreen review sessions
* Better future support for landscape layouts
* Easier debugging
* Fewer navigation edge cases

---

### Lesson Learned

A route file existing in Expo Router does not guarantee that it is reachable.

When using custom navigation containers such as NativeTabs, every route must also exist within the active navigation tree.

Future navigation issues should be investigated in this order:

1. Does the route file exist?
2. Is the route registered?
3. Is the navigator aware of the route?
4. Is the route receiving the expected parameters?
5. Is the destination screen loading the correct data?

---

### Outcome

The project is moving away from NativeTabs and toward a simpler Stack-based architecture that better supports the intended review experience.



# 2026-06-20

## Warm and Snappy UI Refresh

### Problem

The Flashcard App interface was functional, but the overall feeling of the UI was colder and slower than desired.

The app already had the right basic structure:

```txt
Home
  → Create cards
  → Review decks
    → Focused review session
```

However, the visual style felt closer to a clean productivity dashboard than a warm, inviting flashcard tool.

The main issues were:

* Cool gray backgrounds made the app feel slightly sterile
* Small border radii made cards and panels feel rigid
* Press states relied mostly on opacity changes
* Create-section dropdown animations felt slower than necessary
* The card creation flow lacked immediate reward feedback
* The review card looked like a single flat panel instead of a physical card
* Color values, spacing, radii, and shadows were repeated across multiple files

---

### Initial Assumption

The first assumption was that the app did not need a full redesign.

The core UX direction was already solid:

* Create decks
* Add cards quickly
* Review cards in a focused session
* Use simple grading buttons for retention

The problem was not the app concept or screen layout.

The app needed a style pass focused on:

* Warmer colors
* More tactile buttons
* Faster motion
* Softer card surfaces
* More consistent shared design values

---

### Investigation

The existing UI used several repeated style patterns across Home, Create, Review, Preview, and Deck Review components.

Common patterns included:

```tsx
backgroundColor: '#F7F8FB'
borderRadius: 8
borderColor: '#D8DEE8'
opacity: pressed ? 0.78 : 1
```

The existing palette leaned heavily on cool grays, white panels, blue accents, and green accents.

The create panel also used relatively slow animation timing:

```tsx
duration: 520
easing: Easing.out(Easing.cubic)
```

This made dropdown sections feel smooth, but not especially quick.

The review session already had good interaction structure:

* Tap to flip
* Swipe left or right
* Grade with Again / Hard / Good / Easy
* Support for landscape layout

Because the interaction model was already useful, the changes focused on visual polish rather than rewriting behavior.

---

### Root Cause

The UI felt colder than intended because each component was styling itself independently.

There was no shared design system for:

* Colors
* Radius values
* Spacing values
* Shadows
* Motion timing

As a result, the app had a consistent general look, but not a strong emotional direction.

The review experience also lacked physicality.

A flashcard app benefits from feeling like the user is handling cards, but the current review screen presented the card as a flat white panel.

The card creation experience also lacked reinforcement after successful actions.

Creating a card cleared the form, but the user did not get a strong confirmation that the action succeeded.

---

### Design Direction

The chosen design direction was:

```txt
Warm study desk
Fast card handling
Soft paper surfaces
Tactile mobile controls
```

The goal was not to make the app flashy.

The goal was to make the interface feel calmer, warmer, and quicker.

The app should feel like:

* A simple study workspace
* A small stack of paper cards
* A lightweight tool that responds immediately
* A focused review environment without visual clutter

---

### Implementation Approach

No GitHub commit was made directly through the connector.

This was intentional.

A replacement-file zip was created instead so the changes can be reviewed locally in Expo and committed from the local development environment.

This keeps the workflow cleaner:

```txt
Download replacement files
  → Copy files into local repo
  → Run Expo
  → Review UI on device/emulator
  → Commit locally if accepted
```

This avoids creating connector-authored GitHub commits while still making the implementation easy to test.

---

### New Shared Design System

A new shared design token file was created:

```txt
src/constants/design.ts
```

This file centralizes core UI values:

```tsx
COLORS
RADIUS
SPACING
SHADOWS
MOTION
```

The new color palette moves the app away from cold gray-blue styling and toward warmer paper tones.

Core colors include:

```tsx
background: '#F8F3EA'
panel: '#FFFDF8'
panelAlt: '#F1E8DC'
ink: '#241F1A'
muted: '#776B5F'
line: '#E2D3C3'
```

The existing blue and green identity was preserved, but softened:

```tsx
create: '#138A72'
review: '#3457D5'
```

This keeps the app recognizable while making the surface feel warmer.

---

### Radius and Surface Changes

The app moved away from smaller, sharper corners.

Instead of relying heavily on `borderRadius: 8`, the interface now uses shared radius values:

```tsx
sm: 10
md: 16
lg: 22
xl: 28
pill: 999
```

This affects:

* Home sections
* Create panels
* Deck chips
* Review panels
* Flashcard surfaces
* Buttons
* Empty states
* Grade buttons

The result should feel softer and more mobile-native.

---

### Shadow Changes

Shared shadow styles were added:

```tsx
SHADOWS.card
SHADOWS.soft
```

These are used to give panels and cards a little more depth without making the UI look heavy.

The goal is subtle physical layering rather than dramatic shadow effects.

---

### Motion Changes

Create-section animations were made faster.

The previous animation duration was roughly:

```tsx
520ms
```

The new shared motion values are:

```tsx
fast: 180
base: 220
```

Dropdown sections now use:

```tsx
duration: MOTION.fast
easing: Easing.out(Easing.quad)
```

This should make the app feel more responsive when opening:

* The deck picker
* The new deck form
* The create card controls

---

### Press Feedback Changes

Press states were changed from mostly opacity-only feedback to opacity plus small scale movement.

The new pattern is:

```tsx
pressed: {
  opacity: 0.9,
  transform: [{ scale: 0.98 }],
}
```

The review card uses a smaller press scale:

```tsx
cardPressed: {
  transform: [{ scale: 0.995 }],
}
```

This creates a more tactile feeling when tapping buttons and cards.

---

### Create Section Changes

The Create section was reworked to feel less like a form and more like a quick card-entry workspace.

The expanded create panel now emphasizes the selected deck first:

```txt
Deck
Selected deck name
```

The text inputs remain simple:

```txt
Front: prompt, term, or question
Back: answer, explanation, or clue
```

The controls were shortened:

```txt
New deck
Pick deck
```

The add-card button now uses deck-aware copy:

```txt
Add to Spanish
```

instead of a longer generic label.

This makes the action feel more direct.

---

### Card Creation Feedback

A temporary status message was added after successful actions.

Examples:

```txt
Deck created: Spanish ✓
Added to Spanish ✓
```

The message clears automatically after about 1.5 seconds.

This gives the user immediate confirmation without requiring a modal, toast library, or extra screen state.

---

### Deck Picker Changes

The deck picker now uses warmer card-like chips.

Deck chips use:

* Warmer panel background
* Larger corner radius
* Clear active state
* Card count display
* Press scale feedback

This should make selecting a target deck feel more like choosing a physical folder or card stack.

---

### Home Screen Changes

The Home screen now imports shared design tokens from:

```txt
src/constants/design.ts
```

The background changed to the warmer app background.

The header remains conceptually the same:

```txt
Flashcard workspace
Create decks fast, then review with intent.
```

But the screen now sits on a warmer surface, making the app feel less sterile.

---

### Review Entry Section Changes

The Home review call-to-action was updated to use the shared design system.

The Review panel now uses:

* Warm panel background
* Shared border color
* Softer radius
* Subtle shadow
* Press scale feedback

The Review button remains visually blue so review stays distinct from creation.

---

### Review Index Changes

The Review index screen was updated to use shared design tokens.

The two preview panels now sit on the warmer background and use softer panel styling.

The “Create cards” button now uses the shared review accent colors and tactile press feedback.

The retention note was also warmed with a soft warning color treatment.

---

### Preview Panel Changes

The reusable `PreviewPanel` component was updated to match the new design language.

Changes include:

* Warmer preview panel background
* Softer card surface
* Larger rounded corners
* Shared spacing values
* Shared color values
* Better disabled button styling
* Press scale feedback on “Open this deck”

This keeps the Review index visually consistent with the rest of the app.

---

### Deck Review Session Changes

The focused deck review session received the most important visual change.

The review card now sits inside a card stack structure:

```tsx
cardStack
  cardStackBack
  cardStackMiddle
  cardShell
    card
```

This makes the review session feel more like handling a small deck of cards instead of looking at one flat panel.

The tap hint was also tightened:

```txt
Tap to flip · Swipe to browse
```

This is shorter and more polished than the previous instructional copy.

---

### Grade Button Changes

The grading buttons still use the same review options:

```txt
Again
Hard
Good
Easy
```

Each button now includes a small helper label:

```txt
Again  → soon
Hard   → short
Good   → normal
Easy   → later
```

This makes the spaced repetition behavior easier to understand without adding a tutorial screen.

The grade buttons also use warm semantic colors:

* Again: warning tone
* Hard: danger tone
* Good: review blue
* Easy: create green

---

### Affected Files

The replacement zip includes changes to these files:

```txt
src/constants/design.ts

src/app/index.tsx
src/app/review/index.tsx

src/components/home/create-section.tsx
src/components/home/create-section.styles.ts
src/components/home/review-section.tsx

src/components/review/preview-panel.tsx
src/components/review/deck-review-session.tsx
src/components/review/deck-review-session.styles.ts
```

---

### Files Recreated or Added

A new shared design file was added:

```txt
src/constants/design.ts
```

This file should become the central place for future UI styling decisions.

Future components should avoid hardcoding repeated colors and spacing values when possible.

---

### Testing Plan

The changes should be reviewed in Expo before committing.

Recommended test flow:

1. Start the app with a clean cache:

```bash
npx expo start --clear
```

2. Open the Home screen.

3. Confirm the warmer background and section styling.

4. Expand the Create section.

5. Test opening and closing:

```txt
New deck
Pick deck
```

6. Confirm the animations feel faster.

7. Create a new deck.

8. Confirm the status message appears:

```txt
Deck created: [name] ✓
```

9. Add a card to a selected deck.

10. Confirm the status message appears:

```txt
Added to [deck] ✓
```

11. Navigate to Review.

12. Confirm the preview panels still load the correct cards.

13. Open a deck.

14. Confirm the review card stack renders correctly.

15. Test:

```txt
Tap to flip
Swipe left/right
Again
Hard
Good
Easy
Back
```

16. Rotate the device or emulator to landscape and confirm the review layout still behaves correctly.

---

### Risks

The changes are mostly visual, but a few areas should be watched carefully.

Potential risks:

* Animation heights may need small adjustment on different screen sizes
* Long deck names may crowd the `Add to [deck name]` button
* The card stack shadows may need tuning on Android
* The warm palette may need contrast review outdoors or at low brightness
* Status messages may need better placement if the create panel grows more complex

No storage, scheduling, or route logic was intentionally changed.

---

### Lesson Learned

A UI can be technically clean but still feel emotionally wrong.

The first version worked, but it did not fully match the desired product feeling.

For this app, the interface should support the learning loop:

```txt
Capture quickly
Review calmly
Get feedback immediately
Return later
```

Small details matter:

* A faster dropdown makes the app feel lighter
* A checkmark after adding a card reinforces progress
* A card stack makes review feel more physical
* Warmer colors make repeated study feel less clinical
* Shared design tokens prevent the UI from drifting as the app grows

---

### Outcome

A warmer and snappier UI pass was prepared as local replacement files.

The changes have not been committed yet.

The next step is to copy the replacement files into the local project, run Expo, and decide whether this visual direction should become the new baseline for the Flashcard App.

If accepted, the project will have a stronger design foundation through:

* Shared design tokens
* Warmer visual identity
* Faster motion
* Better tactile feedback
* Clearer card creation feedback
* A more physical review session

---

# 2026-06-27

## Notes Section and Lined Notebook Page

### Summary

Added a third Home screen section labeled `notes` under the Review section.

The new section opens a dedicated Notes route for quick freeform writing. The Notes screen is styled like a clean A5 lined notebook page with a soft yellow app section color, faint horizontal ruling, and a left-side saved-notes panel.

### Changes

- Added a soft pastel yellow Notes section on the Home screen.
- Added a new `/notes` route.
- Added local MMKV-backed note storage.
- Added a left panel showing previously saved notes.
- Added a blank-note writing state when the Notes page opens.
- Added a `New` button for starting another note.
- Added note selection so saved notes can be opened and edited immediately.
- Added a yellow `Save & close` button in the top right.
- Added a `Back home` button with an unsaved-changes warning.

### Files Touched

```txt
src/app/index.tsx
src/app/_layout.tsx
src/app/notes/index.tsx
src/components/home/notes-section.tsx
src/components/ui/crayon-fill.tsx
src/constants/design.ts
src/storage/notes.ts
src/types/note.ts
PROJECT_LOG.md
```

### Notes

The notebook page intentionally avoids new native dependencies. The lined-paper look is created with plain React Native views behind a multiline `TextInput`.

This keeps the feature mobile-safe while still giving the Notes route a distinct paper-notebook feeling.

### Outcome

The app now has three main Home actions:

```txt
Create  → make decks and cards
Review  → study existing decks
Notes   → capture longer freeform thoughts
```

This gives the app a stronger capture-to-study workflow. Loose thoughts can now live in Notes before being turned into flashcards later.


---

# 2026-06-27

## Notebook Drag Fix Reapplied to Current Build

### Summary

The latest notebook drag/title fixes were reapplied on top of the current Codex-edited build.

### Changes

- Notebook title/header controls now flex so long notebook names have more room.
- Notebook action buttons resize slightly based on notebook title length.
- Drag hover detection checks both X and Y coordinates.
- Notes can highlight as drop targets.
- Dragged notes show a floating preview so they remain visible above the sidebar and yellow editor border.
- Dragging a notebook note onto a loose note creates a fresh notebook for those two notes instead of pulling the loose note into the selected notebook.

### Files Touched

```txt
src/app/notes/index.tsx
src/storage/notes.ts
PROJECT_LOG.md
```


---

# 2026-06-27

## Notebook Hover and Drag Preview Fix

### Summary

Fixed notebook/note hover highlighting, constrained the notebook title input more aggressively, and removed the double-image effect while dragging notes.

### Changes

- Hover detection now uses a forgiving hit area around notes and notebooks.
- Notes now have their own yellow drop-target highlight style.
- Dragging now uses the floating preview as the moving object.
- The original dragged card fades in place instead of moving with the preview.
- Notebook title input now uses a calculated width and calculated font size based on title length.
- Notebook title input is bounded with overflow protection so it should not leak out of the notebook panel header.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```

# Flashcard App - Project Log

---

# 2026-06-18

## Navigation Architecture Investigation

### Problem

The "Open This Deck" button on the Review screen appeared to work but did not navigate to the deck review page.

The button would visually flash when pressed, indicating that the press event was firing successfully, but the application remained on the same screen.

---

### Initial Assumption

The first suspicion was that the button handler itself was broken.

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

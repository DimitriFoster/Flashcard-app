# What I'm Learning

A running record of concepts, tools, and lessons learned while building the Flashcard App.

---

# Expo

## What Expo Is

Expo is a framework built on top of React Native that simplifies mobile app development.

### Benefits

* Fast setup
* Hot reloading
* QR code testing with Expo Go
* Access to many native device features
* Easier deployment process

### Things I've Learned

* `npx expo start` launches the development server.
* Expo Go allows testing on a physical device without building an APK.
* Expo Router provides file-based routing.
* Expo projects can target Android, iOS, and Web from a single codebase.

### Commands I Use Often

```bash
npx expo start
npx expo start --clear
npx expo start --tunnel
```

### Questions I'm Still Exploring

* How does Expo handle native modules under the hood?
* What happens during an EAS Build?
* How should web support differ from mobile support?

---

# React

## What React Is

React is a JavaScript library for building user interfaces using reusable components.

## Core Concepts

### Components

Components are reusable pieces of UI.

Example:

```tsx
function Greeting() {
  return <Text>Hello World</Text>;
}
```

### Props

Props allow data to be passed into components.

```tsx
<Card title="Spanish Vocabulary" />
```

### State

State allows components to remember information.

```tsx
const [count, setCount] = useState(0);
```

### Effects

Effects run code when something changes.

```tsx
useEffect(() => {
  loadCards();
}, []);
```

## Things I've Learned

* UI is generated from state.
* Updating state causes React to re-render.
* Components should focus on a single responsibility.
* Reusable components reduce duplicated code.

---

# React Native

## What React Native Is

React Native allows React applications to run as native mobile apps.

## Differences From React Web

Instead of:

```html
<div>
```

React Native uses:

```tsx
<View>
```

Instead of:

```html
<p>
```

React Native uses:

```tsx
<Text>
```

## Common Components

### View

Container element.

```tsx
<View>
  <Text>Hello</Text>
</View>
```

### Text

Displays text.

```tsx
<Text>Flashcard App</Text>
```

### Pressable

Handles touch interactions.

```tsx
<Pressable onPress={saveCard}>
  <Text>Save</Text>
</Pressable>
```

### ScrollView

Allows scrolling content.

```tsx
<ScrollView>
  {cards.map(...)}
</ScrollView>
```

## Things I've Learned

* Mobile layouts rely heavily on Flexbox.
* Styling is done with JavaScript objects.
* Performance matters more on mobile devices.
* Touch interactions require different design decisions than web applications.

---

# Next.js

## What Next.js Is

Next.js is a React framework focused on web applications.

## Concepts

### Routing

Pages are generated from the file structure.

Example:

```text
app/
├── page.tsx
├── about/
│   └── page.tsx
```

### Server Components

Some components can run on the server instead of the browser.

### Client Components

Components that require interaction use:

```tsx
"use client";
```

### Server-Side Rendering (SSR)

Pages can be rendered on the server before being sent to the browser.

## Things I've Learned

* Browser APIs like `window` are not always available.
* Server-side rendering changes how data loading works.
* Client and server code must be separated carefully.

## Related Discovery

The Flashcard App originally contained checks like:

```ts
typeof window !== "undefined"
```

This highlighted the difference between browser-only code and code that can run elsewhere.

---

# TypeScript

## Why TypeScript

TypeScript helps catch mistakes before running code.

## Interfaces

```ts
interface Flashcard {
  id: string;
  front: string;
  back: string;
}
```

## Benefits

* Better autocomplete
* Earlier error detection
* Self-documenting code
* Easier refactoring

## Things I've Learned

* Interfaces describe object shapes.
* Types make large projects easier to maintain.
* Strict typing helps prevent bugs.

---

# Mobile Storage

## MMKV

Current storage solution:

```ts
createMMKV({
  id: "flashcard-app-storage",
});
```

## Things I've Learned

* MMKV stores data locally on the device.
* Data persists between app launches.
* MMKV is much faster than AsyncStorage.
* Storage concerns should be separated from UI concerns.

## Open Questions

* Best practices for backups and export/import.
* How storage should work on web versus mobile.

---


## Recent Lessons

* Resolve merge conflicts manually.
* Review files before pushing.
* Use `.gitignore` to prevent unnecessary files from being tracked.

---

# Lessons From This Project

## Technical

* Building software reveals knowledge gaps faster than trying to study vauge concepts.
* UI is just as important as Storage, routing, and state management.
* Simple architecture is usually better than clever architecture.

## Personal

* Understanding comes from building.
* Documentation prevents repeated mistakes.
* Small progress every day compounds over time.

---

# Future Topics To Learn

* Authentication
* APIs
* SQLite
* State management
* Testing
* CI/CD
* App deployment
* Cloud synchronization
* AI-assisted flashcard generation
* Performance optimization

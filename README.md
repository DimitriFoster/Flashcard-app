# Folio

Folio is a local-first flashcard and notes app built with Expo, React Native,
TypeScript, and MMKV. It includes deck creation, spaced-repetition review,
Browse mode, and a focused notes workspace.

## Run locally

Install Node.js and the platform toolchain, then run:

```sh
npm ci
npm run android
```

The app uses native modules, including MMKV, so use an Expo development build
rather than Expo Go. After installing the development build, start Metro with
`npm start`.

For iOS development on macOS, use `npm run ios`. Web development is available
with `npm run web`.

## Checks

```sh
npx tsc --noEmit
npm run lint
```

Local backups, generated files, reports, automation experiments, and personal
workspace notes are deliberately excluded from the repository. Assets already
tracked are the ones the current application references. If you add new app
artwork under `assets/`, explicitly stage the required files with `git add -f`.

An Expo Application Services project can be connected separately if remote
builds are needed; no account-specific project identifier is stored here.

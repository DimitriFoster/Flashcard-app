# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

# Flashcard App

A lightweight flashcard application inspired by the spaced repetition system in anki. Built with Expo and React Native using the codex downloadable ai agent.

## Features

- Create multiple decks
- Add and edit flashcards
- Spaced repetition review system
- Local storage using MMKV

## Tech Stack

- Expo
- React Native
- TypeScript
- React Native MMKV

## Running the App

Prerequisites

Before running the app, install:

Node.js (LTS version recommended)

Git

Expo Go on your Android or iPhone

1. Clone the Repository

```bash
git clone https://github.com/DimitriFoster/Flashcard-app.git
cd Flashcard-app
```

2. Install Dependencies

```bash
npm install
```

3. Start the Expo Development Server

```bash
npx expo start
```

This will open the Expo development server and display a QR code in the terminal and browser.

4. To open the app on your phone
Install Expo Go from the App Store or Google Play.
Ensure your phone and computer are connected to the same Wi-Fi network.
Open Expo Go.
Scan the QR code displayed by the Expo development server.

The app should load on your device within a few seconds.

## Troubleshooting

QR Code Does Not Work

Try starting Expo with a tunnel connection:

```bash
npx expo start --tunnel
```

Dependencies Are Missing

Delete existing dependencies and reinstall:

```bash
rm -rf node_modules
npm install
```

App Fails to Start

Clear the Expo cache:

```bash
npx expo start --clear
```
=======
npx expo start
>>>>>>> 2793da2d6824c3cf366ccf36c85c99e6fe72ae1c

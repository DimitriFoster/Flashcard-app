// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/**",
      "src/**/*.js",
      "flashcard-ui-warm-snappy/**",
      "src/components/folio/**",
      "src/folio-browse/**",
      "src/folio-review/FolioReviewScreen.tsx",
      "src/folio-review/types.ts",
      "src/folio-review/index.ts",
      "src/components/review/preview-panel.tsx",
      "src/app/maestro-seed.tsx",
      "src/storage/maestro-fixtures.ts",
    ],
  }
]);

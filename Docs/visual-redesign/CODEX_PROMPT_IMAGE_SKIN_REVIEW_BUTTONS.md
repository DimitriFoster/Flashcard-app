# Codex Prompt - Image-Skin Buttons on Review Deck Page

Read:

```txt
Docs/visual-redesign/FOLIO_IMAGE_SKIN_BUTTONS_CODEX_BRIEF.md
```

Task:

Apply the image-skin button system only to the review/browse deck page buttons.

Use:

```txt
src/components/folio/buttons/FolioImageSkinButton.tsx
src/components/folio/buttons/FolioReviewButtonSet.tsx
assets/images/review-button-skins/*.png
```

Edit only:

```txt
src/components/review/deck-review-session.tsx
src/components/review/deck-review-session.styles.ts
```

Requirements:

```txt
- Keep current working Pressable behavior.
- Use PNG image skins as button backgrounds.
- Center real FolioSvgIcon icons on top.
- Keep real Text labels/hints on top.
- Do not bake text/icons into images.
- Keep the existing callbacks for Back, Undo, Edit, Help, Again, Hard, Good, Easy.
- Preserve the existing review and browse logic.
- Do not change the session-flow strip in this pass.
```

After editing, run:

```powershell
npm run lint
npx tsc --noEmit
```

Report changed files and any errors.

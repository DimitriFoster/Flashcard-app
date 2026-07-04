# Folio Browse Card Mockup Update — Round 13

This update tightens the browse-card mockup implementation from round 12.

## Changes

- Added the review-page bottom navbar beneath the "Browse mode keeps your schedule unchanged" panel.
- Updated `BottomTabBar` so it supports an `activeTab` prop.
- Added a blue active Browse icon asset: `browse_icon_active_round12.png`.
- Kept the Review page behavior unchanged by defaulting `activeTab` to `review`.
- Tightened the Previous / Flip / Next button assets and gave their render containers more room so the visible faces are less likely to clip.
- Kept browse page PNGs responsive by rendering them into width-based containers with fixed proportions.

## Responsive behavior notes

- PNGs resize to their React Native container when rendered with `Image` or `ImageBackground`.
- For button faces and icons, prefer `resizeMode="contain"` when preserving aspect ratio matters.
- For panel/card shells that need to fill a specific rectangle, `resizeMode="stretch"` is used.
- The page width is constrained by `maxWidth: 430` and otherwise uses `width: '100%'`, so it adapts to smaller/larger phones while keeping the Folio mockup proportions.
- Vertical layout is inside a `ScrollView` for shorter phones, so the page remains usable if the full mockup does not fit perfectly.

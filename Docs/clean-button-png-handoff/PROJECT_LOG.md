# PROJECT_LOG.md

Built this handoff to avoid further style drift.

## What was done
- Took the two user-approved example PNGs.
- Removed the checkerboard / non-transparent background while preserving the button art and its baked-in soft shadow.
- Cropped each cleaned asset to a practical transparent bounding box.
- Added strict Codex instructions so the art is used directly instead of being recreated.

## Why this should work better
The previous approach let Codex rebuild the button visuals with code, which introduced differences in:
- texture density
- icon shape
- font feel
- label spacing
- border softness
- overall fidelity

This handoff switches the approach to: **exact art asset + normal Pressable behavior**.

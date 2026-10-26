# ANICLIP MVP v0.1 — Beta Status

## Current prototype

The browser-first prototype is a static web application intended for early UI and workflow testing.

### Implemented in the prototype branch

- Responsive dark charcoal and lime-green interface.
- Create a project with anime, primary character, story type, duration, aspect ratio, output mode, and character lineup.
- Mode C output planning: separate character plans, a combined plan, or both.
- Editable starter story beats, narrative purpose, overlay text, and planned segment duration.
- Source review fields for candidate URL, status, timestamp reference, and notes.
- Local browser storage for project drafts.
- JSON project export, backup export, and import.
- Project library with open, search, export, and delete actions.
- GitHub Pages deployment workflow for the static app.

## Explicitly not implemented yet

- Gemini API integration or live AI generation.
- Live anime/character discovery or automatic source search.
- Automatic verification of scenes, episodes, timestamps, media access, or usage rights.
- Source-video downloading or DRM/access-control bypass.
- Actual MP4 rendering, timeline playback, or audio processing.
- Automatic publishing to social platforms.

The story outlines in this version are editable starter templates. They are not evidence that a specific scene exists at a particular timestamp.

## Beta test checklist

- [ ] Open the app on desktop and mobile browsers.
- [ ] Create a one-character project.
- [ ] Create a five-character project using Mode C.
- [ ] Switch between individual and combined output plans.
- [ ] Edit a hook, story beat, overlay, and duration.
- [ ] Add a source URL and update its verification status.
- [ ] Export one project to JSON and re-import it.
- [ ] Export a full backup and confirm project data is present.
- [ ] Confirm that no feature claims a video was rendered.
- [ ] Check browser console and GitHub Actions for errors after deployment.

## Storage and cost

Project drafts are stored in browser local storage. Users should export backups before clearing browser data or switching browsers/devices. No paid API, billing, cloud rendering, or external AI service is activated by this prototype.

Gemini must be integrated through a trusted backend if added later; API credentials must never be placed in frontend JavaScript or committed to GitHub.

## Deployment

The pages.yml workflow deploys the static site when changes reach main or when manually triggered from the default branch. Repository Pages settings must allow GitHub Actions deployment. A successful GitHub commit alone does not prove that the site has been deployed or tested.

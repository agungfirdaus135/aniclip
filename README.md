# ANICLIP 🎬

**AI Anime Story Clipper**

ANICLIP is a planned AI-assisted tool for creating coherent, short anime storytelling clips for vertical-video creators and international audiences.

The goal is not simply to collect random anime scenes. ANICLIP is designed to help creators build a story arc, discover relevant source candidates, review scene selections, and prepare an editing project for rendering.

> **Project status:** MVP v0.1 browser prototype is being built on the `feat/mvp-v0.1` branch. It currently uses local starter templates; live Gemini integration, automated source search, and MP4 rendering are not connected.

## Product Workflow

The primary workflow is **Anime → Character → Story Type**.

1. Choose an anime.
2. Choose a character.
3. Choose a story type.
4. Build a coherent story arc.
5. Find candidate source videos for each story segment.
6. Review, remove, or replace candidates.
7. Check media availability and verify timestamps.
8. Review and edit the Story Result.
9. Continue through an eligible online rendering path or the Offline PC Renderer.

If AI search cannot identify an anime, character, or source confidently, the interface should offer manual search or correction rather than inventing information.

## Planned Features

- **Anime and character search:** AI-assisted discovery with source references and manual fallback.
- **Story Builder:** Arrange scenes into a meaningful narrative instead of selecting unrelated highlights.
- **Six story types:** Origin Story, Betrayal & Revenge, Character Awakening, Strongest Moments, Emotional Story, and Full Character Journey.
- **Smart Hook:** Suggest an opening moment and matching English text overlay based only on material the system can actually analyze.
- **Hybrid source discovery:** Manual Links and AI Auto Search, with up to three candidate sources per story segment.
- **Story Result:** Review the story sequence, source candidates, durations, overlays, and verification statuses before rendering.
- **Output preferences:** Video aspect ratio, resolution, subtitles, audio/music, and framing.
- **Shared project format:** Carry story planning and editing instructions between the online app and offline renderer.

## Default Output

| Setting | Default |
|---|---|
| Duration | 30 seconds |
| Available durations | 15, 20, or 30 seconds |
| Aspect ratio | 9:16 vertical |
| Format | MP4 |
| Resolution | Configurable; 1080p target where feasible |
| Text overlays | English |
| ANICLIP watermark | Off |
| Automatic publishing | Not included |

Actual output quality, rendering capability, and resolution depend on available processing resources and source-media properties.

## Source Access and Verification

Finding a source URL does not mean ANICLIP has access to an editable video file.

A public video URL or platform metadata alone does not guarantee that the media can be acquired or rendered. ANICLIP must distinguish between:

- Source discovered
- Source access checked
- Media available for processing
- Timestamp verified
- Unverified or unavailable source

Timestamps must never be invented. If media cannot be accessed through supported and permitted methods, the app should explain the limitation and offer a manual route using local media the user owns or is authorized to edit.

ANICLIP must not bypass DRM, paywalls, access controls, or other restrictions.

## Architecture

ANICLIP is planned as two complementary parts.

### Online Web App

Responsible for anime and character discovery, story planning, source candidates, user review, and project preparation.

### Offline PC Renderer

Responsible for processing authorized local media and rendering the final MP4. The first phase prioritizes a local FFmpeg-based workflow. More demanding local AI features can be evaluated after the target computer's hardware is known.

Both parts should use a shared, versioned project format. An online project can be continued offline when the necessary local media files are available and correctly mapped.

Cloud rendering is optional and must depend on actual free-tier quotas, compute availability, and cost limits.

## Design Direction

- Dark charcoal interface with lime-green accents
- Minimal, responsive, English-first UI
- Clear status labels and editable results
- No claims that simulated or unverified results are real processing output

## Cost and Security Principles

- Start with a free-first prototype.
- Be transparent about hosting limits, API quotas, and compute requirements.
- Never expose Gemini API keys in frontend code, public repositories, project exports, logs, or screenshots.
- Keep AI credentials in a secure backend environment when integration is implemented.
- Do not enable paid services or billing without explicit approval.
- Do not promise unlimited free hosting, guaranteed virality, or guaranteed revenue.

## Documentation

- [Workflow Flowchart](docs/FLOWCHART.md)
- [Product Specification](docs/SPECIFICATION.md)

## MVP v0.1 Prototype Status

The first browser prototype is being developed as a static, free-first web app. It includes an editable starter storyboard, Mode C multi-character planning (individual and combined plans), local project storage, source-status review, output preferences, and JSON import/export.

- **Implemented in the prototype branch:** responsive UI, local starter-template story plans, project library, editable segments, source review fields, JSON backup/import, and a GitHub Pages deployment workflow.
- **Not connected yet:** Gemini API, live anime/source search, automatic timestamp verification, source-video download, and MP4 rendering.
- **Data storage:** browser local storage. Export JSON backups before clearing browser data or switching devices.
- **Deployment:** GitHub Pages can serve the static app after the workflow is merged to `main` and Pages is enabled for GitHub Actions in repository settings.

## Roadmap

1. Beta-test the browser prototype and fix UI/data issues.
2. Validate the shared project format and source-review workflow.
3. Evaluate a secure backend for Gemini integration without exposing API keys.
4. Test permitted media workflows and timestamp verification.
5. Implement and test local rendering with authorized media.
6. Evaluate additional AI processing and optional cloud rendering against real cost limits.

## Scope and Compliance

ANICLIP helps plan and prepare edits. It does not automatically grant rights to reuse copyrighted anime footage, guarantee platform monetization eligibility, or publish content on the user's behalf.

**Prototype limits are explicit:** the current UI creates editable starter plans; it does not claim AI-generated verification, source access, or successful MP4 rendering until those capabilities are implemented and tested.

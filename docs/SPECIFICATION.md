# ANICLIP — Product Specification

## 1. Document Status

This specification defines the proposed product behavior, architecture, constraints, and acceptance criteria for ANICLIP. It is documentation for review, not proof that the described features have been implemented.

## 2. Product Overview

ANICLIP is an AI-assisted Anime Story Clipper intended to help creators plan coherent anime storytelling videos and prepare them for editing and rendering.

The intended audience is international, with an initial focus on English-speaking viewers. The product prioritizes narrative coherence, source transparency, editable results, and a practical path from online story planning to offline rendering.

The main product principle is:

**Build the story first, discover suitable sources second, verify the media, then prepare the render.**

## 3. Primary User Flow

1. Choose an anime.
2. Choose a character.
3. Choose a story type.
4. Build a coherent story arc.
5. Choose the target duration.
6. Generate a proposed Smart Hook and scene plan.
7. Discover candidate sources for each story segment.
8. Review and edit the candidates.
9. Check media availability and verify timestamps.
10. Review and edit the Story Result.
11. Choose a supported online or offline processing path.

If a search result is ambiguous, the user must have a manual fallback. ANICLIP must not invent anime details, character information, sources, scenes, or timestamps.

## 4. Anime and Character Search

### Requirements

- Search for anime information and relevant characters.
- Present source references where available.
- Allow manual search, correction, and selection when results are missing or ambiguous.
- Separate discovered metadata from verified visual evidence.
- Avoid presenting unverified search results as confirmed facts.

### Initial Input Mode

**Mode A — Anime → Character → Story Type** is the primary planned workflow.

The initial prototype focuses on YouTube as the first source-discovery experiment. The longer-term product may consider YouTube, Facebook, Instagram, TikTok, Threads, X/Twitter, and Other.

Supporting a platform in the interface does not automatically mean that its media can be accessed, downloaded, or rendered.

## 5. Story Types

The planned story types are:

1. Origin Story
2. Betrayal & Revenge
3. Character Awakening
4. Strongest Moments
5. Emotional Story
6. Full Character Journey

The Story Builder must organize a meaningful sequence rather than randomly combining popular scenes.

Example narrative structure:

**Betrayal → Survival → Awakening → Revenge**

This is a narrative planning example, not a claim that particular scenes or timestamps have been verified.

## 6. Duration and Story Planning

Supported target durations:

- 15 seconds
- 20 seconds
- 30 seconds

The default is 30 seconds.

The Story Builder should allocate a proposed duration to each segment and check that the total fits the selected target. Final durations may need adjustment based on verified scene lengths and editing constraints.

## 7. Smart Hook

Smart Hook is the planned AI feature that proposes an opening moment and generates matching text overlay.

Requirements:

- The proposed hook must support the story's narrative direction.
- Overlay text should be concise, natural English suitable for short-form content.
- The opening moment must be based on material the system can actually inspect.
- If only source metadata is available, the system must not claim scene-level visual analysis.
- The user can review and edit the hook before processing.

## 8. Source Discovery

Two modes are planned:

### Manual Links

The user supplies source URLs for consideration.

### AI Auto Search

AI searches for relevant source candidates using the story outline and character context.

### Hybrid Candidate Review

- Suggest up to three candidate sources per story segment.
- Display useful source metadata and references where available.
- Let the user remove or replace candidates.
- Preserve the distinction between source discovery and media availability.
- Do not invent source URLs or imply that an untested source is accessible.

## 9. Media Access and Timestamp Integrity

ANICLIP must treat the following as separate states:

1. Source discovered
2. Source access checked
3. Editable media available
4. Scene or timestamp verified
5. Media prepared for the selected renderer

A public URL or metadata result does not guarantee access to an editable media file.

The application must not fabricate episode numbers, timestamps, or scene descriptions. If exact verification is not possible, it should display an unverified status.

When the media cannot be processed through supported and permitted methods, the application should explain the limitation and offer a manual route for local material the user owns or is authorized to edit.

ANICLIP must not bypass DRM, paywalls, access controls, or other restrictions.

## 10. Story Result

The Story Result is an editable plan, not automatically a rendered video.

It should contain:

- Anime and character selection
- Selected story type and narrative outline
- Ordered story segments
- Proposed duration per segment
- Source candidates and source references
- Scene/timestamp verification statuses
- Smart Hook and English overlay text
- Media availability and processing status
- Output settings
- Next-step instructions

Users must be able to review and edit the result before media processing or rendering.

## 11. Output Settings

### Defaults

| Setting | Default |
|---|---|
| Duration | 30 seconds |
| Aspect ratio | 9:16 |
| File format | MP4 |
| Overlay language | English |
| ANICLIP watermark | Off |
| Automatic publishing | Not included |

### Planned Options

- Duration: 15, 20, or 30 seconds
- Aspect ratio: 9:16, 1:1, 16:9, or 4:5
- Target resolution: 720p or 1080p, subject to processing capability
- Subtitle preferences
- Audio/music preferences
- Framing preferences

The output must be described as a target configuration until an actual render succeeds. Resolution and quality depend on the input media and available compute.

## 12. Architecture

ANICLIP is planned as an online planning application paired with an offline PC renderer.

### 12.1 Online Web App

Responsibilities:

- Anime and character search
- Story Builder
- Source discovery and candidate review
- Verification status management
- Story Result editing
- Output configuration
- Shared project export

Cloud rendering is optional and must only be offered when a supported processing route and sufficient resources are available.

### 12.2 Offline PC Renderer

Initial responsibilities:

- Open a compatible ANICLIP project file
- Map project segments to authorized local media
- Apply planned cuts, aspect ratio, overlays, and supported settings
- Render MP4 through a local FFmpeg workflow
- Report actual success or failure

More demanding local AI features, such as advanced visual analysis or automated framing, should be evaluated in a later phase after the target computer's hardware is known.

### 12.3 Shared Project Format

The online application and offline renderer should use one versioned project format.

The format should support, at minimum:

- Project schema version
- Anime, character, and story metadata
- Ordered story segments
- Planned durations and timing references
- Source URLs and source metadata
- Verification and media-readiness statuses
- Overlay text and subtitle preferences
- Output aspect ratio, resolution target, and audio preferences
- Local media references when available
- Render instructions and project status

The project file should not contain API keys, passwords, session cookies, or other secrets.

Local media references must be remappable. Exporting a project does not imply that the underlying source video files are included or automatically available on another device.

The project format should remain backward-compatible where practical, with explicit versioning for changes that affect compatibility.

## 13. Rendering and Processing Status

The application should distinguish between:

- Planning
- Searching for sources
- Reviewing candidates
- Checking access
- Mapping local media
- Ready to render
- Rendering
- Rendered
- Failed or unavailable

A successful render status must only be shown after an actual output file has been produced and checked.

If online rendering is unavailable because of quotas, hosting limits, or compute restrictions, the app should explain the limitation and offer an appropriate project export or offline workflow where possible.

## 14. Cost Constraints

The prototype should follow a free-first approach.

- Prefer free tools and tiers where suitable.
- Clearly disclose quotas and compute limitations.
- Do not promise unlimited free API usage, permanent free hosting, or guaranteed cloud rendering.
- Do not enable paid services or billing without explicit user approval.
- Evaluate resource-intensive features before including them in the prototype.

## 15. Security and Compliance

- Keep Gemini API credentials on a trusted backend when API integration is implemented.
- Never commit API keys to source control or expose them in frontend code, project exports, logs, or screenshots.
- Use only supported and permitted methods to access source media.
- Do not bypass DRM, paywalls, or access restrictions.
- Remind users to verify rights and permissions for footage, music, and other media they use.
- Do not imply that editing a clip grants permission to publish it or guarantees monetization eligibility.

## 16. UI and UX

- Dark charcoal background
- Lime-green accent
- Minimal and responsive layout
- English-first interface
- Clear source and verification statuses
- Editable story results
- Clear separation between demo content, planned content, and real processing results

Planned primary views:

- Create
- Story Builder
- Source Review
- Story Result
- Settings
- Project / Render Status

## 17. Out of Scope for the Initial Prototype

- Automatic publishing to social platforms
- Guaranteed source-video download from arbitrary URLs
- Bypassing DRM, paywalls, or access restrictions
- Guaranteed scene-level analysis when video content is inaccessible
- Guaranteed free cloud rendering
- Guaranteed viral performance or revenue
- Treating a simulated preview as a rendered MP4

## 18. Proposed Development Phases

1. Finalize and approve the documentation.
2. Agree on the shared project schema and prototype boundaries.
3. Build the interactive UI prototype after explicit approval.
4. Evaluate Gemini integration and source-discovery quality.
5. Test source access and timestamp-verification behavior.
6. Build a local FFmpeg renderer for authorized media.
7. Test project portability between online planning and offline rendering.
8. Evaluate optional local AI and cloud rendering against real cost and hardware constraints.

## 19. Acceptance Criteria

The planned design is ready for implementation planning when:

- The main workflow is consistent across all documentation.
- Story planning precedes source discovery.
- Source candidates can be reviewed and replaced.
- Media access and timestamp verification are distinct statuses.
- The shared project format supports the online/offline workflow.
- Output settings and rendering limitations are documented.
- Security, copyright, and cost boundaries are explicit.
- Planned functionality is not misrepresented as implemented functionality.

Implementation must not begin until the user explicitly approves the documentation and authorizes the next phase.

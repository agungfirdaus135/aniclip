# ANICLIP — Workflow Flowchart

## 1. Purpose

This document defines the proposed end-to-end workflow for ANICLIP. It describes intended behavior and does not claim that the workflow has already been implemented.

## 2. Main Flow

~~~mermaid
flowchart TD
    A[Open ANICLIP] --> B[Choose Anime]
    B --> C[AI Search Anime Information]
    C --> D{Anime Identified?}
    D -- No --> E[Manual Search or Correct Input]
    E --> C
    D -- Yes --> F[Choose Character]
    F --> G[AI Search Character Information]
    G --> H{Character Identified?}
    H -- No --> I[Manual Search or Select Another Character]
    I --> G
    H -- Yes --> J[Choose Story Type]
    J --> K[Build Coherent Story Arc]
    K --> L[Choose Duration: 15, 20, or 30 Seconds]
    L --> M[Plan Scenes and Smart Hook]
    M --> N[Search Source Candidates]
    N --> O[Rank Up to 3 Candidates per Story Segment]
    O --> P[Review, Remove, or Replace Candidates]
    P --> Q[Check Source Access and Media Availability]
    Q --> R{Editable Media Available?}
    R -- No --> S[Show Status and Authorized Manual Media Path]
    S --> Q
    R -- Yes --> T[Verify Scene and Timestamp]
    T --> U[Build Story Result]
    U --> V[Review and Edit Story Result]
    V --> W{Choose Processing Path}
    W -- Online --> X{Eligible Rendering Resources Available?}
    X -- Yes --> Y[Render if Supported and Permitted]
    X -- No --> Z[Export Project and Rendering Instructions]
    W -- Offline --> AA{Authorized Local Media Available?}
    AA -- Yes --> AB[Prepare Local Render]
    AA -- No --> AC[Request or Map Local Media]
    AC --> AA
    AB --> AD[Render Locally with FFmpeg]
    Y --> AE[Show Output and Render Status]
    Z --> AF[Show Export Status]
    AD --> AE
~~~

## 3. Workflow Details

### Step 1 — Anime and Character Discovery

The user selects an anime, then a character. AI-assisted search should return useful information and source references when available.

If the result is ambiguous or missing, the user can correct the input, search manually, or select another result. The system must not fabricate titles, characters, scenes, or source references.

### Step 2 — Story Builder

The user chooses one of the supported story types:

- Origin Story
- Betrayal & Revenge
- Character Awakening
- Strongest Moments
- Emotional Story
- Full Character Journey

The system creates a coherent narrative outline before searching for footage. A sample story arc might be Betrayal → Survival → Awakening → Revenge.

This outline is a plan, not proof that the corresponding scenes have been located or verified.

### Step 3 — Smart Hook

Smart Hook proposes an opening moment and matching English overlay based on evidence the system can actually inspect.

If the system only has metadata or a URL and cannot inspect the video content, it must not claim to have identified the exact visual moment.

### Step 4 — Source Discovery

The user can choose between:

- **Manual Links:** provide candidate source URLs.
- **AI Auto Search:** search for relevant sources automatically.

The intended discovery approach is hybrid. ANICLIP may suggest up to three candidates per story segment. The user can review, remove, or replace candidates.

A discovered URL does not imply that a video file is downloadable, editable, or available for rendering.

### Step 5 — Media Availability and Timestamp Verification

Before a candidate is treated as ready for editing, ANICLIP checks whether the media is available through supported and permitted methods.

Where exact scene or timestamp verification is possible, the result should be marked accordingly. If verification is not possible, the system must label it as unverified rather than inventing an episode number or timestamp.

When media is unavailable, the user should receive a clear status and a manual path for providing local media they own or are authorized to edit.

ANICLIP must not bypass DRM, paywalls, or access controls.

### Step 6 — Story Result

The Story Result should present:

- Ordered story segments and narrative purpose
- Planned duration for each segment
- Source candidates and references
- Scene and timestamp verification status
- Smart Hook text and other English overlays
- Editable sequence and output preferences
- Media readiness and next-step instructions

The user must be able to review and edit the planned result before processing.

### Step 7 — Online or Offline Processing

**Online path:** Proceed only if the media can be processed lawfully and supported rendering resources are actually available. If not, show the limitation and offer a project export or rendering instructions.

**Offline path:** Use authorized local media. The initial renderer targets a local FFmpeg workflow. More advanced local AI processing is a later evaluation, dependent on actual computer hardware.

Both paths should use a shared, versioned project format. Project portability does not mean that source video files are automatically embedded or transferred.

### Step 8 — Render Status

The interface must distinguish between planning, media preparation, rendering, completion, and failure. It must not claim an MP4 exists unless the rendering process has actually produced one.

## 4. Suggested Status Labels

| Status | Meaning |
|---|---|
| Found | A relevant candidate or reference was discovered |
| Access checked | Access was checked using the available supported method |
| Media available | Editable media is available for the intended processing path |
| Timestamp verified | The scene position or timestamp was checked against the relevant media |
| Unverified | The source, scene, or timestamp has not been confirmed |
| Unavailable | The source or media cannot currently be used through the available method |
| Ready to render | Required media and settings are prepared for the selected renderer |
| Rendered | A real output file was successfully produced |
| Failed | The attempted step did not complete successfully |

## 5. Planned Views

- **Create:** anime, character, and story-type selection.
- **Story Builder:** narrative outline, segment order, and duration.
- **Source Review:** candidate sources and verification status.
- **Story Result:** editable sequence, hook, overlays, and output settings.
- **Settings:** aspect ratio, resolution, subtitles, audio/music, and framing.
- **Project / Render Status:** project export, media mapping, and rendering status.

## 6. Scope Boundaries

- No automatic publishing to social platforms.
- No fabricated scene details or timestamps.
- No assumption that a URL provides an editable video file.
- No bypass of DRM, paywalls, or access restrictions.
- No guarantee that a free cloud renderer will always be available.
- No claim that a simulated preview is a real rendered video.
- No guarantee of copyright clearance, platform monetization, virality, or revenue.

## 7. Implementation Gate

Implementation has been explicitly authorized. The MVP v0.1 browser prototype is being developed on a feature branch. The static prototype does not yet connect Gemini, live source search, timestamp verification, or MP4 rendering.

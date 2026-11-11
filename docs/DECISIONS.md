# Phase 0 — Decisions, assumptions and platform findings

Recorded before any implementation work, so later phases can be audited against them.

## Environment findings (verified, not assumed)

| Check | Result | Consequence |
| --- | --- | --- |
| Node 22 / npm 10 | Available | The Phase 1 preview runs and is served live |
| Web research | Available | The Phase 5 per-provider ToS report can be based on real sources |
| JDK | Not installed | No Kotlin compilation |
| Gradle distribution | `services.gradle.org` unreachable | No Gradle build, no wrapper verification |
| Android SDK | `dl.google.com` unreachable | No `assembleDebug`, no emulator, no lint |
| Maven Central / Google Maven | Unreachable | No dependency resolution for Media3, Room, Hilt |
| npm registry | Reachable | Preview dependencies install cleanly |

**Conclusion:** Phases 2–6 deliver complete, reviewed Android source that must be built locally. No build result will be claimed that was not actually produced.

## Decisions taken

### 1. Online services — risk posture: unofficial-first

Maximise playback and download capability rather than restrict to official APIs.

Consequences accepted:

- Every provider still sits behind `MusicSourceProvider` with an explicit capability descriptor (`canStream`, `canDownload`, `canImportPlaylists`, `requiresPremium`, `authKind`), so an unofficial path that breaks can be disabled without touching the UI.
- Unofficial paths are gated behind an explicit, persisted "I understand the risk" opt-in and are labelled `unofficial` wherever they appear in the UI.
- Credentials are read from `local.properties` via BuildConfig. Nothing is hardcoded.

**One carve-out.** Unofficial **Spotify downloading is DRM circumvention**, which is unlawful under DMCA §1201 and its EU equivalents independently of Spotify's Terms of Service. That single capability ships as an explicit, capability-disabled stub with the reason documented in code. Unofficial Spotify *streaming*, and both YouTube Music and SoundCloud (ToS-violating but not DRM circumvention), are implemented in full. This carve-out was flagged to the product owner at Phase 0.

Relevant research note: SoundCloud's public API registration, closed since 2017, reopened as self-service in May 2026 for Artist-Pro subscribers, so an official SoundCloud path is now conditionally available.

### 2. Lyrics — legal-first plus opt-in scraping

Provider order: **LRCLIB** (free, open, synced and unsynced) → **Musixmatch** (only when a licensed API key is supplied; the free tier returns a partial transcript, which the UI states explicitly) → **Genius** (official API for metadata and deep links, plus an opt-in HTML scrape for full text, disabled by default and flagged `unofficial` in the UI).

Results are cached locally, ranked by confidence, and the user can re-run the search or pick a different provider result.

### 3. Notification seek bar — correction to an earlier claim

An earlier statement in this session said a seek bar in a media notification is "not technically possible". **That was wrong**, and the correction matters because it changes what gets built.

What the platform documentation actually specifies:

> "The media player shows the elapsed time for the currently playing media, along with a seek bar which is mapped to the MediaSession PlaybackState. The seek bar allows users to change the position and displays the elapsed time for the media item. In order for the seek bar to be enabled, you must implement `PlaybackState.Builder#setActions` and include `ACTION_SEEK_TO`."
> — Android Developers, *Media controls*

> "Adding the SEEK_TO action indicates that seeking is supported and makes the seekbar position marker draggable. If this is not supplied seek will be disabled but progress will still be shown."
> — Google Cast, *Output Switcher*

The accurate distinction:

- An app **cannot draw** a seek bar inside a `MediaStyle` notification itself.
- The **system draws one**, and it **is draggable**, because since Android 13 SystemUI derives media controls from the `MediaSession`'s `PlaybackState` and metadata rather than from the notification layout.

YouTube Music, SoundCloud and Spotify use no private API. They publish a correct media session. MPlayer++ does the same.

Implementation commitments:

| Requirement | How |
| --- | --- |
| Cover, title, artist | `MediaMetadata` (`METADATA_KEY_TITLE`, `_ARTIST`, `_ALBUM_ART_URI`, `_DURATION`) |
| Draggable seek bar | `PlaybackState` with position, duration, speed and `ACTION_SEEK_TO` |
| Play/Pause, Next, Previous | Slots 1–3, derived from `PlaybackState` actions |
| "Add to favorites" | Slot 4 as a Media3 `CommandButton`; pre-Android 13 it is the fourth `Notification.Action` with `setShowActionsInCompactView(0, 1, 2)` |
| Lock screen, Bluetooth, headset, Auto | All come from the same `MediaSession`, via `MediaSessionService` |
| Live / unknown duration | Scrubber is hidden by the system; this is correct behaviour, not a defect |

No custom `RemoteViews` decoration is used: it would fight the standard system UI and break on Android 13+.

### 4. Preview stack — React + Vite + Tailwind

Roughly sixteen surfaces share the mini player, tab bar, sheet system and theme, so components beat duplicated markup. The component tree also maps one-to-one onto the Compose screens built in Phase 2. Plain JavaScript, not TypeScript, per the selected option.

### 5. Localization — English only, structured for more

Every user-facing string lives in `preview/src/i18n/en.js`, keyed to mirror `res/values/strings.xml`. Adding a locale means adding one dictionary file. No string is hardcoded in a component.

## Assumptions carried forward

1. **Statistics threshold.** A listen counts at ≥ 30 seconds or ≥ 50 % of track duration, whichever comes first. Both values and the rule (either/both) are user-configurable.
2. **De-duplication key for "All".** `lowercase(title) + lowercase(artist) + duration bucketed to ±2 s`, upgraded to an ISRC when metadata supplies one. Copies are collapsed in the view but kept distinct in the database so per-source statistics stay accurate, and a "Possible duplicates" screen shows what was collapsed.
3. **Volume boost.** `LoudnessEnhancer` on the player audio session, gain in millibels, hard-capped at 200 %, confirmation dialog when crossing 100 %, limiter engaged, value persisted in DataStore, and a visible unsupported-device state when the effect is absent rather than a silent no-op.
4. **Design.** One brand accent (jade), Material 3, calm and spacious, large cover art, rounded corners, subtle motion, full light and dark themes. Dynamic colour from cover art applies to the player screen only.
5. **Android delivery.** Source plus Gradle wrapper plus exact local setup steps. A `VERIFICATION.md` log will record every claim that could not be machine-verified in the sandbox.
6. **Preview fidelity.** Interactions are real (navigation, tabs, sheets, seek, sliders, toggles, favorites, downloads, theme, device-state simulation). Data is invented. No audio is played.

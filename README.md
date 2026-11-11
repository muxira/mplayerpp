# MPlayer++

A minimalist music player that unifies local tracks and streaming-service libraries in one place: playlists, favorites, a generated "All" collection, lyrics, listening statistics and a proper media-session notification.

**All code, comments, documentation and commit messages in this repository are written in English.**

---

## Status

| Phase | Scope | State |
| --- | --- | --- |
| 0 | Clarification, decisions, assumptions | ✅ Complete — see [`docs/DECISIONS.md`](docs/DECISIONS.md) |
| 1 | Clickable web preview of the whole interface | ✅ Complete — awaiting design approval |
| 2 | Android project setup and architecture | ⏳ Not started |
| 3 | Local playback core | ⏳ Not started |
| 4 | Lyrics, statistics, settings | ⏳ Not started |
| 5 | Online services | ⏳ Not started |
| 6 | Polish and QA | ⏳ Not started |

Each phase stops for approval before the next one starts.

## Repository layout

```
.
├── README.md              This file
├── docs/
│   └── DECISIONS.md       Phase 0 decisions, assumptions and platform findings
└── preview/               Phase 1: React + Vite + Tailwind design preview
    ├── README.md          Run instructions and the full screen list
    ├── src/
    │   ├── data/          mockData.js — the single source of fake data
    │   ├── i18n/          en.js + provider (mirrors res/values/strings.xml)
    │   ├── state/         player, settings, navigation and demo-state stores
    │   ├── components/    shared UI primitives
    │   ├── screens/       one file per screen
    │   └── lib/           formatting and colour helpers
    └── scripts/           render verification harness
```

The Android app (Kotlin, Jetpack Compose, Media3, Room, Hilt) is added in Phase 2 under `app/`, with Gradle Kotlin DSL and a version catalog.

## Run the preview

Requires Node 18 or newer.

```bash
cd preview
npm install
npm run dev
```

Then open the printed URL. The interface renders inside a phone-sized frame; on viewports narrower than 940 px it fills the screen instead.

```bash
npm run build           # production build into preview/dist
npm run verify:render   # renders every screen x device state and fails on error
```

## Known limitations

- **The preview is mock state only.** No backend, no real audio, no network calls, no real accounts. A one-second timer fakes playback progression so the seek bar, mini player and notification move together.
- **The Android app is not in this repository yet**, and it cannot be compiled in the current development sandbox: there is no JDK, no Gradle distribution and no Android SDK, and downloads from `dl.google.com`, `services.gradle.org` and Maven are blocked. Android phases will ship complete source plus exact local build steps, with every claim that could not be machine-verified recorded honestly rather than asserted.
- **Third-party service access carries legal and Terms-of-Service exposure.** The chosen posture, the per-service research and the risk assessment are documented in [`docs/DECISIONS.md`](docs/DECISIONS.md) and will be expanded into a per-provider report in Phase 5.

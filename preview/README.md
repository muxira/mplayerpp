# MPlayer++ — Design Preview (Phase 1)

A clickable preview of the entire MPlayer++ interface, built to approve the design before any Android work starts.

**Stack: React + Vite + Tailwind.** Justification: about sixteen surfaces share the mini player, tab bar, sheet system and theme, so components beat duplicated markup — and the component tree maps one-to-one onto the Compose screens built in Phase 2.

**This is mock state only.** There is no backend, no network access, no real audio and no real accounts. A one-second timer fakes playback progression so the seek bar, mini player and notification surfaces move together.

## Run it

Requires Node 18 or newer.

```bash
npm install
npm run dev              # start the preview
```

Open the printed URL (default `http://localhost:5173`).

```bash
npm run build            # production build into dist/
npm run preview          # serve the production build
npm run verify:render    # render every screen x device state, fail on any error
```

### Layout

On a viewport 940 px or wider, the phone frame floats in a workbench with a reviewer rail beside it. Below 940 px the rail disappears and the preview fills the screen, which is how it behaves at common mobile widths.

## Screens

| # | Screen | How to reach it | What to check |
| --- | --- | --- | --- |
| 1 | **Library** | Tab *Library* | "All" and "Favorites" hero cards, playlists, source strip, recently played, duplicates entry |
| 2 | **Playlist · All** | Library → *All* | Built-in playlist: locked banner, cannot be renamed or deleted, de-duplicated across sources |
| 3 | **Playlist · Favorites** | Library → *Favorites* | System collection, locked |
| 4 | **Playlist · custom** | Library → *Night Drive* | Play / shuffle, reorder mode, rename, delete confirmation |
| 5 | **Playlist · imported** | Library → *Liked music* | Origin link to YouTube Music, system-playlist badge, still deletable here |
| 6 | **Full player · Cover tab** | Mini player → tap | Large artwork, dynamic accent from cover, transport, seek bar, shuffle / repeat-one, sheets for queue, speed, sleep timer, volume boost |
| 7 | **Full player · Lyrics tab** | Player → *Lyrics* | Provider search state, synced line highlighting, "search again", "pick another result", cached badge, partial-transcript and unofficial-scrape notices, instrumental and no-lyrics states |
| 8 | **Mini player** | Persistent, above tabs | Title / artist, favorite, play-pause, next, hairline progress; tap expands the player |
| 9 | **Search** | Tab *Search* | Recent and suggested queries, results grouped per source, source filter chips, connect prompt for a disconnected service, offline banner |
| 10 | **Accounts** | Tab *Settings* → *Accounts* | Connected / disconnected states, per-service capability list, premium and unofficial badges, risk opt-in toggle, disconnect confirmation |
| 11 | **Player settings** | Tab *Settings* | Equalizer (presets + five band sliders), crossfade, gapless, playback speed, sleep timer, audio focus, default repeat / shuffle, statistics threshold, theme, language, cache |
| 12 | **Volume boost** | Settings, or player → speaker icon | 0–200 % slider, warning banner and confirmation dialog above 100 %, limiter note, unsupported-device state |
| 13 | **Statistics / Recap** | Tab *Recap* | Period selector (today, week, month, year, all time), totals, listening timeline chart, highlight cards, top artists, top tracks, top genres, plus an "Empty state" chip |
| 14 | **Import playlists** | Settings → *Import playlists*, or from Accounts | Three-step flow, system-playlist badge and explanation, select all, progress, success |
| 15 | **Create / Edit playlist** | Library → `+`, or a playlist → pencil | Name and description fields, origin note for imported playlists, track picker, validation, discard confirmation |
| 16 | **Notification & lock screen** | Settings → *Notification & lock screen* | Notification shade, lock screen and Android Auto mocks — **the scrubber is draggable and seeks the mock player**, which is exactly how the system-drawn control behaves |
| 17 | **Duplicates** | Library → info icon, or the duplicates card | What "All" collapsed and why |

## Interactions that work

Navigation and back stack · bottom tabs · opening playlists · reorder mode · play / pause / next / previous · shuffle toggle · repeat cycle (off → all → one) · dragging the seek bar and the notification scrubber · favorite toggling everywhere · download cycling (none → pending → downloaded) · theme switch (light / dark / system) · volume boost with the above-100 % confirmation · equalizer presets and per-band gain · every slider and toggle in settings · period selector in Recap · the three-step import flow · sheets and dialogs (Escape closes them) · source filter in Search · language sheet.

## Reviewer rail

The rail on wide viewports is a review aid, not part of the product:

- **Screen jumps** for every surface, including states that are otherwise hard to reach.
- **Theme** switch, bound to the same setting the app exposes.
- **Device state** simulator: `Normal`, `No permission`, `Offline`, `Empty library` — these drive the permission, offline and empty states that the real app reaches for actual reasons.

## Where the fake data lives

Everything invented is in **`src/data/mockData.js`** and nowhere else: covers, tracks (including a deliberately duplicated song and a deliberately corrupted file), playlists, sources and their capabilities, lyrics results, search results, statistics per period, import candidates, equalizer presets and default settings.

## Mapping to the Android app

| Preview | Android (Phase 2+) |
| --- | --- |
| `src/i18n/en.js` | `res/values/strings.xml` |
| `state/PlayerProvider.jsx` | Media3 `Player` observed through a `MediaController` |
| `state/SettingsProvider.jsx` | DataStore preferences |
| `state/NavProvider.jsx` | Compose `NavHost` back stack |
| `data/mockData.js` | Room entities and domain models |
| `components/` | Compose UI components |
| `screens/` | Compose screens with ViewModels |
| Workbench device-state simulator | Real permission, connectivity and empty-library states |

## Verification actually performed

- `npm run build` — 66 modules transformed, no errors.
- `npm run verify:render` — 64 screen × device-state combinations rendered to string, 0 failures. This catches undefined imports, bad destructuring and missing mock data that a bundler cannot see.
- Dev server confirmed to answer `200` both directly and with a proxied `Host` header.

**Not verified:** visual appearance in a real browser and gesture feel. That is what this phase is asking you to review.

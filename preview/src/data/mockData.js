/**
 * The one and only source of fake data for the preview.
 *
 * Nothing in here is real: tracks, artists, lyrics, statistics and accounts are
 * invented so the interface can be reviewed without a backend, a device or any
 * third-party credentials. On Android this file's shape is the contract that
 * the domain models (`Track`, `Playlist`, `Source`, `Lyrics`, `ListeningStats`)
 * are written against.
 */

/* ------------------------------------------------------------------ */
/* Cover art                                                           */
/* ------------------------------------------------------------------ */

/**
 * Covers are generated gradients rather than downloaded artwork.
 * `accent` is the colour the player screen derives from the cover, which is how
 * the "dynamic accent colour from cover art" requirement is demonstrated.
 */
export const covers = {
  c1: { id: 'c1', from: '#1f3a3d', via: '#2f6f6a', to: '#7fd1b9', accent: '#4fd8bd', glyph: '◐' },
  c2: { id: 'c2', from: '#2b1d3a', via: '#5b3a7a', to: '#c39ae0', accent: '#b58ce0', glyph: '◑' },
  c3: { id: 'c3', from: '#3a2418', via: '#8c4f2a', to: '#e8b273', accent: '#e0955a', glyph: '◒' },
  c4: { id: 'c4', from: '#14213d', via: '#2d4a8a', to: '#8fb3f0', accent: '#6d9bf0', glyph: '◓' },
  c5: { id: 'c5', from: '#33141f', via: '#8a2f4a', to: '#f09ab3', accent: '#ef7d9e', glyph: '◔' },
  c6: { id: 'c6', from: '#1b2b1a', via: '#3f6b3a', to: '#a8d69a', accent: '#8ac77c', glyph: '◕' },
  c7: { id: 'c7', from: '#2a2a2a', via: '#5a5a5a', to: '#bdbdbd', accent: '#a8a8a8', glyph: '●' },
  c8: { id: 'c8', from: '#0f2b2b', via: '#1c5e5e', to: '#63c7c7', accent: '#4bbcbc', glyph: '◖' },
  c9: { id: 'c9', from: '#2e1a2e', via: '#6b3a6b', to: '#d69ad6', accent: '#c77dc7', glyph: '◗' },
  c10: { id: 'c10', from: '#302410', via: '#7a5c1c', to: '#e6cf73', accent: '#d9bd4f', glyph: '◍' },
  c11: { id: 'c11', from: '#101f2e', via: '#1f4a7a', to: '#73b8e6', accent: '#4f9ed9', glyph: '◎' },
  c12: { id: 'c12', from: '#2e1010', via: '#7a1f1f', to: '#e67373', accent: '#d94f4f', glyph: '○' },
};

/* ------------------------------------------------------------------ */
/* Sources (providers)                                                 */
/* ------------------------------------------------------------------ */

/**
 * Each source declares capabilities. The UI adapts to them: a source that
 * cannot download never renders a download button, a source that cannot import
 * never appears in the import flow.
 */
export const sources = [
  {
    id: 'local',
    name: 'On this device',
    shortName: 'Device',
    kind: 'local',
    connected: true,
    accountLabel: null,
    capabilities: { canStream: true, canDownload: true, canImportPlaylists: false },
    requiresPremium: false,
    unofficial: false,
    permissionRequired: 'READ_MEDIA_AUDIO',
    note: 'Audio files scanned from device storage.',
  },
  {
    id: 'ytm',
    name: 'YouTube Music',
    shortName: 'YT Music',
    kind: 'service',
    connected: true,
    accountLabel: 'you@gmail.com',
    capabilities: { canStream: true, canDownload: true, canImportPlaylists: true },
    requiresPremium: true,
    unofficial: true,
    permissionRequired: null,
    note: 'No official public API. Uses your own account session.',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    shortName: 'Spotify',
    kind: 'service',
    connected: false,
    accountLabel: null,
    capabilities: { canStream: true, canDownload: false, canImportPlaylists: true },
    requiresPremium: true,
    unofficial: true,
    permissionRequired: null,
    note: 'Official API allows 30 s previews only. Downloads are DRM-protected.',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    shortName: 'SoundCloud',
    kind: 'service',
    connected: true,
    accountLabel: 'nightowl.fm',
    capabilities: { canStream: true, canDownload: true, canImportPlaylists: true },
    requiresPremium: false,
    unofficial: false,
    permissionRequired: null,
    note: 'Official API. Requires a self-service client ID.',
  },
];

export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));

/* ------------------------------------------------------------------ */
/* Tracks                                                              */
/* ------------------------------------------------------------------ */

/** Durations are in seconds. */
export const tracks = [
  {
    id: 't01',
    title: 'Nightfall on the Harbour',
    artist: 'Aurora Fields',
    album: 'Slow Water',
    durationSec: 214,
    sourceId: 'local',
    coverId: 'c1',
    genre: 'Ambient',
    year: 2023,
    plays: 41,
    quality: 'FLAC',
    explicit: false,
    dedupKey: 'nightfall on the harbour|aurora fields|214',
  },
  {
    id: 't02',
    title: 'Nightfall on the Harbour',
    artist: 'Aurora Fields',
    album: 'Slow Water',
    durationSec: 213,
    sourceId: 'spotify',
    coverId: 'c1',
    genre: 'Ambient',
    year: 2023,
    plays: 12,
    quality: '320 kbps',
    explicit: false,
    // Same song as t01 within the 2 second tolerance: "All" collapses these.
    dedupKey: 'nightfall on the harbour|aurora fields|214',
  },
  {
    id: 't03',
    title: 'Concrete Gardens',
    artist: 'Ilse Marlow',
    album: 'City Botanica',
    durationSec: 187,
    sourceId: 'ytm',
    coverId: 'c6',
    genre: 'Indie',
    year: 2024,
    plays: 88,
    quality: '256 kbps',
    explicit: false,
    dedupKey: 'concrete gardens|ilse marlow|187',
  },
  {
    id: 't04',
    title: 'Tape Hiss Lullaby',
    artist: 'Kite & Anchor',
    album: 'Demos, Vol. 2',
    durationSec: 243,
    sourceId: 'soundcloud',
    coverId: 'c3',
    genre: 'Lo-fi',
    year: 2022,
    plays: 19,
    quality: '128 kbps',
    explicit: false,
    dedupKey: 'tape hiss lullaby|kite & anchor|243',
  },
  {
    id: 't05',
    title: 'Meridian',
    artist: 'Sable Court',
    album: 'Meridian',
    durationSec: 301,
    sourceId: 'local',
    coverId: 'c4',
    genre: 'Electronic',
    year: 2021,
    plays: 63,
    quality: 'FLAC',
    explicit: false,
    dedupKey: 'meridian|sable court|301',
  },
  {
    id: 't06',
    title: 'Paper Lanterns',
    artist: 'Yuki Tanabe',
    album: 'Festival Season',
    durationSec: 176,
    sourceId: 'ytm',
    coverId: 'c10',
    genre: 'World',
    year: 2024,
    plays: 34,
    quality: '256 kbps',
    explicit: false,
    dedupKey: 'paper lanterns|yuki tanabe|176',
  },
  {
    id: 't07',
    title: 'Low Tide Letters',
    artist: 'Aurora Fields',
    album: 'Slow Water',
    durationSec: 258,
    sourceId: 'local',
    coverId: 'c8',
    genre: 'Ambient',
    year: 2023,
    plays: 27,
    quality: 'FLAC',
    explicit: false,
    dedupKey: 'low tide letters|aurora fields|258',
  },
  {
    id: 't08',
    title: 'Static Bloom',
    artist: 'Hollow Coast',
    album: 'Greenhouse Noise',
    durationSec: 198,
    sourceId: 'soundcloud',
    coverId: 'c12',
    genre: 'Rock',
    year: 2025,
    plays: 51,
    quality: '320 kbps',
    explicit: true,
    dedupKey: 'static bloom|hollow coast|198',
  },
  {
    id: 't09',
    title: 'Amber Rooms',
    artist: 'Ilse Marlow',
    album: 'City Botanica',
    durationSec: 221,
    sourceId: 'ytm',
    coverId: 'c3',
    genre: 'Indie',
    year: 2024,
    plays: 45,
    quality: '256 kbps',
    explicit: false,
    dedupKey: 'amber rooms|ilse marlow|221',
  },
  {
    id: 't10',
    title: 'Nightbus',
    artist: 'Vera Odell',
    album: 'After Hours Transit',
    durationSec: 265,
    sourceId: 'spotify',
    coverId: 'c11',
    genre: 'Electronic',
    year: 2022,
    plays: 76,
    quality: '320 kbps',
    explicit: false,
    dedupKey: 'nightbus|vera odell|265',
  },
  {
    id: 't11',
    title: 'Cassette Sky',
    artist: 'Kite & Anchor',
    album: 'Demos, Vol. 2',
    durationSec: 204,
    sourceId: 'local',
    coverId: 'c2',
    genre: 'Lo-fi',
    year: 2022,
    plays: 15,
    quality: 'MP3',
    explicit: false,
    dedupKey: 'cassette sky|kite & anchor|204',
  },
  {
    id: 't12',
    title: 'Glasshouse',
    artist: 'Sable Court',
    album: 'Meridian',
    durationSec: 232,
    sourceId: 'ytm',
    coverId: 'c9',
    genre: 'Electronic',
    year: 2021,
    plays: 58,
    quality: '256 kbps',
    explicit: false,
    dedupKey: 'glasshouse|sable court|232',
  },
  {
    id: 't13',
    title: 'Salt & Signal',
    artist: 'Hollow Coast',
    album: 'Greenhouse Noise',
    durationSec: 289,
    sourceId: 'soundcloud',
    coverId: 'c7',
    genre: 'Rock',
    year: 2025,
    plays: 22,
    quality: '320 kbps',
    explicit: false,
    dedupKey: 'salt & signal|hollow coast|289',
  },
  {
    id: 't14',
    title: 'Winterlight Piano',
    artist: 'Noa Bergström',
    album: 'Twelve Rooms',
    durationSec: 154,
    sourceId: 'local',
    coverId: 'c5',
    genre: 'Classical',
    year: 2020,
    plays: 93,
    quality: 'FLAC',
    explicit: false,
    dedupKey: 'winterlight piano|noa bergstrom|154',
  },
  {
    id: 't15',
    title: 'Harbour Lights (Reprise)',
    artist: 'Aurora Fields',
    album: 'Slow Water',
    durationSec: 129,
    sourceId: 'ytm',
    coverId: 'c1',
    genre: 'Ambient',
    year: 2023,
    plays: 8,
    quality: '256 kbps',
    explicit: false,
    dedupKey: 'harbour lights reprise|aurora fields|129',
  },
  {
    id: 't16',
    title: 'Neon Orchard',
    artist: 'Vera Odell',
    album: 'After Hours Transit',
    durationSec: 217,
    sourceId: 'ytm',
    coverId: 'c2',
    genre: 'Electronic',
    year: 2022,
    plays: 39,
    quality: '256 kbps',
    explicit: false,
    dedupKey: 'neon orchard|vera odell|217',
  },
  {
    id: 't17',
    title: 'Field Recording: Rain on Tin',
    artist: 'Noa Bergström',
    album: 'Twelve Rooms',
    durationSec: 342,
    sourceId: 'local',
    coverId: 'c7',
    genre: 'Ambient',
    year: 2020,
    plays: 4,
    quality: 'WAV',
    explicit: false,
    dedupKey: 'field recording rain on tin|noa bergstrom|342',
  },
  {
    id: 't18',
    title: 'Slow Parade',
    artist: 'Ilse Marlow',
    album: 'City Botanica',
    durationSec: 208,
    sourceId: 'soundcloud',
    coverId: 'c6',
    genre: 'Indie',
    year: 2024,
    plays: 31,
    quality: '320 kbps',
    explicit: false,
    dedupKey: 'slow parade|ilse marlow|208',
  },
  {
    id: 't19',
    title: 'Undertow',
    artist: 'Sable Court',
    album: 'Meridian',
    durationSec: 276,
    sourceId: 'local',
    coverId: 'c4',
    genre: 'Electronic',
    year: 2021,
    plays: 47,
    quality: 'FLAC',
    explicit: false,
    dedupKey: 'undertow|sable court|276',
  },
  {
    id: 't20',
    title: 'Kitchen Radio',
    artist: 'Kite & Anchor',
    album: 'Demos, Vol. 2',
    durationSec: 165,
    sourceId: 'ytm',
    coverId: 'c3',
    genre: 'Lo-fi',
    year: 2022,
    plays: 26,
    quality: '256 kbps',
    explicit: false,
    dedupKey: 'kitchen radio|kite & anchor|165',
  },
  // Corrupted file: no duration, no cover, no metadata. Exercises the
  // "missing metadata / corrupted file" edge case across the UI.
  {
    id: 't21',
    title: 'untitled_0x4f2a.m4a',
    artist: null,
    album: null,
    durationSec: 0,
    sourceId: 'local',
    coverId: null,
    genre: null,
    year: null,
    plays: 0,
    quality: 'Unknown',
    explicit: false,
    corrupted: true,
    dedupKey: 'untitled_0x4f2a||0',
  },
  {
    id: 't22',
    title: 'Lantern Room',
    artist: 'Yuki Tanabe',
    album: 'Festival Season',
    durationSec: 193,
    sourceId: 'local',
    coverId: 'c10',
    genre: 'World',
    year: 2024,
    plays: 18,
    quality: 'MP3',
    explicit: false,
    dedupKey: 'lantern room|yuki tanabe|193',
  },
  {
    id: 't23',
    title: 'Blue Hour Commute',
    artist: 'Vera Odell',
    album: 'After Hours Transit',
    durationSec: 244,
    sourceId: 'soundcloud',
    coverId: 'c11',
    genre: 'Electronic',
    year: 2022,
    plays: 35,
    quality: '320 kbps',
    explicit: false,
    dedupKey: 'blue hour commute|vera odell|244',
  },
  {
    id: 't24',
    title: 'Nine Lives of a Houseplant',
    artist: 'Hollow Coast',
    album: 'Greenhouse Noise',
    durationSec: 181,
    sourceId: 'ytm',
    coverId: 'c6',
    genre: 'Rock',
    year: 2025,
    plays: 29,
    quality: '256 kbps',
    explicit: false,
    dedupKey: 'nine lives of a houseplant|hollow coast|181',
  },
];

export const trackById = Object.fromEntries(tracks.map((t) => [t.id, t]));

/** Tracks that appear in more than one source, collapsed by `dedupKey`. */
export const duplicateGroups = (() => {
  const groups = new Map();
  for (const track of tracks) {
    if (!groups.has(track.dedupKey)) groups.set(track.dedupKey, []);
    groups.get(track.dedupKey).push(track);
  }
  return [...groups.values()].filter((group) => group.length > 1);
})();

/** The de-duplicated "All" collection. */
export const allTracks = (() => {
  const seen = new Set();
  const result = [];
  for (const track of tracks) {
    if (seen.has(track.dedupKey)) continue;
    seen.add(track.dedupKey);
    result.push(track);
  }
  return result;
})();

/* ------------------------------------------------------------------ */
/* Playlists                                                           */
/* ------------------------------------------------------------------ */

export const playlists = [
  {
    id: 'pl-all',
    name: 'All',
    kind: 'system',
    deletable: false,
    renamable: false,
    origin: null,
    coverIds: ['c1', 'c4', 'c6', 'c3'],
    trackIds: allTracks.map((t) => t.id),
  },
  {
    id: 'pl-favorites',
    name: 'Favorites',
    kind: 'system',
    deletable: false,
    renamable: false,
    origin: null,
    coverIds: ['c5', 'c2', 'c9', 'c8'],
    trackIds: ['t14', 't05', 't10', 't03', 't07', 't12'],
  },
  {
    id: 'pl-focus',
    name: 'Deep Focus',
    kind: 'custom',
    deletable: true,
    renamable: true,
    origin: null,
    description: 'Long tracks, no words.',
    coverIds: ['c1', 'c8', 'c7'],
    trackIds: ['t17', 't05', 't07', 't19', 't01'],
    createdAt: '2025-08-02',
  },
  {
    id: 'pl-nightdrive',
    name: 'Night Drive',
    kind: 'custom',
    deletable: true,
    renamable: true,
    origin: null,
    description: 'For the ring road after midnight.',
    coverIds: ['c11', 'c2', 'c4'],
    trackIds: ['t10', 't16', 't23', 't12', 't05', 't08'],
    createdAt: '2025-09-14',
  },
  {
    id: 'pl-imported-liked',
    name: 'Liked music',
    kind: 'imported',
    deletable: true,
    renamable: true,
    origin: { sourceId: 'ytm', sourceName: 'YouTube Music', systemPlaylist: true, sourceIdRemote: 'LM' },
    coverIds: ['c6', 'c3', 'c10'],
    trackIds: ['t03', 't09', 't06', 't16', 't20', 't24', 't15'],
    createdAt: '2025-10-01',
  },
  {
    id: 'pl-imported-morning',
    name: 'Morning Commute',
    kind: 'imported',
    deletable: true,
    renamable: true,
    origin: { sourceId: 'soundcloud', sourceName: 'SoundCloud', systemPlaylist: false },
    coverIds: ['c12', 'c7'],
    trackIds: ['t08', 't13', 't04'],
    createdAt: '2025-10-01',
  },
];

/* ------------------------------------------------------------------ */
/* Lyrics                                                              */
/* ------------------------------------------------------------------ */

/**
 * Several providers can return a result for the same track, so each entry is a
 * list ranked by confidence. That is what powers "pick another result".
 */
export const lyricsByTrack = {
  t03: [
    {
      id: 'l-t03-1',
      provider: 'LRCLIB',
      synced: true,
      confidence: 96,
      lines: [
        { atSec: 12, text: 'The city keeps its gardens under glass' },
        { atSec: 19, text: 'I water them with what the day left behind' },
        { atSec: 27, text: 'Concrete, be patient' },
        { atSec: 33, text: 'Something green is on your mind' },
        { atSec: 41, text: 'Roots in the cracks of the overpass' },
        { atSec: 48, text: 'Learning the language of the traffic lights' },
        { atSec: 56, text: 'Concrete gardens, growing slow' },
        { atSec: 64, text: 'Nobody planted you, but here you go' },
        { atSec: 78, text: 'The rain arrives on schedule, like a friend' },
        { atSec: 86, text: 'Who never asks how you have been' },
        { atSec: 94, text: 'Concrete, be patient' },
        { atSec: 101, text: 'Something green is on your mind' },
        { atSec: 118, text: 'And if they pave you over in the spring' },
        { atSec: 126, text: 'You will come up through anything' },
        { atSec: 140, text: 'Concrete gardens, growing slow' },
        { atSec: 148, text: 'Nobody planted you, but here you go' },
      ],
    },
    {
      id: 'l-t03-2',
      provider: 'Musixmatch',
      synced: false,
      confidence: 71,
      truncated: true,
      lines: [
        { text: 'The city keeps its gardens under glass' },
        { text: 'I water them with what the day left behind' },
        { text: 'Concrete, be patient' },
        { text: 'Something green is on your mind' },
        { text: '— Remaining lyrics require a licensed Musixmatch key —' },
      ],
    },
    {
      id: 'l-t03-3',
      provider: 'Genius',
      synced: false,
      confidence: 64,
      scraped: true,
      lines: [
        { text: '[Verse 1]' },
        { text: 'The city keeps its gardens under glass' },
        { text: 'I water them with what the day left behind' },
        { text: '[Chorus]' },
        { text: 'Concrete gardens, growing slow' },
        { text: 'Nobody planted you, but here you go' },
      ],
    },
  ],
  t10: [
    {
      id: 'l-t10-1',
      provider: 'LRCLIB',
      synced: true,
      confidence: 91,
      lines: [
        { atSec: 9, text: 'Last bus, empty seats, my reflection in the door' },
        { atSec: 17, text: 'Every streetlight counting down to something more' },
        { atSec: 26, text: 'I am not going home, I am going under' },
        { atSec: 34, text: 'Nightbus, take me somewhere I can wonder' },
        { atSec: 48, text: 'The driver knows my name but never says it' },
        { atSec: 56, text: 'The city hums a chord and I just play it' },
        { atSec: 71, text: 'Nightbus, nightbus, running out of road' },
        { atSec: 79, text: 'Carrying everybody home alone' },
      ],
    },
    {
      id: 'l-t10-2',
      provider: 'Genius',
      synced: false,
      confidence: 58,
      scraped: true,
      lines: [
        { text: '[Intro]' },
        { text: 'Last bus, empty seats' },
        { text: '[Verse 1]' },
        { text: 'Every streetlight counting down to something more' },
      ],
    },
  ],
  t14: [
    {
      id: 'l-t14-1',
      provider: 'LRCLIB',
      synced: false,
      confidence: 88,
      instrumental: false,
      lines: [
        { text: 'Winterlight, come through the window' },
        { text: 'Sit on the floor like a cat you know' },
        { text: 'Twelve rooms and I have seen them all' },
        { text: 'Only this one has the light on the wall' },
      ],
    },
  ],
  t05: [
    {
      id: 'l-t05-1',
      provider: 'LRCLIB',
      synced: true,
      confidence: 99,
      instrumental: true,
      lines: [],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export const recentSearches = ['Aurora Fields', 'lo-fi demos', 'Nightbus', 'ambient flac'];

export const suggestedQueries = ['Deep focus', 'New from Hollow Coast', 'World music 2024'];

/** Results returned for the demo query, grouped by the source that provided them. */
export const searchResults = {
  query: 'nightfall',
  groups: [
    {
      sourceId: 'local',
      items: [
        { trackId: 't01', relevance: 'On your device' },
        { trackId: 't15', relevance: 'On your device' },
      ],
    },
    {
      sourceId: 'ytm',
      items: [
        { trackId: 't03', relevance: 'YouTube Music' },
        { trackId: 't09', relevance: 'YouTube Music' },
        { trackId: 't24', relevance: 'YouTube Music' },
      ],
    },
    {
      sourceId: 'soundcloud',
      items: [
        { trackId: 't08', relevance: 'SoundCloud' },
        { trackId: 't13', relevance: 'SoundCloud' },
        { trackId: 't04', relevance: 'SoundCloud' },
      ],
    },
    {
      sourceId: 'spotify',
      items: [],
      unavailableReason: 'notConnected',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Statistics / Recap                                                  */
/* ------------------------------------------------------------------ */

export const recapPeriods = ['day', 'week', 'month', 'year', 'all'];

/**
 * One series per period. `buckets` drives the bar chart, `highlights` drive the
 * recap cards. Numbers are invented but internally consistent.
 */
export const statsByPeriod = {
  day: {
    totalMinutes: 84,
    trackCount: 17,
    artistCount: 6,
    buckets: [
      { label: '06', minutes: 0 },
      { label: '09', minutes: 12 },
      { label: '12', minutes: 24 },
      { label: '15', minutes: 8 },
      { label: '18', minutes: 27 },
      { label: '21', minutes: 13 },
    ],
    bucketUnit: 'hours',
    topArtists: [
      { name: 'Aurora Fields', minutes: 31, plays: 8, coverId: 'c1' },
      { name: 'Vera Odell', minutes: 22, plays: 5, coverId: 'c11' },
      { name: 'Noa Bergström', minutes: 15, plays: 3, coverId: 'c5' },
    ],
    topTracks: [
      { trackId: 't01', plays: 5, minutes: 18 },
      { trackId: 't10', plays: 4, minutes: 18 },
      { trackId: 't14', plays: 3, minutes: 8 },
    ],
    topGenres: [
      { genre: 'Ambient', minutes: 39, share: 0.46 },
      { genre: 'Electronic', minutes: 27, share: 0.32 },
      { genre: 'Classical', minutes: 12, share: 0.14 },
      { genre: 'Other', minutes: 6, share: 0.08 },
    ],
    highlights: [
      { id: 'h1', titleKey: 'recap.highlight.streak', value: 6 },
      { id: 'h2', title: 'Longest session', value: '41 min', caption: 'Evening, headphones' },
    ],
  },
  week: {
    totalMinutes: 612,
    trackCount: 94,
    artistCount: 18,
    buckets: [
      { label: 'Mon', minutes: 78 },
      { label: 'Tue', minutes: 112 },
      { label: 'Wed', minutes: 64 },
      { label: 'Thu', minutes: 131 },
      { label: 'Fri', minutes: 96 },
      { label: 'Sat', minutes: 47 },
      { label: 'Sun', minutes: 84 },
    ],
    bucketUnit: 'days',
    topArtists: [
      { name: 'Ilse Marlow', minutes: 143, plays: 38, coverId: 'c6' },
      { name: 'Aurora Fields', minutes: 121, plays: 29, coverId: 'c1' },
      { name: 'Sable Court', minutes: 98, plays: 21, coverId: 'c4' },
      { name: 'Vera Odell', minutes: 76, plays: 18, coverId: 'c11' },
    ],
    topTracks: [
      { trackId: 't03', plays: 14, minutes: 44 },
      { trackId: 't05', plays: 11, minutes: 55 },
      { trackId: 't09', plays: 9, minutes: 33 },
      { trackId: 't12', plays: 8, minutes: 31 },
    ],
    topGenres: [
      { genre: 'Indie', minutes: 186, share: 0.3 },
      { genre: 'Ambient', minutes: 159, share: 0.26 },
      { genre: 'Electronic', minutes: 141, share: 0.23 },
      { genre: 'Rock', minutes: 73, share: 0.12 },
      { genre: 'Other', minutes: 53, share: 0.09 },
    ],
    highlights: [
      { id: 'h1', title: 'Most played day', value: 'Thursday', caption: '131 minutes' },
      { id: 'h2', title: 'New discovery', value: 'Hollow Coast', caption: 'First played Tuesday' },
    ],
  },
  month: {
    totalMinutes: 2480,
    trackCount: 341,
    artistCount: 44,
    buckets: [
      { label: 'W1', minutes: 610 },
      { label: 'W2', minutes: 704 },
      { label: 'W3', minutes: 528 },
      { label: 'W4', minutes: 638 },
    ],
    bucketUnit: 'weeks',
    topArtists: [
      { name: 'Sable Court', minutes: 512, plays: 118, coverId: 'c4' },
      { name: 'Ilse Marlow', minutes: 468, plays: 104, coverId: 'c6' },
      { name: 'Aurora Fields', minutes: 431, plays: 96, coverId: 'c1' },
      { name: 'Kite & Anchor', minutes: 288, plays: 71, coverId: 'c3' },
      { name: 'Vera Odell', minutes: 244, plays: 58, coverId: 'c11' },
    ],
    topTracks: [
      { trackId: 't05', plays: 34, minutes: 170 },
      { trackId: 't19', plays: 29, minutes: 133 },
      { trackId: 't03', plays: 27, minutes: 84 },
      { trackId: 't14', plays: 24, minutes: 62 },
      { trackId: 't10', plays: 21, minutes: 93 },
    ],
    topGenres: [
      { genre: 'Electronic', minutes: 812, share: 0.33 },
      { genre: 'Indie', minutes: 604, share: 0.24 },
      { genre: 'Ambient', minutes: 521, share: 0.21 },
      { genre: 'Lo-fi', minutes: 268, share: 0.11 },
      { genre: 'Other', minutes: 275, share: 0.11 },
    ],
    highlights: [
      { id: 'h1', title: 'Total plays', value: '341', caption: 'Across 4 sources' },
      { id: 'h2', title: 'Favourite hour', value: '18:00', caption: 'You listen most after work' },
    ],
  },
  year: {
    totalMinutes: 28140,
    trackCount: 2188,
    artistCount: 173,
    buckets: [
      { label: 'Jan', minutes: 2100 },
      { label: 'Feb', minutes: 1980 },
      { label: 'Mar', minutes: 2410 },
      { label: 'Apr', minutes: 2260 },
      { label: 'May', minutes: 2540 },
      { label: 'Jun', minutes: 2180 },
      { label: 'Jul', minutes: 1890 },
      { label: 'Aug', minutes: 2320 },
      { label: 'Sep', minutes: 2610 },
      { label: 'Oct', minutes: 2480 },
      { label: 'Nov', minutes: 2140 },
      { label: 'Dec', minutes: 1230 },
    ],
    bucketUnit: 'months',
    topArtists: [
      { name: 'Aurora Fields', minutes: 4820, plays: 910, coverId: 'c1' },
      { name: 'Sable Court', minutes: 4310, plays: 802, coverId: 'c4' },
      { name: 'Ilse Marlow', minutes: 3990, plays: 771, coverId: 'c6' },
      { name: 'Noa Bergström', minutes: 2870, plays: 604, coverId: 'c5' },
      { name: 'Vera Odell', minutes: 2410, plays: 488, coverId: 'c11' },
    ],
    topTracks: [
      { trackId: 't14', plays: 214, minutes: 550 },
      { trackId: 't01', plays: 188, minutes: 670 },
      { trackId: 't05', plays: 161, minutes: 805 },
      { trackId: 't03', plays: 142, minutes: 443 },
      { trackId: 't10', plays: 129, minutes: 570 },
    ],
    topGenres: [
      { genre: 'Ambient', minutes: 8940, share: 0.32 },
      { genre: 'Electronic', minutes: 7320, share: 0.26 },
      { genre: 'Indie', minutes: 5610, share: 0.2 },
      { genre: 'Classical', minutes: 3120, share: 0.11 },
      { genre: 'Other', minutes: 3150, share: 0.11 },
    ],
    highlights: [
      { id: 'h1', title: 'Hours listened', value: '469', caption: 'About 19 full days' },
      { id: 'h2', title: 'Artist of the year', value: 'Aurora Fields', caption: '80 hours' },
    ],
  },
  all: {
    totalMinutes: 96420,
    trackCount: 6812,
    artistCount: 402,
    buckets: [
      { label: '2021', minutes: 12400 },
      { label: '2022', minutes: 21800 },
      { label: '2023', minutes: 19600 },
      { label: '2024', minutes: 23100 },
      { label: '2025', minutes: 19520 },
    ],
    bucketUnit: 'years',
    topArtists: [
      { name: 'Sable Court', minutes: 14200, plays: 2410, coverId: 'c4' },
      { name: 'Aurora Fields', minutes: 13180, plays: 2260, coverId: 'c1' },
      { name: 'Ilse Marlow', minutes: 11240, plays: 1980, coverId: 'c6' },
      { name: 'Kite & Anchor', minutes: 8920, plays: 1610, coverId: 'c3' },
      { name: 'Noa Bergström', minutes: 7640, plays: 1420, coverId: 'c5' },
    ],
    topTracks: [
      { trackId: 't05', plays: 612, minutes: 3060 },
      { trackId: 't14', plays: 540, minutes: 1386 },
      { trackId: 't01', plays: 488, minutes: 1737 },
      { trackId: 't12', plays: 431, minutes: 1668 },
      { trackId: 't03', plays: 398, minutes: 1242 },
    ],
    topGenres: [
      { genre: 'Electronic', minutes: 28400, share: 0.29 },
      { genre: 'Ambient', minutes: 25100, share: 0.26 },
      { genre: 'Indie', minutes: 18600, share: 0.19 },
      { genre: 'Lo-fi', minutes: 12400, share: 0.13 },
      { genre: 'Other', minutes: 11920, share: 0.13 },
    ],
    highlights: [
      { id: 'h1', title: 'Years with MPlayer', value: '5', caption: 'Since March 2021' },
      { id: 'h2', title: 'Tracks in library', value: '6 812', caption: 'Across 4 sources' },
    ],
  },
};

/**
 * A period with no data, to prove the empty state renders. Reachable from the
 * Recap screen by tapping the "empty period" demo chip.
 */
export const emptyStats = {
  totalMinutes: 0,
  trackCount: 0,
  artistCount: 0,
  buckets: [],
  bucketUnit: 'days',
  topArtists: [],
  topTracks: [],
  topGenres: [],
  highlights: [],
};

/* ------------------------------------------------------------------ */
/* Import candidates                                                   */
/* ------------------------------------------------------------------ */

export const importCandidates = [
  {
    id: 'imp-1',
    sourceId: 'ytm',
    name: 'Liked music',
    system: true,
    trackCount: 412,
    minutes: 1584,
    coverIds: ['c6', 'c3', 'c10', 'c1'],
    imported: true,
  },
  {
    id: 'imp-2',
    sourceId: 'ytm',
    name: 'Supermix: Ambient hours',
    system: true,
    trackCount: 60,
    minutes: 268,
    coverIds: ['c1', 'c8', 'c7'],
    imported: false,
  },
  {
    id: 'imp-3',
    sourceId: 'ytm',
    name: 'Studio evenings',
    system: false,
    trackCount: 34,
    minutes: 121,
    coverIds: ['c4', 'c2'],
    imported: false,
  },
  {
    id: 'imp-4',
    sourceId: 'soundcloud',
    name: 'Likes',
    system: true,
    trackCount: 188,
    minutes: 640,
    coverIds: ['c12', 'c7', 'c6'],
    imported: false,
  },
  {
    id: 'imp-5',
    sourceId: 'soundcloud',
    name: 'Morning Commute',
    system: false,
    trackCount: 22,
    minutes: 74,
    coverIds: ['c11', 'c3'],
    imported: true,
  },
  {
    id: 'imp-6',
    sourceId: 'spotify',
    name: 'Liked Songs',
    system: true,
    trackCount: 903,
    minutes: 3210,
    coverIds: ['c9', 'c5'],
    imported: false,
    blockedReason: 'notConnected',
  },
];

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export const equalizerBands = [
  { freq: '60 Hz', key: 60 },
  { freq: '230 Hz', key: 230 },
  { freq: '910 Hz', key: 910 },
  { freq: '3.6 kHz', key: 3600 },
  { freq: '14 kHz', key: 14000 },
];

export const equalizerPresets = [
  { id: 'flat', name: 'Flat', gains: [0, 0, 0, 0, 0] },
  { id: 'warm', name: 'Warm', gains: [4, 2, 0, -1, -2] },
  { id: 'bright', name: 'Bright', gains: [-2, 0, 2, 4, 5] },
  { id: 'bass', name: 'Bass boost', gains: [7, 4, 0, 0, 0] },
  { id: 'vocal', name: 'Vocal', gains: [-3, 0, 4, 3, -1] },
  { id: 'late', name: 'Late night', gains: [2, 1, 0, 1, 2] },
];

export const playbackSpeeds = [0.75, 1, 1.25, 1.5, 1.75, 2];

export const sleepTimerOptions = [0, 5, 15, 30, 45, 60, -1];

export const audioFocusOptions = ['pause', 'duck', 'ignore'];

export const defaultSettings = {
  theme: 'system',
  language: 'en',
  equalizerPreset: 'flat',
  equalizerGains: [0, 0, 0, 0, 0],
  crossfadeSec: 0,
  gapless: true,
  playbackSpeed: 1,
  sleepTimerMin: 0,
  audioFocus: 'duck',
  defaultRepeat: 'off',
  defaultShuffle: false,
  statsThresholdSec: 30,
  statsThresholdPercent: 50,
  statsThresholdRule: 'either',
  cacheSizeMb: 512,
  volumeBoost: 100,
  unofficialAccess: { ytm: true, spotify: false, soundcloud: false },
};

/* ------------------------------------------------------------------ */
/* Queue used when the preview starts                                  */
/* ------------------------------------------------------------------ */

export const initialQueueIds = ['t03', 't10', 't05', 't14', 't01', 't09', 't12', 't08'];

export const initialFavoriteIds = ['t14', 't05', 't10', 't03', 't07', 't12'];

export const initialDownloadedIds = ['t01', 't05', 't14', 't07'];

export const demoDevice = {
  model: 'MPlayer++ Preview',
  time: '21:04',
  battery: 82,
  wifi: true,
};

/**
 * English string resources for the preview.
 *
 * Every piece of user-facing text in the preview lives here. This file is the
 * one-to-one blueprint for `res/values/strings.xml` in the Android app: the
 * keys below map directly onto string resource names, so nothing user-facing
 * is ever hardcoded in a component.
 *
 * Adding a locale means adding a sibling dictionary with the same keys.
 */
const en = {
  'app.name': 'MPlayer++',
  'app.tagline': 'All your music, one calm place.',

  // Generic actions
  'action.back': 'Back',
  'action.close': 'Close',
  'action.cancel': 'Cancel',
  'action.save': 'Save',
  'action.delete': 'Delete',
  'action.rename': 'Rename',
  'action.done': 'Done',
  'action.retry': 'Try again',
  'action.seeAll': 'See all',
  'action.connect': 'Connect',
  'action.disconnect': 'Disconnect',
  'action.import': 'Import',
  'action.download': 'Download',
  'action.downloading': 'Downloading',
  'action.downloaded': 'Downloaded',
  'action.play': 'Play',
  'action.pause': 'Pause',
  'action.shuffle': 'Shuffle',
  'action.shuffleOn': 'Shuffle on',
  'action.shuffleOff': 'Shuffle off',
  'action.search': 'Search',
  'action.edit': 'Edit',
  'action.openInApp': 'Open in {app}',
  'action.learnMore': 'Learn more',
  'action.dismiss': 'Dismiss',

  // Navigation
  'nav.primary': 'Primary navigation',
  'nav.library': 'Library',
  'nav.search': 'Search',
  'nav.recap': 'Recap',
  'nav.settings': 'Settings',

  // Library
  'library.title': 'Library',
  'library.greeting': 'Good evening',
  'library.playlists': 'Playlists',
  'library.sources': 'Sources',
  'library.recentlyPlayed': 'Recently played',
  'library.newPlaylist': 'New playlist',
  'library.all.title': 'All',
  'library.all.subtitle': '{count} tracks · every source',
  'library.favorites.title': 'Favorites',
  'library.favorites.subtitle': '{count} tracks',
  'library.importedBanner': 'Imported from {service}',
  'library.duplicates.title': 'Possible duplicates',
  'library.duplicates.body': '{count} tracks appear in more than one source. "All" shows each song once.',
  'library.permission.title': 'Allow access to your music',
  'library.permission.body':
    'MPlayer++ needs permission to read audio files on this device. Nothing leaves your phone.',
  'library.permission.grant': 'Allow access',
  'library.empty.title': 'Nothing here yet',
  'library.empty.body': 'Add files to your device or connect a service to fill your library.',

  // Playlist
  'playlist.by': 'by {name}',
  'playlist.tracks': '{count} tracks',
  'playlist.duration': '{minutes} min',
  'playlist.play': 'Play',
  'playlist.shuffle': 'Shuffle',
  'playlist.edit': 'Edit playlist',
  'playlist.delete': 'Delete playlist',
  'playlist.deleteConfirmTitle': 'Delete "{name}"?',
  'playlist.deleteConfirmBody': 'The playlist is removed from MPlayer++. Your tracks stay untouched.',
  'playlist.addTracks': 'Add tracks',
  'playlist.reorder': 'Reorder',
  'playlist.reorderHint': 'Drag the handle to change the order.',
  'playlist.locked.title': 'Built-in playlist',
  'playlist.locked.body': '"All" is generated from every connected source. It cannot be renamed or deleted.',
  'playlist.create.title': 'New playlist',
  'playlist.edit.title': 'Edit playlist',
  'playlist.nameLabel': 'Name',
  'playlist.namePlaceholder': 'Late night drives',
  'playlist.descriptionLabel': 'Description',
  'playlist.descriptionPlaceholder': 'Optional',
  'playlist.empty.title': 'This playlist is empty',
  'playlist.empty.body': 'Tap "Add tracks" to put something in it.',

  // Player
  'player.coverTab': 'Cover',
  'player.lyricsTab': 'Lyrics',
  'player.queue': 'Queue',
  'player.addToFavorites': 'Add to favorites',
  'player.removeFromFavorites': 'Remove from favorites',
  'player.addToPlaylist': 'Add to playlist',
  'player.repeat': 'Repeat',
  'player.repeatOff': 'Repeat off',
  'player.repeatAll': 'Repeat playlist',
  'player.repeatOne': 'Repeat this track',
  'player.next': 'Next',
  'player.previous': 'Previous',
  'player.playPause': 'Play or pause',
  'player.seek': 'Seek',
  'player.fromSource': 'From {source}',
  'player.speed': 'Speed',
  'player.sleep': 'Sleep timer',
  'player.volumeBoost': 'Volume boost',
  'player.more': 'More options',

  // Lyrics
  'lyrics.title': 'Lyrics',
  'lyrics.loading': 'Searching lyrics providers…',
  'lyrics.loadingBody': 'Checking LRCLIB, Musixmatch and Genius for this track.',
  'lyrics.none.title': 'No lyrics found',
  'lyrics.none.body': 'None of the providers matched "{title}" by {artist}.',
  'lyrics.searchAgain': 'Search again',
  'lyrics.pickAnother': 'Pick another result',
  'lyrics.synced': 'Synced',
  'lyrics.unsynced': 'Plain text',
  'lyrics.source': 'Source: {provider}',
  'lyrics.confidence': '{percent}% match',
  'lyrics.cached': 'Cached offline',
  'lyrics.legalNote':
    'Lyrics are provided by third parties. Unofficial scraping is off by default and may violate provider terms.',

  // Search
  'search.placeholder': 'Songs, artists, albums',
  'search.title': 'Search',
  'search.recent': 'Recent searches',
  'search.suggested': 'Suggested',
  'search.resultsFor': 'Results for "{query}"',
  'search.noResults.title': 'No results',
  'search.noResults.body': 'Try a different spelling, or connect another service.',
  'search.offline.title': 'You are offline',
  'search.offline.body': 'Showing results from your device library and cache only.',
  'search.scope.all': 'All sources',
  'search.filter': 'Filter by source',
  'search.notAvailable': 'Streaming unavailable',

  // Accounts
  'accounts.title': 'Accounts',
  'accounts.subtitle': 'Connect the services you already pay for.',
  'accounts.connected': 'Connected',
  'accounts.notConnected': 'Not connected',
  'accounts.connectedAs': 'Connected as {email}',
  'accounts.capabilities': 'What MPlayer++ can do here',
  'accounts.canStream': 'Stream tracks',
  'accounts.canDownload': 'Download for offline',
  'accounts.canImport': 'Import playlists',
  'accounts.cannotStream': 'No streaming',
  'accounts.cannotDownload': 'No downloads',
  'accounts.cannotImport': 'No playlist import',
  'accounts.requiresPremium': 'Requires a premium subscription',
  'accounts.risk.title': 'Unofficial access',
  'accounts.risk.body':
    'This provider uses methods that are not part of the official public API. It can stop working at any time and may violate the service terms. Enable only if you accept that.',
  'accounts.risk.toggle': 'I understand the risk',
  'accounts.disconnectConfirmTitle': 'Disconnect {service}?',
  'accounts.disconnectConfirmBody': 'Imported playlists stay on your device. Streaming stops immediately.',

  // Settings
  'settings.title': 'Settings',
  'settings.playback': 'Playback',
  'settings.accounts': 'Accounts',
  'settings.equalizer': 'Equalizer',
  'settings.equalizer.presets': 'Presets',
  'settings.equalizer.custom': 'Custom',
  'settings.equalizer.reset': 'Reset to flat',
  'settings.crossfade': 'Crossfade',
  'settings.crossfade.seconds': '{count} s',
  'settings.gapless': 'Gapless playback',
  'settings.gapless.hint': 'Remove the silence between tracks of the same album.',
  'settings.speed': 'Playback speed',
  'settings.sleepTimer': 'Sleep timer',
  'settings.sleepTimer.off': 'Off',
  'settings.sleepTimer.minutes': '{count} min',
  'settings.sleepTimer.endOfTrack': 'End of current track',
  'settings.sleepTimer.remaining': '{count} min left',
  'settings.audioFocus': 'Audio focus',
  'settings.audioFocus.hint': 'What happens when another app needs the audio.',
  'settings.audioFocus.pause': 'Pause playback',
  'settings.audioFocus.duck': 'Lower volume briefly',
  'settings.audioFocus.ignore': 'Keep playing',
  'settings.defaults': 'Defaults',
  'settings.defaultRepeat': 'Start with repeat',
  'settings.defaultShuffle': 'Start with shuffle',
  'settings.statsThreshold': 'Statistics threshold',
  'settings.statsThreshold.hint': 'How long a track must play before it counts as a listen.',
  'settings.statsThreshold.seconds': '{count} seconds',
  'settings.statsThreshold.percent': '{count}% of the track',
  'settings.statsThreshold.rule': 'Count when either limit is reached',
  'settings.appearance': 'Appearance',
  'settings.theme': 'Theme',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.theme.system': 'System',
  'settings.language': 'Language',
  'settings.language.en': 'English',
  'settings.language.more': 'More languages can be added as resource files.',
  'settings.cache': 'Cache',
  'settings.cache.size': '{mb} MB',
  'settings.cache.used': '{mb} MB used',
  'settings.cache.clear': 'Clear cache',
  'settings.volumeBoost': 'Volume boost',
  'settings.about': 'About',
  'settings.surfaces': 'Notification & lock screen',

  // Volume boost
  'boost.title': 'Volume boost',
  'boost.value': '{percent}%',
  'boost.normal': 'Normal',
  'boost.hint': 'Boosts quiet recordings above system volume using the loudness enhancer.',
  'boost.warning.title': 'Above 100%',
  'boost.warning.body':
    'Boosting past 100% amplifies the signal beyond what the recording intended. Expect distortion, and it can damage your hearing and your speakers.',
  'boost.warning.confirm': 'Keep {percent}%',
  'boost.deviceUnsupported': 'This device has no loudness enhancer. Boost is limited to 100%.',
  'boost.limiter': 'Clipping protection active',

  // Statistics / Recap
  'recap.title': 'Recap',
  'recap.subtitle': 'Your listening, measured.',
  'recap.period.day': 'Today',
  'recap.period.week': 'This week',
  'recap.period.month': 'This month',
  'recap.period.year': 'This year',
  'recap.period.all': 'All time',
  'recap.totalMinutes': '{minutes} minutes',
  'recap.listened': 'Listened',
  'recap.tracks': '{count} tracks',
  'recap.artists': '{count} artists',
  'recap.topArtists': 'Top artists',
  'recap.topTracks': 'Top tracks',
  'recap.topGenres': 'Top genres',
  'recap.timeline': 'Listening over time',
  'recap.plays': '{count} plays',
  'recap.minutesShort': '{minutes} min',
  'recap.empty.title': 'No listening yet in this period',
  'recap.empty.body': 'Play a track for at least {threshold} and it will show up here.',
  'recap.highlight.streak': '{count}-day streak',
  'recap.share': 'Share recap',

  // Import
  'import.title': 'Import playlists',
  'import.subtitle': 'Bring playlists from your services into MPlayer++.',
  'import.step.pick': 'Pick a service',
  'import.step.choose': 'Choose playlists',
  'import.step.done': 'Done',
  'import.selectAll': 'Select all',
  'import.selected': '{count} selected',
  'import.systemBadge': 'System playlist',
  'import.systemNote':
    'System playlists cannot be deleted inside {service}. Imported copies become ordinary playlists here, and keep a link to their origin.',
  'import.tracksCount': '{count} tracks · {minutes} min',
  'import.start': 'Import {count} playlists',
  'import.progress': 'Importing {name}…',
  'import.success': 'Imported {count} playlists',
  'import.alreadyImported': 'Already imported',
  'import.empty.title': 'Nothing to import',
  'import.empty.body': 'Connect a service first, or every playlist is already imported.',

  // Notification / lock screen surfaces
  'surface.title': 'Notification & lock screen',
  'surface.subtitle': 'How MPlayer++ appears outside the app.',
  'surface.shade': 'Notification shade',
  'surface.lock': 'Lock screen',
  'surface.auto': 'Android Auto',
  'surface.note':
    'Media controls are drawn by the system from the media session. The scrubber is draggable because seeking is published in the playback state.',
  'surface.favoriteAdded': 'Added to favorites',
  'surface.notifications': 'Notifications',

  // Shared vocabulary
  'common.unknownArtist': 'Unknown artist',
  'common.minutes': 'minutes',
  'common.unofficial': 'unofficial',
  'common.premium': 'premium',
  'common.systemPlaylist': 'system playlist',
  'common.moveUp': 'Move up',
  'common.moveDown': 'Move down',
  'common.outputDevice': 'Phone',
  'common.copies': '{count} copies',

  // Track states
  'track.unreadable': 'Unreadable file · no metadata',

  // Library, continued
  'library.offline.body': 'Streaming sources are paused. Downloaded tracks still play.',

  // Playlist, continued
  'playlist.deleted.title': 'Playlist deleted',
  'playlist.deleted.body': '"{name}" was removed from MPlayer++. Your tracks are untouched.',
  'playlist.dedupNote': 'De-duplicated across every connected source',
  'playlist.createdOn': 'Created {date}',
  'playlist.discardCreateTitle': 'Discard new playlist?',
  'playlist.discardEditTitle': 'Discard changes?',
  'playlist.discardBody': 'Nothing will be saved.',
  'playlist.nameRequired': 'A playlist needs a name before it can be saved.',
  'playlist.originNote':
    'Imported from {service}{systemSuffix}. Renaming or deleting this copy does not change anything in the original service.',

  // Duplicates
  'duplicates.none.title': 'No duplicates',
  'duplicates.none.body': 'Every track in your library has a unique identity.',
  'duplicates.note':
    'The highest quality copy is played; the others stay in the database so per-source statistics remain accurate.',

  // Lyrics, continued
  'lyrics.instrumental.title': 'Instrumental track',
  'lyrics.instrumental.body': 'The providers agree this track has no vocals, so there is nothing to show.',
  'lyrics.truncatedNote':
    'Musixmatch returns a partial transcript on the free tier. Add a licensed API key in local.properties for the full text.',
  'lyrics.scrapedNote':
    'This result came from an unofficial page scrape. It is disabled by default and may violate the terms of service of the provider.',

  // Search, continued
  'search.tip':
    'Tip: type anything and submit. The mock returns a fixed result set grouped by source so the capability behaviour can be reviewed.',

  // Accounts, continued
  'accounts.playlistsAvailable': '{count} playlists available',
  'accounts.minutesAgo': '{count} minutes ago',
  'accounts.syncedAgo': 'Library synced {time} · {size} in {count} playlists',
  'accounts.credentialsNote':
    'Credentials are never stored in source code. Each provider reads its client ID and secret from local.properties and exposes them through BuildConfig.',

  // Import, continued
  'import.progressBody': 'Reading the remote playlist and resolving every track against the local catalogue…',
  'import.doneBody': 'Imported playlists are ordinary playlists now: rename them, reorder them, delete them.',

  // Recap, continued
  'recap.emptyDemo': 'Empty state',
  'recap.thresholdNote': 'A listen counts at {threshold}. Adjustable in Settings.',

  // Settings, continued
  'settings.about.build': 'preview build {version} · mock data only',

  // Notification / lock screen surfaces, continued
  'surface.date.short': 'Tue, 11 Nov',
  'surface.date.long': 'Tuesday, 11 November',
  'surface.clock': '21:04',
  'surface.locked': 'Locked',
  'surface.auto.title': 'Android Auto · now playing',
  'surface.auto.note': 'Auto only exposes the standard transport actions; custom actions are not shown here.',
  'surface.scrubberNote':
    'Try dragging the scrubber. It seeks the mock player, exactly like the real system control does when the playback state publishes a seek action.',
  'surface.other.title': 'System',
  'surface.other.body': '2 new notifications.',
  'surface.download.body': '3 tracks downloaded for offline playback.',
  'surface.ago': '{time} ago',

  // Common states
  'state.loading': 'Loading…',
  'state.error.title': 'Something went wrong',
  'state.error.body': 'Check your connection and try again.',
  'state.offline': 'Offline',
};

export default en;

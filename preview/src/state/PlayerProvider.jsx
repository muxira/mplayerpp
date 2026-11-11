import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  initialDownloadedIds,
  initialFavoriteIds,
  initialQueueIds,
  trackById,
} from '../data/mockData.js';
import { clamp } from '../lib/format.js';

const PlayerContext = createContext(null);

const initialState = {
  queue: initialQueueIds,
  index: 0,
  isPlaying: true,
  positionSec: 47,
  shuffle: false,
  repeatMode: 'off', // 'off' | 'all' | 'one'
  favorites: initialFavoriteIds,
  // Download state is a map of track id -> 'pending' | 'done'.
  downloaded: Object.fromEntries(initialDownloadedIds.map((id) => [id, 'done'])),
  sleepTimerRemainingMin: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'playQueue': {
      const { queue, index, isPlaying } = action;
      return { ...state, queue, index: clamp(index, 0, queue.length - 1), isPlaying, positionSec: 0 };
    }
    case 'togglePlay':
      return { ...state, isPlaying: !state.isPlaying };
    case 'setPlaying':
      return { ...state, isPlaying: action.isPlaying };
    case 'next': {
      if (state.queue.length === 0) return state;
      if (state.shuffle) {
        const others = state.queue.map((_, i) => i).filter((i) => i !== state.index);
        const pick = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : state.index;
        return { ...state, index: pick, positionSec: 0, isPlaying: true };
      }
      const nextIndex = state.index + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeatMode === 'all') return { ...state, index: 0, positionSec: 0, isPlaying: true };
        return { ...state, positionSec: 0, isPlaying: false };
      }
      return { ...state, index: nextIndex, positionSec: 0, isPlaying: true };
    }
    case 'previous': {
      if (state.queue.length === 0) return state;
      // Restart the track if it is more than a few seconds in, like most players.
      if (state.positionSec > 4) return { ...state, positionSec: 0 };
      const prevIndex = state.index - 1;
      if (prevIndex < 0) {
        if (state.repeatMode === 'all') {
          return { ...state, index: state.queue.length - 1, positionSec: 0, isPlaying: true };
        }
        return { ...state, positionSec: 0 };
      }
      return { ...state, index: prevIndex, positionSec: 0, isPlaying: true };
    }
    case 'seek':
      return { ...state, positionSec: clamp(action.positionSec, 0, action.durationSec || Infinity) };
    case 'tick': {
      if (!state.isPlaying) return state;
      const track = trackById[state.queue[state.index]];
      const duration = track?.durationSec || 0;
      const nextPosition = state.positionSec + 1;
      if (duration > 0 && nextPosition >= duration) {
        if (state.repeatMode === 'one') return { ...state, positionSec: 0 };
        return reducer(state, { type: 'next' });
      }
      return { ...state, positionSec: nextPosition };
    }
    case 'toggleShuffle':
      return { ...state, shuffle: !state.shuffle };
    case 'cycleRepeat': {
      const order = ['off', 'all', 'one'];
      const nextMode = order[(order.indexOf(state.repeatMode) + 1) % order.length];
      return { ...state, repeatMode: nextMode };
    }
    case 'toggleFavorite': {
      const has = state.favorites.includes(action.trackId);
      return {
        ...state,
        favorites: has ? state.favorites.filter((id) => id !== action.trackId) : [...state.favorites, action.trackId],
      };
    }
    case 'cycleDownload': {
      const { trackId } = action;
      const status = state.downloaded[trackId] || 'none';
      const next = status === 'none' ? 'pending' : status === 'pending' ? 'done' : 'none';
      const downloaded = { ...state.downloaded };
      if (next === 'none') delete downloaded[trackId];
      else downloaded[trackId] = next;
      return { ...state, downloaded };
    }
    case 'resolveDownloads': {
      const downloaded = { ...state.downloaded };
      for (const [id, status] of Object.entries(downloaded)) {
        if (status === 'pending') downloaded[id] = 'done';
      }
      return { ...state, downloaded };
    }
    case 'setSleepTimer':
      return { ...state, sleepTimerRemainingMin: action.minutes };
    default:
      return state;
  }
}

/**
 * Mock playback state. On Android this maps to the Media3 `Player` observed
 * through a `MediaController`; here a one-second timer fakes progression so the
 * seek bar, mini player and notification all move together.
 */
export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pretend queued downloads finish after a short delay.
  useEffect(() => {
    const pending = Object.values(state.downloaded).some((status) => status === 'pending');
    if (!pending) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'resolveDownloads' }), 2200);
    return () => clearTimeout(timer);
  }, [state.downloaded]);

  const currentTrack = trackById[state.queue[state.index]] ?? null;

  const playTrack = useCallback((trackId, queue) => {
    const nextQueue = queue && queue.length > 0 ? queue : [trackId];
    const index = Math.max(0, nextQueue.indexOf(trackId));
    dispatch({ type: 'playQueue', queue: nextQueue, index, isPlaying: true });
  }, []);

  const playQueue = useCallback((queue, index = 0, isPlaying = true) => {
    if (queue.length === 0) return;
    dispatch({ type: 'playQueue', queue, index, isPlaying });
  }, []);

  const seekFraction = useCallback(
    (fraction) => {
      const duration = currentTrack?.durationSec || 0;
      dispatch({ type: 'seek', positionSec: fraction * duration, durationSec: duration });
    },
    [currentTrack],
  );

  const isFavorite = useCallback((trackId) => state.favorites.includes(trackId), [state.favorites]);

  const downloadStatus = useCallback((trackId) => state.downloaded[trackId] || 'none', [state.downloaded]);

  const value = useMemo(
    () => ({
      ...state,
      currentTrack,
      durationSec: currentTrack?.durationSec ?? 0,
      progress: currentTrack?.durationSec ? state.positionSec / currentTrack.durationSec : 0,
      playTrack,
      playQueue,
      togglePlay: () => dispatch({ type: 'togglePlay' }),
      next: () => dispatch({ type: 'next' }),
      previous: () => dispatch({ type: 'previous' }),
      seekFraction,
      toggleShuffle: () => dispatch({ type: 'toggleShuffle' }),
      cycleRepeat: () => dispatch({ type: 'cycleRepeat' }),
      toggleFavorite: (trackId) => dispatch({ type: 'toggleFavorite', trackId }),
      cycleDownload: (trackId) => dispatch({ type: 'cycleDownload', trackId }),
      setSleepTimer: (minutes) => dispatch({ type: 'setSleepTimer', minutes }),
      isFavorite,
      downloadStatus,
    }),
    [state, currentTrack, playTrack, playQueue, seekFraction, isFavorite, downloadStatus],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}

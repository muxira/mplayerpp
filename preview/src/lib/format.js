/** Small formatting helpers shared by the preview screens. */

/** 214 -> "3:34", 3724 -> "1:02:04". */
export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Sum of track durations in seconds. */
export function totalDuration(tracks) {
  return tracks.reduce((sum, track) => sum + (track.durationSec || 0), 0);
}

/** 3724 -> "1:02:04" style totals are handled by formatDuration; this is for
 *  minute counts: 1584 -> "26 h 24 min". */
export function formatLongMinutes(minutes) {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function formatCount(count) {
  return new Intl.NumberFormat('en-US').format(count);
}

/** Clamp a number into an inclusive range. */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

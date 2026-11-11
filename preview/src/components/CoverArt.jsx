import { covers } from '../data/mockData.js';
import { Icon } from './Icons.jsx';

const fallback = { from: '#2a2f33', via: '#3c4348', to: '#5c666c', accent: '#8a949a', glyph: '♪' };

export function coverOf(coverId) {
  return covers[coverId] ?? fallback;
}

/**
 * Generated cover art: a gradient plus a soft glyph, so the preview never
 * depends on external images. `accent` from the same object is what the player
 * screen uses for dynamic colour.
 */
export function CoverArt({ coverId, size = 48, rounded = 14, className = '', glyph = true, style }) {
  const cover = coverOf(coverId);
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        background: `linear-gradient(145deg, ${cover.from} 0%, ${cover.via} 52%, ${cover.to} 100%)`,
        ...style,
      }}
      aria-hidden="true"
    >
      {glyph && (
        <span
          className="absolute inset-0 flex items-center justify-center font-light text-white/70"
          style={{ fontSize: Math.round(size * 0.42) }}
        >
          {cover.glyph}
        </span>
      )}
      <span
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' }}
      />
    </div>
  );
}

/** Four-up mosaic used for playlist headers and import cards. */
export function CoverMosaic({ coverIds = [], size = 56, rounded = 18, className = '' }) {
  const ids = [...coverIds, ...coverIds, ...coverIds, ...coverIds].slice(0, 4);
  const cell = size / 2;
  return (
    <div
      className={`grid shrink-0 grid-cols-2 overflow-hidden ${className}`}
      style={{ width: size, height: size, borderRadius: rounded, gap: 1 }}
      aria-hidden="true"
    >
      {ids.map((id, index) => {
        const cover = coverOf(id);
        return (
          <div
            key={`${id}-${index}`}
            style={{
              width: cell,
              height: cell,
              background: `linear-gradient(145deg, ${cover.from}, ${cover.to})`,
            }}
          />
        );
      })}
    </div>
  );
}

/** Source badge shown next to a track so the origin of each song is obvious. */
const sourceIcon = { local: 'device', ytm: 'youtube', spotify: 'spotify', soundcloud: 'soundcloud' };

export function SourceDot({ sourceId, size = 16, title }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full"
      style={{ width: size, height: size, color: 'var(--on-surface-3)' }}
      title={title}
    >
      <Icon name={sourceIcon[sourceId] ?? 'music'} size={size} strokeWidth={1.6} />
    </span>
  );
}

import { Icon } from './Icons.jsx';
import { CoverArt, SourceDot } from './CoverArt.jsx';
import { NowPlayingBars } from './Controls.jsx';
import { formatDuration } from '../lib/format.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';
import { sourceById } from '../data/mockData.js';

const sourceIconName = { local: 'device', ytm: 'youtube', spotify: 'spotify', soundcloud: 'soundcloud' };

/**
 * One track in a list.
 *
 * The row is a flex container holding independent buttons (play target,
 * favourite, selection, reorder) rather than a button wrapping buttons, which
 * keeps the markup valid and the hit targets separate.
 *
 * States covered: currently playing, favourite, download pending/done,
 * corrupted file with no metadata, selection mode and reorder mode.
 */
export function TrackRow({ track, index, queue, active = false, isPlaying = false, reorderMode = false, selected, onClick, onMove }) {
  const { t } = useI18n();
  const player = usePlayer();
  const favorite = player.isFavorite(track.id);
  const download = player.downloadStatus(track.id);
  const source = sourceById[track.sourceId];
  const corrupted = Boolean(track.corrupted);
  const selectable = selected !== undefined;

  const activate = () => {
    if (corrupted) return;
    if (selectable || reorderMode) {
      onClick?.(track);
      return;
    }
    player.playTrack(track.id, queue);
  };

  return (
    <div className="row items-center">
      {reorderMode && onMove && (
        <span className="flex shrink-0 items-center">
          <button
            type="button"
            className="icon-btn h-9 w-9"
            onClick={() => onMove(track.id, -1)}
            disabled={index === 0}
            aria-label={`${t('common.moveUp')}: ${track.title}`}
            style={{ opacity: index === 0 ? 0.3 : 1 }}
          >
            <Icon name="chevronDown" size={16} className="rotate-180" />
          </button>
          <button
            type="button"
            className="icon-btn h-9 w-9"
            onClick={() => onMove(track.id, 1)}
            disabled={index === queue.length - 1}
            aria-label={`${t('common.moveDown')}: ${track.title}`}
            style={{ opacity: index === queue.length - 1 ? 0.3 : 1 }}
          >
            <Icon name="chevronDown" size={16} />
          </button>
        </span>
      )}

      {selectable && (
        <button
          type="button"
          onClick={() => onClick?.(track)}
          aria-pressed={selected}
          aria-label={track.title}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{
            background: selected ? 'var(--accent)' : 'transparent',
            border: `1.5px solid ${selected ? 'transparent' : 'var(--outline-strong)'}`,
            color: 'var(--on-accent)',
          }}
        >
          {selected && <Icon name="check" size={14} strokeWidth={2.6} />}
        </button>
      )}

      <button type="button" onClick={activate} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`${track.title}${track.artist ? ` by ${track.artist}` : ''}`}>
        <span className="relative shrink-0">
          <CoverArt coverId={track.coverId} size={52} rounded={14} />
          {active && (
            <span className="absolute inset-0 flex items-center justify-center rounded-[14px]" style={{ background: 'rgba(0,0,0,0.45)' }}>
              <NowPlayingBars active={isPlaying} />
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className="flex items-center gap-1.5 truncate text-[15px] font-medium"
            style={{ color: corrupted ? 'var(--on-surface-3)' : active ? 'var(--accent)' : 'var(--on-surface)' }}
          >
            <span className="truncate">{track.title}</span>
            {track.explicit && (
              <span className="shrink-0 rounded px-1 text-[9px] font-bold" style={{ background: 'var(--surface-3)', color: 'var(--on-surface-3)' }}>
                E
              </span>
            )}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5">
            <SourceDot sourceId={track.sourceId} size={13} title={source?.name} />
            <span className="caption truncate">
              {corrupted ? t('track.unreadable') : [track.artist, track.album].filter(Boolean).join(' · ')}
            </span>
          </span>
        </span>

        <span className="caption shrink-0 tabular-nums" style={{ minWidth: 38, textAlign: 'right' }}>
          {track.durationSec > 0 ? formatDuration(track.durationSec) : '--:--'}
        </span>
      </button>

      {!reorderMode && !selectable && (
        <span className="flex shrink-0 items-center">
          {download !== 'none' && (
            <Icon
              name={download === 'done' ? 'check' : 'download'}
              size={15}
              className="mr-1"
              style={{ color: download === 'done' ? 'var(--accent)' : 'var(--on-surface-3)' }}
            />
          )}
          <button
            type="button"
            className="icon-btn h-10 w-10"
            onClick={() => player.toggleFavorite(track.id)}
            aria-label={favorite ? t('player.removeFromFavorites') : t('player.addToFavorites')}
            aria-pressed={favorite}
          >
            <Icon name="heart" size={18} filled={favorite} style={{ color: favorite ? 'var(--accent)' : 'var(--on-surface-3)' }} />
          </button>
        </span>
      )}
    </div>
  );
}

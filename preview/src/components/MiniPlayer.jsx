import { CoverArt } from './CoverArt.jsx';
import { Icon } from './Icons.jsx';
import { SeekBar } from './SeekBar.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';

/**
 * Persistent mini player sitting above the bottom navigation.
 * Tapping anywhere except the buttons expands the full player.
 */
export function MiniPlayer({ onExpand }) {
  const { t } = useI18n();
  const player = usePlayer();
  const track = player.currentTrack;
  if (!track) return null;

  const favorite = player.isFavorite(track.id);

  return (
    <div className="relative z-20 shrink-0 px-2 pb-1">
      <div
        className="relative overflow-hidden rounded-[22px]"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--outline)',
          boxShadow: '0 8px 24px -12px rgba(0,0,0,0.35)',
        }}
      >
        <div className="absolute inset-x-0 top-0">
          <SeekBar compact progress={player.progress} disabled />
        </div>

        <div className="flex items-center gap-2 py-2 pl-2 pr-1">
          <button
            type="button"
            onClick={onExpand}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-label={`${track.title} — open player`}
          >
            <CoverArt coverId={track.coverId} size={42} rounded={12} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold">{track.title}</span>
              <span className="caption block truncate">{track.artist ?? t('common.unknownArtist')}</span>
            </span>
          </button>

          <button
            type="button"
            className="icon-btn h-10 w-10"
            onClick={() => player.toggleFavorite(track.id)}
            aria-label={favorite ? t('player.removeFromFavorites') : t('player.addToFavorites')}
            aria-pressed={favorite}
          >
            <Icon name="heart" size={19} filled={favorite} style={{ color: favorite ? 'var(--accent)' : undefined }} />
          </button>

          <button
            type="button"
            className="icon-btn h-10 w-10"
            onClick={player.togglePlay}
            aria-label={player.isPlaying ? t('action.pause') : t('action.play')}
          >
            <Icon name={player.isPlaying ? 'pause' : 'play'} size={20} />
          </button>

          <button type="button" className="icon-btn h-10 w-10" onClick={player.next} aria-label={t('player.next')}>
            <Icon name="next" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

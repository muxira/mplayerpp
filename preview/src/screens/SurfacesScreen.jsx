import { useState } from 'react';
import { TopBar } from '../components/TopBar.jsx';
import { Icon } from '../components/Icons.jsx';
import { CoverArt, coverOf } from '../components/CoverArt.jsx';
import { SeekBar } from '../components/SeekBar.jsx';
import { Segmented } from '../components/Controls.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';
import { formatDuration } from '../lib/format.js';

/**
 * The media controls the system draws from the MediaSession.
 *
 * This is the shape Android 13+ renders in the notification shade, on the lock
 * screen and in Quick Settings: artwork, title, artist, a draggable scrubber
 * (present because the playback state publishes a seek action), the three
 * standard transport buttons and one custom action.
 */
function MediaControlCard({ compact = false, onFavorite, favorite }) {
  const { t } = useI18n();
  const player = usePlayer();
  const track = player.currentTrack;
  if (!track) return null;

  return (
    <div
      className="overflow-hidden rounded-[26px] p-3.5"
      style={{
        background: 'rgba(28,32,35,0.82)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 18px 40px -20px rgba(0,0,0,0.8)',
        color: '#f2f4f5',
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <CoverArt coverId={track.coverId} size={compact ? 44 : 52} rounded={14} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">{track.title}</p>
          <p className="truncate text-[12px]" style={{ color: 'rgba(242,244,245,0.62)' }}>
            {track.artist ?? t('common.unknownArtist')}
          </p>
        </div>
        <span
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(242,244,245,0.8)' }}
        >
          <Icon name="device" size={11} />
          {t('common.outputDevice')}
        </span>
      </div>

      <div className="px-0.5" style={{ ['--surface-3']: 'rgba(255,255,255,0.16)', ['--accent']: '#4fd8bd' }}>
        <SeekBar
          progress={player.progress}
          positionSec={player.positionSec}
          durationSec={player.durationSec}
          onSeekFraction={player.seekFraction}
          label={t('player.seek')}
        />
      </div>
      <div className="-mt-1 flex items-center justify-between px-1" style={{ color: 'rgba(242,244,245,0.5)' }}>
        <span className="text-[10px] tabular-nums">{formatDuration(player.positionSec)}</span>
        <span className="text-[10px] tabular-nums">{formatDuration(player.durationSec)}</span>
      </div>

      <div className="mt-1.5 flex items-center justify-around">
        {[
          { key: 'prev', icon: 'previous', label: t('player.previous'), onClick: player.previous, size: 24 },
          { key: 'play', icon: player.isPlaying ? 'pause' : 'play', label: player.isPlaying ? t('action.pause') : t('action.play'), onClick: player.togglePlay, size: 30 },
          { key: 'next', icon: 'next', label: t('player.next'), onClick: player.next, size: 24 },
          { key: 'fav', icon: 'heart', label: t('player.addToFavorites'), onClick: () => { player.toggleFavorite(track.id); onFavorite?.(); }, size: 22, filled: favorite },
        ].map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            aria-label={action.label}
            aria-pressed={action.key === 'fav' ? favorite : undefined}
            className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-150 active:scale-90"
            style={{ color: action.key === 'fav' && action.filled ? '#4fd8bd' : '#f2f4f5' }}
          >
            <Icon name={action.icon} size={action.size} filled={action.filled} />
          </button>
        ))}
      </div>
    </div>
  );
}

function SystemNotification({ icon, title, body, time }) {
  return (
    <div className="rounded-[22px] p-3.5" style={{ background: 'rgba(28,32,35,0.7)', border: '1px solid rgba(255,255,255,0.08)', color: '#f2f4f5' }}>
      <div className="flex items-center gap-2">
        <Icon name={icon} size={13} style={{ color: 'rgba(242,244,245,0.6)' }} />
        <span className="text-[11px] font-medium" style={{ color: 'rgba(242,244,245,0.7)' }}>
          {title}
        </span>
        <span className="ml-auto text-[10px]" style={{ color: 'rgba(242,244,245,0.45)' }}>
          {time}
        </span>
      </div>
      <p className="mt-1 text-[12.5px] leading-snug" style={{ color: 'rgba(242,244,245,0.85)' }}>
        {body}
      </p>
    </div>
  );
}

/** Mocks of the notification shade, the lock screen and Android Auto. */
export function SurfacesScreen() {
  const { t } = useI18n();
  const { pop } = useNav();
  const player = usePlayer();
  const [surface, setSurface] = useState('shade');
  const [toast, setToast] = useState(false);

  const track = player.currentTrack;
  const cover = coverOf(track?.coverId);
  const favorite = track ? player.isFavorite(track.id) : false;

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 1800);
  };

  return (
    <div className="screen">
      <TopBar large title={t('surface.title')} subtitle={t('surface.subtitle')} onBack={pop} />

      <div className="scroll-area pb-8">
        <div className="px-5 pb-4">
          <Segmented
            ariaLabel={t('surface.title')}
            value={surface}
            onChange={setSurface}
            options={[
              { id: 'shade', label: t('surface.shade') },
              { id: 'lock', label: t('surface.lock') },
              { id: 'auto', label: t('surface.auto') },
            ]}
          />
        </div>

        <div className="px-4">
          {surface === 'shade' && (
            <div
              className="relative overflow-hidden rounded-[30px] p-4 animate-fade-in"
              style={{ background: 'linear-gradient(180deg, #14181a 0%, #0b0e0f 100%)', minHeight: 460 }}
            >
              <div className="mb-4 flex items-center justify-between px-2 text-[12px] font-medium" style={{ color: 'rgba(242,244,245,0.75)' }}>
                <span>{t('surface.date.short')}</span>
                <span className="tabular-nums">{t('surface.clock')}</span>
              </div>

              <div className="space-y-2.5">
                <MediaControlCard onFavorite={showToast} favorite={favorite} />
                <SystemNotification icon="download" title={t('app.name')} body={t('surface.download.body')} time={t('surface.ago', { time: '2m' })} />
                <SystemNotification icon="bell" title={t('surface.other.title')} body={t('surface.other.body')} time={t('surface.ago', { time: '18m' })} />
              </div>

              <div className="mt-5 flex justify-center">
                <span className="h-1 w-16 rounded-full" style={{ background: 'rgba(242,244,245,0.25)' }} />
              </div>
            </div>
          )}

          {surface === 'lock' && (
            <div
              className="relative overflow-hidden rounded-[30px] p-5 animate-fade-in"
              style={{
                background: `linear-gradient(165deg, ${cover.from} 0%, ${cover.via} 55%, #0b0e0f 130%)`,
                minHeight: 520,
              }}
            >
              <div className="flex items-center justify-between text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <span className="flex items-center gap-1.5">
                  <Icon name="lock" size={12} />
                  {t('surface.locked')}
                </span>
                <span className="tabular-nums">{t('surface.clock')}</span>
              </div>

              <div className="mt-8 text-center" style={{ color: '#fff' }}>
                <p className="text-[64px] font-light leading-none tracking-[-0.04em] tabular-nums">{t('surface.clock')}</p>
                <p className="mt-1.5 text-[13px] opacity-70">{t('surface.date.long')}</p>
              </div>

              <div className="mt-8">
                <MediaControlCard onFavorite={showToast} favorite={favorite} />
              </div>

              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="h-1 w-24 rounded-full" style={{ background: 'rgba(255,255,255,0.35)' }} />
              </div>
            </div>
          )}

          {surface === 'auto' && (
            <div className="overflow-hidden rounded-[30px] animate-fade-in" style={{ background: '#0b0e0f', padding: 16 }}>
              <div className="mb-3 flex items-center gap-2 px-1" style={{ color: 'rgba(242,244,245,0.6)' }}>
                <Icon name="car" size={16} />
                <span className="text-[12px] font-medium">{t('surface.auto.title')}</span>
              </div>
              <div className="flex items-center gap-4 rounded-[22px] p-4" style={{ background: 'rgba(28,32,35,0.9)' }}>
                <CoverArt coverId={track?.coverId} size={84} rounded={16} />
                <div className="min-w-0 flex-1" style={{ color: '#f2f4f5' }}>
                  <p className="truncate text-[16px] font-semibold">{track?.title}</p>
                  <p className="truncate text-[13px]" style={{ color: 'rgba(242,244,245,0.6)' }}>
                    {track?.artist ?? t('common.unknownArtist')}
                  </p>
                  <p className="mt-1 truncate text-[11px]" style={{ color: 'rgba(242,244,245,0.45)' }}>
                    {track?.album}
                  </p>
                  <div className="mt-3" style={{ ['--surface-3']: 'rgba(255,255,255,0.16)', ['--accent']: '#4fd8bd' }}>
                    <SeekBar compact progress={player.progress} disabled />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-around" style={{ color: '#f2f4f5' }}>
                {[
                  { key: 'prev', icon: 'previous', label: t('player.previous'), onClick: player.previous },
                  { key: 'play', icon: player.isPlaying ? 'pause' : 'play', label: t('player.playPause'), onClick: player.togglePlay },
                  { key: 'next', icon: 'next', label: t('player.next'), onClick: player.next },
                ].map((action) => (
                  <button key={action.key} type="button" onClick={action.onClick} aria-label={action.label} className="flex h-14 w-14 items-center justify-center rounded-full active:scale-90">
                    <Icon name={action.icon} size={action.key === 'play' ? 28 : 24} />
                  </button>
                ))}
              </div>
              <p className="caption mt-2 text-center" style={{ color: 'rgba(242,244,245,0.45)' }}>
                {t('surface.auto.note')}
              </p>
            </div>
          )}
        </div>

        <div className="mx-4 mt-5 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--surface-2)' }}>
          <Icon name="info" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
          <p className="caption" style={{ color: 'var(--on-surface-2)' }}>
            {t('surface.note')} {t('surface.scrubberNote')}
          </p>
        </div>

        {toast && (
          <div
            className="mx-auto mt-4 w-fit animate-rise-in rounded-full px-4 py-2 text-[13px] font-medium"
            style={{ background: 'var(--surface-inverse)', color: 'var(--surface)' }}
            role="status"
          >
            {t('surface.favoriteAdded')}
          </div>
        )}
      </div>
    </div>
  );
}

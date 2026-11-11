import { Icon } from '../../components/Icons.jsx';
import { SeekBar } from '../../components/SeekBar.jsx';
import { CoverArt, coverOf } from '../../components/CoverArt.jsx';
import { VolumeBoostControl } from '../../components/VolumeBoostControl.jsx';
import { Sheet } from '../../components/Sheet.jsx';
import { useI18n } from '../../i18n/I18nProvider.jsx';
import { usePlayer } from '../../state/PlayerProvider.jsx';
import { useSettings } from '../../state/SettingsProvider.jsx';
import { useNav } from '../../state/NavProvider.jsx';
import { playbackSpeeds, sleepTimerOptions, sourceById, trackById } from '../../data/mockData.js';

/**
 * Cover tab: large artwork, transport controls, seek bar, and sheets for
 * volume boost, playback speed and the play queue.
 */
export function CoverTab({ openSheet, onOpenSheet, onCloseSheet }) {
  const { t } = useI18n();
  const player = usePlayer();
  const { settings, setSetting } = useSettings();
  const { push } = useNav();
  const track = player.currentTrack;

  if (!track) return null;

  const cover = coverOf(track.coverId);
  const source = sourceById[track.sourceId];
  const favorite = player.isFavorite(track.id);
  const download = player.downloadStatus(track.id);
  const canDownload = source?.capabilities.canDownload ?? false;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-2">
      <div className="flex min-h-0 flex-1 items-center justify-center py-2">
        <div className="relative">
          <span
            className="absolute -inset-6 rounded-[52px] opacity-40 blur-2xl"
            style={{ background: `linear-gradient(145deg, ${cover.from}, ${cover.to})` }}
            aria-hidden="true"
          />
          <CoverArt
            coverId={track.coverId}
            size={268}
            rounded={34}
            className="relative animate-rise-in"
            style={{ boxShadow: '0 26px 60px -24px rgba(0,0,0,0.65)' }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[22px] font-semibold leading-tight tracking-[-0.02em]">{track.title}</h2>
          <p className="mt-1 truncate text-[15px]" style={{ color: 'var(--on-surface-2)' }}>
            {track.artist ?? t('common.unknownArtist')}
            {track.album ? ` · ${track.album}` : ''}
          </p>
          <p className="caption mt-1 flex items-center gap-1.5">
            <Icon
              name={track.sourceId === 'local' ? 'device' : track.sourceId === 'ytm' ? 'youtube' : track.sourceId === 'spotify' ? 'spotify' : 'soundcloud'}
              size={12}
            />
            {t('player.fromSource', { source: source?.name ?? track.sourceId })}
            {track.quality ? ` · ${track.quality}` : ''}
          </p>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => player.toggleFavorite(track.id)}
          aria-label={favorite ? t('player.removeFromFavorites') : t('player.addToFavorites')}
          aria-pressed={favorite}
        >
          <Icon name="heart" size={22} filled={favorite} style={{ color: favorite ? 'var(--accent)' : 'var(--on-surface-2)' }} />
        </button>
      </div>

      <div className="mt-4">
        <SeekBar
          progress={player.progress}
          positionSec={player.positionSec}
          durationSec={player.durationSec}
          onSeekFraction={player.seekFraction}
          disabled={player.durationSec === 0}
          label={t('player.seek')}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          className={`icon-btn ${player.shuffle ? 'icon-btn-on' : ''}`}
          onClick={player.toggleShuffle}
          aria-label={player.shuffle ? t('action.shuffleOn') : t('action.shuffleOff')}
          aria-pressed={player.shuffle}
        >
          <Icon name="shuffle" size={20} />
        </button>

        <button type="button" className="icon-btn" onClick={player.previous} aria-label={t('player.previous')}>
          <Icon name="previous" size={27} />
        </button>

        <button
          type="button"
          onClick={player.togglePlay}
          aria-label={player.isPlaying ? t('action.pause') : t('action.play')}
          className="flex h-[70px] w-[70px] items-center justify-center rounded-full transition-transform duration-200 ease-emphasized active:scale-95"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)', boxShadow: '0 10px 26px -10px rgba(0,0,0,0.6)' }}
        >
          <Icon name={player.isPlaying ? 'pause' : 'play'} size={28} />
        </button>

        <button type="button" className="icon-btn" onClick={player.next} aria-label={t('player.next')}>
          <Icon name="next" size={27} />
        </button>

        <button
          type="button"
          className={`icon-btn relative ${player.repeatMode !== 'off' ? 'icon-btn-on' : ''}`}
          onClick={player.cycleRepeat}
          aria-label={
            player.repeatMode === 'off' ? t('player.repeatOff') : player.repeatMode === 'all' ? t('player.repeatAll') : t('player.repeatOne')
          }
        >
          <Icon name="repeat" size={20} />
          {player.repeatMode === 'one' && (
            <span
              className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
              style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
            >
              1
            </span>
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between pb-1">
        <button
          type="button"
          className="icon-btn"
          onClick={() => (canDownload ? player.cycleDownload(track.id) : null)}
          aria-label={canDownload ? t('action.download') : t('accounts.cannotDownload')}
          title={canDownload ? t('action.download') : `${source?.name}: ${t('accounts.cannotDownload')}`}
          style={{ opacity: canDownload ? 1 : 0.4 }}
        >
          <Icon
            name={download === 'done' ? 'check' : 'download'}
            size={19}
            style={{ color: download === 'done' ? 'var(--accent)' : undefined }}
          />
        </button>

        <button type="button" className="icon-btn" onClick={() => onOpenSheet('speed')} aria-label={t('player.speed')}>
          <span className="text-[12px] font-semibold tabular-nums">{settings.playbackSpeed}×</span>
        </button>

        <button type="button" className="icon-btn" onClick={() => onOpenSheet('boost')} aria-label={t('player.volumeBoost')}>
          <Icon name="volume" size={19} style={{ color: settings.volumeBoost > 100 ? 'var(--warning)' : undefined }} />
        </button>

        <button type="button" className="icon-btn" onClick={() => onOpenSheet('sleep')} aria-label={t('player.sleep')}>
          <Icon name="sleep" size={19} style={{ color: settings.sleepTimerMin !== 0 ? 'var(--accent)' : undefined }} />
        </button>

        <button type="button" className="icon-btn" onClick={() => onOpenSheet('queue')} aria-label={t('player.queue')}>
          <Icon name="queue" size={19} />
        </button>
      </div>

      {/* Volume boost sheet */}
      <Sheet open={openSheet === 'boost'} onClose={onCloseSheet} title={t('boost.title')}>
        <div className="px-1 pb-3">
          <VolumeBoostControl value={settings.volumeBoost} onChange={(v) => setSetting('volumeBoost', v)} />
        </div>
      </Sheet>

      {/* Playback speed sheet */}
      <Sheet open={openSheet === 'speed'} onClose={onCloseSheet} title={t('settings.speed')}>
        <div className="grid grid-cols-3 gap-2 p-4">
          {playbackSpeeds.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => setSetting('playbackSpeed', speed)}
              className="rounded-2xl py-3.5 text-[15px] font-semibold tabular-nums transition-colors"
              style={{
                background: settings.playbackSpeed === speed ? 'var(--accent)' : 'var(--surface-2)',
                color: settings.playbackSpeed === speed ? 'var(--on-accent)' : 'var(--on-surface)',
                border: '1px solid var(--outline)',
              }}
            >
              {speed}×
            </button>
          ))}
        </div>
      </Sheet>

      {/* Sleep timer sheet */}
      <Sheet open={openSheet === 'sleep'} onClose={onCloseSheet} title={t('settings.sleepTimer')}>
        <div className="grid grid-cols-2 gap-2 p-4">
          {sleepTimerOptions.filter((minutes) => minutes >= 0).map((minutes) => (
            <button
              key={minutes}
              type="button"
              onClick={() => {
                setSetting('sleepTimerMin', minutes);
                player.setSleepTimer(minutes);
              }}
              className="rounded-2xl py-3 text-[14px] font-medium transition-colors"
              style={{
                background: settings.sleepTimerMin === minutes ? 'var(--accent)' : 'var(--surface-2)',
                color: settings.sleepTimerMin === minutes ? 'var(--on-accent)' : 'var(--on-surface)',
                border: '1px solid var(--outline)',
              }}
            >
              {minutes === 0 ? t('settings.sleepTimer.off') : t('settings.sleepTimer.minutes', { count: minutes })}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSetting('sleepTimerMin', -1)}
            className="col-span-2 rounded-2xl py-3 text-[14px] font-medium transition-colors"
            style={{
              background: settings.sleepTimerMin === -1 ? 'var(--accent)' : 'var(--surface-2)',
              color: settings.sleepTimerMin === -1 ? 'var(--on-accent)' : 'var(--on-surface)',
              border: '1px solid var(--outline)',
            }}
          >
            {t('settings.sleepTimer.endOfTrack')}
          </button>
        </div>
      </Sheet>

      {/* Queue sheet */}
      <Sheet open={openSheet === 'queue'} onClose={onCloseSheet} title={`${t('player.queue')} · ${player.queue.length}`}>
        <div className="pb-2">
          {player.queue.map((id, index) => {
            const queued = trackById[id];
            if (!queued) return null;
            const isCurrent = index === player.index;
            return (
              <button
                key={`${id}-${index}`}
                type="button"
                className="row w-full"
                onClick={() => {
                  player.playQueue(player.queue, index, true);
                  onCloseSheet();
                }}
                style={{ opacity: isCurrent ? 1 : 0.85 }}
              >
                <CoverArt coverId={queued.coverId} size={40} rounded={11} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium" style={{ color: isCurrent ? 'var(--accent)' : undefined }}>
                    {queued.title}
                  </span>
                  <span className="caption block truncate">{queued.artist ?? t('common.unknownArtist')}</span>
                </span>
                {isCurrent && <Icon name={player.isPlaying ? 'pause' : 'play'} size={16} style={{ color: 'var(--accent)' }} />}
              </button>
            );
          })}
          <div className="px-4 pt-3">
            <button type="button" className="btn btn-tonal w-full" onClick={() => { onCloseSheet(); push('search'); }}>
              <Icon name="plus" size={16} />
              {t('playlist.addTracks')}
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}

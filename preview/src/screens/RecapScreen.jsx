import { useMemo, useState } from 'react';
import { TopBar } from '../components/TopBar.jsx';
import { Icon } from '../components/Icons.jsx';
import { CoverArt } from '../components/CoverArt.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Chip } from '../components/Controls.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';
import { useSettings } from '../state/SettingsProvider.jsx';
import { emptyStats, recapPeriods, statsByPeriod, trackById } from '../data/mockData.js';
import { formatCount, formatDuration, formatLongMinutes } from '../lib/format.js';

function BarChart({ buckets }) {
  const max = Math.max(1, ...buckets.map((b) => b.minutes));
  return (
    <div className="flex h-[132px] items-end gap-1.5">
      {buckets.map((bucket, index) => {
        const height = Math.max(4, (bucket.minutes / max) * 100);
        return (
          <div key={bucket.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-full transition-all duration-500 ease-emphasized"
                style={{
                  height: `${height}%`,
                  background: index === buckets.length - 1 ? 'var(--accent)' : 'var(--accent-soft)',
                  minHeight: 4,
                  transitionDelay: `${index * 35}ms`,
                }}
                title={`${bucket.label}: ${bucket.minutes} min`}
              />
            </div>
            <span className="caption truncate text-[10px]">{bucket.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ShareBar({ share, label, minutes }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[14px] font-medium">{label}</span>
        <span className="caption tabular-nums">{formatLongMinutes(minutes)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--surface-3)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-emphasized"
          style={{ width: `${Math.round(share * 100)}%`, background: 'var(--accent)' }}
        />
      </div>
    </div>
  );
}

/**
 * Statistics / Recap: per-period totals, a listening timeline, top artists,
 * top tracks and top genres, plus a period selector.
 */
export function RecapScreen() {
  const { t } = useI18n();
  const player = usePlayer();
  const { settings } = useSettings();
  const [period, setPeriod] = useState('week');
  const [forceEmpty, setForceEmpty] = useState(false);

  const stats = useMemo(() => (forceEmpty ? emptyStats : statsByPeriod[period]), [period, forceEmpty]);

  const periodOptions = recapPeriods.map((id) => ({ id, label: t(`recap.period.${id}`) }));
  const thresholdLabel = `${t('settings.statsThreshold.seconds', { count: settings.statsThresholdSec })} · ${t(
    'settings.statsThreshold.percent',
    { count: settings.statsThresholdPercent },
  )}`;

  return (
    <div className="screen">
      <TopBar
        large
        title={t('recap.title')}
        subtitle={t('recap.subtitle')}
        actions={[{ key: 'share', icon: 'share', label: t('recap.share'), onClick: () => {} }]}
      />

      <div className="scroll-area pb-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
          {periodOptions.map((option) => (
            <Chip key={option.id} active={period === option.id && !forceEmpty} onClick={() => { setPeriod(option.id); setForceEmpty(false); }}>
              {option.label}
            </Chip>
          ))}
          <Chip active={forceEmpty} onClick={() => setForceEmpty((v) => !v)} icon="info">
            {t('recap.emptyDemo')}
          </Chip>        </div>

        {stats.totalMinutes === 0 ? (
          <EmptyState
            icon="recap"
            title={t('recap.empty.title')}
            body={t('recap.empty.body', { threshold: thresholdLabel })}
            action={
              <button type="button" className="btn btn-filled" onClick={() => setForceEmpty(false)}>
                {t('action.retry')}
              </button>
            }
          />
        ) : (
          <>
            <section className="mt-5 px-5">
              <p className="overline">{t('recap.listened')}</p>
              <p className="mt-1 text-[44px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
                {formatCount(stats.totalMinutes)}
                <span className="ml-2 text-[18px] font-medium" style={{ color: 'var(--on-surface-2)' }}>
                  {t('common.minutes')}
                </span>
              </p>
              <p className="caption mt-2">
                {t('recap.tracks', { count: formatCount(stats.trackCount) })} · {t('recap.artists', { count: formatCount(stats.artistCount) })}
              </p>
            </section>

            <section className="card mx-4 mt-5 p-4">
              <h2 className="h3 mb-4">{t('recap.timeline')}</h2>
              <BarChart buckets={stats.buckets} />
            </section>

            {stats.highlights.length > 0 && (
              <section className="mt-4 flex gap-3 px-4">
                {stats.highlights.map((highlight) => (
                  <div key={highlight.id} className="card-soft flex-1 p-4">
                    <p className="caption" style={{ color: 'var(--accent)' }}>
                      {highlight.titleKey ? t(highlight.titleKey, { count: highlight.value }) : highlight.title}
                    </p>
                    <p className="mt-1 text-[20px] font-semibold tracking-tight" style={{ color: 'var(--on-surface)' }}>
                      {highlight.titleKey ? '' : highlight.value}
                    </p>
                    {highlight.caption && <p className="caption mt-0.5" style={{ color: 'var(--on-surface-2)' }}>{highlight.caption}</p>}
                  </div>
                ))}
              </section>
            )}

            <section className="mt-7 px-5">
              <h2 className="overline mb-3">{t('recap.topArtists')}</h2>
              {stats.topArtists.map((artist, index) => {
                const max = stats.topArtists[0].minutes;
                return (
                  <div key={artist.name} className="mb-3 flex items-center gap-3">
                    <span className="w-4 text-right text-[13px] font-semibold tabular-nums" style={{ color: 'var(--on-surface-3)' }}>
                      {index + 1}
                    </span>
                    <CoverArt coverId={artist.coverId} size={44} rounded={14} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium">{artist.name}</p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--surface-3)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(artist.minutes / max) * 100}%`, background: 'var(--accent)' }} />
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="caption tabular-nums">{formatLongMinutes(artist.minutes)}</p>
                      <p className="caption tabular-nums">{t('recap.plays', { count: artist.plays })}</p>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="mt-7 px-5">
              <h2 className="overline mb-2">{t('recap.topTracks')}</h2>
              <div className="-mx-1">
                {stats.topTracks.map((entry, index) => {
                  const track = trackById[entry.trackId];
                  if (!track) return null;
                  return (
                    <button
                      key={entry.trackId}
                      type="button"
                      className="row w-full"
                      onClick={() => player.playTrack(track.id, stats.topTracks.map((x) => x.trackId).filter((id) => trackById[id]))}
                    >
                      <span className="w-4 shrink-0 text-right text-[13px] font-semibold tabular-nums" style={{ color: 'var(--on-surface-3)' }}>
                        {index + 1}
                      </span>
                      <CoverArt coverId={track.coverId} size={44} rounded={13} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium">{track.title}</span>
                        <span className="caption block truncate">{track.artist}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="caption block tabular-nums">{t('recap.plays', { count: entry.plays })}</span>
                        <span className="caption block tabular-nums">{formatDuration(track.durationSec)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="card mx-4 mt-6 p-4">
              <h2 className="h3 mb-4">{t('recap.topGenres')}</h2>
              {stats.topGenres.map((genre) => (
                <ShareBar key={genre.genre} share={genre.share} label={genre.genre} minutes={genre.minutes} />
              ))}
            </section>

            <p className="caption mt-6 flex items-center justify-center gap-1.5 px-8 text-center">
              <Icon name="info" size={12} />
              {t('recap.thresholdNote', { threshold: thresholdLabel })}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

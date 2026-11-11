import { TopBar } from '../components/TopBar.jsx';
import { CoverArt, CoverMosaic } from '../components/CoverArt.jsx';
import { Icon } from '../components/Icons.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Badge } from '../components/Controls.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';
import { useDemo } from '../state/DemoProvider.jsx';
import { playlists, sources, tracks, trackById, duplicateGroups } from '../data/mockData.js';
import { formatCount, formatLongMinutes } from '../lib/format.js';

function playlistMeta(playlist) {
  const list = playlist.trackIds.map((id) => trackById[id]).filter(Boolean);
  const minutes = list.reduce((sum, t) => sum + (t.durationSec || 0), 0) / 60;
  return { count: list.length, minutes };
}

function HeroCard({ playlist, onOpen }) {
  const { t } = useI18n();
  const { count, minutes } = playlistMeta(playlist);
  const isFavorites = playlist.id === 'pl-favorites';
  return (
    <button
      type="button"
      onClick={() => onOpen(playlist.id)}
      className="card flex-1 p-4 text-left transition-transform duration-200 ease-emphasized active:scale-[0.98]"
    >
      <CoverMosaic coverIds={playlist.coverIds} size={58} rounded={18} />
      <p className="mt-3.5 truncate text-[16px] font-semibold">{playlist.name}</p>
      <p className="caption mt-0.5">
        {isFavorites ? t('library.favorites.subtitle', { count }) : `${formatCount(count)} · ${formatLongMinutes(minutes)}`}
      </p>
    </button>
  );
}

function PlaylistCard({ playlist, onOpen, onEdit }) {
  const { t } = useI18n();
  const { count, minutes } = playlistMeta(playlist);
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <button type="button" onClick={() => onOpen(playlist.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <CoverMosaic coverIds={playlist.coverIds} size={50} rounded={16} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-medium">{playlist.name}</span>
            {playlist.kind === 'imported' && playlist.origin?.systemPlaylist && <Badge tone="accent">{t('import.systemBadge')}</Badge>}
          </span>
          <span className="caption mt-0.5 block truncate">
            {t('playlist.tracks', { count })} · {formatLongMinutes(minutes)}
            {playlist.origin ? ` · ${t('library.importedBanner', { service: playlist.origin.sourceName })}` : ''}
          </span>
        </span>
      </button>
      <button type="button" className="icon-btn h-10 w-10" onClick={() => onEdit(playlist.id)} aria-label={t('playlist.edit')}>
        <Icon name="more" size={18} />
      </button>
    </div>
  );
}

function SourceStrip({ onOpenAccounts }) {
  return (
    <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-5 pb-1">
      {sources.map((source) => (
        <button
          key={source.id}
          type="button"
          onClick={onOpenAccounts}
          className="flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--outline)',
            opacity: source.connected ? 1 : 0.55,
          }}
        >
          <Icon
            name={source.kind === 'local' ? 'device' : source.id === 'ytm' ? 'youtube' : source.id === 'spotify' ? 'spotify' : 'soundcloud'}
            size={16}
            style={{ color: source.connected ? 'var(--accent)' : 'var(--on-surface-3)' }}
          />
          <span className="text-[13px] font-medium">{source.shortName}</span>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: source.connected ? 'var(--accent)' : 'var(--on-surface-3)' }}
          />
        </button>
      ))}
    </div>
  );
}

export function LibraryScreen() {
  const { t } = useI18n();
  const { push } = useNav();
  const player = usePlayer();
  const { hasPermission, online, isEmpty, setDemoState } = useDemo();

  const all = playlists.find((p) => p.id === 'pl-all');
  const favorites = playlists.find((p) => p.id === 'pl-favorites');
  const customPlaylists = playlists.filter((p) => p.kind !== 'system');
  const recent = [...tracks].sort((a, b) => b.plays - a.plays).slice(0, 8);

  const openPlaylist = (id) => push('playlist', { playlistId: id });

  return (
    <div className="screen">
      <TopBar
        large
        subtitle={t('library.greeting')}
        title={t('library.title')}
        actions={[
          {
            key: 'duplicates',
            icon: 'info',
            label: t('library.duplicates.title'),
            onClick: () => push('duplicates'),
          },
          { key: 'new', icon: 'plus', label: t('library.newPlaylist'), onClick: () => push('playlistEdit', { mode: 'create' }) },
        ]}
      />

      <div className="scroll-area pb-4">
        {!online && (
          <div className="mx-5 mb-3 flex items-center gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--surface-2)' }}>
            <Icon name="offline" size={17} style={{ color: 'var(--on-surface-3)' }} />
            <div>
              <p className="text-[13px] font-semibold">{t('state.offline')}</p>
              <p className="caption mt-0.5">{t('library.offline.body')}</p>
            </div>
          </div>
        )}

        {!hasPermission ? (
          <EmptyState
            icon="device"
            tone="warning"
            title={t('library.permission.title')}
            body={t('library.permission.body')}
            action={
              <button type="button" className="btn btn-filled" onClick={() => setDemoState('normal')}>
                {t('library.permission.grant')}
              </button>
            }
          />
        ) : isEmpty ? (
          <EmptyState
            icon="music"
            title={t('library.empty.title')}
            body={t('library.empty.body')}
            action={
              <div className="flex gap-2">
                <button type="button" className="btn btn-filled" onClick={() => push('accounts')}>
                  {t('accounts.title')}
                </button>
                <button type="button" className="btn btn-tonal" onClick={() => push('import')}>
                  {t('import.title')}
                </button>
              </div>
            }
          />
        ) : (
          <>
            <div className="flex gap-3 px-5 pt-1">
              <HeroCard playlist={all} onOpen={openPlaylist} />
              <HeroCard playlist={favorites} onOpen={openPlaylist} />
            </div>

            <section className="mt-7">
              <div className="mb-2.5 flex items-baseline justify-between px-5">
                <h2 className="overline">{t('library.sources')}</h2>
                <button type="button" className="caption font-medium" style={{ color: 'var(--accent)' }} onClick={() => push('accounts')}>
                  {t('accounts.title')}
                </button>
              </div>
              <SourceStrip onOpenAccounts={() => push('accounts')} />
            </section>

            <section className="mt-7">
              <div className="mb-1 flex items-baseline justify-between px-5">
                <h2 className="overline">{t('library.playlists')}</h2>
                <span className="caption">{formatCount(customPlaylists.length)}</span>
              </div>
              {customPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} onOpen={openPlaylist} onEdit={() => push('playlistEdit', { playlistId: playlist.id })} />
              ))}
            </section>

            <section className="mt-7">
              <h2 className="overline mb-2.5 px-5">{t('library.recentlyPlayed')}</h2>
              <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-5">
                {recent.map((track) => (
                  <button key={track.id} type="button" onClick={() => player.playTrack(track.id, recent.map((x) => x.id))} className="w-[104px] shrink-0 text-left">
                    <CoverArt coverId={track.coverId} size={104} rounded={20} />
                    <p className="mt-2 truncate text-[13px] font-medium">{track.title}</p>
                    <p className="caption truncate">{track.artist ?? 'Unknown'}</p>
                  </button>
                ))}
              </div>
            </section>

            {duplicateGroups.length > 0 && (
              <button
                type="button"
                onClick={() => push('duplicates')}
                className="mx-5 mt-7 flex w-[calc(100%-2.5rem)] items-center gap-3 rounded-3xl p-4 text-left"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--outline)' }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  <Icon name="link" size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold">{t('library.duplicates.title')}</span>
                  <span className="caption mt-0.5 block">{t('library.duplicates.body', { count: duplicateGroups.length })}</span>
                </span>
                <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

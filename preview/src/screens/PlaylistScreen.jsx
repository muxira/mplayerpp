import { useState } from 'react';
import { TopBar } from '../components/TopBar.jsx';
import { CoverMosaic, CoverArt } from '../components/CoverArt.jsx';
import { Icon } from '../components/Icons.jsx';
import { TrackRow } from '../components/TrackRow.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Badge } from '../components/Controls.jsx';
import { ConfirmDialog } from '../components/Sheet.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';
import { playlists, trackById } from '../data/mockData.js';
import { formatDuration, formatLongMinutes, totalDuration } from '../lib/format.js';

/** Playlist detail: header, play/shuffle, reorder mode, delete confirmation. */
export function PlaylistScreen({ playlistId }) {
  const { t } = useI18n();
  const { push, pop } = useNav();
  const player = usePlayer();
  const [reorder, setReorder] = useState(false);
  const [order, setOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const playlist = playlists.find((p) => p.id === playlistId);
  if (!playlist) return <div className="screen" />;

  const trackIds = order ?? playlist.trackIds;
  const list = trackIds.map((id) => trackById[id]).filter(Boolean);
  const isLocked = !playlist.deletable || !playlist.renamable;
  const activeId = player.currentTrack?.id;

  const move = (trackId, delta) => {
    setOrder((current) => {
      const ids = [...(current ?? playlist.trackIds)];
      const from = ids.indexOf(trackId);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= ids.length) return current ?? ids;
      ids.splice(to, 0, ids.splice(from, 1)[0]);
      return ids;
    });
  };

  if (deleted) {
    return (
      <div className="screen">
        <EmptyState
          icon="check"
          title={t('playlist.deleted.title')}
          body={t('playlist.deleted.body', { name: playlist.name })}
          action={
            <button type="button" className="btn btn-filled" onClick={pop}>
              {t('action.done')}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar
        title={playlist.name}
        onBack={pop}
        actions={
          reorder
            ? [{ key: 'done', icon: 'check', label: t('action.done'), onClick: () => setReorder(false) }]
            : [
                { key: 'reorder', icon: 'drag', label: t('playlist.reorder'), onClick: () => setReorder(true) },
                { key: 'edit', icon: 'edit', label: t('playlist.edit'), onClick: () => push('playlistEdit', { playlistId: playlist.id }) },
              ]
        }
      />

      <div className="scroll-area pb-6">
        <div className="flex flex-col items-center px-5 pb-5 pt-2 text-center">
          <CoverMosaic coverIds={playlist.coverIds} size={168} rounded={30} />
          <h1 className="h1 mt-5">{playlist.name}</h1>
          <p className="caption mt-1.5">
            {t('playlist.tracks', { count: list.length })} · {formatLongMinutes(totalDuration(list) / 60)}
          </p>
          {playlist.description && <p className="body mt-2 max-w-[30ch]">{playlist.description}</p>}

          {playlist.origin && (
            <span className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: 'var(--surface-2)', border: '1px solid var(--outline)' }}>
              <Icon name="link" size={14} style={{ color: 'var(--accent)' }} />
              <span className="caption" style={{ color: 'var(--on-surface-2)' }}>
                {t('library.importedBanner', { service: playlist.origin.sourceName })}
                {playlist.origin.systemPlaylist ? ` · ${t('common.systemPlaylist')}` : ''}
              </span>
            </span>
          )}

          <div className="mt-5 flex w-full items-center gap-2.5">
            <button
              type="button"
              className="btn btn-filled flex-1"
              onClick={() => player.playQueue(trackIds, 0, true)}
              disabled={list.length === 0}
              style={{ opacity: list.length === 0 ? 0.4 : 1 }}
            >
              <Icon name="play" size={18} />
              {t('playlist.play')}
            </button>
            <button type="button" className="btn btn-tonal flex-1" onClick={() => player.playQueue(trackIds, 0, true)} disabled={list.length === 0} style={{ opacity: list.length === 0 ? 0.4 : 1 }}>
              <Icon name="shuffle" size={18} />
              {t('playlist.shuffle')}
            </button>
          </div>
        </div>

        {isLocked && (
          <div className="mx-4 mb-3 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--surface-2)' }}>
            <Icon name="lock" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--on-surface-3)' }} />
            <div>
              <p className="text-[13px] font-semibold">{t('playlist.locked.title')}</p>
              <p className="caption mt-0.5">{t('playlist.locked.body')}</p>
            </div>
          </div>
        )}

        {reorder && (
          <div className="mx-4 mb-2 flex items-center gap-2.5 rounded-2xl p-3" style={{ background: 'var(--accent-soft)' }}>
            <Icon name="drag" size={15} style={{ color: 'var(--accent)' }} />
            <p className="caption" style={{ color: 'var(--accent)' }}>
              {t('playlist.reorderHint')}
            </p>
          </div>
        )}

        {list.length === 0 ? (
          <EmptyState
            icon="music"
            title={t('playlist.empty.title')}
            body={t('playlist.empty.body')}
            action={
              <button type="button" className="btn btn-filled" onClick={() => push('playlistEdit', { playlistId: playlist.id })}>
                {t('playlist.addTracks')}
              </button>
            }
          />
        ) : (
          <div className="pb-2">
            {list.map((track, index) => (
              <TrackRow
                key={track.id}
                track={track}
                index={index}
                queue={trackIds}
                active={track.id === activeId}
                isPlaying={track.id === activeId && player.isPlaying}
                reorderMode={reorder}
                onMove={move}
              />
            ))}
          </div>
        )}

        {playlist.deletable && !reorder && (
          <div className="mt-4 px-4">
            <button type="button" className="btn btn-danger w-full" onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" size={17} />
              {t('playlist.delete')}
            </button>
          </div>
        )}

        {list.length > 0 && (
          <p className="caption mt-6 text-center">
            {playlist.id === 'pl-all' ? t('playlist.dedupNote') : t('playlist.createdOn', { date: playlist.createdAt ?? '' })}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={t('playlist.deleteConfirmTitle', { name: playlist.name })}
        body={t('playlist.deleteConfirmBody')}
        cancelLabel={t('action.cancel')}
        confirmLabel={t('action.delete')}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          setDeleted(true);
        }}
      />
    </div>
  );
}

/** Small helper reused by the duplicates sheet. */
export function DuplicateRow({ group }) {
  const { t } = useI18n();
  const primary = group[0];
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <CoverArt coverId={primary.coverId} size={44} rounded={12} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium">{primary.title}</p>
          <p className="caption truncate">{primary.artist}</p>
        </div>
        <Badge tone="accent">{t('common.copies', { count: group.length })}</Badge>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {group.map((copy) => (
          <span key={copy.id} className="badge" style={{ background: 'var(--surface-3)', color: 'var(--on-surface-2)' }}>
            {copy.sourceId} · {copy.quality} · {formatDuration(copy.durationSec)}
          </span>
        ))}
      </div>
    </div>
  );
}

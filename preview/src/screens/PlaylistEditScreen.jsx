import { useMemo, useState } from 'react';
import { TopBar } from '../components/TopBar.jsx';
import { Icon } from '../components/Icons.jsx';
import { CoverArt } from '../components/CoverArt.jsx';
import { ConfirmDialog } from '../components/Sheet.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { playlists, tracks } from '../data/mockData.js';
import { formatDuration } from '../lib/format.js';

/**
 * Create / edit playlist: name, description and track membership.
 * Built-in playlists ("All", "Favorites") never reach this screen.
 */
export function PlaylistEditScreen({ playlistId, mode }) {
  const { t } = useI18n();
  const { pop } = useNav();
  const playlist = playlists.find((p) => p.id === playlistId);
  const isCreate = mode === 'create' || !playlist;

  const [name, setName] = useState(playlist?.name ?? '');
  const [description, setDescription] = useState(playlist?.description ?? '');
  const [trackIds, setTrackIds] = useState(() => new Set(playlist?.trackIds ?? []));
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectable = useMemo(() => tracks.filter((track) => !track.corrupted), []);
  const nameValid = name.trim().length > 0;

  const toggleTrack = (id) => {
    setTrackIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (saved) {
    return (
      <div className="screen">
        <TopBar title={isCreate ? t('playlist.create.title') : t('playlist.edit.title')} onBack={pop} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Icon name="check" size={28} strokeWidth={2.4} />
          </span>
          <h3 className="h2 mb-1.5">{name}</h3>
          <p className="body">{t('playlist.tracks', { count: trackIds.size })}</p>
          <button type="button" className="btn btn-filled mt-6" onClick={pop}>
            {t('action.done')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar
        title={isCreate ? t('playlist.create.title') : t('playlist.edit.title')}
        onBack={() => setConfirmDiscard(true)}
        actions={[{ key: 'save', icon: 'check', label: t('action.save'), onClick: () => nameValid && setSaved(true) }]}
      />

      <div className="scroll-area px-5 pb-8">
        <label className="overline mb-2 block" htmlFor="playlist-name">
          {t('playlist.nameLabel')}
        </label>
        <input
          id="playlist-name"
          className="field mb-4"
          value={name}
          placeholder={t('playlist.namePlaceholder')}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          autoFocus={isCreate}
        />

        <label className="overline mb-2 block" htmlFor="playlist-description">
          {t('playlist.descriptionLabel')}
        </label>
        <input
          id="playlist-description"
          className="field mb-6"
          value={description}
          placeholder={t('playlist.descriptionPlaceholder')}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={140}
        />

        {playlist?.origin && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--surface-2)' }}>
            <Icon name="link" size={16} style={{ color: 'var(--accent)' }} />
            <p className="caption" style={{ color: 'var(--on-surface-2)' }}>
              {t('playlist.originNote', {
                service: playlist.origin.sourceName,
                systemSuffix: playlist.origin.systemPlaylist ? ` (${t('common.systemPlaylist')})` : '',
              })}
            </p>
          </div>
        )}

        <div className="mb-2 flex items-center justify-between">
          <h2 className="overline">{t('playlist.addTracks')}</h2>
          <span className="caption">{t('import.selected', { count: trackIds.size })}</span>
        </div>

        <div className="card overflow-hidden">
          {selectable.map((track, index) => {
            const isSelected = trackIds.has(track.id);
            return (
              <div key={track.id}>
                {index > 0 && <div className="divider mx-4" />}
                <button type="button" className="row w-full" onClick={() => toggleTrack(track.id)} aria-pressed={isSelected}>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      border: `1.5px solid ${isSelected ? 'transparent' : 'var(--outline-strong)'}`,
                      color: 'var(--on-accent)',
                    }}
                  >
                    {isSelected && <Icon name="check" size={14} strokeWidth={2.6} />}
                  </span>
                  <CoverArt coverId={track.coverId} size={42} rounded={12} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{track.title}</span>
                    <span className="caption block truncate">{track.artist}</span>
                  </span>
                  <span className="caption shrink-0 tabular-nums">{formatDuration(track.durationSec)}</span>
                </button>
              </div>
            );
          })}
        </div>

        {!nameValid && (
          <p className="caption mt-4 text-center" style={{ color: 'var(--danger)' }}>
            {t('playlist.nameRequired')}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        title={isCreate ? t('playlist.discardCreateTitle') : t('playlist.discardEditTitle')}
        body={t('playlist.discardBody')}
        cancelLabel={t('action.cancel')}
        confirmLabel={t('action.delete')}
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={() => {
          setConfirmDiscard(false);
          pop();
        }}
      />
    </div>
  );
}

import { useState } from 'react';
import { TopBar } from '../components/TopBar.jsx';
import { Icon } from '../components/Icons.jsx';
import { TrackRow } from '../components/TrackRow.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Chip, Badge } from '../components/Controls.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';
import { useDemo } from '../state/DemoProvider.jsx';
import { recentSearches, searchResults, sourceById, suggestedQueries, trackById } from '../data/mockData.js';

/**
 * Search across connected services.
 *
 * Every result row adapts to the source capabilities: download appears only
 * where `canDownload` is true, and a disconnected source renders a connect
 * prompt instead of fake results.
 */
export function SearchScreen() {
  const { t } = useI18n();
  const { push } = useNav();
  const player = usePlayer();
  const { online } = useDemo();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('all');

  const activeQuery = submitted ?? '';
  const groups = (searchResults.groups ?? []).filter((group) => sourceFilter === 'all' || group.sourceId === sourceFilter);
  const visibleGroups = activeQuery ? groups : [];

  const submit = (value) => {
    const trimmed = value.trim();
    setQuery(trimmed);
    setSubmitted(trimmed.length > 0 ? trimmed : null);
  };

  return (
    <div className="screen">
      <TopBar
        large
        title={t('search.title')}
        actions={[{ key: 'filter', icon: 'filter', label: t('search.filter'), onClick: () => push('accounts') }]}
      />

      <div className="scroll-area pb-6">
        <form
          className="px-5"
          onSubmit={(event) => {
            event.preventDefault();
            submit(query);
          }}
        >
          <div className="relative">
            <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              className="field pl-11 pr-11"
              type="search"
              value={query}
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button type="button" className="icon-btn absolute right-0 top-1/2 h-11 w-11 -translate-y-1/2" onClick={() => submit('')} aria-label={t('action.close')}>
                <Icon name="close" size={17} />
              </button>
            )}
          </div>
        </form>

        {!online && (
          <div className="mx-5 mt-3 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--warning-soft)' }}>
            <Icon name="offline" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--warning)' }} />
            <div>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--warning)' }}>
                {t('search.offline.title')}
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: 'var(--warning)', opacity: 0.85 }}>
                {t('search.offline.body')}
              </p>
            </div>
          </div>
        )}

        {!activeQuery ? (
          <div className="mt-6">
            <h2 className="overline mb-2.5 px-5">{t('search.recent')}</h2>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
              {recentSearches.map((item) => (
                <Chip key={item} onClick={() => submit(item)}>
                  <Icon name="clock" size={13} />
                  {item}
                </Chip>
              ))}
            </div>

            <h2 className="overline mb-2.5 mt-6 px-5">{t('search.suggested')}</h2>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
              {suggestedQueries.map((item) => (
                <Chip key={item} onClick={() => submit(item)}>
                  {item}
                </Chip>
              ))}
            </div>

            <p className="caption mt-8 px-5">{t('search.tip')}</p>
          </div>
        ) : (
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between px-5">
              <h2 className="h3 truncate">{t('search.resultsFor', { query: activeQuery })}</h2>
            </div>

            <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto px-5">
              <Chip active={sourceFilter === 'all'} onClick={() => setSourceFilter('all')}>
                {t('search.scope.all')}
              </Chip>
              {Object.values(sourceById).map((source) => (
                <Chip key={source.id} active={sourceFilter === source.id} onClick={() => setSourceFilter(source.id)}>
                  {source.shortName}
                </Chip>
              ))}
            </div>

            {visibleGroups.map((group) => {
              const source = sourceById[group.sourceId];
              if (group.items.length === 0) {
                return (
                  <div key={group.sourceId} className="mx-4 my-3 rounded-3xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--outline)' }}>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        name={source.id === 'ytm' ? 'youtube' : source.id === 'spotify' ? 'spotify' : 'soundcloud'}
                        size={17}
                        style={{ color: 'var(--on-surface-3)' }}
                      />
                      <span className="text-[14px] font-semibold">{source.name}</span>
                      <Badge tone="neutral">{t('accounts.notConnected')}</Badge>
                    </div>
                    <p className="caption mt-2">{source.note}</p>
                    <button type="button" className="btn btn-tonal mt-3 w-full" onClick={() => push('accounts')}>
                      {t('action.connect')}
                    </button>
                  </div>
                );
              }

              const trackIds = group.items.map((item) => item.trackId);
              return (
                <section key={group.sourceId} className="mt-4">
                  <div className="mb-1 flex items-center gap-2 px-5">
                    <Icon
                      name={source.id === 'local' ? 'device' : source.id === 'ytm' ? 'youtube' : source.id === 'spotify' ? 'spotify' : 'soundcloud'}
                      size={14}
                      style={{ color: 'var(--on-surface-3)' }}
                    />
                    <h3 className="overline">{source.name}</h3>
                    {source.unofficial && <Badge tone="warning">unofficial</Badge>}
                    {!source.capabilities.canDownload && <Badge tone="neutral">no downloads</Badge>}
                  </div>
                  {trackIds.map((id) => {
                    const track = trackById[id];
                    if (!track) return null;
                    return <TrackRow key={id} track={track} queue={trackIds} active={player.currentTrack?.id === id} isPlaying={player.currentTrack?.id === id && player.isPlaying} />;
                  })}
                </section>
              );
            })}

            {visibleGroups.every((group) => group.items.length === 0) && (
              <EmptyState
                icon="search"
                title={t('search.noResults.title')}
                body={t('search.noResults.body')}
                action={
                  <button type="button" className="btn btn-filled" onClick={() => submit('')}>
                    {t('action.retry')}
                  </button>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

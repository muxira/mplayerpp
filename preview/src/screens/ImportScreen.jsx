import { useEffect, useState } from 'react';
import { TopBar } from '../components/TopBar.jsx';
import { Icon } from '../components/Icons.jsx';
import { CoverMosaic } from '../components/CoverArt.jsx';
import { Badge } from '../components/Controls.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { importCandidates, sourceById, sources } from '../data/mockData.js';
import { formatCount, formatLongMinutes } from '../lib/format.js';

const sourceIcon = { ytm: 'youtube', spotify: 'spotify', soundcloud: 'soundcloud' };

const STEPS = ['service', 'select', 'done'];

/**
 * Playlist import flow, including system playlists that cannot be deleted in
 * their original service (for example YouTube Music "Liked music").
 * Imported copies become ordinary, deletable playlists and keep an origin link.
 */
export function ImportScreen({ sourceId }) {
  const { t } = useI18n();
  const { pop, push } = useNav();
  const [step, setStep] = useState(sourceId ? 'select' : 'service');
  const [chosenSource, setChosenSource] = useState(sourceId ?? null);
  const [selected, setSelected] = useState(() => new Set());
  const [importing, setImporting] = useState(false);
  const [finished, setFinished] = useState(false);

  const importable = sources.filter((s) => s.connected && s.capabilities.canImportPlaylists);
  const candidates = chosenSource ? importCandidates.filter((c) => c.sourceId === chosenSource) : [];
  const available = candidates.filter((c) => !c.imported);

  useEffect(() => {
    if (!importing) return undefined;
    const timer = setTimeout(() => {
      setImporting(false);
      setFinished(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, [importing]);

  const toggle = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedItems = available.filter((c) => selected.has(c.id));

  return (
    <div className="screen">
      <TopBar
        large={step === 'service'}
        title={step === 'service' ? t('import.title') : chosenSource ? sourceById[chosenSource].name : t('import.title')}
        subtitle={step === 'service' ? t('import.subtitle') : undefined}
        onBack={step === 'service' ? pop : () => { setStep('service'); setChosenSource(null); setSelected(new Set()); }}
      />

      <div className="px-5 pb-2">
        <div className="flex items-center gap-2">
          {STEPS.map((s, index) => {
            const currentIndex = STEPS.indexOf(finished ? 'done' : step);
            const done = index < currentIndex;
            const active = index === currentIndex;
            return (
              <div key={s} className="flex flex-1 items-center gap-2">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: active || done ? 'var(--accent)' : 'var(--surface-3)',
                    color: active || done ? 'var(--on-accent)' : 'var(--on-surface-3)',
                  }}
                >
                  {done ? <Icon name="check" size={12} strokeWidth={3} /> : index + 1}
                </span>
                {index < STEPS.length - 1 && (
                  <span className="h-[2px] flex-1 rounded-full" style={{ background: done ? 'var(--accent)' : 'var(--surface-3)' }} />
                )}
              </div>
            );
          })}
        </div>
        <p className="caption mt-2.5">
          {t(step === 'service' ? 'import.step.pick' : step === 'select' ? 'import.step.choose' : 'import.step.done')}
        </p>
      </div>

      <div className="scroll-area px-4 pb-8 pt-2">
        {step === 'service' &&
          (importable.length === 0 ? (
            <EmptyState
              icon="link"
              title={t('import.empty.title')}
              body={t('import.empty.body')}
              action={
                <button type="button" className="btn btn-filled" onClick={() => push('accounts')}>
                  {t('accounts.title')}
                </button>
              }
            />
          ) : (
            importable.map((source) => {
              const count = importCandidates.filter((c) => c.sourceId === source.id && !c.imported).length;
              return (
                <button
                  key={source.id}
                  type="button"
                  className="card mb-2.5 flex w-full items-center gap-3 p-4 text-left transition-transform duration-200 ease-emphasized active:scale-[0.99]"
                  onClick={() => {
                    setChosenSource(source.id);
                    setStep('select');
                  }}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    <Icon name={sourceIcon[source.id]} size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold">{source.name}</span>
                    <span className="caption mt-0.5 block">
                      {count > 0 ? t('accounts.playlistsAvailable', { count }) : t('import.empty.title')}
                    </span>
                  </span>
                  <Icon name="chevronRight" size={18} style={{ color: 'var(--on-surface-3)' }} />
                </button>
              );
            })
          ))}

        {step === 'select' && (
          <>
            {candidates.some((c) => c.system) && (
              <div className="mb-3 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--accent-soft)' }}>
                <Icon name="info" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--accent)' }}>
                  {t('import.systemNote', { service: sourceById[chosenSource]?.name ?? '' })}
                </p>
              </div>
            )}

            <div className="mb-3 flex items-center justify-between">
              <button type="button" className="caption font-semibold" style={{ color: 'var(--accent)' }} onClick={() => setSelected(new Set(available.map((c) => c.id)))}>
                {t('import.selectAll')}
              </button>
              <span className="caption">{t('import.selected', { count: selected.size })}</span>
            </div>

            {candidates.map((candidate) => {
              const isImported = candidate.imported;
              const isSelected = selected.has(candidate.id);
              return (
                <button
                  key={candidate.id}
                  type="button"
                  disabled={isImported}
                  onClick={() => toggle(candidate.id)}
                  className="mb-2 flex w-full items-center gap-3 rounded-3xl p-3.5 text-left transition-colors"
                  style={{
                    background: 'var(--surface-2)',
                    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--outline)'}`,
                    opacity: isImported ? 0.55 : 1,
                  }}
                >
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
                  <CoverMosaic coverIds={candidate.coverIds} size={48} rounded={14} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-medium">{candidate.name}</span>
                      {candidate.system && <Badge tone="accent">{t('import.systemBadge')}</Badge>}
                    </span>
                    <span className="caption mt-0.5 block">
                      {isImported ? t('import.alreadyImported') : t('import.tracksCount', { count: formatCount(candidate.trackCount), minutes: formatLongMinutes(candidate.minutes) })}
                    </span>
                  </span>
                </button>
              );
            })}

            {available.length === 0 && (
              <EmptyState icon="check" title={t('import.empty.title')} body={t('import.empty.body')} />
            )}
          </>
        )}

        {step === 'done' && (
          <EmptyState
            icon={importing ? 'refresh' : 'check'}
            title={importing ? t('import.progress', { name: selectedItems[0]?.name ?? '' }) : t('import.success', { count: selectedItems.length })}
            body={importing ? t('import.progressBody') : t('import.doneBody')}
            action={
              importing ? (
                <span className="mx-auto block h-1 w-40 overflow-hidden rounded-full" style={{ background: 'var(--surface-3)' }}>
                  <span className="block h-full w-1/2 animate-pulse rounded-full" style={{ background: 'var(--accent)' }} />
                </span>
              ) : (
                <button type="button" className="btn btn-filled" onClick={pop}>
                  {t('action.done')}
                </button>
              )
            }
          />
        )}
      </div>

      {step === 'select' && available.length > 0 && (
        <div className="shrink-0 px-5 pb-5 pt-2" style={{ borderTop: '1px solid var(--outline)' }}>
          <button
            type="button"
            className="btn btn-filled w-full"
            disabled={selected.size === 0}
            style={{ opacity: selected.size === 0 ? 0.4 : 1 }}
            onClick={() => {
              setStep('done');
              setImporting(true);
            }}
          >
            {t('import.start', { count: selected.size })}
          </button>
        </div>
      )}
    </div>
  );
}

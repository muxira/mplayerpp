import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../../components/Icons.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { Badge } from '../../components/Controls.jsx';
import { Sheet } from '../../components/Sheet.jsx';
import { useI18n } from '../../i18n/I18nProvider.jsx';
import { usePlayer } from '../../state/PlayerProvider.jsx';
import { useDemo } from '../../state/DemoProvider.jsx';
import { lyricsByTrack } from '../../data/mockData.js';

/** Simulated lookup latency across the provider chain. */
const SEARCH_MS = 1400;

function activeLineIndex(result, positionSec) {
  if (!result?.synced || !Array.isArray(result.lines)) return -1;
  let found = -1;
  result.lines.forEach((line, index) => {
    if (positionSec >= (line.atSec ?? 0)) found = index;
  });
  return found;
}

/**
 * Lyrics tab.
 *
 * Behaviour modelled here: results are fetched automatically when a track is
 * added or opened, ranked by confidence, cached locally, synced lines highlight
 * in time with playback, and the user can re-run the search or pick a different
 * provider result.
 */
export function LyricsTab() {
  const { t } = useI18n();
  const player = usePlayer();
  const { online } = useDemo();
  const track = player.currentTrack;

  const results = useMemo(() => (track ? lyricsByTrack[track.id] ?? [] : []), [track?.id]);
  const [status, setStatus] = useState('idle'); // idle | searching | done
  const [selected, setSelected] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const scrollRef = useRef(null);
  const lineRefs = useRef([]);

  const runSearch = () => {
    setStatus('searching');
    setSelected(0);
  };

  useEffect(() => {
    runSearch();
  }, [track?.id]);

  useEffect(() => {
    if (status !== 'searching') return undefined;
    const timer = setTimeout(() => setStatus('done'), SEARCH_MS);
    return () => clearTimeout(timer);
  }, [status]);

  const result = results[Math.min(selected, results.length - 1)];
  const active = activeLineIndex(result, player.positionSec);

  // Keep the active synced line in view.
  useEffect(() => {
    if (!result?.synced || active < 0 || !scrollRef.current) return;
    const node = lineRefs.current[active];
    if (!node) return;
    const parent = scrollRef.current;
    const target = node.offsetTop - parent.clientHeight / 2 + node.clientHeight / 2;
    parent.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }, [active, result?.synced]);

  if (!track) return null;

  if (status === 'searching') {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          <Icon name="quote" size={24} />
        </span>
        <p className="h3">{t('lyrics.loading')}</p>
        <p className="body mt-1.5 max-w-[30ch]">{t('lyrics.loadingBody')}</p>
        <div className="mt-5 flex gap-2">
          {['LRCLIB', 'Musixmatch', 'Genius'].map((provider, index) => (
            <span
              key={provider}
              className="badge animate-pulse"
              style={{ background: 'var(--surface-2)', color: 'var(--on-surface-3)', animationDelay: `${index * 180}ms` }}
            >
              {provider}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div ref={scrollRef} className="scroll-area min-h-0 flex-1">
        <EmptyState
          icon="quote"
          title={t('lyrics.none.title')}
          body={t('lyrics.none.body', { title: track.title, artist: track.artist ?? 'an unknown artist' })}
          action={
            <div className="flex flex-col items-center gap-3">
              <button type="button" className="btn btn-filled" onClick={runSearch}>
                <Icon name="refresh" size={16} />
                {t('lyrics.searchAgain')}
              </button>
              {!online && <span className="caption">{t('search.offline.title')}</span>}
            </div>
          }
        />
        <p className="caption px-8 pb-8 text-center">{t('lyrics.legalNote')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 px-6 pb-2 pt-1">
        <Badge tone="accent">{result.provider}</Badge>
        <Badge tone="neutral">{result.synced ? t('lyrics.synced') : t('lyrics.unsynced')}</Badge>
        <span className="caption">{t('lyrics.confidence', { percent: result.confidence })}</span>
        <span className="ml-auto flex items-center gap-1">
          <Icon name="cache" size={12} style={{ color: 'var(--on-surface-3)' }} />
          <span className="caption">{t('lyrics.cached')}</span>
        </span>
      </div>

      {result.instrumental && result.lines.length === 0 ? (
        <EmptyState icon="music" title={t('lyrics.instrumental.title')} body={t('lyrics.instrumental.body')} />
      ) : (
        <div ref={scrollRef} className="scroll-area min-h-0 flex-1 px-6">
          <div className="py-3">
            {result.lines.map((line, index) => {
              const isActive = result.synced && index === active;
              const isPast = result.synced && index < active;
              return (
                <p
                  key={line.id ?? `${result.id}-${index}`}
                  ref={(node) => {
                    lineRefs.current[index] = node;
                  }}
                  className="py-1.5 text-[17px] leading-[1.45] transition-all duration-300"
                  style={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--accent)' : isPast ? 'var(--on-surface-3)' : 'var(--on-surface)',
                    opacity: result.synced && !isActive ? 0.55 : 1,
                    letterSpacing: isActive ? '-0.01em' : undefined,
                  }}
                >
                  {line.text}
                </p>
              );
            })}
          </div>

          {result.truncated && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--surface-2)' }}>
              <Icon name="info" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--on-surface-3)' }} />
              <p className="caption" style={{ color: 'var(--on-surface-2)' }}>
                {t('lyrics.truncatedNote')}
              </p>
            </div>
          )}

          {result.scraped && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--warning-soft)' }}>
              <Icon name="warning" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--warning)' }} />
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--warning)' }}>
                {t('lyrics.scrapedNote')}
              </p>
            </div>
          )}

          <p className="caption pb-6">{t('lyrics.legalNote')}</p>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2 px-6 pb-3 pt-1">
        <button type="button" className="btn btn-quiet flex-1" onClick={runSearch}>
          <Icon name="refresh" size={16} />
          {t('lyrics.searchAgain')}
        </button>
        <button type="button" className="btn btn-tonal flex-1" onClick={() => setPickerOpen(true)}>
          {t('lyrics.pickAnother')}
        </button>
      </div>

      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} title={t('lyrics.pickAnother')}>
        <div className="pb-2">
          {results.map((candidate, index) => (
            <button
              key={candidate.id}
              type="button"
              className="row w-full"
              onClick={() => {
                setSelected(index);
                setPickerOpen(false);
              }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: index === selected ? 'var(--accent)' : 'var(--surface-3)', color: index === selected ? 'var(--on-accent)' : 'var(--on-surface-2)' }}
              >
                <Icon name="quote" size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-medium">{candidate.provider}</span>
                  {candidate.scraped && <Badge tone="warning">{t('common.unofficial')}</Badge>}
                </span>
                <span className="caption mt-0.5 block">
                  {candidate.synced ? t('lyrics.synced') : t('lyrics.unsynced')} · {candidate.lines.length} lines ·{' '}
                  {t('lyrics.confidence', { percent: candidate.confidence })}
                </span>
              </span>
              {index === selected && <Icon name="check" size={18} style={{ color: 'var(--accent)' }} />}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

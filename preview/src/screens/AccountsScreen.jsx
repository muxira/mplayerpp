import { useState } from 'react';
import { TopBar } from '../components/TopBar.jsx';
import { Icon } from '../components/Icons.jsx';
import { Badge, Toggle } from '../components/Controls.jsx';
import { ConfirmDialog } from '../components/Sheet.jsx';
import { CoverMosaic } from '../components/CoverArt.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { useSettings } from '../state/SettingsProvider.jsx';
import { importCandidates, sources } from '../data/mockData.js';
import { formatCount, formatLongMinutes } from '../lib/format.js';

const sourceIcon = { local: 'device', ytm: 'youtube', spotify: 'spotify', soundcloud: 'soundcloud' };

function CapabilityLine({ ok, label }) {
  return (
    <span className="flex items-center gap-1.5 text-[13px]" style={{ color: ok ? 'var(--on-surface-2)' : 'var(--on-surface-3)' }}>
      <Icon name={ok ? 'check' : 'close'} size={13} style={{ color: ok ? 'var(--accent)' : 'var(--on-surface-3)' }} />
      <span className={ok ? '' : 'line-through decoration-1'}>{label}</span>
    </span>
  );
}

/**
 * Settings > Accounts: connection state per service, what each service can
 * actually do here, and the explicit opt-in for unofficial access.
 */
export function AccountsScreen() {
  const { t } = useI18n();
  const { pop, push } = useNav();
  const { settings, toggleUnofficialAccess } = useSettings();
  const [expanded, setExpanded] = useState('ytm');
  const [pendingDisconnect, setPendingDisconnect] = useState(null);
  const [connectionOverrides, setConnectionOverrides] = useState({});

  const isConnected = (source) => connectionOverrides[source.id] ?? source.connected;

  const toggleConnection = (source) => {
    setConnectionOverrides((current) => ({ ...current, [source.id]: !isConnected(source) }));
  };

  return (
    <div className="screen">
      <TopBar large title={t('accounts.title')} subtitle={t('accounts.subtitle')} onBack={pop} />

      <div className="scroll-area pb-8">
        <div className="px-4">
          {sources.map((source) => {
            const connected = isConnected(source);
            const open = expanded === source.id;
            const unofficialAllowed = settings.unofficialAccess[source.id] ?? false;
            const candidates = importCandidates.filter((c) => c.sourceId === source.id);

            return (
              <div key={source.id} className="card mb-3 overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 p-4 text-left"
                  onClick={() => setExpanded(open ? null : source.id)}
                  aria-expanded={open}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: connected ? 'var(--accent-soft)' : 'var(--surface-3)', color: connected ? 'var(--accent)' : 'var(--on-surface-3)' }}
                  >
                    <Icon name={sourceIcon[source.id]} size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-semibold">{source.name}</span>
                      {source.requiresPremium && connected && <Badge tone="accent">{t('common.premium')}</Badge>}
                      {source.unofficial && <Badge tone="warning">{t('common.unofficial')}</Badge>}
                    </span>
                    <span className="caption mt-0.5 block truncate">
                      {connected
                        ? source.accountLabel
                          ? t('accounts.connectedAs', { email: source.accountLabel })
                          : t('accounts.connected')
                        : t('accounts.notConnected')}
                    </span>
                  </span>
                  <Icon name={open ? 'chevronDown' : 'chevronRight'} size={18} style={{ color: 'var(--on-surface-3)' }} />
                </button>

                {open && (
                  <div className="animate-rise-in border-t px-4 pb-4 pt-3.5" style={{ borderColor: 'var(--outline)' }}>
                    <p className="overline mb-2.5">{t('accounts.capabilities')}</p>
                    <div className="mb-3.5 grid grid-cols-1 gap-1.5">
                      <CapabilityLine ok={source.capabilities.canStream} label={source.capabilities.canStream ? t('accounts.canStream') : t('accounts.cannotStream')} />
                      <CapabilityLine ok={source.capabilities.canDownload} label={source.capabilities.canDownload ? t('accounts.canDownload') : t('accounts.cannotDownload')} />
                      <CapabilityLine
                        ok={source.capabilities.canImportPlaylists}
                        label={source.capabilities.canImportPlaylists ? t('accounts.canImport') : t('accounts.cannotImport')}
                      />
                    </div>

                    <p className="caption mb-3.5">{source.note}</p>

                    {source.kind === 'service' && (
                      <div className="mb-3.5 rounded-2xl p-3.5" style={{ background: 'var(--surface-3)' }}>
                        <div className="flex items-start gap-2.5">
                          <Icon name="warning" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--warning)' }} />
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold">{t('accounts.risk.title')}</p>
                            <p className="caption mt-1" style={{ color: 'var(--on-surface-2)' }}>
                              {t('accounts.risk.body')}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[13px] font-medium">{t('accounts.risk.toggle')}</span>
                          <Toggle checked={unofficialAllowed} onChange={() => toggleUnofficialAccess(source.id)} label={t('accounts.risk.toggle')} />
                        </div>
                      </div>
                    )}

                    {connected && candidates.length > 0 && (
                      <button type="button" className="row mb-2 rounded-2xl" style={{ background: 'var(--surface-3)' }} onClick={() => push('import', { sourceId: source.id })}>
                        <CoverMosaic coverIds={candidates[0].coverIds} size={40} rounded={12} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-medium">{t('import.title')}</span>
                          <span className="caption block">
                            {t('accounts.playlistsAvailable', { count: candidates.filter((c) => !c.imported).length })} ·{' '}
                            {formatCount(candidates.reduce((sum, c) => sum + c.trackCount, 0))} tracks
                          </span>
                        </span>
                        <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
                      </button>
                    )}

                    {connected && source.accountLabel && (
                      <p className="caption mb-2">
                        {t('accounts.syncedAgo', {
                          time: t('accounts.minutesAgo', { count: 4 }),
                          size: formatLongMinutes(candidates.reduce((sum, c) => sum + c.minutes, 0)),
                          count: candidates.length,
                        })}
                      </p>
                    )}

                    {source.kind === 'service' && (
                      <button
                        type="button"
                        className={`btn w-full mt-1 ${connected ? 'btn-danger' : 'btn-filled'}`}
                        onClick={() => (connected ? setPendingDisconnect(source) : toggleConnection(source))}
                      >
                        {connected ? t('action.disconnect') : t('action.connect')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="caption mt-2 px-6 text-center">{t('accounts.credentialsNote')}</p>
      </div>

      <ConfirmDialog
        open={pendingDisconnect !== null}
        title={t('accounts.disconnectConfirmTitle', { service: pendingDisconnect?.name ?? '' })}
        body={t('accounts.disconnectConfirmBody')}
        cancelLabel={t('action.cancel')}
        confirmLabel={t('action.disconnect')}
        onCancel={() => setPendingDisconnect(null)}
        onConfirm={() => {
          if (pendingDisconnect) toggleConnection(pendingDisconnect);
          setPendingDisconnect(null);
        }}
      />
    </div>
  );
}

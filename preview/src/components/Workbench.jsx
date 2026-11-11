import { useEffect, useState } from 'react';
import { PhoneFrame } from './PhoneFrame.jsx';
import { MiniPlayer } from './MiniPlayer.jsx';
import { BottomNav } from './BottomNav.jsx';
import { Icon } from './Icons.jsx';
import { Segmented, Chip } from './Controls.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';
import { useSettings } from '../state/SettingsProvider.jsx';
import { useDemo } from '../state/DemoProvider.jsx';
import { LibraryScreen } from '../screens/LibraryScreen.jsx';
import { PlaylistScreen } from '../screens/PlaylistScreen.jsx';
import { PlayerScreen } from '../screens/PlayerScreen.jsx';
import { SearchScreen } from '../screens/SearchScreen.jsx';
import { RecapScreen } from '../screens/RecapScreen.jsx';
import { SettingsScreen } from '../screens/SettingsScreen.jsx';
import { AccountsScreen } from '../screens/AccountsScreen.jsx';
import { ImportScreen } from '../screens/ImportScreen.jsx';
import { PlaylistEditScreen } from '../screens/PlaylistEditScreen.jsx';
import { SurfacesScreen } from '../screens/SurfacesScreen.jsx';
import { DuplicatesScreen } from '../screens/DuplicatesScreen.jsx';

/** Screens that hide the mini player and bottom navigation (they are full-bleed). */
const IMMERSIVE = new Set(['player', 'surfaces']);

const TAB_OF = {
  library: 'library',
  playlist: 'library',
  playlistEdit: 'library',
  duplicates: 'library',
  search: 'search',
  recap: 'recap',
  settings: 'settings',
  accounts: 'settings',
  import: 'settings',
  surfaces: 'settings',
};

/** Routes the current nav entry to a screen. Stands in for the Compose NavHost. */
function ScreenRouter() {
  const { current, push } = useNav();
  const { screen, params } = current;

  switch (screen) {
    case 'library':
      return <LibraryScreen />;
    case 'playlist':
      return <PlaylistScreen playlistId={params.playlistId} />;
    case 'playlistEdit':
      return <PlaylistEditScreen playlistId={params.playlistId} mode={params.mode} />;
    case 'player':
      return <PlayerScreen />;
    case 'search':
      return <SearchScreen />;
    case 'recap':
      return <RecapScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'accounts':
      return <AccountsScreen />;
    case 'import':
      return <ImportScreen sourceId={params.sourceId} />;
    case 'surfaces':
      return <SurfacesScreen />;
    case 'duplicates':
      return <DuplicatesScreen />;
    default:
      return <LibraryScreen />;
  }
}

/** The phone content: routed screen plus the persistent mini player and tabs. */
function DeviceContent() {
  const { current, resetTab, push } = useNav();
  const player = usePlayer();
  const immersive = IMMERSIVE.has(current.screen);
  const activeTab = TAB_OF[current.screen] ?? 'library';

  const selectTab = (tab) => {
    if (tab === current.screen) return;
    resetTab(tab);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ background: 'var(--surface)' }}>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div key={current.id} className="relative flex min-h-0 flex-1 flex-col animate-fade-in">
          <ScreenRouter />
        </div>
      </div>

      {!immersive && (
        <>
          {player.currentTrack && <MiniPlayer onExpand={() => push('player')} />}
          <BottomNav activeTab={activeTab} onSelect={selectTab} />
        </>
      )}
    </div>
  );
}

const railGroups = [
  {
    label: 'Tabs',
    items: [
      { label: 'Library', screen: 'library', root: true },
      { label: 'Search', screen: 'search', root: true },
      { label: 'Recap', screen: 'recap', root: true },
      { label: 'Settings', screen: 'settings', root: true },
    ],
  },
  {
    label: 'Detail screens',
    items: [
      { label: 'Playlist · All (built-in)', screen: 'playlist', params: { playlistId: 'pl-all' } },
      { label: 'Playlist · Favorites', screen: 'playlist', params: { playlistId: 'pl-favorites' } },
      { label: 'Playlist · custom', screen: 'playlist', params: { playlistId: 'pl-nightdrive' } },
      { label: 'Playlist · imported', screen: 'playlist', params: { playlistId: 'pl-imported-liked' } },
      { label: 'Full player', screen: 'player' },
      { label: 'Notification & lock screen', screen: 'surfaces' },
      { label: 'Duplicates', screen: 'duplicates' },
    ],
  },
  {
    label: 'Flows',
    items: [
      { label: 'Accounts', screen: 'accounts' },
      { label: 'Import playlists', screen: 'import' },
      { label: 'Create playlist', screen: 'playlistEdit', params: { mode: 'create' } },
      { label: 'Edit playlist', screen: 'playlistEdit', params: { playlistId: 'pl-focus' } },
    ],
  },
];

const demoStates = [
  { id: 'normal', label: 'Normal' },
  { id: 'noPermission', label: 'No permission' },
  { id: 'offline', label: 'Offline' },
  { id: 'empty', label: 'Empty library' },
];

/**
 * Reviewer chrome around the phone: screen jumps, theme switch and device-state
 * simulator. Hidden on narrow viewports, where the preview fills the screen.
 */
export function Workbench() {
  const { t } = useI18n();
  const { push, resetTab, current } = useNav();
  const { settings, setSetting, resolvedTheme } = useSettings();
  const { demoState, setDemoState } = useDemo();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const measure = () => setNarrow(window.innerWidth < 940);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const goTo = (item) => {
    if (item.root) resetTab(item.screen);
    else push(item.screen, item.params ?? {});
  };

  return (
    <div className="workbench flex min-h-screen w-full items-center justify-center gap-12 px-6 py-8">
      {!narrow && (
        <aside className="no-scrollbar h-[844px] max-h-[92vh] w-[310px] shrink-0 overflow-y-auto pr-1" data-theme="dark">
          <div className="mb-7">
            <div className="mb-1 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl" style={{ background: '#0f3d38', color: '#4fd8bd' }}>
                <Icon name="music" size={18} />
              </span>
              <h1 className="text-[19px] font-semibold tracking-tight text-white">MPlayer++</h1>
            </div>
            <p className="text-[12.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Design preview · mock data only. No playback, no network, no real accounts.
            </p>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.09em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {t('settings.theme')}
            </p>
            <div className="rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <Segmented
                ariaLabel={t('settings.theme')}
                value={settings.theme}
                onChange={(value) => setSetting('theme', value)}
                options={[
                  { id: 'light', label: t('settings.theme.light') },
                  { id: 'dark', label: t('settings.theme.dark') },
                  { id: 'system', label: t('settings.theme.system') },
                ]}
              />
            </div>
            <p className="mt-2 text-[11.5px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Currently rendering: {resolvedTheme}
            </p>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.09em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Device state
            </p>
            <div className="flex flex-wrap gap-1.5">
              {demoStates.map((state) => (
                <span key={state.id} className="rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <Chip active={demoState === state.id} onClick={() => setDemoState(state.id)}>
                    {state.label}
                  </Chip>
                </span>
              ))}
            </div>
          </div>

          {railGroups.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.09em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isCurrent = current.screen === item.screen && JSON.stringify(current.params ?? {}) === JSON.stringify(item.params ?? {});
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => goTo(item)}
                      className="rounded-xl px-3 py-2 text-left text-[13px] transition-colors"
                      style={{
                        background: isCurrent ? 'rgba(79,216,189,0.16)' : 'transparent',
                        color: isCurrent ? '#4fd8bd' : 'rgba(255,255,255,0.72)',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.32)' }}>
            Esc closes sheets and dialogs. The seek bar, scrubber, sliders and toggles are all interactive; everything
            else is mock state.
          </p>
        </aside>
      )}

      <PhoneFrame theme={resolvedTheme} fullBleed={narrow}>
        <DeviceContent />
      </PhoneFrame>
    </div>
  );
}

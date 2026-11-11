import { useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { coverOf } from '../components/CoverArt.jsx';
import { CoverTab } from './player/CoverTab.jsx';
import { LyricsTab } from './player/LyricsTab.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { usePlayer } from '../state/PlayerProvider.jsx';
import { useSettings } from '../state/SettingsProvider.jsx';
import { accentTokens } from '../lib/color.js';

/**
 * Full-screen player with two tabs.
 *
 * The accent colour is derived from the current cover art, which is what the
 * brief asks for on the player screen; the rest of the app keeps the single
 * brand accent.
 */
export function PlayerScreen() {
  const { t } = useI18n();
  const { pop } = useNav();
  const player = usePlayer();
  const { resolvedTheme } = useSettings();
  const [tab, setTab] = useState('cover');
  const [openSheet, setOpenSheet] = useState(null);

  const track = player.currentTrack;
  const cover = coverOf(track?.coverId);
  const tokens = accentTokens(cover.accent, resolvedTheme);

  return (
      <div className="screen relative" style={tokens}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 70% at 50% 0%, ${cover.via}33 0%, transparent 62%), linear-gradient(180deg, ${cover.from}22 0%, transparent 45%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-2 px-2 pb-1 pt-2">
          <button type="button" className="icon-btn" onClick={pop} aria-label={t('action.close')}>
            <Icon name="chevronDown" size={22} />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="overline truncate">{track ? track.album ?? '' : ''}</p>
          </div>
          <button type="button" className="icon-btn" onClick={() => setOpenSheet('more')} aria-label={t('player.more')}>
            <Icon name="more" size={20} />
          </button>
        </header>

        <div className="relative mx-6 mb-1 mt-1 flex gap-1 rounded-full p-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--outline)' }}>
          {[
            { id: 'cover', label: t('player.coverTab'), icon: 'music' },
            { id: 'lyrics', label: t('player.lyricsTab'), icon: 'quote' },
          ].map((option) => {
            const activeTab = option.id === tab;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={activeTab}
                onClick={() => setTab(option.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-[13px] font-semibold transition-colors duration-200"
                style={{
                  background: activeTab ? 'var(--accent)' : 'transparent',
                  color: activeTab ? 'var(--on-accent)' : 'var(--on-surface-2)',
                }}
              >
                <Icon name={option.icon} size={15} />
                {option.label}
              </button>
            );
          })}
        </div>

        {tab === 'cover' ? (
          <CoverTab openSheet={openSheet} onOpenSheet={setOpenSheet} onCloseSheet={() => setOpenSheet(null)} />
        ) : (
          <LyricsTab />
        )}
      </div>
    </div>
  );
}

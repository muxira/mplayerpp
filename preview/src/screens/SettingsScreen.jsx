import { useState } from 'react';
import { TopBar } from '../components/TopBar.jsx';
import { Icon } from '../components/Icons.jsx';
import { SettingRow, Slider, Segmented, Toggle, Chip } from '../components/Controls.jsx';
import { Sheet } from '../components/Sheet.jsx';
import { VolumeBoostControl } from '../components/VolumeBoostControl.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { useSettings } from '../state/SettingsProvider.jsx';
import { audioFocusOptions, equalizerBands, equalizerPresets, playbackSpeeds, sleepTimerOptions } from '../data/mockData.js';

const themeOptions = [
  { id: 'light', labelKey: 'settings.theme.light', icon: 'sun' },
  { id: 'dark', labelKey: 'settings.theme.dark', icon: 'moon' },
  { id: 'system', labelKey: 'settings.theme.system', icon: 'auto' },
];

/** Player settings: equalizer, crossfade, gapless, speed, focus, defaults,
 *  statistics threshold, theme, language and cache. */
export function SettingsScreen() {
  const { t } = useI18n();
  const { push } = useNav();
  const { settings, setSetting } = useSettings();
  const [sheet, setSheet] = useState(null);

  const activePreset = equalizerPresets.find(
    (preset) => preset.id === settings.equalizerPreset && preset.gains.join(',') === settings.equalizerGains.join(','),
  );

  return (
    <div className="screen">
      <TopBar large title={t('settings.title')} subtitle={t('app.tagline')} />

      <div className="scroll-area pb-8">
        {/* ------------------------------ Playback ------------------------------ */}
        <h2 className="overline mb-1.5 mt-1 px-5">{t('settings.playback')}</h2>
        <div className="card mx-4 mb-5 overflow-hidden">
          <SettingRow icon="equalizer" label={t('settings.equalizer')} hint={activePreset ? activePreset.name : t('settings.equalizer.custom')} onClick={() => setSheet('equalizer')}>
            <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
          </SettingRow>
          <div className="divider mx-4" />

          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-[15px] font-medium">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'var(--surface-3)' }}>
                  <Icon name="crossfade" size={18} />
                </span>
                {t('settings.crossfade')}
              </span>
              <span className="text-[14px] font-semibold tabular-nums" style={{ color: settings.crossfadeSec === 0 ? 'var(--on-surface-3)' : 'var(--accent)' }}>
                {settings.crossfadeSec === 0 ? t('settings.sleepTimer.off') : t('settings.crossfade.seconds', { count: settings.crossfadeSec })}
              </span>
            </div>
            <div className="mt-2 pl-12">
              <Slider value={settings.crossfadeSec} min={0} max={12} step={1} onChange={(v) => setSetting('crossfadeSec', v)} label={t('settings.crossfade')} />
            </div>
          </div>
          <div className="divider mx-4" />

          <SettingRow icon="gapless" label={t('settings.gapless')} hint={t('settings.gapless.hint')}>
            <Toggle checked={settings.gapless} onChange={(v) => setSetting('gapless', v)} label={t('settings.gapless')} />
          </SettingRow>
          <div className="divider mx-4" />

          <SettingRow icon="speed" label={t('settings.speed')} hint={`${settings.playbackSpeed}×`} onClick={() => setSheet('speed')}>
            <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
          </SettingRow>
          <div className="divider mx-4" />

          <SettingRow
            icon="sleep"
            label={t('settings.sleepTimer')}
            hint={
              settings.sleepTimerMin === 0
                ? t('settings.sleepTimer.off')
                : settings.sleepTimerMin === -1
                  ? t('settings.sleepTimer.endOfTrack')
                  : t('settings.sleepTimer.minutes', { count: settings.sleepTimerMin })
            }
            onClick={() => setSheet('sleep')}
          >
            <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
          </SettingRow>
          <div className="divider mx-4" />

          <SettingRow icon="focus" label={t('settings.audioFocus')} hint={t('settings.audioFocus.hint')}>
            <div className="w-[170px]">
              <Segmented
                ariaLabel={t('settings.audioFocus')}
                value={settings.audioFocus}
                onChange={(v) => setSetting('audioFocus', v)}
                options={audioFocusOptions.map((id) => ({ id, label: t(`settings.audioFocus.${id}`) }))}
              />
            </div>
          </SettingRow>
        </div>

        {/* ------------------------------ Defaults ------------------------------ */}
        <h2 className="overline mb-1.5 px-5">{t('settings.defaults')}</h2>
        <div className="card mx-4 mb-5 overflow-hidden">
          <SettingRow icon="repeat" label={t('settings.defaultRepeat')}>
            <div className="w-[190px]">
              <Segmented
                ariaLabel={t('settings.defaultRepeat')}
                value={settings.defaultRepeat}
                onChange={(v) => setSetting('defaultRepeat', v)}
                options={[
                  { id: 'off', label: t('player.repeatOff').replace('Repeat ', '') },
                  { id: 'all', label: t('player.repeatAll').replace('Repeat ', '') },
                  { id: 'one', label: t('player.repeatOne').replace('Repeat ', '') },
                ]}
              />
            </div>
          </SettingRow>
          <div className="divider mx-4" />
          <SettingRow icon="shuffle" label={t('settings.defaultShuffle')}>
            <Toggle checked={settings.defaultShuffle} onChange={(v) => setSetting('defaultShuffle', v)} label={t('settings.defaultShuffle')} />
          </SettingRow>
        </div>

        {/* --------------------------- Volume boost ---------------------------- */}
        <div className="mx-4 mb-5">
          <VolumeBoostControl value={settings.volumeBoost} onChange={(v) => setSetting('volumeBoost', v)} />
        </div>

        {/* --------------------------- Stats threshold -------------------------- */}
        <h2 className="overline mb-1.5 px-5">{t('settings.statsThreshold')}</h2>
        <div className="card mx-4 mb-5 p-4">
          <p className="caption mb-4">{t('settings.statsThreshold.hint')}</p>
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[14px] font-medium">{t('settings.statsThreshold.seconds', { count: settings.statsThresholdSec })}</span>
            </div>
            <Slider
              value={settings.statsThresholdSec}
              min={10}
              max={120}
              step={5}
              onChange={(v) => setSetting('statsThresholdSec', v)}
              label={t('settings.statsThreshold.seconds', { count: settings.statsThresholdSec })}
            />
          </div>
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[14px] font-medium">{t('settings.statsThreshold.percent', { count: settings.statsThresholdPercent })}</span>
            </div>
            <Slider
              value={settings.statsThresholdPercent}
              min={10}
              max={100}
              step={5}
              onChange={(v) => setSetting('statsThresholdPercent', v)}
              label={t('settings.statsThreshold.percent', { count: settings.statsThresholdPercent })}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl px-3.5 py-2.5" style={{ background: 'var(--surface-3)' }}>
            <span className="text-[13px] font-medium">{t('settings.statsThreshold.rule')}</span>
            <Toggle
              checked={settings.statsThresholdRule === 'either'}
              onChange={(v) => setSetting('statsThresholdRule', v ? 'either' : 'both')}
              label={t('settings.statsThreshold.rule')}
            />
          </div>
        </div>

        {/* ----------------------------- Appearance ----------------------------- */}
        <h2 className="overline mb-1.5 px-5">{t('settings.appearance')}</h2>
        <div className="card mx-4 mb-5 overflow-hidden">
          <div className="px-4 py-3">
            <span className="mb-2.5 flex items-center gap-3 text-[15px] font-medium">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'var(--surface-3)' }}>
                <Icon name="palette" size={18} />
              </span>
              {t('settings.theme')}
            </span>
            <div className="pl-12">
              <Segmented
                ariaLabel={t('settings.theme')}
                value={settings.theme}
                onChange={(v) => setSetting('theme', v)}
                options={themeOptions.map((option) => ({ id: option.id, label: t(option.labelKey) }))}
              />
            </div>
          </div>
          <div className="divider mx-4" />
          <SettingRow icon="globe" label={t('settings.language')} hint={t('settings.language.more')} onClick={() => setSheet('language')}>
            <span className="text-[14px] font-medium" style={{ color: 'var(--on-surface-2)' }}>
              {t('settings.language.en')}
            </span>
            <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
          </SettingRow>
        </div>

        {/* -------------------------------- Cache ------------------------------- */}
        <h2 className="overline mb-1.5 px-5">{t('settings.cache')}</h2>
        <div className="card mx-4 mb-5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[14px] font-medium">{t('settings.cache.size', { mb: settings.cacheSizeMb })}</span>
            <span className="caption tabular-nums">{t('settings.cache.used', { mb: 214 })}</span>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full" style={{ background: 'var(--surface-3)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (214 / settings.cacheSizeMb) * 100)}%`, background: 'var(--accent)' }} />
          </div>
          <Slider
            value={settings.cacheSizeMb}
            min={128}
            max={4096}
            step={128}
            onChange={(v) => setSetting('cacheSizeMb', v)}
            label={t('settings.cache')}
          />
          <button type="button" className="btn btn-quiet mt-3 w-full" onClick={() => setSetting('cacheSizeMb', settings.cacheSizeMb)}>
            {t('settings.cache.clear')}
          </button>
        </div>

        {/* ------------------------------- Sources ------------------------------ */}
        <div className="card mx-4 mb-5 overflow-hidden">
          <SettingRow icon="spotify" label={t('settings.accounts')} hint={t('accounts.subtitle')} onClick={() => push('accounts')}>
            <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
          </SettingRow>
          <div className="divider mx-4" />
          <SettingRow icon="bell" label={t('settings.surfaces')} hint={t('surface.subtitle')} onClick={() => push('surfaces')}>
            <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
          </SettingRow>
          <div className="divider mx-4" />
          <SettingRow icon="link" label={t('import.title')} hint={t('import.subtitle')} onClick={() => push('import')}>
            <Icon name="chevronRight" size={17} style={{ color: 'var(--on-surface-3)' }} />
          </SettingRow>
        </div>

        <p className="caption px-6 text-center">
          {t('app.name')} · {t('settings.about.build', { version: '0.1.0' })}
        </p>
      </div>

      {/* ------------------------------- Sheets ------------------------------- */}
      <Sheet open={sheet === 'equalizer'} onClose={() => setSheet(null)} title={t('settings.equalizer')}>
        <div className="p-4">
          <p className="overline mb-2.5">{t('settings.equalizer.presets')}</p>
          <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
            {equalizerPresets.map((preset) => (
              <Chip
                key={preset.id}
                active={settings.equalizerPreset === preset.id}
                onClick={() => {
                  setSetting('equalizerPreset', preset.id);
                  setSetting('equalizerGains', preset.gains);
                }}
              >
                {preset.name}
              </Chip>
            ))}
          </div>

          <div className="flex items-end justify-between gap-2">
            {equalizerBands.map((band, index) => (
              <div key={band.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="caption tabular-nums">{settings.equalizerGains[index] > 0 ? '+' : ''}{settings.equalizerGains[index]}</span>
                <div className="relative h-[130px] w-8">
                  <input
                    type="range"
                    className="slider eq-vertical"
                    min={-12}
                    max={12}
                    step={1}
                    value={settings.equalizerGains[index]}
                    aria-label={`${band.freq} gain`}
                    onChange={(event) => {
                      const gains = [...settings.equalizerGains];
                      gains[index] = Number(event.target.value);
                      setSetting('equalizerGains', gains);
                      setSetting('equalizerPreset', 'custom');
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 130,
                      height: 28,
                      transform: 'translate(-50%, -50%) rotate(-90deg)',
                      '--fill': `${((settings.equalizerGains[index] + 12) / 24) * 100}%`,
                    }}
                  />
                </div>
                <span className="caption text-[10px]">{band.freq}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-quiet mt-5 w-full"
            onClick={() => {
              setSetting('equalizerPreset', 'flat');
              setSetting('equalizerGains', [0, 0, 0, 0, 0]);
            }}
          >
            {t('settings.equalizer.reset')}
          </button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'speed'} onClose={() => setSheet(null)} title={t('settings.speed')}>
        <div className="grid grid-cols-3 gap-2 p-4">
          {playbackSpeeds.map((speed) => (
            <button
              key={speed}
              type="button"
              className="rounded-2xl py-3.5 text-[15px] font-semibold tabular-nums"
              style={{
                background: settings.playbackSpeed === speed ? 'var(--accent)' : 'var(--surface-2)',
                color: settings.playbackSpeed === speed ? 'var(--on-accent)' : 'var(--on-surface)',
                border: '1px solid var(--outline)',
              }}
              onClick={() => {
                setSetting('playbackSpeed', speed);
                setSheet(null);
              }}
            >
              {speed}×
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === 'sleep'} onClose={() => setSheet(null)} title={t('settings.sleepTimer')}>
        <div className="grid grid-cols-2 gap-2 p-4">
          {sleepTimerOptions.filter((minutes) => minutes >= 0).map((minutes) => (
            <button
              key={minutes}
              type="button"
              className="rounded-2xl py-3 text-[14px] font-medium"
              style={{
                background: settings.sleepTimerMin === minutes ? 'var(--accent)' : 'var(--surface-2)',
                color: settings.sleepTimerMin === minutes ? 'var(--on-accent)' : 'var(--on-surface)',
                border: '1px solid var(--outline)',
              }}
              onClick={() => {
                setSetting('sleepTimerMin', minutes);
                setSheet(null);
              }}
            >
              {minutes === 0 ? t('settings.sleepTimer.off') : t('settings.sleepTimer.minutes', { count: minutes })}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === 'language'} onClose={() => setSheet(null)} title={t('settings.language')}>
        <div className="p-2">
          <SettingRow icon="globe" label={t('settings.language.en')} hint="Default · en">
            <Icon name="check" size={18} style={{ color: 'var(--accent)' }} />
          </SettingRow>
          <p className="caption px-4 py-3">{t('settings.language.more')}</p>
        </div>
      </Sheet>
    </div>
  );
}

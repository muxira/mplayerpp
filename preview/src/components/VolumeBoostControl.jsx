import { useState } from 'react';
import { Icon } from './Icons.jsx';
import { Slider } from './Controls.jsx';
import { ConfirmDialog } from './Sheet.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';

const MAX_BOOST = 200;
const SAFE_BOOST = 100;

/**
 * Volume boost from 0% to 200%.
 *
 * On Android this drives a `LoudnessEnhancer` attached to the player's audio
 * session (gain in millibels), with a limiter to reduce clipping. Crossing 100%
 * always asks for confirmation, and the value is persisted as a user setting.
 * `unsupported` renders the state a device without the audio effect would show.
 */
export function VolumeBoostControl({ value, onChange, unsupported = false, compact = false }) {
  const { t } = useI18n();
  const [pending, setPending] = useState(null);

  const effective = unsupported ? Math.min(value, SAFE_BOOST) : value;
  const overLimit = effective > SAFE_BOOST;
  const fill = unsupported ? 'var(--on-surface-3)' : overLimit ? 'var(--warning)' : 'var(--accent)';

  const handleChange = (next) => {
    if (unsupported) return;
    if (next > SAFE_BOOST && value <= SAFE_BOOST) {
      setPending(next);
      return;
    }
    onChange(next);
  };

  return (
    <div className={compact ? '' : 'card p-5'}>
      {!compact && (
        <div className="mb-4 flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: overLimit ? 'var(--warning-soft)' : 'var(--accent-soft)', color: overLimit ? 'var(--warning)' : 'var(--accent)' }}
          >
            <Icon name="bolt" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="h3">{t('boost.title')}</h3>
            <p className="caption mt-0.5">{t('boost.hint')}</p>
          </div>
          <div className="text-right">
            <span
              className="text-[22px] font-semibold tabular-nums tracking-tight"
              style={{ color: overLimit ? 'var(--warning)' : 'var(--on-surface)' }}
            >
              {t('boost.value', { percent: effective })}
            </span>
            {effective === SAFE_BOOST && <span className="caption block">{t('boost.normal')}</span>}
          </div>
        </div>
      )}

      <Slider
        value={effective}
        min={0}
        max={MAX_BOOST}
        step={5}
        onChange={handleChange}
        label={t('boost.title')}
        trackFill={fill}
      />

      <div className="mt-1 flex items-center justify-between">
        <span className="caption tabular-nums">0%</span>
        <span className="caption tabular-nums" style={{ color: overLimit ? 'var(--warning)' : undefined }}>
          {SAFE_BOOST}%
        </span>
        <span className="caption tabular-nums">{MAX_BOOST}%</span>
      </div>

      {overLimit && !unsupported && (
        <div
          className="mt-4 flex items-start gap-2.5 rounded-2xl p-3.5 animate-rise-in"
          style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}
          role="status"
        >
          <Icon name="warning" size={17} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold">{t('boost.warning.title')}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed opacity-90">{t('boost.warning.body')}</p>
          </div>
        </div>
      )}

      {unsupported && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--surface-3)' }} role="status">
          <Icon name="info" size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--on-surface-3)' }} />
          <p className="caption" style={{ color: 'var(--on-surface-2)' }}>
            {t('boost.deviceUnsupported')}
          </p>
        </div>
      )}

      {!overLimit && !unsupported && (
        <p className="caption mt-4 flex items-center gap-1.5">
          <Icon name="check" size={13} style={{ color: 'var(--accent)' }} />
          {t('boost.limiter')}
        </p>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={t('boost.warning.title')}
        body={t('boost.warning.body')}
        cancelLabel={t('action.cancel')}
        confirmLabel={t('boost.warning.confirm', { percent: pending ?? SAFE_BOOST })}
        tone="warning"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          onChange(pending);
          setPending(null);
        }}
      />
    </div>
  );
}

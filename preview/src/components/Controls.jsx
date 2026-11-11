import { Icon } from './Icons.jsx';

/** Row with a label, optional hint and a right-hand control. */
export function SettingRow({ icon, label, hint, children, onClick, danger = false }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`row items-center ${onClick ? 'cursor-pointer' : ''}`}
      style={danger ? { color: 'var(--danger)' } : undefined}
      type={onClick ? 'button' : undefined}
    >
      {icon && (
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: danger ? 'var(--danger-soft)' : 'var(--surface-3)', color: 'inherit' }}
        >
          <Icon name={icon} size={18} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium" style={{ color: danger ? 'var(--danger)' : 'var(--on-surface)' }}>
          {label}
        </span>
        {hint && <span className="caption mt-0.5 block truncate">{hint}</span>}
      </span>
      {children}
    </Tag>
  );
}

/** Accessible switch. */
export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative shrink-0 rounded-full transition-colors duration-200"
      style={{
        width: 52,
        height: 32,
        background: checked ? 'var(--accent)' : 'var(--surface-3)',
        border: `1px solid ${checked ? 'transparent' : 'var(--outline-strong)'}`,
      }}
    >
      <span
        className="absolute rounded-full bg-white shadow transition-all duration-200 ease-emphasized"
        style={{
          top: 3,
          left: checked ? 23 : 3,
          width: checked ? 24 : 24,
          height: 24,
          background: checked ? '#fff' : 'var(--on-surface-3)',
        }}
      />
    </button>
  );
}

/**
 * Horizontal range control. `--fill` drives the gradient track and `--track-fill`
 * lets a caller recolour it (the volume boost slider turns warning-coloured
 * above 100%).
 */
export function Slider({ value, min, max, step = 1, onChange, label, trackFill }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      className="slider"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      onChange={(event) => onChange(Number(event.target.value))}
      style={{ '--fill': `${pct}%`, '--track-fill': trackFill || 'var(--accent)' }}
    />
  );
}

/** Material-style segmented control. */
export function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-1 rounded-full p-1"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--outline)' }}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className="flex-1 rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200"
            style={{
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'var(--on-accent)' : 'var(--on-surface-2)',
              minHeight: 36,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Chip({ active = false, onClick, children, icon }) {
  return (
    <button type="button" onClick={onClick} className={`chip ${active ? 'chip-on' : ''}`}>
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}

export function Badge({ tone = 'neutral', children }) {
  const tones = {
    neutral: { bg: 'var(--surface-3)', fg: 'var(--on-surface-2)' },
    accent: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
    warning: { bg: 'var(--warning-soft)', fg: 'var(--warning)' },
    danger: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  };
  const t = tones[tone] ?? tones.neutral;
  return (
    <span className="badge" style={{ background: t.bg, color: t.fg }}>
      {children}
    </span>
  );
}

/** Thin animated bars used while something is "playing". */
export function NowPlayingBars({ active = true, className = '' }) {
  return (
    <span className={`inline-flex h-3.5 items-end gap-[2px] ${className}`} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={active ? 'eq-bar w-[2px] rounded-full' : 'w-[2px] rounded-full'}
          style={{
            height: '100%',
            background: 'var(--accent)',
            animationDelay: `${i * 160}ms`,
            transform: active ? undefined : 'scaleY(0.35)',
          }}
        />
      ))}
    </span>
  );
}

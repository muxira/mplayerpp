import { Icon } from './Icons.jsx';

/** Consistent empty / error / permission state block. */
export function EmptyState({ icon = 'music', title, body, action, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: 'var(--surface-2)', fg: 'var(--on-surface-3)' },
    warning: { bg: 'var(--warning-soft)', fg: 'var(--warning)' },
    danger: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  };
  const t = tones[tone] ?? tones.neutral;
  return (
    <div className="flex flex-col items-center px-8 py-12 text-center animate-rise-in">
      <span
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl"
        style={{ background: t.bg, color: t.fg }}
      >
        <Icon name={icon} size={26} />
      </span>
      <h3 className="h3 mb-1.5">{title}</h3>
      {body && <p className="body max-w-[26ch]">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

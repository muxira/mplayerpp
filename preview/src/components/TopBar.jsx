import { Icon } from './Icons.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';

/**
 * Screen header. Either a large-title variant (library-style screens) or a
 * compact variant with a back button (detail screens).
 */
export function TopBar({ title, subtitle, onBack, actions, large = false, transparent = false, accent }) {
  const { t } = useI18n();
  return (
    <header
      className={`relative z-10 shrink-0 ${large ? 'px-5 pb-2 pt-3' : 'px-2 pb-2 pt-2'}`}
      style={transparent ? { background: 'transparent' } : undefined}
    >
      <div className="flex items-center gap-1">
        {onBack && (
          <button type="button" className="icon-btn" onClick={onBack} aria-label={t('action.back')}>
            <Icon name="back" size={22} style={{ color: accent }} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {large ? (
            <>
              {subtitle && <p className="caption mb-0.5 truncate">{subtitle}</p>}
              <h1 className="h1 truncate" style={accent ? { color: accent } : undefined}>
                {title}
              </h1>
            </>
          ) : (
            <h2 className="truncate px-2 text-[17px] font-semibold tracking-[-0.01em]" style={accent ? { color: accent } : undefined}>
              {title}
            </h2>
          )}
        </div>
        {actions?.map((action) => (
          <button
            key={action.key}
            type="button"
            className={`icon-btn ${action.active ? 'icon-btn-on' : ''}`}
            onClick={action.onClick}
            aria-label={action.label}
            aria-pressed={action.active}
            title={action.label}
          >
            <Icon name={action.icon} size={21} filled={action.filled} />
          </button>
        ))}
      </div>
    </header>
  );
}

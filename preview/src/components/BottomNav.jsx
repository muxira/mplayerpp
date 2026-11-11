import { Icon } from './Icons.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';

const tabs = [
  { id: 'library', icon: 'library', labelKey: 'nav.library' },
  { id: 'search', icon: 'search', labelKey: 'nav.search' },
  { id: 'recap', icon: 'recap', labelKey: 'nav.recap' },
  { id: 'settings', icon: 'settings', labelKey: 'nav.settings' },
];

/** Bottom navigation. `activeTab` is derived from the current nav entry. */
export function BottomNav({ activeTab, onSelect }) {
  const { t } = useI18n();
  return (
    <nav
      className="relative z-20 flex shrink-0 items-stretch justify-around px-2 pb-2 pt-1.5"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--outline)' }}
      aria-label={t('nav.primary')}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            aria-current={active ? 'page' : undefined}
            className="flex flex-1 flex-col items-center gap-1 py-1 transition-colors"
            style={{ minHeight: 52 }}
          >
            <span
              className="flex h-8 items-center justify-center rounded-full px-4 transition-all duration-300 ease-emphasized"
              style={{
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--on-surface-3)',
              }}
            >
              <Icon name={tab.icon} size={21} strokeWidth={active ? 2 : 1.7} />
            </span>
            <span
              className="text-[11px] font-medium transition-colors"
              style={{ color: active ? 'var(--on-surface)' : 'var(--on-surface-3)' }}
            >
              {t(tab.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

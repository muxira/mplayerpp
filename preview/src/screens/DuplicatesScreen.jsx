import { TopBar } from '../components/TopBar.jsx';
import { Icon } from '../components/Icons.jsx';
import { DuplicateRow } from './PlaylistScreen.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useNav } from '../state/NavProvider.jsx';
import { duplicateGroups } from '../data/mockData.js';

/**
 * Duplicate review. The "All" playlist collapses copies by a stable key
 * (title + artist + duration within a two second tolerance, upgraded to an
 * ISRC when metadata provides one); this screen shows what was collapsed.
 */
export function DuplicatesScreen() {
  const { t } = useI18n();
  const { pop } = useNav();

  return (
    <div className="screen">
      <TopBar large title={t('library.duplicates.title')} subtitle={t('app.tagline')} onBack={pop} />

      <div className="scroll-area pb-8">
        <div className="mx-4 mb-4 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--accent-soft)' }}>
          <Icon name="link" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--accent)' }}>
            {t('library.duplicates.body', { count: duplicateGroups.length })} {t('duplicates.note')}
          </p>
        </div>

        {duplicateGroups.length === 0 ? (
          <EmptyState icon="check" title={t('duplicates.none.title')} body={t('duplicates.none.body')} />
        ) : (
          <div className="card mx-4 overflow-hidden">
            {duplicateGroups.map((group, index) => (
              <div key={group[0].dedupKey}>
                {index > 0 && <div className="divider mx-4" />}
                <DuplicateRow group={group} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

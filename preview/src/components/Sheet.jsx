import { useEffect } from 'react';
import { Icon } from './Icons.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';

/** Bottom sheet with a scrim, grab handle and escape-to-close. */
export function Sheet({ open, onClose, title, children, footer }) {
  const { t } = useI18n();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label={t('action.close')}
        onClick={onClose}
        className="absolute inset-0 animate-fade-in cursor-default"
        style={{ background: 'rgba(0,0,0,0.45)' }}
      />
      <div
        className="relative animate-sheet-up overflow-hidden rounded-t-[28px]"
        style={{ background: 'var(--surface)', border: '1px solid var(--outline)', borderBottom: 'none' }}
      >
        <div className="flex justify-center pt-3">
          <span className="h-1 w-9 rounded-full" style={{ background: 'var(--outline-strong)' }} />
        </div>
        <div className="flex items-center gap-3 px-5 pb-1 pt-3">
          <h3 className="h2 min-w-0 flex-1 truncate">{title}</h3>
          <button type="button" className="icon-btn h-9 w-9" onClick={onClose} aria-label={t('action.close')}>
            <Icon name="close" size={19} />
          </button>
        </div>
        <div className="scroll-area max-h-[52vh] px-2 pb-2">{children}</div>
        {footer && (
          <div className="px-5 pb-6 pt-2" style={{ borderTop: '1px solid var(--outline)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Centred confirmation dialog. */
export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, tone = 'danger', onConfirm, onCancel }) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6" role="alertdialog" aria-modal="true">
      <button
        type="button"
        aria-label={t('action.close')}
        className="absolute inset-0 animate-fade-in cursor-default"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onCancel}
      />
      <div
        className="relative w-full animate-rise-in rounded-[28px] p-6"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--outline)' }}
      >
        <h3 className="h2 mb-2">{title}</h3>
        {body && <p className="body mb-6">{body}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-quiet" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={`btn ${tone === 'danger' ? 'btn-danger' : 'btn-filled'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

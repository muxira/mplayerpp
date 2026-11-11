import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import en from './en.js';

const I18nContext = createContext(null);

const dictionaries = { en };

/**
 * Minimal i18n layer: one active locale, flat key lookup, `{placeholder}`
 * interpolation. Mirrors how `stringResource(R.string.x, arg)` behaves on
 * Android so the preview and the app stay in sync.
 */
export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('en');

  const t = useCallback(
    (key, vars) => {
      const dict = dictionaries[locale] ?? en;
      let text = dict[key] ?? en[key];
      if (text === undefined) return key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [locale],
  );

  const value = useMemo(() => ({ t, locale, setLocale }), [t, locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

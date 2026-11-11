import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultSettings } from '../data/mockData.js';

const SettingsContext = createContext(null);

function prefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Owns every persisted user preference (DataStore on Android) and resolves the
 * effective theme from the "light / dark / system" setting.
 */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [systemDark, setSystemDark] = useState(prefersDark);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme = settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme;

  const setSetting = useCallback((key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  }, []);

  const toggleUnofficialAccess = useCallback((sourceId) => {
    setSettings((current) => ({
      ...current,
      unofficialAccess: {
        ...current.unofficialAccess,
        [sourceId]: !current.unofficialAccess[sourceId],
      },
    }));
  }, []);

  const value = useMemo(
    () => ({ settings, setSetting, toggleUnofficialAccess, resolvedTheme }),
    [settings, setSetting, toggleUnofficialAccess, resolvedTheme],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

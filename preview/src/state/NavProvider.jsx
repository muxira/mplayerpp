import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const NavContext = createContext(null);

let entrySeq = 0;
const nextEntryId = () => {
  entrySeq += 1;
  return `nav-${entrySeq}`;
};

/**
 * Stack navigation that stands in for the Compose `NavHost` back stack.
 * `push` adds an entry, `pop` returns to the previous one, `resetTab` swaps the
 * root screen when a bottom-navigation tab is tapped.
 */
export function NavProvider({ initial, children }) {
  const [entries, setEntries] = useState(() => [
    { id: nextEntryId(), screen: initial.screen, params: initial.params },
  ]);

  const push = useCallback((screen, params = {}) => {
    setEntries((current) => [...current, { id: nextEntryId(), screen, params }]);
  }, []);

  const pop = useCallback(() => {
    setEntries((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);

  const resetTab = useCallback((screen, params = {}) => {
    setEntries([{ id: nextEntryId(), screen, params }]);
  }, []);

  const current = entries[entries.length - 1];

  const value = useMemo(
    () => ({ entries, current, push, pop, resetTab, canGoBack: entries.length > 1, depth: entries.length }),
    [entries, current, push, pop, resetTab],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used inside NavProvider');
  return ctx;
}

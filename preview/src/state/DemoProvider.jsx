import { createContext, useContext, useMemo, useState } from 'react';

const DemoContext = createContext(null);

/**
 * Reviewer-only switch used to inspect edge states without a device:
 * `normal`, `noPermission` (media permission denied), `offline`, `empty`
 * (brand-new library). The Android app reaches these states for real.
 */
export function DemoProvider({ children, initial = 'normal' }) {
  const [demoState, setDemoState] = useState(initial);
  const value = useMemo(
    () => ({
      demoState,
      setDemoState,
      hasPermission: demoState !== 'noPermission',
      online: demoState !== 'offline',
      isEmpty: demoState === 'empty',
    }),
    [demoState],
  );
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}

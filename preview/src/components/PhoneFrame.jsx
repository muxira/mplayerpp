import { Icon } from './Icons.jsx';
import { demoDevice } from '../data/mockData.js';

/** Fake Android status bar so the frame reads as a device. */
export function StatusBar({ accent }) {
  return (
    <div
      className="relative z-30 flex h-9 shrink-0 items-center justify-between px-6 pt-1 text-[12px] font-semibold"
      style={{ color: accent ?? 'var(--on-surface)' }}
      aria-hidden="true"
    >
      <span className="tabular-nums">{demoDevice.time}</span>
      <span className="flex items-center gap-1.5">
        <Icon name="wifi" size={13} strokeWidth={2} />
        <span className="relative flex h-3 w-5 items-center rounded-[3px] border border-current px-[1px]">
          <span className="h-[6px] rounded-[1px] bg-current" style={{ width: `${demoDevice.battery * 0.16}px` }} />
        </span>
      </span>
    </div>
  );
}

/**
 * Phone-sized frame. On narrow viewports it fills the screen; on wide ones it
 * floats in the workbench and the reviewer rail sits beside it.
 */
export function PhoneFrame({ children, theme, fullBleed = false, statusBarAccent }) {
  return (
    <div
      data-theme={theme}
      className={
        fullBleed
          ? 'relative h-[100dvh] w-full overflow-hidden'
          : 'relative h-[844px] max-h-[92vh] w-[390px] overflow-hidden rounded-[46px] p-[10px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]'
      }
      style={
        fullBleed
          ? { background: 'var(--surface)' }
          : {
              background: 'linear-gradient(160deg, #3a3f44 0%, #14181a 40%, #2b3034 100%)',
            }
      }
    >
      <div
        className={fullBleed ? 'relative h-full w-full overflow-hidden' : 'relative h-full w-full overflow-hidden rounded-[37px]'}
        style={{ background: 'var(--surface)' }}
      >
        <StatusBar accent={statusBarAccent} />
        {!fullBleed && (
          <span
            className="pointer-events-none absolute left-1/2 top-2.5 z-40 h-6 w-24 -translate-x-1/2 rounded-full"
            style={{ background: '#0b0d0e' }}
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    </div>
  );
}

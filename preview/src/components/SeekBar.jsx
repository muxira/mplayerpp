import { useCallback, useRef, useState } from 'react';
import { formatDuration } from '../lib/format.js';

/**
 * Pointer-driven progress bar. Works with mouse and touch, snaps the thumb while
 * dragging and reports a 0..1 fraction on release.
 *
 * `compact` renders the hairline variant used by the mini player.
 */
export function SeekBar({
  progress = 0,
  positionSec = 0,
  durationSec = 0,
  onSeekFraction,
  compact = false,
  showTimes = true,
  label = 'Seek',
  disabled = false,
}) {
  const trackRef = useRef(null);
  const [dragFraction, setDragFraction] = useState(null);

  const shown = disabled ? 0 : dragFraction ?? progress;
  const shownPosition = disabled ? 0 : dragFraction != null ? dragFraction * durationSec : positionSec;

  const fractionFromEvent = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }, []);

  const handleDown = (event) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragFraction(fractionFromEvent(event.clientX));
  };

  const handleMove = (event) => {
    if (disabled || dragFraction == null) return;
    setDragFraction(fractionFromEvent(event.clientX));
  };

  const handleUp = () => {
    if (disabled || dragFraction == null) return;
    onSeekFraction?.(dragFraction);
    setDragFraction(null);
  };

  if (compact) {
    return (
      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.round(durationSec)}
        aria-valuenow={Math.round(shownPosition)}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        className="relative h-1 w-full cursor-pointer overflow-hidden"
        style={{ background: 'var(--outline)' }}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${shown * 100}%`, background: 'var(--accent)', transition: dragFraction == null ? 'width 900ms linear' : 'none' }}
        />
      </div>
    );
  }

  return (
    <div className="w-full select-none">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.round(durationSec)}
        aria-valuenow={Math.round(shownPosition)}
        aria-valuetext={`${formatDuration(shownPosition)} of ${formatDuration(durationSec)}`}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === 'ArrowRight') onSeekFraction?.(Math.min(1, progress + 0.05));
          if (event.key === 'ArrowLeft') onSeekFraction?.(Math.max(0, progress - 0.05));
        }}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        className="relative flex h-7 w-full cursor-pointer items-center"
      >
        <div className="relative h-[5px] w-full overflow-hidden rounded-full" style={{ background: 'var(--surface-3)' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${shown * 100}%`,
              background: 'var(--accent)',
              transition: dragFraction == null ? 'width 900ms linear' : 'none',
            }}
          />
        </div>
        {!disabled && (
          <span
            className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full shadow"
            style={{
              left: `${shown * 100}%`,
              background: 'var(--accent)',
              transition: dragFraction == null ? 'left 900ms linear' : 'none',
              transform: `translateX(-50%) scale(${dragFraction != null ? 1.35 : 1})`,
            }}
          />
        )}
      </div>
      {showTimes && (
        <div className="mt-1 flex items-center justify-between" style={{ fontVariantNumeric: 'tabular-nums' }}>
          <span className="caption">{formatDuration(shownPosition)}</span>
          <span className="caption">{durationSec > 0 ? `-${formatDuration(durationSec - shownPosition)}` : '--:--'}</span>
        </div>
      )}
    </div>
  );
}

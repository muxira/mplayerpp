/**
 * Inline SVG icon set (24x24, stroke-based, inherits `currentColor`).
 * On Android these map to vector drawables in `res/drawable`.
 */

const paths = {
  play: <path d="M8 5.2v13.6L19 12 8 5.2Z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="7" y="5" width="3.6" height="14" rx="1.4" fill="currentColor" stroke="none" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  next: (
    <>
      <path d="M6 5.4v13.2L16 12 6 5.4Z" fill="currentColor" stroke="none" />
      <rect x="17" y="5.4" width="2.4" height="13.2" rx="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  previous: (
    <>
      <path d="M18 5.4v13.2L8 12l10-6.6Z" fill="currentColor" stroke="none" />
      <rect x="4.6" y="5.4" width="2.4" height="13.2" rx="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  shuffle: (
    <>
      <path d="M3 7h2.8c1 0 1.9.5 2.5 1.3l5.7 7.4c.6.8 1.5 1.3 2.5 1.3H21" />
      <path d="M3 17h2.8c1 0 1.9-.5 2.5-1.3l1.4-1.8" />
      <path d="M14.4 9.3 15.8 7.5c.6-.8 1.5-1.3 2.5-1.3H21" />
      <path d="M18.4 3.6 21 6.2l-2.6 2.6" />
      <path d="M18.4 14.6 21 17.2l-2.6 2.6" />
    </>
  ),
  repeat: (
    <>
      <path d="M17 3.6 20.4 7 17 10.4" />
      <path d="M20.4 7H7.2A3.7 3.7 0 0 0 3.5 10.7v1.6" />
      <path d="M7 20.4 3.6 17 7 13.6" />
      <path d="M3.6 17h13.2a3.7 3.7 0 0 0 3.7-3.7v-1.6" />
    </>
  ),
  heart: <path d="M12 20.2 5 13.4a4.5 4.5 0 0 1 6.4-6.4l.6.6.6-.6a4.5 4.5 0 1 1 6.4 6.4Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.4" />
      <path d="M15.8 15.8 21 21" />
    </>
  ),
  library: (
    <>
      <rect x="3.4" y="3.4" width="7.2" height="7.2" rx="2.2" />
      <rect x="13.4" y="3.4" width="7.2" height="7.2" rx="2.2" />
      <rect x="3.4" y="13.4" width="7.2" height="7.2" rx="2.2" />
      <rect x="13.4" y="13.4" width="7.2" height="7.2" rx="2.2" />
    </>
  ),
  recap: <path d="M4.5 19.5v-5M9.5 19.5v-11M14.5 19.5v-7.5M19.5 19.5v-3.5" />,
  settings: (
    <>
      <path d="M3.5 7.5h10M18.5 7.5h2M3.5 16.5h2M10.5 16.5h10" />
      <circle cx="16" cy="7.5" r="2.6" />
      <circle cx="8" cy="16.5" r="2.6" />
    </>
  ),
  back: <path d="M15 4.5 7.5 12 15 19.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  more: (
    <>
      <circle cx="12" cy="5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.7" fill="currentColor" stroke="none" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  download: <path d="M12 3.5v11m0 0 4.2-4.2M12 14.5 7.8 10.3M4.5 19.5h15" />,
  check: <path d="M5 12.8 9.7 17.5 19 6.8" />,
  drag: (
    <>
      <circle cx="9" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  edit: <path d="M4 20h4L19.2 8.8a2.8 2.8 0 0 0-4-4L4 16v4Z" />,
  trash: <path d="M4.5 7h15M9.5 7V4.5h5V7M6.8 7l.9 13h8.6l.9-13" />,
  link: <path d="M10 13.8a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1 1M14 10.2a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1-1" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4.2" />
      <path d="M10.4 9.2v5.6L15 12l-4.6-2.8Z" fill="currentColor" stroke="none" />
    </>
  ),
  spotify: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7 9.4c3.2-.9 6.8-.5 9.6 1.1M7.7 12.6c2.6-.7 5.5-.4 7.8.9M8.4 15.6c2-.5 4.2-.3 6 .7" />
    </>
  ),
  soundcloud: (
    <>
      <path d="M4 16.5v-4M6.6 17.5v-6.4M9.2 17.5V9.6" />
      <path d="M11.8 17.5V8.4a4.4 4.4 0 0 1 8.4 1.6c1.3.3 2.3 1.4 2.3 2.9 0 2.5-1.8 4.6-4.3 4.6h-6.4Z" />
    </>
  ),
  device: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
      <path d="M10.5 5.5h3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.4 0 2-1 1.6-2-.5-1.3.4-2.5 1.8-2.5h1.4A3.7 3.7 0 0 0 20.5 12c0-4.7-3.8-8.5-8.5-8.5Z" />
      <circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="10" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  bolt: <path d="M13.4 2.5 5 13.2h5.2L9.8 21.5 18.6 10.4h-5.4l.2-7.9Z" />,
  volume: (
    <>
      <path d="M4 9.5h3L11.5 6v12L7 14.5H4v-5Z" />
      <path d="M15 9.4a3.6 3.6 0 0 1 0 5.2M17.6 6.8a7.2 7.2 0 0 1 0 10.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  moon: <path d="M20 14.4A8.4 8.4 0 0 1 9.6 4 8.5 8.5 0 1 0 20 14.4Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </>
  ),
  auto: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4" />
    </>
  ),
  bell: <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5ZM10 18.5a2 2 0 0 0 4 0" />,
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="3" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  car: (
    <>
      <path d="M3.5 15.5v-2l2-5.2A2 2 0 0 1 7.4 7h9.2a2 2 0 0 1 1.9 1.3l2 5.2v2" />
      <path d="M3.5 15.5h17v2.2h-3v-2.2M6.5 17.7h-3v-2.2" />
      <circle cx="7" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="13" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  quote: (
    <>
      <path d="M9.5 6.5C7 7.7 5.5 10 5.5 13v4.5h5V12h-3c0-2 0.6-3.4 2-4.2v-1.3Z" />
      <path d="M18 6.5c-2.5 1.2-4 3.5-4 6.5v4.5h5V12h-3c0-2 0.6-3.4 2-4.2v-1.3Z" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4 2.8 20h18.4L12 4Z" />
      <path d="M12 10v4.4M12 17.2h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </>
  ),
  chevronRight: <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  chevronDown: <path d="M5.5 9.5 12 16l6.5-6.5" />,
  share: (
    <>
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="17.5" cy="6" r="2.6" />
      <circle cx="17.5" cy="18" r="2.6" />
      <path d="M8.4 10.8 15.1 7.2M8.4 13.2l6.7 3.6" />
    </>
  ),
  refresh: <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4.5V10h-5.5" />,
  queue: <path d="M4 6.5h11M4 11h11M4 15.5h7M17.5 10.5v8M17.5 10.5l3 1.8M14.5 18.5a2 2 0 1 0 3-1.7" />,
  equalizer: <path d="M6 20V13M6 9V4M12 20v-9M12 7V4M18 20v-4M18 12V4" />,
  crossfade: <path d="M3 8h6l6 8h6M3 16h6l2.5-3.3M14.5 10.7 17 8h4M18 5l3 3-3 3M18 13l3 3-3 3" />,
  gapless: <path d="M8.5 8.5a5 5 0 1 0 0 7M15.5 8.5a5 5 0 1 1 0 7" />,
  focus: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  cache: (
    <>
      <ellipse cx="12" cy="6.2" rx="7.5" ry="2.8" />
      <path d="M4.5 6.2v11.6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V6.2M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" />
    </>
  ),
  speed: (
    <>
      <path d="M4 17a8.5 8.5 0 1 1 16 0" />
      <path d="M12 17l4-5" />
    </>
  ),
  sleep: (
    <>
      <path d="M19 13.6A7.6 7.6 0 0 1 9.4 4.6 8 8 0 1 0 19 13.6Z" />
      <path d="M14.5 4h4l-4 4h4" />
    </>
  ),
  filter: <path d="M3.5 6h17l-6.6 7.6V20l-3.8-2.2v-4.2L3.5 6Z" />,
  wifi: <path d="M2.5 8.8a15 15 0 0 1 19 0M5.8 12.4a10 10 0 0 1 12.4 0M9.2 16a5 5 0 0 1 5.6 0M12 19.4h.01" />,
  star: <path d="M12 4.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.9l5.4-.8L12 4.2Z" />,
  music: (
    <>
      <circle cx="7" cy="17.5" r="3" />
      <circle cx="18" cy="15.5" r="3" />
      <path d="M10 17.5V7l11-2.5v11" />
    </>
  ),
  offline: <path d="M3 3l18 18M8.2 12.6a10 10 0 0 1 3.3-1.7M5 9a15 15 0 0 1 4-2.5M12 19.4h.01M9.2 16a5 5 0 0 1 5.2-.2" />,
};

export function Icon({ name, size = 24, strokeWidth = 1.7, className = '', filled = false, ...rest }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {content}
    </svg>
  );
}

export const iconNames = Object.keys(paths);

/** Colour helpers used for dynamic accent extraction from cover art. */

export function hexToRgb(hex) {
  const clean = String(hex).replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const int = parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Mix a colour towards black (`amount` 0..1) to keep contrast on light surfaces. */
export function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v) => Math.round(v * (1 - amount));
  return `#${[f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** WCAG relative luminance, used to pick black or white text on an accent. */
export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function readableOn(hex) {
  return luminance(hex) > 0.45 ? '#14171a' : '#ffffff';
}

/**
 * Build the dynamic-colour token set for a screen from a single cover colour.
 * Light theme gets a darkened accent so body text stays readable.
 */
export function accentTokens(hex, theme) {
  const base = theme === 'dark' ? hex : darken(hex, 0.28);
  return {
    '--accent': base,
    '--accent-bright': hex,
    '--on-accent': readableOn(base),
    '--accent-soft': rgba(base, theme === 'dark' ? 0.18 : 0.12),
  };
}

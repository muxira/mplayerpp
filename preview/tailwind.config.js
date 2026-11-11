/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      transitionTimingFunction: {
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        riseIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        sheetUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        equalize: {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'rise-in': 'riseIn 260ms cubic-bezier(0.2, 0, 0, 1) both',
        'sheet-up': 'sheetUp 300ms cubic-bezier(0.2, 0, 0, 1) both',
        'fade-in': 'fadeIn 200ms ease-out both',
      },
    },
  },
  plugins: [],
};

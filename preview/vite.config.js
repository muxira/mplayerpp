import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Bound to 0.0.0.0 so the preview works through a proxied host, and with
// allowedHosts disabled so any origin (sandbox preview domain) is accepted.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
});

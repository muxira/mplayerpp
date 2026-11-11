/**
 * Renders every screen of the preview to a string and fails on the first error.
 * Run with `npm run verify:render`. This is a build-independent sanity check:
 * it proves each screen mounts with real mock data, which a bundler cannot tell
 * you because it only checks syntax and imports.
 */
import { build } from 'esbuild';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const routes = [
  ['library', {}],
  ['playlist', { playlistId: 'pl-all' }],
  ['playlist', { playlistId: 'pl-favorites' }],
  ['playlist', { playlistId: 'pl-imported-liked' }],
  ['playlist', { playlistId: 'pl-focus' }],
  ['player', {}],
  ['search', {}],
  ['recap', {}],
  ['settings', {}],
  ['accounts', {}],
  ['import', {}],
  ['import', { sourceId: 'ytm' }],
  ['playlistEdit', { mode: 'create' }],
  ['playlistEdit', { playlistId: 'pl-focus' }],
  ['surfaces', {}],
  ['duplicates', {}],
];

const demoStates = ['normal', 'noPermission', 'offline', 'empty'];

// Output lives inside the project's node_modules/.cache so that Node resolves
// the externalised react packages, and so nothing generated ends up committed.
const tempDir = join(root, 'node_modules', '.cache', 'ssr-verify');
mkdirSync(tempDir, { recursive: true });
const outfile = join(tempDir, 'ssr.mjs');

await build({
  entryPoints: [join(root, 'scripts/ssr-entry.jsx')],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
  logLevel: 'error',
  absWorkingDir: root,
});

const { renderScreen } = await import(outfile);

let failures = 0;
let rendered = 0;

for (const demoState of demoStates) {
  for (const [screen, params] of routes) {
    const label = `${screen}${Object.keys(params).length ? ` ${JSON.stringify(params)}` : ''} [${demoState}]`;
    try {
      const html = renderScreen(screen, params, demoState);
      if (html.length < 400) throw new Error(`suspiciously short output (${html.length} chars)`);
      rendered += 1;
      console.log(`  ok   ${label} (${html.length} chars)`);
    } catch (error) {
      failures += 1;
      console.error(`  FAIL ${label}\n       ${error.message}`);
    }
  }
}

rmSync(tempDir, { recursive: true, force: true });

console.log(`\nRendered ${rendered} screen/state combinations, ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);

import { renderToString } from 'react-dom/server';
import { I18nProvider } from '../src/i18n/I18nProvider.jsx';
import { SettingsProvider } from '../src/state/SettingsProvider.jsx';
import { DemoProvider } from '../src/state/DemoProvider.jsx';
import { PlayerProvider } from '../src/state/PlayerProvider.jsx';
import { NavProvider } from '../src/state/NavProvider.jsx';
import { Workbench } from '../src/components/Workbench.jsx';

/**
 * Server-render entry used only by `npm run verify:render`.
 *
 * It renders the whole provider tree for a given route so every screen is
 * exercised at least once, which catches undefined imports, bad destructuring
 * and missing data long before anyone opens a browser.
 */
export function renderScreen(screen, params = {}, demoState = 'normal') {
  const html = renderToString(
    <I18nProvider>
      <SettingsProvider>
        <DemoProvider initial={demoState}>
          <PlayerProvider>
            <NavProvider initial={{ screen, params }}>
              <Workbench />
            </NavProvider>
          </PlayerProvider>
        </DemoProvider>
      </SettingsProvider>
    </I18nProvider>,
  );
  return html;
}

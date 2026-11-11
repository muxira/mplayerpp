import { I18nProvider } from './i18n/I18nProvider.jsx';
import { SettingsProvider } from './state/SettingsProvider.jsx';
import { DemoProvider } from './state/DemoProvider.jsx';
import { PlayerProvider } from './state/PlayerProvider.jsx';
import { NavProvider } from './state/NavProvider.jsx';
import { Workbench } from './components/Workbench.jsx';

/**
 * Root of the design preview.
 *
 * Provider order mirrors the Android dependency graph: strings, then persisted
 * settings, then reviewer-only demo state, then playback, then navigation.
 */
export default function App() {
  return (
    <I18nProvider>
      <SettingsProvider>
        <DemoProvider>
          <PlayerProvider>
            <NavProvider initial={{ screen: 'library' }}>
              <Workbench />
            </NavProvider>
          </PlayerProvider>
        </DemoProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

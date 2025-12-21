import { useState, useEffect } from "react";
// import { invoke } from "@tauri-apps/api/core"; // Removed Tauri
import "./App.css";
import { Language, getSystemLanguage, useTranslation, getSupportedLanguages } from "./i18n";

// Settings Interface
interface AppSettings {
  hideReadReceipts: boolean;
  hideTypingIndicator: boolean;
  blockTracking: boolean;
  startAtLogin: boolean;
  minimizeToTray: boolean;
}

// type Tab = 'general' | 'privacy' | 'about';


function App() {
  // const [activeTab, setActiveTab] = useState<Tab>('general');

  const [language, setLanguage] = useState<Language>(getSystemLanguage());
  const [settings, setSettings] = useState<AppSettings>({
    hideReadReceipts: true,
    hideTypingIndicator: true,
    blockTracking: true,
    startAtLogin: true,
    minimizeToTray: true,
  });

  const [updateStatus, setUpdateStatus] = useState<string>('');

  // Listen for update events
  useEffect(() => {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.on('update-message', (msg: string) => {
        setUpdateStatus(msg);
      });
    }
  }, []);

  // Get translations
  const t = useTranslation(language);

  // Load saved settings
  useEffect(() => {
    const initSettings = async () => {
      if (window.electron?.ipcRenderer) {
        try {
          // Source of truth: Electron Main Process
          const remoteSettings = await window.electron.ipcRenderer.invoke('get-settings');
          if (remoteSettings) {
            setSettings(prev => ({ ...prev, ...remoteSettings }));
          }
        } catch (error) {
          console.error("Failed to load settings from Electron:", error);
        }
      } else {
        // Fallback for web dev mode
        const savedSettings = localStorage.getItem("messenger-settings");
        if (savedSettings) {
          setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
        }
      }

      const savedLanguage = localStorage.getItem("messenger-language") as Language;
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    };

    initSettings();
  }, []);

  // Save settings & Sync with Electron
  useEffect(() => {
    localStorage.setItem("messenger-settings", JSON.stringify(settings));
    localStorage.setItem("messenger-language", language);

    // Send updates to Main Process (SAFE CHECK)
    // Avoid sending updates if we are just initializing? 
    // Ideally we should track if verified loaded, but for now this is okay 
    // as main process acts as store.
    if (window.electron?.ipcRenderer) {
      // We only want to invoke if we actually have changes or it's user driven. 
      // React strict mode might double invoke, but it's safe.
      window.electron.ipcRenderer.invoke('update-settings', settings).catch(console.error);
    }
  }, [settings, language]);

  const toggleSetting = (key: keyof AppSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isElectron = !!window.electron?.ipcRenderer;
  // @ts-expect-error Custom property
  const platform = window.electron?.platform || 'darwin'; // fallback to mac if unknown
  const platformClass = platform === 'darwin' ? 'os-mac' : (platform === 'win32' ? 'os-win' : 'os-linux');

  return (
    <div className={`settings-app ${platformClass}`}>
      {!isElectron && (
        <div className="error-banner">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'text-bottom' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          IPC Disconnected
        </div>
      )}

      <div className="settings-header">
        {/* Draggable Header Area */}
        <h1>Settings</h1>
      </div>

      <div className="settings-content">

        {/* GROUP 1: APPEARANCE & SYSTEM */}
        <div className="settings-section">
          <h2>{t.appearance} & System</h2>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label>Start at Login</label>
              </div>
              <div
                className={`toggle ${settings.startAtLogin ? 'active' : ''}`}
                onClick={() => toggleSetting('startAtLogin')}
              />
            </div>

            {platform !== 'darwin' && (
              <div className="setting-item">
                <div className="setting-info">
                  <label>{t.minimizeToTray || 'Minimize to Tray'}</label>
                </div>
                <div
                  className={`toggle ${settings.minimizeToTray ? 'active' : ''}`}
                  onClick={() => toggleSetting('minimizeToTray')}
                />
              </div>
            )}

            <div className="setting-item">
              <div className="setting-info">
                <label>{t.language}</label>
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                {getSupportedLanguages().map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* GROUP 2: PRIVACY */}
        <div className="settings-section">
          <h2>{t.privacy}</h2>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label>{t.hideReadReceipts}</label>
              </div>
              <div
                className={`toggle ${settings.hideReadReceipts ? 'active' : ''}`}
                onClick={() => toggleSetting('hideReadReceipts')}
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>{t.hideTypingIndicator}</label>
              </div>
              <div
                className={`toggle ${settings.hideTypingIndicator ? 'active' : ''}`}
                onClick={() => toggleSetting('hideTypingIndicator')}
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>{t.blockLinkTracking}</label>
              </div>
              <div
                className={`toggle ${settings.blockTracking ? 'active' : ''}`}
                onClick={() => toggleSetting('blockTracking')}
              />
            </div>
          </div>
        </div>

        {/* GROUP 3: ABOUT */}
        <div className="settings-section">
          <div className="settings-group" style={{ padding: '20px', textAlign: 'center', display: 'block' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: 16 }}>Messenger Neo</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>v0.1.0</p>

            <a
              href="https://messenger-neo.boringlab.site"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: '#0084FF', textDecoration: 'none', fontWeight: 500 }}
            >
              {t.visitWebsite}
            </a>

            {/* Auto Update UI */}
            {isElectron && (
              <div style={{ marginTop: 15 }}>
                <button
                  className="update-btn"
                  onClick={() => {
                    setUpdateStatus(t.checkingForUpdates);
                    // IPC now typed
                    window.electron.ipcRenderer.invoke('check-for-updates');
                  }}
                  disabled={updateStatus === t.checkingForUpdates || updateStatus.includes('Downloading')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  {t.checkForUpdates}
                </button>
                {updateStatus && (
                  <p style={{ marginTop: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
                    {updateStatus}
                    {updateStatus.startsWith(t.updateError) && (
                      <a
                        href="https://messenger-neo.boringlab.site"
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'block', marginTop: 5, color: '#ff3b30' }}
                      >
                        {t.downloadManually}
                      </a>
                    )}
                    {updateStatus === t.updateDownloaded && (
                      <button
                        onClick={() => window.electron.ipcRenderer.invoke('quit-and-install')}
                        style={{ display: 'block', margin: '5px auto', padding: '4px 8px', cursor: 'pointer' }}
                      >
                        {t.restartApp}
                      </button>
                    )}
                  </p>
                )}
              </div>
            )}

            <p style={{ marginTop: 15, fontSize: 12, lineHeight: 1.4, color: 'var(--text-secondary)' }}>
              {t.disclaimer}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;

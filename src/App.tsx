import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Language, getSystemLanguage, useTranslation } from "./i18n";

// Settings Interface
interface PrivacySettings {
  hideReadReceipts: boolean;
  hideTypingIndicator: boolean;
  blockTracking: boolean;
}

type Theme = "light" | "dark" | "system";

function App() {
  const [theme, setTheme] = useState<Theme>("system");
  const [language, setLanguage] = useState<Language>(getSystemLanguage());
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    hideReadReceipts: true,
    hideTypingIndicator: true,
    blockTracking: true,
  });

  // Get translations
  const t = useTranslation(language);

  // Apply theme to settings window
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // Load saved settings
  useEffect(() => {
    const savedTheme = localStorage.getItem("messenger-theme") as Theme;
    const savedPrivacy = localStorage.getItem("messenger-privacy");
    const savedLanguage = localStorage.getItem("messenger-language") as Language;

    if (savedTheme) setTheme(savedTheme);
    if (savedPrivacy) setPrivacySettings(JSON.parse(savedPrivacy));
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Auto-detect from system on first run
      setLanguage(getSystemLanguage());
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem("messenger-theme", theme);
    localStorage.setItem("messenger-privacy", JSON.stringify(privacySettings));
    localStorage.setItem("messenger-language", language);
  }, [theme, privacySettings, language]);

  const togglePrivacySetting = async (key: keyof PrivacySettings) => {
    const newValue = !privacySettings[key];
    setPrivacySettings(prev => ({
      ...prev,
      [key]: newValue
    }));

    // Apply to main window via Tauri commands
    if (key === "hideReadReceipts") {
      try {
        await invoke("hide_read_receipts", { hide: newValue });
      } catch (e) {
        console.error("Failed to toggle read receipts:", e);
      }
    }
  };

  const toggleDarkMode = async () => {
    try {
      await invoke("toggle_dark_mode");
    } catch (e) {
      console.error("Failed to toggle dark mode:", e);
    }
  };

  return (
    <div className="settings-app">
      <div className="settings-header">
        <h1>{t.settings}</h1>
      </div>

      <div className="settings-body">
        <section className="settings-section">
          <h2>{t.appearance}</h2>

          <div className="setting-item">
            <div className="setting-info">
              <label>{t.theme}</label>
              <span className="setting-desc">{t.themeDesc}</span>
            </div>
            <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
              <option value="system">{t.themeSystem}</option>
              <option value="light">{t.themeLight}</option>
              <option value="dark">{t.themeDark}</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>{t.darkModeMessenger}</label>
              <span className="setting-desc">{t.darkModeMessengerDesc}</span>
            </div>
            <button className="action-btn" onClick={toggleDarkMode}>
              {t.toggle}
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h2>{t.language}</h2>

          <div className="setting-item">
            <div className="setting-info">
              <label>{t.language}</label>
              <span className="setting-desc">{t.languageDesc}</span>
            </div>
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h2>{t.privacy}</h2>

          <div className="setting-item">
            <div className="setting-info">
              <label>{t.hideReadReceipts}</label>
              <span className="setting-desc">{t.hideReadReceiptsDesc}</span>
            </div>
            <button
              className={`toggle ${privacySettings.hideReadReceipts ? 'active' : ''}`}
              onClick={() => togglePrivacySetting('hideReadReceipts')}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>{t.hideTypingIndicator}</label>
              <span className="setting-desc">{t.hideTypingIndicatorDesc}</span>
            </div>
            <button
              className={`toggle ${privacySettings.hideTypingIndicator ? 'active' : ''}`}
              onClick={() => togglePrivacySetting('hideTypingIndicator')}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>{t.blockLinkTracking}</label>
              <span className="setting-desc">{t.blockLinkTrackingDesc}</span>
            </div>
            <button
              className={`toggle ${privacySettings.blockTracking ? 'active' : ''}`}
              onClick={() => togglePrivacySetting('blockTracking')}
            >
              <span className="toggle-slider" />
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h2>{t.keyboardShortcuts}</h2>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <span className="shortcut-key">⌘ + ,</span>
              <span>{t.openSettings}</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">⌘ + D</span>
              <span>{t.toggleDarkMode}</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">⌘ + Q</span>
              <span>{t.quitApp}</span>
            </div>
          </div>
        </section>

        <section className="settings-section about-section">
          <h2>{t.about}</h2>
          <div className="about-content">
            <div className="app-info">
              <svg className="messenger-logo" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M18 0C7.61 0 0 7.16 0 17.36C0 22.77 2.27 27.38 5.88 30.52C6.18 30.79 6.36 31.17 6.37 31.58L6.51 35.52C6.56 36.61 7.68 37.33 8.7 36.93L13.17 35.12C13.49 34.99 13.85 34.96 14.19 35.03C15.39 35.29 16.66 35.43 18 35.43C28.39 35.43 36 28.27 36 18.07C36 7.88 28.39 0 18 0Z" fill="url(#paint0)" />
                <path d="M7.2 22.32L12.61 14.02C13.35 12.88 14.87 12.58 15.99 13.35L20.34 16.58C20.66 16.82 21.1 16.82 21.41 16.57L27.18 12.05C27.93 11.46 28.91 12.38 28.39 13.18L22.98 21.48C22.24 22.62 20.72 22.92 19.6 22.15L15.25 18.92C14.93 18.68 14.49 18.68 14.18 18.93L8.41 23.45C7.66 24.04 6.68 23.12 7.2 22.32Z" fill="white" />
                <defs>
                  <radialGradient id="paint0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.18 36) rotate(-57.14) scale(40.95)">
                    <stop stopColor="#0099FF" />
                    <stop offset="0.61" stopColor="#A033FF" />
                    <stop offset="0.93" stopColor="#FF5280" />
                    <stop offset="1" stopColor="#FF7061" />
                  </radialGradient>
                </defs>
              </svg>
              <div>
                <h3>{t.aboutTitle}</h3>
                <p className="version">{t.version} 0.1.0</p>
              </div>
            </div>
            <div className="about-description">
              <p>
                <strong>{t.aboutDescription1}</strong>
              </p>
              <p>
                {t.aboutDescription2}
              </p>
            </div>
            <p className="disclaimer">
              {t.disclaimer}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

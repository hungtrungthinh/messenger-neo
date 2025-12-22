# Privacy Policy

**Last Updated:** December 22, 2025

**Messenger Neo** ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our desktop application collects, uses, and discloses information.

## 1. Minimal Data Collection

Messenger Neo is a **desktop wrapper** for the official Messenger.com website. We do **NOT** have access to, collect, store, or process your:
- Messages
- Passwords
- Contacts
- Photos or Media
- Login Credentials

All your personal communication data typically remains strictly between you and Meta Platforms, Inc. (Facebook). We simply provide a dedicated browser window to access their service.

## 2. Telemetry & Analytics

We use **Google Analytics 4 (Measurement Protocol)** to collect anonymous usage statistics to help us improve the application.

### What we track:
- **App Lifecycle:** App Launch, App Quit.
- **Updates:** Version checks, update availability, update errors.
- **Platform Info:** Operating System (macOS/Windows/Linux), Architecture (x64/arm64), App Version.
- **Errors:** Generic error messages (e.g., "Update failed") to help debugging.

### What we do NOT track:
- IP Addresses (Anonymized by default).
- User Identifiers (Facebook ID, Email, Name).
- Content of your usage.

### Opt-Out
You can disable all telemetry in the application settings:
1. Go to **Settings** (Cmd/Ctrl + ,).
2. Toggle **"Block Analytics / Tracking"** to ON.

## 3. Local Data Storage

We store a small amount of data locally on your device using `electron-store` to remember your preferences:
- Window size and position.
- Application settings (Dark mode, Start at login, etc.).
- Update preferences.

This data never leaves your device.

## 4. Third-Party Services

### Meta (Facebook/Messenger)
By using this application, you are interacting directly with `messenger.com`. Your usage is subject to [Meta's Privacy Policy](https://www.facebook.com/privacy/policy/).

### Google Analytics
Telemetry data is processed by Google. See [Google's Privacy & Terms](https://policies.google.com/privacy).

## 5. Security

- **Sandboxing:** The application runs the web view in a strictly sandboxed environment (`sandbox: true`) to prevent malicious scripts from accessing your system.
- **Context Isolation:** We verify that `contextIsolation` is enabled to prevent web pages from accessing internal Electron APIs.
- **No Injection:** We do not inject ads or third-party tracking scripts into your web view.

## 6. Changes to This Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

## 7. Contact Us

If you have any questions about this Privacy Policy, please contact us via our GitHub Repository.

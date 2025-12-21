# Product Requirement Document (PRD)
## Messenger Neo (macOS/Windows/Linux) Desktop App
**Version:** 1.13
**Status:** Feature Complete
**Last Updated:** 2025-12-21

## 1. Project Overview
**Messenger Neo** is a modern, high-performance desktop wrapper for `messenger.com`, designed to replace the discontinued official Messenger Desktop app. It aims to provide a native-like experience on macOS, Windows, and Linux while strictly respecting user privacy and security.

### Core Philosophy
*   **Security First:** Strictly sandboxed webview. No injection of external scripts unless for critical CSS fixes.
*   **Native Feel:** Application must look and behave like a native app on each platform (macOS Cocoa, Windows Fluent, Linux Adwaita-like).
*   **Privacy:** Built-in blocking of Facebook tracking pixels and link shims.

## 2. Technical Stack
*   **Framework:** Electron + Vite + React + TypeScript.
*   **Build System:** `electron-builder` (Cross-platform targets).
*   **State Management:** `electron-store` (for settings persistence).
*   **Update Mechanism:** `electron-updater` (Generic Provider with custom server).

## 3. Native UI/UX Standards (Strict)

### 3.1 General Window Behavior
- **Single Instance:** Only one instance of the app running at a time.
- **Auto-Update:** Background check, silent download, "Restart to Install" prompt.
- **Responsive:** Fluid resizing down to 400x500px.

### 3.2 macOS (Native Look & Feel)
- **Window:** Standard Cocoa-style window with hidden title bar (`titleBarStyle: 'hiddenInset'`).
- **Traffic Lights:** Positioned at `x: 20px, y: 20px` (or native standard).
- **Vibrancy:** Sidebar uses `vibrancy: 'sidebar'` (NSVisualEffectView).
- **Dock:** App icon behaves standardly. No "Minimize to Tray" on macOS (Standard behavior: Minimize to Dock).
- **Menu Bar:**
    - **App Name:** Must be visible as "Messenger Neo".
    - **Tray Icon:** "Template Image" standard (`TrayTemplate.png`) for auto Light/Dark mode inversion.

### 3.3 Windows (Fluent Design)
- **Window:** Standard frame with custom title bar potential, or standard native frame if custom is buggy.
- **Tray:** Colorful icon (`icon.ico`).
- **Minimize to Tray:** Supported. Clicking "X" can opt to minimize to tray based on settings.

### 3.4 Linux (GNOME/GTK)
- **Window:** Standard GTK window frame.
- **Tray:** Standard AppIndicator behavior.

## 4. Key Features

### 4.1 Settings Panel
- **Layout:** iOS-style grouped list.
- **Content:**
    - **Privacy:** Hide Read Receipts, Hide Typing Indicator, Block Link Tracking.
    - **System:** Start at Login, Minimize to Tray (Non-Mac).
    - **Appearance:** Language selector (EN, VI, JA, KO, ES, FR, DE).
- **About:** Version info, update status, website link.

### 4.2 Auto-Update System
- **Provider:** Generic (Custom Server).
- **Structure:**
    - `/mac/`: macOS (Universal - ARM64 & x64).
    - `/win/`: Windows (Exe & AppX).
    - `/linux/`: Linux.
- **Fallback:** "Download Manually" link if update fails.

## 5. Security Requirements (Non-Negotiable)
- **Context Isolation:** `true`
- **Node Integration:** `false`
- **Sandbox:** `true`
- **Navigation:** All strictly locked to `messenger.com` and `facebook.com` login domains.
- **External Links:** All `http/https` links must open in the user's default browser (e.g., Chrome/Safari), never inside the app.

## 6. Localization
- Supported Languages: English, Vietnamese, Japanese, Korean, Spanish, French, German.
## 7. Analytics & Telemetry
- **Provider:** Google Analytics 4 (Measurement Protocol).
- **Measurement ID:** `G-JHJ6L73YNP`
- **Scope:** App-level events only. No content tracking.
- **Events to Track:**
    - `app_launch` (params: platform, version, arch)
    - `app_update_check`
    - `app_update_available`
    - `manual_download_fallback`
- **Privacy:** Anonymized Client ID. No Personal Identifiable Information (PII).

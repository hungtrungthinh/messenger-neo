# Messenger Desktop

A privacy-focused, cross-platform Messenger desktop client built with Tauri + React.

## Features

- **Native WebView** - Loads messenger.com directly (no iframe restrictions)
- **Dark/Light Theme** - Toggle dark mode with `Cmd+D`
- **Privacy Features** - Hide read receipts, typing indicators
- **System Tray** - Minimize to tray with quick access menu
- **Lightweight** - Only ~5-10MB vs 180MB+ for Electron alternatives
- **Fast Startup** - Sub-second launch time
- **Low Memory** - Uses ~30-40MB RAM vs 200-300MB for Electron apps

## Tech Stack

- **Frontend**: React + TypeScript (for Settings UI)
- **Backend**: Rust + Tauri 2.0
- **WebView**: Native macOS WebKit with Chrome User-Agent

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Build for Production

```bash
# Build for your current platform
npm run tauri build
```

The built application will be in `src-tauri/target/release/bundle/`.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ + ,` | Open Settings |
| `⌘ + D` | Toggle Dark Mode |
| `⌘ + Q` | Quit Application |

## App Menu

Access from the menu bar:
- **Messenger → Settings...** - Open settings window
- **Messenger → Toggle Dark Mode** - Apply dark filter to Messenger
- **Messenger → Hide Read Receipts** - Others won't see when you've read messages
- **Messenger → Quit Messenger** - Exit the app

## System Tray

Right-click the tray icon for:
- Show Window
- Hide Window
- Settings...
- Quit Messenger

## Project Structure

```
messenger-desktop/
├── src/                    # React frontend (Settings UI)
│   ├── App.tsx            # Settings application component
│   ├── App.css            # Styles with dark/light themes
│   └── main.tsx           # React entry point
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── lib.rs         # Tauri setup, menus, tray, JS injection
│   │   └── main.rs        # Entry point
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration (loads messenger.com)
├── public/                 # Static assets
└── package.json
```

## Privacy Notes

This app includes privacy features that inject CSS/JS into messenger.com:
- **Hide Read Receipts**: Hides "Seen" indicators
- **Dark Mode**: Applies CSS filter to invert colors

These features work by injecting code into the loaded webpage.

## Disclaimer

This is an unofficial Messenger client and is not affiliated with, authorized, maintained, sponsored or endorsed by Meta/Facebook or any of its affiliates or subsidiaries.

This application loads [messenger.com](https://www.messenger.com) in a native WebView with a Chrome User-Agent. Facebook may change their site or detect/block unofficial clients at any time.

## 📄 License

## License

**CC BY-NC-ND 4.0** (Attribution-NonCommercial-NoDerivatives)

This project is licensed under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License**.

Builds and Source Code are provided for **Educational and Personal Use Only**.
- **Commercial Use:** STRICTLY PROHIBITED.
- **Modification:** You may NOT distribute modified versions (Derivatives).
- **Private Development:** You must obtain explicit permission from the author before using this code for private custom development.

See [LICENSE](LICENSE) for full legal text.

## Acknowledgments

- Inspired by [Caprine](https://github.com/sindresorhus/caprine)
- Built with [Tauri 2.0](https://tauri.app/)

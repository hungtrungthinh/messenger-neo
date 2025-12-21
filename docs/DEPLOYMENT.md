# Messenger Neo - Deployment & Update Guide (v1.13)

## 1. Overview
The application uses **Electron Updater** with a **Generic Provider**. This means updates are hosted on a standard static web server (HTTP/HTTPS) rather than relying on GitHub Releases API.

**Base URL:** `https://download.boringlab.site/apps/messenger-neo/`

## 2. Server Directory Structure (CRITICAL)
You must organize your server folders exactly as follows to support cross-platform updates.

```text
/apps/messenger-neo/
├── mac/                <-- For macOS (All Architectures)
│   ├── latest-mac.yml  (Manifest file)
│   ├── latest-arm64.zip
│   ├── latest-arm64.dmg
│   ├── latest-x64.zip
│   └── latest-x64.dmg
│
├── win/                <-- For Windows (All Architectures)
│   ├── latest.yml      (Manifest file)
│   └── Messenger Neo-Setup-0.1.0.exe
│
└── linux/              <-- For Linux
    ├── latest-linux.yml (Manifest file)
    └── latest-x64.AppImage
```

## 3. Build & Release Process

### Step 1: Increment Version
Open `package.json` and bump the version number (e.g., `0.1.0` -> `0.1.1`).

### Step 2: Build Artifacts

#### Option A: Local Build (Manual)
Run the build command on the target OS machine:
```bash
npm run build
```
*   **On macOS**: Generates `latest-mac.yml`, `.dmg`, `.zip` (for both `arm64` and `x64`).
*   **On Windows**: Generates `latest.yml`, `.exe` (NSIS), `.appx` (Store).
*   **On Linux**: Generates `latest-linux.yml`, `.AppImage`, `.deb`.

#### Option B: CI/CD (GitHub Actions - Recommended)
Push your code to GitHub. The configured workflow (`.github/workflows/release.yml`) should trigger and build artifacts for all platforms automatically.
1.  Go to repository **Actions** tab.
2.  Wait for the build to complete.
3.  Download artifacts.

### Step 3: Upload to Server
Upload the generated files to the corresponding folder on your server.
*   **Important:** You must **overwrite** the existing `latest-mac.yml` (or `latest.yml`, `latest-linux.yml`) on the server. This is how the app detects a new version.

## 4. Troubleshooting Updates

*   **Error: `Multipart header not found`**: Ensure you uploaded the `.zip` file for macOS.
*   **Error: `Signature mismatch`**: Ensure you are using consistent code signing certificates (or lack thereof).
*   **App not finding update**: Check if the YAML file on the server contains the correct version number and checksums matching the uploaded binary.

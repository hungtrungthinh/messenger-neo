/**
 * MESSENGER NEO - A Privacy-Focused Messenger Client
 * Copyright (c) 2025 Thinh Nguyen (Boring Lab).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 */

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { app, BrowserWindow, shell, ipcMain, nativeTheme, Tray, Menu } from 'electron'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appPath = app.getAppPath();
const preloadPath = path.join(appPath, 'dist-electron', 'preload.cjs');

// Defines
process.env.DIST_ELECTRON = path.join(__dirname, '../dist-electron');
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

// --- BEST PRACTICE: App Name & Single Instance ---
// Explicitly set name for Menu Bar (especially in dev)
app.setName('Messenger Neo');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    process.exit(0);
}

// --- BEST PRACTICE: Persistent Storage ---
interface StoreType {
    windowBounds: { width: number; height: number; x?: number; y?: number };
    settings: {
        hideReadReceipts: boolean;
        hideTypingIndicator: boolean;
        blockTracking: boolean;
        startAtLogin: boolean;
        minimizeToTray: boolean;
    };
}
const store = new Store<StoreType>({
    defaults: {
        windowBounds: { width: 1200, height: 800 },
        settings: {
            hideReadReceipts: true,
            hideTypingIndicator: true,
            blockTracking: true,
            startAtLogin: true,
            minimizeToTray: true,
        },
    }
});

let mainWindow: BrowserWindow | null;
let settingsWindow: BrowserWindow | null;
let tray: Tray | null = null;

// Initial Load
let settings = store.get('settings');

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createTray() {
    if (tray) return;

    // Use Template Image for macOS (Auto Light/Dark mode interaction)
    // We generated TrayTemplate.png (copy of 32x32) for this purpose.
    const iconName = process.platform === 'darwin' ? 'TrayTemplate.png' : 'icon.png';
    const iconPath = path.join(process.env.VITE_PUBLIC || '', `icons/${iconName}`);

    // In production/dist, VITE_PUBLIC might point differently, let's trust path.join works as before.
    // If TrayTemplate.png missing, we might fail silently or show empty.

    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                mainWindow?.show();
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                // @ts-expect-error Custom property
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Messenger Neo');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (mainWindow?.isVisible()) {
            if (mainWindow.isFocused()) {
                mainWindow.hide();
            } else {
                mainWindow.focus();
            }
        } else {
            mainWindow?.show();
        }
    });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 400,
        minHeight: 500,
        center: true,
        backgroundColor: '#ffffff',
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true, // STRICT SECURITY COMPLIANCE
        },
        show: false,
        icon: path.join(process.env.VITE_PUBLIC || '', 'icons/128x128.png'),
        x: store.get('windowBounds.x'),
        y: store.get('windowBounds.y'),
        width: store.get('windowBounds.width') || 1200,
        height: store.get('windowBounds.height') || 800,
    });

    mainWindow.on('resize', () => {
        if (!mainWindow) return;
        const { width, height } = mainWindow.getBounds();
        store.set('windowBounds.width', width);
        store.set('windowBounds.height', height);
    });

    mainWindow.on('move', () => {
        if (!mainWindow) return;
        const { x, y } = mainWindow.getBounds();
        store.set('windowBounds.x', x);
        store.set('windowBounds.y', y);
    });

    mainWindow.loadURL('https://www.messenger.com');

    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowedPermissions = ['notifications', 'media'];
        if (allowedPermissions.includes(permission)) {
            callback(true);
        } else {
            callback(false);
        }
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // STRICT SECURITY: Only allow known protocols or safe external links
        if (url.startsWith('https:')) shell.openExternal(url);
        return { action: 'deny' };
    });

    // STRICT SECURITY: Prevent navigation to unauthorized domains within the webview
    mainWindow.webContents.on('will-navigate', (event, url) => {
        const parsedUrl = new URL(url);
        const allowedDomains = ['messenger.com', 'www.messenger.com', 'facebook.com', 'www.facebook.com', 'login.facebook.com'];
        // Allow subdomains of messenger.com and facebook.com
        const isAllowed = allowedDomains.includes(parsedUrl.hostname) || parsedUrl.hostname.endsWith('.messenger.com') || parsedUrl.hostname.endsWith('.facebook.com');

        if (!isAllowed) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    mainWindow.webContents.on('dom-ready', () => {
        injectPrivacyCode();
    });

    // Handle No Internet / Load Failure
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        // -3 is aborted (often happens during reloads), we ignore it
        // We only care if the main Messenger page fails
        if (errorCode !== -3 && validatedURL.includes('messenger.com')) {
            console.log('Failed to load:', validatedURL, errorCode, errorDescription);
            const offlinePath = path.join(process.env.VITE_PUBLIC || '', 'offline.html');
            mainWindow?.loadFile(offlinePath);
        }
    });

    mainWindow.on('close', (event) => {
        // @ts-expect-error Custom property
        // On macOS, we DO NOT minimize to tray. We just let standard behavior happen.
        // If settings.minimizeToTray is on, we only respect it for non-Darwin.
        if (!app.isQuitting && settings.minimizeToTray && process.platform !== 'darwin') {
            event.preventDefault();
            mainWindow?.hide();
            return false;
        }
    });
}

function createSettingsWindow() {
    if (settingsWindow) {
        if (settingsWindow.isDestroyed()) {
            settingsWindow = null;
        } else {
            settingsWindow.focus();
            return;
        }
    }

    const isParentVisible = mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible();

    settingsWindow = new BrowserWindow({
        width: 500,
        height: 850,
        resizable: false,
        title: 'Settings',
        titleBarStyle: 'hiddenInset',
        vibrancy: 'sidebar',
        parent: isParentVisible ? mainWindow! : undefined,
        modal: false,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
        autoHideMenuBar: true,
        show: false,
    });

    settingsWindow.once('ready-to-show', () => {
        settingsWindow?.show();
    });

    if (VITE_DEV_SERVER_URL) {
        settingsWindow.loadURL(VITE_DEV_SERVER_URL);
    } else {
        settingsWindow.loadFile(path.join(process.env.DIST || '', 'index.html'));
    }

    // Handle external links in Settings
    settingsWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url);
        return { action: 'deny' };
    });

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

function injectPrivacyCode() {
    if (!mainWindow) return;

    if (settings.hideReadReceipts) {
        const css = '[aria-label*="Seen"], [aria-label*="Đã xem"], svg[aria-label*="Seen"] { display: none !important; opacity: 0 !important; }';
        mainWindow.webContents.insertCSS(css);
    }

    if (settings.hideTypingIndicator) {
        const css = '[role="presentation"][class*="typing"], [aria-label*="Typing"], [aria-label*="Đang nhập"] { display: none !important; opacity: 0 !important; transform: scale(0); }';
        mainWindow.webContents.insertCSS(css);
    }
}

ipcMain.handle('open-settings', () => {
    createSettingsWindow();
});

ipcMain.handle('get-settings', () => {
    return settings;
});



// ... (existing imports)

// Configure autoUpdater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

import { analytics } from './analytics.ts';

// ... (existing imports)

// --- Auto Updater Events ---
autoUpdater.on('checking-for-update', () => {
    mainWindow?.webContents.send('update-message', 'Checking for updates...');
    analytics.track('app_update_check');
});

autoUpdater.on('update-available', (info) => {
    mainWindow?.webContents.send('update-message', 'Update available.');
    mainWindow?.webContents.send('update-available', info);
    analytics.track('app_update_available', { version: info.version });
});

autoUpdater.on('update-not-available', (_info) => {
    mainWindow?.webContents.send('update-message', 'Update not available.');
    mainWindow?.webContents.send('update-not-available');
});

autoUpdater.on('error', (err) => {
    mainWindow?.webContents.send('update-message', 'Error in auto-updater. ' + err);
    mainWindow?.webContents.send('update-error', err.toString());
    analytics.track('app_update_error', { error: err.toString() });
});

// ... (download progress)

autoUpdater.on('update-downloaded', (_info) => {
    mainWindow?.webContents.send('update-message', 'Update downloaded');
    mainWindow?.webContents.send('update-downloaded');
    analytics.track('app_update_downloaded');
});

// ... (IPC Handlers)

app.whenReady().then(() => {
    createMainWindow();

    // TRACK APP LAUNCH
    analytics.track('app_launch', {
        version: app.getVersion(),
        platform: process.platform,
        arch: process.arch
    });

    // macOS Requirement: No Tray Icon. Dock only.
    if (process.platform !== 'darwin') {
        createTray();
    } else {
        // ... (dock menu)
    }
    createMenu();
});

// @ts-expect-error Custom property
app.isQuitting = false;
app.on('before-quit', () => {
    // @ts-expect-error Custom property
    app.isQuitting = true;
});

function createMenu() {
    const isMac = process.platform === 'darwin';

    const template: any[] = [
        ...(isMac
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    {
                        label: 'Preferences...',
                        accelerator: 'CmdOrCtrl+,',
                        click: () => createSettingsWindow()
                    },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            }]
            : []),
        {
            label: 'File',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                        { role: 'pasteAndMatchStyle' },
                        { role: 'delete' },
                        { role: 'selectAll' },
                        { type: 'separator' },
                        {
                            label: 'Speech',
                            submenu: [
                                { role: 'startSpeaking' },
                                { role: 'stopSpeaking' }
                            ]
                        }
                    ]
                    : [
                        { role: 'delete' },
                        { type: 'separator' },
                        { role: 'selectAll' }
                    ])
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [
                        { type: 'separator' },
                        { role: 'front' },
                        { type: 'separator' },
                        { role: 'window' }
                    ]
                    : [
                        { role: 'close' }
                    ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

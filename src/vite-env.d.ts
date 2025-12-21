/// <reference types="vite/client" />
/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
    interface ProcessEnv {
        DIST_ELECTRON: string
        DIST: string
        VITE_PUBLIC: string
    }
}

interface Window {
    electron: {
        ipcRenderer: {
            send(channel: string, ...args: any[]): void;
            on(channel: string, func: (...args: any[]) => void): () => void;
            off(channel: string, func: (...args: any[]) => void): void;
            invoke(channel: string, ...args: any[]): Promise<any>;

            // Updater specific
            invoke(channel: 'check-for-updates'): Promise<void>;
            invoke(channel: 'download-update'): Promise<void>;
            invoke(channel: 'quit-and-install'): Promise<void>;
        }
    }
}

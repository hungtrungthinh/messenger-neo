"use strict";""`typescript
import { ipcRenderer, contextBridge } from 'electron';

console.log('[PRELOAD] Starting...');

try {
  contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
      on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
      },
      off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args;
        return ipcRenderer.off(channel, ...omit);
      },
      send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        return ipcRenderer.send(channel, ...omit);
      },
      invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
      },
    },
    platform: process.platform
  });
  console.log('[PRELOAD] ContextBridge exposed successfully');
} catch (error) {
  console.error('[PRELOAD] Error exposing ContextBridge:', error);
} // 'darwin', 'win32', 'linux'
// End of preload
```;

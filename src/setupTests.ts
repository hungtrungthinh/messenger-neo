import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.electron
Object.defineProperty(window, 'electron', {
    writable: true,
    value: {
        ipcRenderer: {
            on: vi.fn(),
            off: vi.fn(),
            send: vi.fn(),
            invoke: vi.fn().mockResolvedValue({}), // Default mock
        },
        platform: 'darwin',
    },
});

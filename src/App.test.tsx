import { render, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Expect the settings header or main content (assuming App renders Settings if standalone or Main Window)
        // Since App.tsx handles both, we logic check.
        // Actually App.tsx currently renders Settings UI directly based on my previous knowledge, 
        // OR it's checking window.location. Let's see. 
        // Based on "Settings Window" task, App.tsx is likely the Settings UI.
    });

    it('requests initial settings on load', async () => {
        const invokeMock = vi.fn().mockResolvedValue({
            hideReadReceipts: true,
            hideTypingIndicator: false,
            startAtLogin: true
        });
        window.electron.ipcRenderer.invoke = invokeMock;

        render(<App />);

        await waitFor(() => {
            expect(invokeMock).toHaveBeenCalledWith('get-settings');
        });
    });
});

import { net } from 'electron';
import Store from 'electron-store';
import { randomUUID } from 'node:crypto';

const GA_MEASUREMENT_ID = 'G-JHJ6L73YNP';
const GA_API_SECRET = 'ffMA3nPYSQy8hjxNehcvJA'; // Secret for Measurement Protocol

interface AnalyticsStore {
    clientId: string;
}

const store = new Store<AnalyticsStore>({
    name: 'analytics',
    defaults: {
        clientId: ''
    }
});

class Analytics {
    private clientId: string;

    constructor() {
        this.clientId = store.get('clientId');
        if (!this.clientId) {
            this.clientId = randomUUID();
            store.set('clientId', this.clientId);
        }
    }

    /**
     * Track an event to Google Analytics 4
     * @param eventName Name of the event (e.g., 'app_launch')
     * @param params Additional parameters
     */
    public track(eventName: string, params: Record<string, any> = {}) {
        const payload = {
            client_id: this.clientId,
            events: [{
                name: eventName,
                params: {
                    ...params,
                    engagement_time_msec: 100,
                    session_id: Date.now().toString(),
                }
            }]
        };

        const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;

        const request = net.request({
            method: 'POST',
            url: url,
            useSessionCookies: false
        });

        request.setHeader('Content-Type', 'application/json');

        request.on('error', (error) => {
            console.error('Analytics Error:', error);
        });

        request.write(JSON.stringify(payload));
        request.end();
    }
}

export const analytics = new Analytics();

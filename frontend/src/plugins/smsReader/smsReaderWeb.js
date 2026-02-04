/**
 * Web fallback for SMS Reader Plugin
 * Shows error/instructions when running in browser
 */

export class SMSReaderWeb {
    async checkPermission() {
        console.warn('SMS reading is not available in web browsers');
        return { granted: false, unavailable: true };
    }

    async requestPermission() {
        console.warn('SMS reading requires the native Android app');
        return { granted: false, unavailable: true };
    }

    async getMessages(options = {}) {
        console.warn('SMS reading is not available in web browsers');
        return { messages: [], unavailable: true };
    }

    async startListening() {
        console.warn('SMS listening is not available in web browsers');
        return { success: false, unavailable: true };
    }

    async stopListening() {
        return { success: true };
    }

    async getBankMessages(options = {}) {
        console.warn('SMS reading is not available in web browsers');
        return { messages: [], unavailable: true };
    }

    async addListener(eventName, callback) {
        console.warn(`SMS listener "${eventName}" is not available in web browsers`);
        return { remove: () => {} };
    }
}

/**
 * Storage Service
 * Handles localStorage operations with safe access
 */

const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'userData',
    USER_PREFERENCES: 'userPreferences',
    THEME: 'theme'
};

const isDevelopment = process.env.NODE_ENV === 'development';

const StorageService = {
    /**
     * Set item in localStorage
     */
    set(key, value) {
        try {
            if (typeof window === 'undefined') return;
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            if (isDevelopment) console.debug(`[Storage] Set: ${key}`);
        } catch (error) {
            console.error(`[Storage] Failed to set: ${key}`, error);
        }
    },

    /**
     * Get item from localStorage
     */
    get(key) {
        try {
            if (typeof window === 'undefined') return null;
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`[Storage] Failed to get: ${key}`, error);
            return null;
        }
    },

    /**
     * Get and parse JSON item from localStorage
     */
    getJSON(key) {
        try {
            const item = this.get(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`[Storage] Failed to parse: ${key}`, error);
            return null;
        }
    },

    /**
     * Remove item from localStorage
     */
    remove(key) {
        try {
            if (typeof window === 'undefined') return;
            localStorage.removeItem(key);
            if (isDevelopment) console.debug(`[Storage] Removed: ${key}`);
        } catch (error) {
            console.error(`[Storage] Failed to remove: ${key}`, error);
        }
    },

    /**
     * Clear all localStorage items
     */
    clear() {
        try {
            if (typeof window === 'undefined') return;
            localStorage.clear();
            if (isDevelopment) console.debug('[Storage] Cleared');
        } catch (error) {
            console.error('[Storage] Failed to clear', error);
        }
    },

    /**
     * Check if key exists
     */
    has(key) {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem(key) !== null;
    },

    // Auth Token Methods
    setAuthToken(token) {
        this.set(STORAGE_KEYS.AUTH_TOKEN, token);
    },

    getAuthToken() {
        return this.get(STORAGE_KEYS.AUTH_TOKEN);
    },

    removeAuthToken() {
        this.remove(STORAGE_KEYS.AUTH_TOKEN);
    },

    // User Data Methods
    setUserData(userData) {
        this.set(STORAGE_KEYS.USER_DATA, userData);
    },

    getUserData() {
        return this.getJSON(STORAGE_KEYS.USER_DATA);
    },

    removeUserData() {
        this.remove(STORAGE_KEYS.USER_DATA);
    },

    // User Preferences Methods
    setUserPreferences(preferences) {
        this.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
    },

    getUserPreferences() {
        return this.getJSON(STORAGE_KEYS.USER_PREFERENCES);
    },

    // Theme Methods
    setTheme(theme) {
        this.set(STORAGE_KEYS.THEME, theme);
    },

    getTheme() {
        return this.get(STORAGE_KEYS.THEME) || 'dark';
    },

    // Storage Keys export
    KEYS: STORAGE_KEYS
};

export default StorageService;

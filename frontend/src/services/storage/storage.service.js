/**
 * Storage Service
 * Handles localStorage operations with safe access
 */

import logger from './logger.service';
import { STORAGE_KEYS } from '../constants';

class StorageService {
    /**
     * Set item in localStorage
     */
    setItem(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            logger.debug('StorageService', `Item set: ${key}`);
        } catch (error) {
            logger.error('StorageService', `Failed to set item: ${key}`, error);
        }
    }

    /**
     * Get item from localStorage
     */
    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            logger.error('StorageService', `Failed to get item: ${key}`, error);
            return null;
        }
    }

    /**
     * Remove item from localStorage
     */
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            logger.debug('StorageService', `Item removed: ${key}`);
        } catch (error) {
            logger.error('StorageService', `Failed to remove item: ${key}`, error);
        }
    }

    /**
     * Clear all localStorage items
     */
    clear() {
        try {
            localStorage.clear();
            logger.debug('StorageService', 'localStorage cleared');
        } catch (error) {
            logger.error('StorageService', 'Failed to clear localStorage', error);
        }
    }

    /**
     * Check if key exists
     */
    hasItem(key) {
        return localStorage.getItem(key) !== null;
    }

    // Auth Token Methods
    setAuthToken(token) {
        this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    getAuthToken() {
        return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    removeAuthToken() {
        this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    // User Data Methods
    setUserData(userData) {
        this.setItem(STORAGE_KEYS.USER_DATA, userData);
    }

    getUserData() {
        return this.getItem(STORAGE_KEYS.USER_DATA);
    }

    removeUserData() {
        this.removeItem(STORAGE_KEYS.USER_DATA);
    }

    // User Preferences Methods
    setUserPreferences(preferences) {
        this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
    }

    getUserPreferences() {
        return this.getItem(STORAGE_KEYS.USER_PREFERENCES);
    }

    // Theme Methods
    setTheme(theme) {
        this.setItem(STORAGE_KEYS.THEME, theme);
    }

    getTheme() {
        return this.getItem(STORAGE_KEYS.THEME) || 'dark';
    }
}

export default new StorageService();

/**
 * Auth Service
 * Handles authentication operations including login, logout, and token management
 */

import logger from '../logger.service';
import StorageService from '../storage/storage.service';

const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'currentUser';

const AuthService = {
    /**
     * Get authentication token
     * @returns {string|null} Auth token or null
     */
    getAuthToken() {
        try {
            return StorageService.get(AUTH_TOKEN_KEY);
        } catch (err) {
            logger.error('AuthService', 'Failed to get auth token', err);
            return null;
        }
    },

    /**
     * Set authentication token
     * @param {string} token - Auth token
     */
    setAuthToken(token) {
        try {
            StorageService.set(AUTH_TOKEN_KEY, token);
        } catch (err) {
            logger.error('AuthService', 'Failed to set auth token', err);
        }
    },

    /**
     * Get refresh token
     * @returns {string|null} Refresh token or null
     */
    getRefreshToken() {
        try {
            return StorageService.get(REFRESH_TOKEN_KEY);
        } catch (err) {
            logger.error('AuthService', 'Failed to get refresh token', err);
            return null;
        }
    },

    /**
     * Set refresh token
     * @param {string} token - Refresh token
     */
    setRefreshToken(token) {
        try {
            StorageService.set(REFRESH_TOKEN_KEY, token);
        } catch (err) {
            logger.error('AuthService', 'Failed to set refresh token', err);
        }
    },

    /**
     * Clear all authentication tokens
     */
    clearAuthTokens() {
        try {
            StorageService.remove(AUTH_TOKEN_KEY);
            StorageService.remove(REFRESH_TOKEN_KEY);
            StorageService.remove(USER_KEY);
            logger.info('AuthService', 'Auth tokens cleared');
        } catch (err) {
            logger.error('AuthService', 'Failed to clear auth tokens', err);
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    checkAuth() {
        const token = this.getAuthToken();
        return !!token;
    },

    /**
     * Check if running in development mode
     * @returns {boolean} Development mode status
     */
    isDevelopment() {
        return process.env.NODE_ENV === 'development';
    },

    /**
     * Create mock token for development
     * @returns {string} Mock token
     */
    createMockToken() {
        const token = 'mock-dev-token-' + Date.now();
        this.setAuthToken(token);
        logger.info('AuthService', 'Dev mode: Mock token created');
        return token;
    },

    /**
     * Get current user
     * @returns {object|null} Current user or null
     */
    getCurrentUser() {
        try {
            const userStr = StorageService.get(USER_KEY);
            return userStr ? JSON.parse(userStr) : null;
        } catch (err) {
            logger.error('AuthService', 'Failed to get current user', err);
            return null;
        }
    },

    /**
     * Set current user
     * @param {object} user - User object
     */
    setCurrentUser(user) {
        try {
            StorageService.set(USER_KEY, JSON.stringify(user));
        } catch (err) {
            logger.error('AuthService', 'Failed to set current user', err);
        }
    },

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<object>} Login result
     */
    async login(email, password) {
        try {
            // In production, this would call the API
            // For now, simulate successful login in dev mode
            if (this.isDevelopment()) {
                const mockUser = {
                    id: '1',
                    email: email,
                    name: email.split('@')[0],
                };
                const mockToken = this.createMockToken();
                this.setCurrentUser(mockUser);
                
                return {
                    success: true,
                    user: mockUser,
                    token: mockToken
                };
            }

            // API call would go here
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: data.message || 'Login failed'
                };
            }

            const data = await response.json();
            this.setAuthToken(data.token);
            if (data.refreshToken) {
                this.setRefreshToken(data.refreshToken);
            }
            if (data.user) {
                this.setCurrentUser(data.user);
            }

            return {
                success: true,
                user: data.user,
                token: data.token
            };
        } catch (err) {
            logger.error('AuthService', 'Login error', err);
            return {
                success: false,
                error: err instanceof Error ? err.message : 'Login failed'
            };
        }
    },

    /**
     * Signup user
     * @param {object} userData - User registration data
     * @returns {Promise<object>} Signup result
     */
    async signup(userData) {
        try {
            // In production, this would call the API
            if (this.isDevelopment()) {
                const mockUser = {
                    id: Date.now().toString(),
                    email: userData.email,
                    name: `${userData.firstName} ${userData.lastName}`,
                };
                const mockToken = this.createMockToken();
                this.setCurrentUser(mockUser);
                
                return {
                    success: true,
                    user: mockUser,
                    token: mockToken
                };
            }

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: data.message || 'Signup failed'
                };
            }

            const data = await response.json();
            this.setAuthToken(data.token);
            if (data.user) {
                this.setCurrentUser(data.user);
            }

            return {
                success: true,
                user: data.user,
                token: data.token
            };
        } catch (err) {
            logger.error('AuthService', 'Signup error', err);
            return {
                success: false,
                error: err instanceof Error ? err.message : 'Signup failed'
            };
        }
    },

    /**
     * Logout user
     */
    logout() {
        this.clearAuthTokens();
        logger.info('AuthService', 'User logged out');
    }
};

export default AuthService;

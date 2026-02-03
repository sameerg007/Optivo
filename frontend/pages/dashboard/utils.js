// Logger utility for production
export const logger = {
    info: (message, data) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[INFO] ${message}`, data);
        }
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);
    },
    warn: (message, data) => {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[WARN] ${message}`, data);
        }
    }
};

// Auth service for authentication checks and token management
export const authService = {
    getAuthToken: () => {
        try {
            return localStorage?.getItem('authToken');
        } catch (err) {
            logger.error('Failed to get auth token', err);
            return null;
        }
    },

    setAuthToken: (token) => {
        try {
            localStorage?.setItem('authToken', token);
        } catch (err) {
            logger.error('Failed to set auth token', err);
        }
    },

    clearAuthTokens: () => {
        try {
            localStorage?.removeItem('authToken');
            localStorage?.removeItem('refreshToken');
        } catch (err) {
            logger.error('Failed to clear auth tokens', err);
        }
    },

    isDevelopment: () => process.env.NODE_ENV === 'development',

    createMockToken: () => {
        const token = 'mock-dev-token';
        authService.setAuthToken(token);
        logger.info('Dev mode: Mock token created for testing');
        return token;
    }
};

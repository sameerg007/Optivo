/**
 * Application Configuration
 * Centralized configuration for the entire application
 */

export const APP_CONFIG = {
    // App Info
    APP_NAME: 'Optivo',
    APP_VERSION: '1.0.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development',

    // API Configuration
    API: {
        BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    },

    // Auth Configuration
    AUTH: {
        TOKEN_KEY: 'auth_token',
        REFRESH_TOKEN_KEY: 'refresh_token',
        USER_KEY: 'user_data',
        TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
        ENABLE_MOCK_AUTH: true // For development
    },

    // Feature Flags
    FEATURES: {
        EXPENSE_TRACKER: true,
        MUTUAL_FUNDS: true,
        USER_PROFILE: true,
        ANALYTICS: false,
        NOTIFICATIONS: false
    },

    // UI Configuration
    UI: {
        ITEMS_PER_PAGE: 10,
        TOAST_DURATION: 3000,
        MODAL_ANIMATION_DURATION: 300
    },

    // Validation Rules
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 8,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^[0-9]{10}$/
    },

    // Budget Configuration
    BUDGET: {
        DEFAULT_MONTHLY_BUDGET: 5000,
        CURRENCY: 'INR',
        CURRENCY_SYMBOL: '₹'
    }
};

export default APP_CONFIG;

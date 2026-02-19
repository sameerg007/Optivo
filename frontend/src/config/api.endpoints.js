/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions
 */

export const API_ENDPOINTS = {
    // Auth Endpoints
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
        VERIFY_EMAIL: '/auth/verify-email'
    },

    // User Endpoints
    USER: {
        GET_PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
        DELETE_ACCOUNT: '/user/delete-account'
    },

    // Dashboard Endpoints
    DASHBOARD: {
        GET_OVERVIEW: '/dashboard/overview',
        GET_STATS: '/dashboard/stats'
    },

    // Expense Endpoints
    EXPENSES: {
        LIST: '/expenses',
        CREATE: '/expenses',
        GET: '/expenses/:id',
        UPDATE: '/expenses/:id',
        DELETE: '/expenses/:id',
        GET_BY_CATEGORY: '/expenses/category/:category',
        GET_SUMMARY: '/expenses/summary'
    },

};

export default API_ENDPOINTS;

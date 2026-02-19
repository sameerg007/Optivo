/**
 * Dashboard Configuration
 * Centralized configuration for dashboard tabs and settings
 */

export const TAB_CONTENT = {
    expense_tracker: {
        id: 'expense_tracker',
        label: 'Expense Tracker',
        icon: '💰',
        title: 'Expense Tracker',
        description: 'Track and manage your expenses efficiently.'
    },
    profile: {
        id: 'profile',
        label: 'Profile',
        icon: '👤',
        title: 'Profile',
        description: 'Manage your profile and account settings.'
    }
};

export const TABS = Object.values(TAB_CONTENT);

export const DEFAULT_ACTIVE_TAB = 'expense_tracker';

// API Endpoints for dashboard
export const DASHBOARD_API = {
    TAB_CONTENT: '/api/dashboard/tabs',
    LOGOUT: '/api/auth/logout'
};

// Timeouts and limits
export const DASHBOARD_TIMEOUT = 30000; // 30 seconds

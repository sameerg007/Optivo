// Dashboard Configuration and Constants
export const TAB_CONTENT = {
    expense_tracker: {
        id: 'expense_tracker',
        label: 'Expense Tracker',
        icon: '💰',
        title: 'Expense Tracker',
        description: 'This is the content for Expense Tracker. Backend integration will be added here.'
    },
    mutual_funds: {
        id: 'mutual_funds',
        label: 'Mutual Funds',
        icon: '📈',
        title: 'Mutual Funds',
        description: 'This is the content for Mutual Funds. Backend integration will be added here.'
    },
    profile: {
        id: 'profile',
        label: 'Profile',
        icon: '👤',
        title: 'Profile',
        description: 'This is the content for Profile. Backend integration will be added here.'
    }
};

export const TABS = Object.values(TAB_CONTENT);

export const DEFAULT_ACTIVE_TAB = 'expense_tracker';

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
    TAB_CONTENT: '/api/dashboard/tabs',
    LOGOUT: '/api/auth/logout'
};

// Timeouts and limits
export const API_TIMEOUT = 30000; // 30 seconds

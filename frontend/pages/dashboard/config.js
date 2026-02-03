// Dashboard Configuration and Constants
export const TAB_CONTENT = {
    tab1: {
        id: 'tab1',
        label: 'Tab 1',
        title: 'Expense Tracker',
        description: 'This is the content for Expense Tracker. Backend integration will be added here.'
    },
    tab2: {
        id: 'tab2',
        label: 'Tab 2',
        title: 'Mutual Funds',
        description: 'This is the content for Mutual Funds. Backend integration will be added here.'
    },
    tab3: {
        id: 'tab3',
        label: 'Tab 3',
        title: 'Profile',
        description: 'This is the content for Profile. Backend integration will be added here.'
    }
};

export const TABS = Object.values(TAB_CONTENT);

export const DEFAULT_ACTIVE_TAB = 'tab1';

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
    TAB_CONTENT: '/api/dashboard/tabs',
    LOGOUT: '/api/auth/logout'
};

// Timeouts and limits
export const API_TIMEOUT = 30000; // 30 seconds

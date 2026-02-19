/**
 * Application Constants
 * Global constants used across the application
 */

// Expense Categories
export const EXPENSE_CATEGORIES = {
    food: {
        id: 'food',
        name: 'Food',
        icon: '🍔',
        color: '#FF6B6B',
        description: 'Meals, groceries, and food delivery'
    },
    transport: {
        id: 'transport',
        name: 'Transport',
        icon: '🚗',
        color: '#4ECDC4',
        description: 'Travel, fuel, and vehicle expenses'
    },
    entertainment: {
        id: 'entertainment',
        name: 'Entertainment',
        icon: '🎬',
        color: '#45B7D1',
        description: 'Movies, games, and entertainment'
    },
    utilities: {
        id: 'utilities',
        name: 'Utilities',
        icon: '💡',
        color: '#FFA502',
        description: 'Bills and utility payments'
    },
    shopping: {
        id: 'shopping',
        name: 'Shopping',
        icon: '🛍️',
        color: '#FF69B4',
        description: 'Clothing and shopping'
    },
    health: {
        id: 'health',
        name: 'Health',
        icon: '🏥',
        color: '#6BCB77',
        description: 'Medical and health expenses'
    },
    other: {
        id: 'other',
        name: 'Other',
        icon: '📌',
        color: '#9D84B7',
        description: 'Miscellaneous expenses'
    }
};

// Dashboard Tabs
export const DASHBOARD_TABS = {
    EXPENSE_TRACKER: {
        id: 'expense_tracker',
        label: 'Expense Tracker',
        icon: '💰',
        route: '/dashboard?tab=expense-tracker'
    },
    PROFILE: {
        id: 'profile',
        label: 'Profile',
        icon: '👤',
        route: '/dashboard?tab=profile'
    }
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Unauthorized. Please login again.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_ALREADY_EXISTS: 'Email already registered.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    WEAK_PASSWORD: 'Password is too weak.',
    REQUIRED_FIELD: 'This field is required.',
    INVALID_AMOUNT: 'Amount must be greater than 0.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    SIGNUP_SUCCESS: 'Signup successful!',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    EXPENSE_ADDED: 'Expense added successfully.',
    EXPENSE_UPDATED: 'Expense updated successfully.',
    EXPENSE_DELETED: 'Expense deleted successfully.',
    PROFILE_UPDATED: 'Profile updated successfully.'
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    DASHBOARD: '/dashboard',
    SETTINGS: '/settings',
    NOT_FOUND: '/404'
};

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'optivo_auth_token',
    REFRESH_TOKEN: 'optivo_refresh_token',
    USER_DATA: 'optivo_user_data',
    USER_PREFERENCES: 'optivo_user_preferences',
    THEME: 'optivo_theme'
};

// Date Formats
export const DATE_FORMATS = {
    SHORT: 'MMM DD, YYYY',
    LONG: 'MMMM DD, YYYY',
    TIME: 'HH:mm',
    DATETIME: 'MMM DD, YYYY HH:mm',
    ISO: 'YYYY-MM-DD'
};

// Regex Patterns
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    PHONE: /^[0-9]{10}$/,
    URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]*$/
};

export default {
    EXPENSE_CATEGORIES,
    DASHBOARD_TABS,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ROUTES,
    STORAGE_KEYS,
    DATE_FORMATS,
    REGEX_PATTERNS
};

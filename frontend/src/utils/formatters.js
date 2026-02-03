/**
 * Utility Functions - Formatters
 * Data formatting helpers
 */

import APP_CONFIG from '../config/app.config';

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'INR') => {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(amount);
};

/**
 * Format currency with symbol
 */
export const formatCurrencyWithSymbol = (amount) => {
    return `${APP_CONFIG.BUDGET.CURRENCY_SYMBOL}${parseFloat(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/**
 * Format date
 */
export const formatDate = (date, format = 'short') => {
    const dateObj = new Date(date);
    
    const options = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric' },
        full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    };

    return dateObj.toLocaleDateString('en-IN', options[format] || options.short);
};

/**
 * Format time
 */
export const formatTime = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format datetime
 */
export const formatDateTime = (date) => {
    return `${formatDate(date, 'short')} ${formatTime(date)}`;
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now - dateObj;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(date, 'short');
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
    return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Format number with commas
 */
export const formatNumber = (number, decimals = 0) => {
    return parseFloat(number).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

/**
 * Truncate text
 */
export const truncateText = (text, length = 50) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalize each word
 */
export const capitalizeWords = (text) => {
    return text
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ');
};

/**
 * Format slug to readable text
 */
export const formatSlug = (slug) => {
    return slug
        .split('-')
        .map((word) => capitalize(word))
        .join(' ');
};

export default {
    formatCurrency,
    formatCurrencyWithSymbol,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    formatPercentage,
    formatNumber,
    truncateText,
    capitalize,
    capitalizeWords,
    formatSlug
};

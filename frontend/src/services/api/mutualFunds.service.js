/**
 * Mutual Funds API Service
 * Fetches real mutual fund data from the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_MF_API_URL || 'http://localhost:8000/api/mutual-funds';

/**
 * Generic API fetch wrapper
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Get list of popular mutual funds
 * @param {string} category - Optional category filter
 * @returns {Promise<{success: boolean, data: {funds: Array, count: number}}>}
 */
export async function getPopularFunds(category = null) {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return fetchAPI(`/${params}`);
}

/**
 * Search mutual funds
 * @param {string} query - Search query
 * @returns {Promise<{success: boolean, data: {results: Array, count: number}}>}
 */
export async function searchFunds(query) {
    return fetchAPI(`/search?q=${encodeURIComponent(query)}`);
}

/**
 * Get available fund categories
 * @returns {Promise<{success: boolean, data: {categories: Array}}>}
 */
export async function getCategories() {
    return fetchAPI('/categories');
}

/**
 * Get detailed fund information
 * @param {string} symbol - Fund symbol
 * @param {string} period - Historical data period (1mo, 3mo, 6mo, 1y, 2y, 5y)
 * @returns {Promise<{success: boolean, data: {fund: Object}}>}
 */
export async function getFundDetail(symbol, period = '1y') {
    return fetchAPI(`/${encodeURIComponent(symbol)}?period=${period}`);
}

/**
 * Get current NAV for a fund
 * @param {string} symbol - Fund symbol
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export async function getFundNAV(symbol) {
    return fetchAPI(`/${encodeURIComponent(symbol)}/nav`);
}

/**
 * Get historical NAV data
 * @param {string} symbol - Fund symbol
 * @param {string} period - Period (1mo, 3mo, 6mo, 1y, 2y, 5y)
 * @returns {Promise<{success: boolean, data: {history: Array}}>}
 */
export async function getFundHistory(symbol, period = '1y') {
    return fetchAPI(`/${encodeURIComponent(symbol)}/history?period=${period}`);
}

/**
 * Calculate portfolio value
 * @param {Array} holdings - Array of {symbol, units, avg_nav}
 * @returns {Promise<{success: boolean, data: {holdings: Array, summary: Object}}>}
 */
export async function calculatePortfolio(holdings) {
    return fetchAPI('/portfolio/calculate', {
        method: 'POST',
        body: JSON.stringify(holdings),
    });
}

/**
 * Format currency value
 * @param {number} value 
 * @param {string} currency 
 * @returns {string}
 */
export function formatCurrency(value, currency = 'INR') {
    if (value === null || value === undefined) return '-';
    
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Format percentage value
 * @param {number} value 
 * @returns {string}
 */
export function formatPercent(value) {
    if (value === null || value === undefined) return '-';
    
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format large numbers (crores, lakhs)
 * @param {number} value 
 * @returns {string}
 */
export function formatLargeNumber(value) {
    if (value === null || value === undefined) return '-';
    
    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
        return `₹${(value / 100000).toFixed(2)} L`;
    } else {
        return `₹${value.toLocaleString('en-IN')}`;
    }
}

export default {
    getPopularFunds,
    searchFunds,
    getCategories,
    getFundDetail,
    getFundNAV,
    getFundHistory,
    calculatePortfolio,
    formatCurrency,
    formatPercent,
    formatLargeNumber,
};

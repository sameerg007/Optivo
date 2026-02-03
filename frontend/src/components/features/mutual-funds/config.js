// Mutual Funds Feature Configuration

// Market Indices
export const MARKET_INDICES = {
    NIFTY_50: {
        id: 'nifty_50',
        name: 'NIFTY 50',
        symbol: 'NIFTY',
        exchange: 'NSE'
    },
    SENSEX: {
        id: 'sensex',
        name: 'SENSEX',
        symbol: 'SENSEX',
        exchange: 'BSE'
    },
    NIFTY_BANK: {
        id: 'nifty_bank',
        name: 'NIFTY BANK',
        symbol: 'BANKNIFTY',
        exchange: 'NSE'
    }
};

// Mock market data (in production, this would come from an API)
export const MOCK_MARKET_DATA = {
    nifty_50: {
        value: 22456.80,
        change: 125.45,
        changePercent: 0.56,
        high: 22520.30,
        low: 22380.15,
        open: 22400.00,
        previousClose: 22331.35,
        lastUpdated: new Date().toISOString()
    },
    sensex: {
        value: 73852.94,
        change: 412.67,
        changePercent: 0.56,
        high: 73980.50,
        low: 73620.00,
        open: 73700.00,
        previousClose: 73440.27,
        lastUpdated: new Date().toISOString()
    },
    nifty_bank: {
        value: 48234.55,
        change: -156.30,
        changePercent: -0.32,
        high: 48450.00,
        low: 48100.00,
        open: 48400.00,
        previousClose: 48390.85,
        lastUpdated: new Date().toISOString()
    }
};

// Mutual Fund Categories
export const MF_CATEGORIES = {
    equity: { name: 'Equity', icon: '📈', color: '#6366f1' },
    debt: { name: 'Debt', icon: '💵', color: '#22c55e' },
    hybrid: { name: 'Hybrid', icon: '⚖️', color: '#f59e0b' },
    index: { name: 'Index', icon: '📊', color: '#3b82f6' },
    elss: { name: 'ELSS', icon: '🏛️', color: '#8b5cf6' },
    liquid: { name: 'Liquid', icon: '💧', color: '#06b6d4' }
};

// Sample Mutual Funds Data
export const SAMPLE_MUTUAL_FUNDS = [
    {
        id: 'mf_1',
        name: 'Axis Bluechip Fund',
        category: 'equity',
        nav: 52.34,
        navChange: 0.45,
        navChangePercent: 0.87,
        aum: '32,456 Cr',
        returns: {
            '1Y': 18.5,
            '3Y': 14.2,
            '5Y': 16.8
        },
        rating: 5,
        riskLevel: 'High'
    },
    {
        id: 'mf_2',
        name: 'HDFC Mid-Cap Opportunities',
        category: 'equity',
        nav: 128.67,
        navChange: -1.23,
        navChangePercent: -0.95,
        aum: '45,123 Cr',
        returns: {
            '1Y': 22.3,
            '3Y': 18.6,
            '5Y': 19.2
        },
        rating: 4,
        riskLevel: 'High'
    },
    {
        id: 'mf_3',
        name: 'ICICI Pru Balanced Advantage',
        category: 'hybrid',
        nav: 65.89,
        navChange: 0.12,
        navChangePercent: 0.18,
        aum: '56,789 Cr',
        returns: {
            '1Y': 12.4,
            '3Y': 11.8,
            '5Y': 13.5
        },
        rating: 5,
        riskLevel: 'Moderate'
    },
    {
        id: 'mf_4',
        name: 'SBI Nifty 50 Index Fund',
        category: 'index',
        nav: 198.45,
        navChange: 1.56,
        navChangePercent: 0.79,
        aum: '12,345 Cr',
        returns: {
            '1Y': 15.2,
            '3Y': 13.4,
            '5Y': 14.8
        },
        rating: 4,
        riskLevel: 'High'
    },
    {
        id: 'mf_5',
        name: 'Mirae Asset Tax Saver Fund',
        category: 'elss',
        nav: 42.18,
        navChange: 0.34,
        navChangePercent: 0.81,
        aum: '18,900 Cr',
        returns: {
            '1Y': 20.1,
            '3Y': 16.7,
            '5Y': 18.3
        },
        rating: 5,
        riskLevel: 'High'
    }
];

// Market Status
export const MARKET_STATUS = {
    PRE_OPEN: 'pre_open',
    OPEN: 'open',
    CLOSED: 'closed'
};

// Get current market status based on time
export function getMarketStatus() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay();

    // Weekend check
    if (day === 0 || day === 6) {
        return MARKET_STATUS.CLOSED;
    }

    const timeInMinutes = hours * 60 + minutes;
    
    // Pre-market: 9:00 AM - 9:15 AM
    if (timeInMinutes >= 540 && timeInMinutes < 555) {
        return MARKET_STATUS.PRE_OPEN;
    }
    
    // Market hours: 9:15 AM - 3:30 PM
    if (timeInMinutes >= 555 && timeInMinutes <= 930) {
        return MARKET_STATUS.OPEN;
    }

    return MARKET_STATUS.CLOSED;
}

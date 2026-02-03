// Expense Data and Categories Configuration
export const CATEGORIES = {
    food: { name: 'Food', icon: '🍔', color: '#FF6B6B' },
    transport: { name: 'Transport', icon: '🚗', color: '#4ECDC4' },
    entertainment: { name: 'Entertainment', icon: '🎬', color: '#45B7D1' },
    utilities: { name: 'Utilities', icon: '💡', color: '#FFA502' },
    shopping: { name: 'Shopping', icon: '🛍️', color: '#FF69B4' },
    health: { name: 'Health', icon: '🏥', color: '#6BCB77' },
    other: { name: 'Other', icon: '📌', color: '#9D84B7' }
};

// Payment Modes Configuration
export const PAYMENT_MODES = {
    cash: { name: 'Cash', icon: '💵', color: '#22c55e' },
    credit_card: { name: 'Credit Card', icon: '💳', color: '#8b5cf6' },
    debit_card: { name: 'Debit Card', icon: '💳', color: '#3b82f6' },
    upi: { name: 'UPI', icon: '📱', color: '#f97316' },
    cheque: { name: 'Cheque', icon: '📝', color: '#64748b' }
};

// User's Saved Cards (this would typically come from backend/user profile)
export const SAVED_CARDS = {
    credit: [
        { id: 'cc1', name: 'HDFC Credit Card', lastFour: '4532', network: 'Visa', color: '#1e40af' },
        { id: 'cc2', name: 'ICICI Amazon Pay', lastFour: '8921', network: 'Mastercard', color: '#7c3aed' },
        { id: 'cc3', name: 'SBI Card Elite', lastFour: '6745', network: 'Visa', color: '#0369a1' }
    ],
    debit: [
        { id: 'dc1', name: 'HDFC Debit Card', lastFour: '1234', network: 'Visa', color: '#0f766e' },
        { id: 'dc2', name: 'SBI Debit Card', lastFour: '5678', network: 'RuPay', color: '#1d4ed8' },
        { id: 'dc3', name: 'Axis Debit Card', lastFour: '9012', network: 'Mastercard', color: '#be185d' }
    ]
};

export const EXPENSE_DATA = [
    {
        id: '1',
        category: 'food',
        amount: 45.50,
        date: '2026-02-03',
        description: 'Lunch at cafe',
        time: '12:30'
    },
    {
        id: '2',
        category: 'transport',
        amount: 12.00,
        date: '2026-02-03',
        description: 'Uber to office',
        time: '08:15'
    },
    {
        id: '3',
        category: 'shopping',
        amount: 125.99,
        date: '2026-02-02',
        description: 'Online shopping',
        time: '14:45'
    },
    {
        id: '4',
        category: 'entertainment',
        amount: 15.00,
        date: '2026-02-02',
        description: 'Movie tickets',
        time: '19:00'
    },
    {
        id: '5',
        category: 'utilities',
        amount: 89.00,
        date: '2026-02-01',
        description: 'Electricity bill',
        time: '10:00'
    },
    {
        id: '6',
        category: 'food',
        amount: 32.50,
        date: '2026-02-01',
        description: 'Dinner with friends',
        time: '20:00'
    },
    {
        id: '7',
        category: 'health',
        amount: 50.00,
        date: '2026-01-31',
        description: 'Gym subscription',
        time: '09:30'
    },
    {
        id: '8',
        category: 'transport',
        amount: 45.00,
        date: '2026-01-31',
        description: 'Car service',
        time: '15:20'
    },
    {
        id: '9',
        category: 'shopping',
        amount: 65.75,
        date: '2026-01-30',
        description: 'Groceries',
        time: '11:00'
    },
    {
        id: '10',
        category: 'other',
        amount: 20.00,
        date: '2026-01-30',
        description: 'Tips',
        time: '18:45'
    }
];

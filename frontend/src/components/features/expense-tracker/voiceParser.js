/**
 * Voice Parser for Expense Tracker
 * Parses natural language voice input to extract expense details
 */

import { CATEGORIES, PAYMENT_MODES } from './config';

// Category keywords mapping
const CATEGORY_KEYWORDS = {
    food: ['food', 'lunch', 'dinner', 'breakfast', 'snack', 'meal', 'eat', 'eating', 'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'biryani', 'samosa', 'chai', 'tea'],
    transport: ['transport', 'travel', 'uber', 'ola', 'cab', 'taxi', 'bus', 'train', 'metro', 'auto', 'rickshaw', 'petrol', 'diesel', 'fuel', 'gas', 'parking'],
    entertainment: ['entertainment', 'movie', 'movies', 'film', 'netflix', 'spotify', 'concert', 'show', 'game', 'gaming', 'subscription', 'fun', 'party'],
    utilities: ['utility', 'utilities', 'electricity', 'electric', 'water', 'gas', 'internet', 'wifi', 'phone', 'mobile', 'recharge', 'bill', 'rent'],
    shopping: ['shopping', 'shop', 'buy', 'bought', 'purchase', 'amazon', 'flipkart', 'clothes', 'clothing', 'shoes', 'electronics', 'online'],
    health: ['health', 'medical', 'medicine', 'doctor', 'hospital', 'gym', 'fitness', 'pharmacy', 'chemist', 'healthcare', 'clinic', 'dental'],
    other: ['other', 'miscellaneous', 'misc', 'general']
};

// Payment mode keywords mapping
const PAYMENT_KEYWORDS = {
    cash: ['cash', 'money', 'currency', 'notes'],
    upi: ['upi', 'gpay', 'google pay', 'phonepe', 'phone pe', 'paytm', 'bhim', 'online payment'],
    credit_card: ['credit card', 'credit', 'cc'],
    debit_card: ['debit card', 'debit', 'dc', 'atm card'],
    cheque: ['cheque', 'check', 'cheq']
};

// Amount patterns
const AMOUNT_PATTERNS = [
    /(?:₹|rs\.?|rupees?|inr)\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i,
    /(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:₹|rs\.?|rupees?|inr)/i,
    /(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:bucks?|dollars?)/i,
    /(?:spent|paid|cost|for|amount)\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i,
    /(\d+(?:,\d{3})*(?:\.\d{1,2})?)/
];

/**
 * Parse voice input to extract expense details
 * @param {string} text - The voice transcript
 * @returns {Object} Parsed expense data with confidence scores
 */
export function parseVoiceInput(text) {
    const lowerText = text.toLowerCase().trim();
    
    const result = {
        category: null,
        amount: null,
        description: null,
        paymentMode: null,
        confidence: {
            category: 0,
            amount: 0,
            paymentMode: 0
        },
        rawText: text
    };

    // Extract category
    const categoryResult = extractCategory(lowerText);
    if (categoryResult) {
        result.category = categoryResult.category;
        result.confidence.category = categoryResult.confidence;
    }

    // Extract amount
    const amountResult = extractAmount(lowerText);
    if (amountResult) {
        result.amount = amountResult.amount;
        result.confidence.amount = amountResult.confidence;
    }

    // Extract payment mode
    const paymentResult = extractPaymentMode(lowerText);
    if (paymentResult) {
        result.paymentMode = paymentResult.mode;
        result.confidence.paymentMode = paymentResult.confidence;
    }

    // Generate description from the text
    result.description = generateDescription(text, result);

    return result;
}

/**
 * Extract category from text
 */
function extractCategory(text) {
    let bestMatch = null;
    let bestScore = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                // Calculate score based on keyword specificity
                const score = keyword.length / text.length + 0.5;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = category;
                }
            }
        }
    }

    if (bestMatch && CATEGORIES[bestMatch]) {
        return {
            category: bestMatch,
            confidence: Math.min(bestScore, 1)
        };
    }

    return null;
}

/**
 * Extract amount from text
 */
function extractAmount(text) {
    // Remove commas for easier parsing
    const cleanText = text.replace(/,/g, '');

    for (const pattern of AMOUNT_PATTERNS) {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
            const amount = parseFloat(match[1]);
            if (!isNaN(amount) && amount > 0 && amount < 10000000) {
                return {
                    amount,
                    confidence: pattern === AMOUNT_PATTERNS[AMOUNT_PATTERNS.length - 1] ? 0.6 : 0.9
                };
            }
        }
    }

    return null;
}

/**
 * Extract payment mode from text
 */
function extractPaymentMode(text) {
    for (const [mode, keywords] of Object.entries(PAYMENT_KEYWORDS)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                return {
                    mode,
                    confidence: keyword.split(' ').length > 1 ? 0.95 : 0.8
                };
            }
        }
    }

    return null;
}

/**
 * Generate a clean description from the voice input
 */
function generateDescription(text, parsedData) {
    let description = text.trim();

    // Capitalize first letter
    if (description.length > 0) {
        description = description.charAt(0).toUpperCase() + description.slice(1);
    }

    // Limit length
    if (description.length > 100) {
        description = description.substring(0, 97) + '...';
    }

    return description || 'Voice expense entry';
}

/**
 * Get suggestions based on partial input
 */
export function getVoiceSuggestions(partialText) {
    const lower = partialText.toLowerCase();
    const suggestions = [];

    // Suggest categories
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (keyword.startsWith(lower) || lower.includes(keyword)) {
                suggestions.push({
                    type: 'category',
                    value: category,
                    display: CATEGORIES[category]?.name || category
                });
                break;
            }
        }
    }

    return suggestions.slice(0, 5);
}

export default parseVoiceInput;

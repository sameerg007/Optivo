/**
 * SMS Parser Service
 * Parses bank transaction SMS messages to extract expense data
 * Supports major Indian banks SMS formats
 */

const { v4: uuidv4 } = require('uuid');

// Common SMS patterns for Indian banks
const SMS_PATTERNS = {
    // Debited patterns
    DEBIT: [
        // HDFC Bank
        /(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)\s*(?:debited|withdrawn|spent|paid)/i,
        /(?:debited|withdrawn|spent|paid)\s*(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)/i,
        // ICICI Bank
        /Acct\s*\*+\d+\s*debited\s*(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)/i,
        // SBI
        /(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)\s*(?:has been debited)/i,
        // Axis Bank
        /(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)\s*debited from a\/c/i,
        // Generic UPI
        /(?:sent|paid)\s*(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)/i,
        /(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)\s*(?:sent|transferred)/i,
    ],
    
    // Credited patterns (for income tracking)
    CREDIT: [
        /(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)\s*(?:credited|received|deposited)/i,
        /(?:credited|received|deposited)\s*(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)/i,
    ],
    
    // Merchant/Description extraction
    MERCHANT: [
        /(?:at|to|@)\s*([A-Za-z0-9\s&\-\.]+?)(?:\s*(?:on|dated|ref|txn|UPI))/i,
        /(?:Info|VPA|UPI):\s*([A-Za-z0-9@\.\-]+)/i,
        /(?:to|paid to)\s+([A-Za-z0-9\s\-\.]+?)(?:\s+(?:Ref|on|UPI))/i,
        /trf to\s+([A-Za-z0-9\s\-\.]+)/i,
    ],
    
    // Date extraction
    DATE: [
        /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/,
        /(\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{2,4})/i,
    ],
    
    // Card last 4 digits
    CARD: [
        /(?:card|a\/c|acct)\s*(?:ending|xx|no\.?)\s*(\d{4})/i,
        /\*{4,}(\d{4})/,
    ],
    
    // UPI ID
    UPI: [
        /([a-zA-Z0-9\.\-]+@[a-zA-Z]+)/,
    ]
};

// Category keywords mapping
const CATEGORY_KEYWORDS = {
    food: [
        'swiggy', 'zomato', 'dominos', 'pizza', 'mcdonalds', 'kfc', 'burger',
        'restaurant', 'cafe', 'food', 'eat', 'dining', 'kitchen', 'biryani',
        'starbucks', 'chai', 'coffee', 'bakery', 'hotel', 'dhaba', 'canteen'
    ],
    transport: [
        'uber', 'ola', 'rapido', 'metro', 'irctc', 'railway', 'petrol', 'diesel',
        'fuel', 'parking', 'toll', 'fastag', 'cab', 'auto', 'bus', 'flight',
        'makemytrip', 'goibibo', 'redbus', 'indigo', 'spicejet', 'cleartrip'
    ],
    shopping: [
        'amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'meesho', 'snapdeal',
        'shoppers', 'mall', 'store', 'retail', 'mart', 'bazaar', 'dmart', 'reliance',
        'bigbasket', 'grofers', 'blinkit', 'zepto', 'instamart', 'jiomart'
    ],
    entertainment: [
        'netflix', 'prime', 'hotstar', 'spotify', 'youtube', 'gaana', 'jiocinema',
        'pvr', 'inox', 'bookmyshow', 'movie', 'cinema', 'game', 'play', 'xbox', 
        'playstation', 'steam', 'discord'
    ],
    utilities: [
        'electricity', 'bescom', 'msedcl', 'tata power', 'adani', 'gas', 'water',
        'broadband', 'jio', 'airtel', 'vi', 'bsnl', 'mobile', 'recharge', 'dth',
        'insurance', 'lic', 'hdfc life', 'icici pru', 'rent', 'maintenance'
    ],
    health: [
        'pharmacy', 'pharma', 'medical', 'medicine', 'apollo', 'medplus', '1mg',
        'netmeds', 'hospital', 'clinic', 'doctor', 'diagnostic', 'lab', 'health',
        'practo', 'pharmeasy', 'tata 1mg'
    ]
};

// Payment mode detection keywords
const PAYMENT_MODE_KEYWORDS = {
    upi: ['upi', 'gpay', 'phonepe', 'paytm', 'bhim', '@ybl', '@oksbi', '@okaxis', '@okicici'],
    credit_card: ['credit card', 'cc ', 'credit'],
    debit_card: ['debit card', 'dc ', 'debit', 'atm'],
    cash: ['cash', 'atm withdrawal'],
    netbanking: ['neft', 'imps', 'rtgs', 'netbanking']
};

/**
 * Parse amount from SMS text
 */
function parseAmount(text) {
    for (const pattern of SMS_PATTERNS.DEBIT) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return parseFloat(match[1].replace(/,/g, ''));
        }
    }
    return null;
}

/**
 * Check if SMS is a credit (income) transaction
 */
function isCredit(text) {
    for (const pattern of SMS_PATTERNS.CREDIT) {
        if (pattern.test(text)) {
            return true;
        }
    }
    return false;
}

/**
 * Extract merchant/description from SMS
 */
function parseMerchant(text) {
    for (const pattern of SMS_PATTERNS.MERCHANT) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return null;
}

/**
 * Extract date from SMS
 */
function parseDate(text) {
    for (const pattern of SMS_PATTERNS.DATE) {
        const match = text.match(pattern);
        if (match && match[1]) {
            const parsed = new Date(match[1]);
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString().split('T')[0];
            }
        }
    }
    return new Date().toISOString().split('T')[0];
}

/**
 * Detect category based on merchant/description keywords
 */
function detectCategory(text) {
    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                return category;
            }
        }
    }
    
    return 'other';
}

/**
 * Detect payment mode from SMS
 */
function detectPaymentMode(text) {
    const lowerText = text.toLowerCase();
    
    for (const [mode, keywords] of Object.entries(PAYMENT_MODE_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                return mode;
            }
        }
    }
    
    return 'other';
}

/**
 * Extract card last 4 digits
 */
function parseCardNumber(text) {
    for (const pattern of SMS_PATTERNS.CARD) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

/**
 * Validate if text looks like a bank SMS
 */
function isBankSMS(text) {
    if (!text) return false;
    
    const lowerText = text.toLowerCase();
    const bankKeywords = [
        'debited', 'credited', 'transaction', 'txn', 'upi', 'neft', 'imps',
        'a/c', 'acct', 'account', 'balance', 'inr', 'rs.', 'rs ', 'rupees',
        'bank', 'hdfc', 'icici', 'sbi', 'axis', 'kotak', 'idfc', 'yes bank'
    ];
    
    return bankKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Main function to parse SMS and extract transaction data
 * @param {string} smsText - The raw SMS text
 * @param {string} sender - SMS sender ID (optional)
 * @param {number} timestamp - SMS timestamp (optional)
 * @returns {Object|null} - Parsed transaction data or null if not valid
 */
function parseSMS(smsText, sender = null, timestamp = null) {
    if (!smsText || typeof smsText !== 'string') {
        return { success: false, error: 'Invalid SMS text' };
    }
    
    // Check if it's a bank SMS
    if (!isBankSMS(smsText)) {
        return { success: false, error: 'Not a bank transaction SMS' };
    }
    
    // Check if it's a credit transaction
    const creditTransaction = isCredit(smsText);
    
    // Parse amount
    const amount = parseAmount(smsText);
    if (!amount || amount <= 0) {
        return { success: false, error: 'Could not extract amount' };
    }
    
    // Extract other details
    const merchant = parseMerchant(smsText);
    const date = parseDate(smsText);
    const category = detectCategory(smsText);
    const paymentMode = detectPaymentMode(smsText);
    const cardLast4 = parseCardNumber(smsText);
    
    // Generate description
    let description = merchant || 'Transaction';
    if (cardLast4) {
        description += ` (Card **${cardLast4})`;
    }
    
    // Get time
    const txnDate = timestamp ? new Date(timestamp) : new Date();
    const time = `${txnDate.getHours().toString().padStart(2, '0')}:${txnDate.getMinutes().toString().padStart(2, '0')}`;
    
    return {
        success: true,
        transaction: {
            id: uuidv4(),
            type: creditTransaction ? 'credit' : 'debit',
            amount,
            category,
            description,
            date,
            time,
            paymentMode,
            cardLast4,
            source: 'sms',
            sender,
            rawSMS: smsText,
            createdAt: new Date().toISOString()
        }
    };
}

/**
 * Parse multiple SMS messages
 * @param {Array} messages - Array of {text, sender, timestamp} objects
 * @returns {Object} - Results with successful and failed parses
 */
function parseMultipleSMS(messages) {
    if (!Array.isArray(messages)) {
        return { success: false, error: 'Invalid input' };
    }
    
    const results = {
        success: true,
        total: messages.length,
        parsed: 0,
        transactions: [],
        errors: []
    };
    
    for (const msg of messages) {
        const text = typeof msg === 'string' ? msg : msg.text;
        const sender = msg.sender || null;
        const timestamp = msg.timestamp || null;
        
        const result = parseSMS(text, sender, timestamp);
        
        if (result.success) {
            results.transactions.push(result.transaction);
            results.parsed++;
        } else {
            results.errors.push({ text: text?.substring(0, 50), error: result.error });
        }
    }
    
    return results;
}

module.exports = {
    parseSMS,
    parseMultipleSMS,
    isBankSMS,
    CATEGORY_KEYWORDS,
    PAYMENT_MODE_KEYWORDS
};

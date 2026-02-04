/**
 * Transaction Service
 * In-memory storage for transactions (can be replaced with database)
 */

const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
const transactions = new Map();
const deviceTransactions = new Map(); // deviceId -> [transactionIds]

/**
 * Add a new transaction
 */
function addTransaction(transaction, deviceId) {
    const id = transaction.id || uuidv4();
    const txn = {
        ...transaction,
        id,
        deviceId,
        createdAt: transaction.createdAt || new Date().toISOString()
    };
    
    transactions.set(id, txn);
    
    // Track by device
    if (!deviceTransactions.has(deviceId)) {
        deviceTransactions.set(deviceId, []);
    }
    deviceTransactions.get(deviceId).push(id);
    
    return txn;
}

/**
 * Add multiple transactions
 */
function addMultipleTransactions(txnList, deviceId) {
    return txnList.map(txn => addTransaction(txn, deviceId));
}

/**
 * Get all transactions for a device
 */
function getTransactionsByDevice(deviceId, options = {}) {
    const { limit = 50, offset = 0, category = null, startDate = null, endDate = null } = options;
    
    const txnIds = deviceTransactions.get(deviceId) || [];
    let result = txnIds
        .map(id => transactions.get(id))
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply filters
    if (category) {
        result = result.filter(t => t.category === category);
    }
    if (startDate) {
        result = result.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
        result = result.filter(t => new Date(t.date) <= new Date(endDate));
    }
    
    // Pagination
    const total = result.length;
    result = result.slice(offset, offset + limit);
    
    return {
        transactions: result,
        total,
        limit,
        offset,
        hasMore: offset + limit < total
    };
}

/**
 * Get a single transaction by ID
 */
function getTransactionById(id) {
    return transactions.get(id) || null;
}

/**
 * Update a transaction
 */
function updateTransaction(id, updates) {
    const txn = transactions.get(id);
    if (!txn) return null;
    
    const updated = {
        ...txn,
        ...updates,
        id, // Prevent ID change
        updatedAt: new Date().toISOString()
    };
    
    transactions.set(id, updated);
    return updated;
}

/**
 * Delete a transaction
 */
function deleteTransaction(id, deviceId) {
    const txn = transactions.get(id);
    if (!txn || txn.deviceId !== deviceId) return false;
    
    transactions.delete(id);
    
    // Remove from device list
    const deviceTxns = deviceTransactions.get(deviceId);
    if (deviceTxns) {
        const index = deviceTxns.indexOf(id);
        if (index > -1) deviceTxns.splice(index, 1);
    }
    
    return true;
}

/**
 * Get summary statistics for a device
 */
function getTransactionSummary(deviceId, month = null) {
    const txnIds = deviceTransactions.get(deviceId) || [];
    let txns = txnIds.map(id => transactions.get(id)).filter(Boolean);
    
    // Filter by month if provided
    if (month) {
        const [year, monthNum] = month.split('-');
        txns = txns.filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === parseInt(year) && d.getMonth() + 1 === parseInt(monthNum);
        });
    }
    
    // Calculate totals by category
    const byCategory = {};
    let totalSpent = 0;
    let totalIncome = 0;
    
    txns.forEach(t => {
        if (t.type === 'debit') {
            totalSpent += t.amount;
            byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
        } else {
            totalIncome += t.amount;
        }
    });
    
    return {
        totalSpent,
        totalIncome,
        netAmount: totalIncome - totalSpent,
        transactionCount: txns.length,
        byCategory,
        month: month || 'all-time'
    };
}

/**
 * Check if SMS was already processed (duplicate detection)
 */
function isDuplicateSMS(rawSMS, deviceId) {
    const txnIds = deviceTransactions.get(deviceId) || [];
    return txnIds.some(id => {
        const txn = transactions.get(id);
        return txn && txn.rawSMS === rawSMS;
    });
}

module.exports = {
    addTransaction,
    addMultipleTransactions,
    getTransactionsByDevice,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary,
    isDuplicateSMS
};

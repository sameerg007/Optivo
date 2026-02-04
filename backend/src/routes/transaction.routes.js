/**
 * Transaction Routes
 * API endpoints for transaction management
 */

const express = require('express');
const router = express.Router();
const transactionService = require('../services/transaction.service');

// Middleware to require device ID
const requireDeviceId = (req, res, next) => {
    const deviceId = req.headers['x-device-id'];
    if (!deviceId) {
        return res.status(400).json({ error: 'X-Device-ID header is required' });
    }
    req.deviceId = deviceId;
    next();
};

router.use(requireDeviceId);

/**
 * GET /api/transactions
 * Get all transactions for a device
 */
router.get('/', (req, res) => {
    try {
        const { limit, offset, category, startDate, endDate } = req.query;
        
        const result = transactionService.getTransactionsByDevice(req.deviceId, {
            limit: parseInt(limit) || 50,
            offset: parseInt(offset) || 0,
            category,
            startDate,
            endDate
        });
        
        res.json(result);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to get transactions' });
    }
});

/**
 * GET /api/transactions/summary
 * Get transaction summary/statistics
 */
router.get('/summary', (req, res) => {
    try {
        const { month } = req.query; // Format: YYYY-MM
        const summary = transactionService.getTransactionSummary(req.deviceId, month);
        res.json(summary);
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ error: 'Failed to get summary' });
    }
});

/**
 * GET /api/transactions/:id
 * Get a single transaction by ID
 */
router.get('/:id', (req, res) => {
    try {
        const txn = transactionService.getTransactionById(req.params.id);
        
        if (!txn) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        if (txn.deviceId !== req.deviceId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        res.json(txn);
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ error: 'Failed to get transaction' });
    }
});

/**
 * POST /api/transactions
 * Create a new transaction manually
 */
router.post('/', (req, res) => {
    try {
        const { amount, category, description, date, time, paymentMode } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }
        
        const txn = transactionService.addTransaction({
            type: 'debit',
            amount: parseFloat(amount),
            category: category || 'other',
            description: description || 'Manual entry',
            date: date || new Date().toISOString().split('T')[0],
            time: time || new Date().toTimeString().slice(0, 5),
            paymentMode: paymentMode || 'other',
            source: 'manual'
        }, req.deviceId);
        
        res.status(201).json(txn);
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

/**
 * PUT /api/transactions/:id
 * Update a transaction
 */
router.put('/:id', (req, res) => {
    try {
        const txn = transactionService.getTransactionById(req.params.id);
        
        if (!txn) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        if (txn.deviceId !== req.deviceId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const updated = transactionService.updateTransaction(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete('/:id', (req, res) => {
    try {
        const deleted = transactionService.deleteTransaction(req.params.id, req.deviceId);
        
        if (!deleted) {
            return res.status(404).json({ error: 'Transaction not found or access denied' });
        }
        
        res.json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

module.exports = router;

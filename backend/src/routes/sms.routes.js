/**
 * SMS Routes
 * API endpoints for SMS parsing
 */

const express = require('express');
const router = express.Router();
const smsParser = require('../services/smsParser.service');
const transactionService = require('../services/transaction.service');

/**
 * POST /api/sms/parse
 * Parse a single SMS and optionally save it
 */
router.post('/parse', (req, res) => {
    try {
        const { text, sender, timestamp, save = false } = req.body;
        const deviceId = req.headers['x-device-id'] || 'anonymous';
        
        if (!text) {
            return res.status(400).json({ error: 'SMS text is required' });
        }
        
        const result = smsParser.parseSMS(text, sender, timestamp);
        
        if (!result.success) {
            return res.status(200).json(result);
        }
        
        // Check for duplicate
        if (save && transactionService.isDuplicateSMS(text, deviceId)) {
            return res.status(200).json({
                success: false,
                error: 'Duplicate transaction',
                duplicate: true
            });
        }
        
        // Save if requested
        if (save && result.transaction) {
            const saved = transactionService.addTransaction(result.transaction, deviceId);
            return res.json({
                success: true,
                saved: true,
                transaction: saved
            });
        }
        
        res.json(result);
    } catch (error) {
        console.error('SMS parse error:', error);
        res.status(500).json({ error: 'Failed to parse SMS' });
    }
});

/**
 * POST /api/sms/batch
 * Parse and save multiple SMS messages (from phone sync)
 */
router.post('/batch', (req, res) => {
    try {
        const { messages } = req.body;
        const deviceId = req.headers['x-device-id'];
        
        if (!deviceId) {
            return res.status(400).json({ error: 'X-Device-ID header is required' });
        }
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }
        
        const result = smsParser.parseMultipleSMS(messages);
        
        // Filter out duplicates and save
        const newTransactions = [];
        const duplicates = [];
        
        for (const txn of result.transactions) {
            if (transactionService.isDuplicateSMS(txn.rawSMS, deviceId)) {
                duplicates.push(txn.id);
            } else {
                const saved = transactionService.addTransaction(txn, deviceId);
                newTransactions.push(saved);
            }
        }
        
        res.json({
            success: true,
            total: messages.length,
            parsed: result.parsed,
            saved: newTransactions.length,
            duplicates: duplicates.length,
            transactions: newTransactions,
            errors: result.errors
        });
    } catch (error) {
        console.error('SMS batch error:', error);
        res.status(500).json({ error: 'Failed to process SMS batch' });
    }
});

/**
 * POST /api/sms/validate
 * Check if a text is a valid bank SMS
 */
router.post('/validate', (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    
    const isValid = smsParser.isBankSMS(text);
    res.json({ valid: isValid });
});

module.exports = router;

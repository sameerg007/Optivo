/**
 * SMS Service
 * Handles SMS reading via Capacitor plugin and syncing with backend
 */

import SMSReader, {
    checkPermission,
    requestPermission,
    getMessages,
    getBankMessages,
    startListening,
    stopListening
} from '../../plugins/smsReader';
import { API_ENDPOINTS } from '../../config';

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Device ID for tracking (use a persistent ID in production)
const getDeviceId = () => {
    if (typeof window === 'undefined') return 'server';
    
    let deviceId = localStorage.getItem('optivo_device_id');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('optivo_device_id', deviceId);
    }
    return deviceId;
};

/**
 * Check if SMS reading is available (native app only)
 * @returns {Promise<boolean>}
 */
export async function isSMSAvailable() {
    try {
        const result = await checkPermission();
        return !result.unavailable;
    } catch (error) {
        console.error('SMS availability check failed:', error);
        return false;
    }
}

/**
 * Check and request SMS permission
 * @returns {Promise<{granted: boolean, unavailable?: boolean}>}
 */
export async function checkAndRequestSMSPermission() {
    try {
        const permissionStatus = await checkPermission();
        
        if (permissionStatus.unavailable) {
            return { granted: false, unavailable: true };
        }
        
        if (permissionStatus.granted) {
            return { granted: true };
        }
        
        // Request permission if not granted
        const requestResult = await requestPermission();
        return requestResult;
    } catch (error) {
        console.error('Permission request failed:', error);
        return { granted: false, error: error.message };
    }
}

/**
 * Fetch recent bank SMS and parse transactions
 * @param {Object} options
 * @param {number} options.days - Number of days to look back
 * @param {number} options.limit - Max messages to fetch
 * @returns {Promise<{success: boolean, transactions?: Array, error?: string}>}
 */
export async function fetchAndParseBankSMS(options = { days: 30, limit: 100 }) {
    try {
        // Check permission first
        const permission = await checkAndRequestSMSPermission();
        
        if (permission.unavailable) {
            return { 
                success: false, 
                unavailable: true,
                error: 'SMS reading is only available in the mobile app' 
            };
        }
        
        if (!permission.granted) {
            return { 
                success: false, 
                error: 'SMS permission not granted. Please allow SMS access in settings.' 
            };
        }
        
        // Get bank messages
        const { messages } = await getBankMessages(options);
        
        if (!messages || messages.length === 0) {
            return { success: true, transactions: [], message: 'No bank SMS found' };
        }
        
        // Send to backend for parsing
        const response = await fetch(`${API_BASE_URL}/sms/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages.map(msg => ({
                    body: msg.body,
                    sender: msg.address,
                    timestamp: msg.date,
                    messageId: msg.id
                })),
                deviceId: getDeviceId()
            })
        });
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const result = await response.json();
        return { 
            success: true, 
            transactions: result.transactions,
            parsed: result.parsed,
            skipped: result.skipped
        };
    } catch (error) {
        console.error('Failed to fetch and parse SMS:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Parse a single SMS message
 * @param {string} smsBody - The SMS text content
 * @returns {Promise<{success: boolean, transaction?: Object, error?: string}>}
 */
export async function parseSingleSMS(smsBody) {
    try {
        const response = await fetch(`${API_BASE_URL}/sms/parse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: smsBody,
                deviceId: getDeviceId()
            })
        });
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to parse SMS:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Start real-time SMS listening and auto-sync
 * @param {Function} onNewTransaction - Callback when new transaction detected
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function startSMSAutoSync(onNewTransaction) {
    try {
        const permission = await checkAndRequestSMSPermission();
        
        if (permission.unavailable) {
            return { success: false, unavailable: true };
        }
        
        if (!permission.granted) {
            return { success: false, error: 'SMS permission not granted' };
        }
        
        // Start listening for new SMS
        await startListening(async (event) => {
            const { message } = event;
            
            // Send to backend for parsing
            const result = await parseSingleSMS(message.body);
            
            if (result.success && result.transaction) {
                // Notify callback
                if (onNewTransaction) {
                    onNewTransaction(result.transaction);
                }
            }
        });
        
        return { success: true };
    } catch (error) {
        console.error('Failed to start SMS auto-sync:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Stop SMS auto-sync
 * @returns {Promise<void>}
 */
export async function stopSMSAutoSync() {
    try {
        await stopListening();
    } catch (error) {
        console.error('Failed to stop SMS auto-sync:', error);
    }
}

/**
 * Get all synced transactions from backend
 * @returns {Promise<{success: boolean, transactions?: Array, error?: string}>}
 */
export async function getSyncedTransactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions?deviceId=${getDeviceId()}`);
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, transactions: data.transactions };
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get transaction summary (totals by category)
 * @returns {Promise<{success: boolean, summary?: Object, error?: string}>}
 */
export async function getTransactionSummary() {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/summary?deviceId=${getDeviceId()}`);
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, summary: data.summary };
    } catch (error) {
        console.error('Failed to fetch summary:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a transaction
 * @param {string} transactionId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteTransaction(transactionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deviceId: getDeviceId() })
        });
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        return { success: true };
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update a transaction
 * @param {string} transactionId
 * @param {Object} updates
 * @returns {Promise<{success: boolean, transaction?: Object, error?: string}>}
 */
export async function updateTransaction(transactionId, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...updates, deviceId: getDeviceId() })
        });
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, transaction: data.transaction };
    } catch (error) {
        console.error('Failed to update transaction:', error);
        return { success: false, error: error.message };
    }
}

export default {
    isSMSAvailable,
    checkAndRequestSMSPermission,
    fetchAndParseBankSMS,
    parseSingleSMS,
    startSMSAutoSync,
    stopSMSAutoSync,
    getSyncedTransactions,
    getTransactionSummary,
    deleteTransaction,
    updateTransaction
};

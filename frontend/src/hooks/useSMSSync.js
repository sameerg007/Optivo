/**
 * useSMSSync Hook
 * React hook for SMS syncing functionality
 */

import { useState, useEffect, useCallback } from 'react';
import {
    isSMSAvailable,
    checkAndRequestSMSPermission,
    fetchAndParseBankSMS,
    startSMSAutoSync,
    stopSMSAutoSync,
    getSyncedTransactions,
    getTransactionSummary
} from '../services/sms';

/**
 * Hook for SMS-based transaction syncing
 * @param {Object} options
 * @param {boolean} options.autoStart - Start auto-sync on mount
 * @param {Function} options.onNewTransaction - Callback for new transactions
 */
export function useSMSSync(options = {}) {
    const { autoStart = false, onNewTransaction } = options;
    
    const [isAvailable, setIsAvailable] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    
    // Check if SMS is available (native app)
    useEffect(() => {
        const checkAvailability = async () => {
            const available = await isSMSAvailable();
            setIsAvailable(available);
            
            if (available) {
                const permission = await checkAndRequestSMSPermission();
                setHasPermission(permission.granted);
            }
        };
        
        checkAvailability();
    }, []);
    
    // Auto-start sync if enabled
    useEffect(() => {
        if (autoStart && isAvailable && hasPermission) {
            startAutoSync();
        }
        
        return () => {
            if (isSyncing) {
                stopSMSAutoSync();
            }
        };
    }, [autoStart, isAvailable, hasPermission]);
    
    /**
     * Request SMS permission
     */
    const requestPermission = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await checkAndRequestSMSPermission();
            setHasPermission(result.granted);
            
            if (!result.granted) {
                setError(result.unavailable 
                    ? 'SMS reading is only available in the mobile app'
                    : 'SMS permission not granted. Please allow in settings.');
            }
            
            return result.granted;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    /**
     * Fetch and sync bank SMS
     */
    const syncBankSMS = useCallback(async (days = 30) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await fetchAndParseBankSMS({ days, limit: 200 });
            
            if (!result.success) {
                setError(result.error);
                return result;
            }
            
            if (result.transactions) {
                setTransactions(prev => {
                    // Merge new transactions, avoiding duplicates
                    const existingIds = new Set(prev.map(t => t.id));
                    const newTxns = result.transactions.filter(t => !existingIds.has(t.id));
                    return [...newTxns, ...prev].sort((a, b) => 
                        new Date(b.date) - new Date(a.date)
                    );
                });
            }
            
            setLastSyncTime(new Date());
            
            // Refresh summary
            const summaryResult = await getTransactionSummary();
            if (summaryResult.success) {
                setSummary(summaryResult.summary);
            }
            
            return result;
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    /**
     * Start auto-sync for real-time transaction tracking
     */
    const startAutoSync = useCallback(async () => {
        if (isSyncing) return;
        
        setError(null);
        
        try {
            const result = await startSMSAutoSync((transaction) => {
                setTransactions(prev => [transaction, ...prev]);
                
                if (onNewTransaction) {
                    onNewTransaction(transaction);
                }
            });
            
            if (result.success) {
                setIsSyncing(true);
            } else {
                setError(result.error);
            }
            
            return result;
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, [isSyncing, onNewTransaction]);
    
    /**
     * Stop auto-sync
     */
    const stopAutoSync = useCallback(async () => {
        await stopSMSAutoSync();
        setIsSyncing(false);
    }, []);
    
    /**
     * Load existing transactions from backend
     */
    const loadTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await getSyncedTransactions();
            
            if (result.success) {
                setTransactions(result.transactions || []);
            } else {
                setError(result.error);
            }
            
            return result;
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    /**
     * Refresh summary
     */
    const refreshSummary = useCallback(async () => {
        try {
            const result = await getTransactionSummary();
            if (result.success) {
                setSummary(result.summary);
            }
            return result;
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, []);
    
    return {
        // State
        isAvailable,
        hasPermission,
        isLoading,
        isSyncing,
        transactions,
        summary,
        error,
        lastSyncTime,
        
        // Actions
        requestPermission,
        syncBankSMS,
        startAutoSync,
        stopAutoSync,
        loadTransactions,
        refreshSummary,
        
        // Helpers
        clearError: () => setError(null),
        setTransactions
    };
}

export default useSMSSync;

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import styles from './dashboard.module.css';
import { TAB_CONTENT, DEFAULT_ACTIVE_TAB } from './config';
import { authService, logger } from './utils';
import TabNavigation from './components/TabNavigation';
import TabContent from './components/TabContent';

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(DEFAULT_ACTIVE_TAB);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Ref to track authentication check
    const authCheckRef = useRef(false);

    // Check authentication on mount
    useEffect(() => {
        if (authCheckRef.current) return;
        authCheckRef.current = true;

        try {
            let token = authService.getAuthToken();
            const isDev = authService.isDevelopment();
            
            if (!token && !isDev) {
                logger.warn('No authentication token found');
                router.push('/login');
                return;
            }
            
            if (!token && isDev) {
                token = authService.createMockToken();
            }
            
            setIsAuthenticated(true);
            logger.info('User authenticated');
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Authentication check failed';
            setError(errorMessage);
            logger.error('Auth check error', err);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Handle tab change
    const handleTabChange = useCallback((tabId) => {
        try {
            setActiveTab(tabId);
            setError('');
            logger.info('Tab changed', { tabId });
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Failed to change tab';
            setError(errorMessage);
            logger.error('Tab change error', err);
        }
    }, []);

    // Handle logout
    const handleLogout = useCallback(async () => {
        try {
            setLoading(true);
            authService.clearAuthTokens();
            logger.info('Logout successful');
            router.push('/login');
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Logout failed';
            setError(errorMessage);
            logger.error('Logout error', err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Loading state
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingSpinner}>
                    <Typography>Loading...</Typography>
                </div>
            </div>
        );
    }

    // Not authenticated state
    if (!isAuthenticated) {
        return null;
    }

    // Main render
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <Typography variant="h5" className={styles.headerTitle}>
                        Dashboard
                    </Typography>
                    <button
                        type="button"
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className={styles.errorMessage} role="alert">
                    ⚠️ {error}
                </div>
            )}

            {/* Main Content */}
            <div className={styles.mainContent}>
                <TabContent activeTab={activeTab} />
            </div>

            {/* Tab Navigation Footer */}
            <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
    );
}

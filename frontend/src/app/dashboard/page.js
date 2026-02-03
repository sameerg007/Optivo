'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/features/dashboard/dashboard.module.css';
import { TAB_CONTENT, DEFAULT_ACTIVE_TAB } from '@/config/dashboard.config';
import { AuthService, Logger } from '@/services';
import TabNavigation from '@/components/features/dashboard/TabNavigation';
import TabContent from '@/components/features/dashboard/TabContent';

export default function DashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(DEFAULT_ACTIVE_TAB);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Ref to track authentication check
    const authCheckRef = useRef(false);

    // Bypass authentication in development - auto authenticate
    useEffect(() => {
        // Always authenticate in development mode for easier testing
        setIsAuthenticated(true);
        setLoading(false);
    }, []);

    // Check authentication on mount (kept for production)
    useEffect(() => {
        if (authCheckRef.current) return;
        authCheckRef.current = true;

        try {
            let token = AuthService.getAuthToken();
            const isDev = AuthService.isDevelopment();
            
            // In development, always allow access
            if (isDev) {
                if (!token) {
                    token = AuthService.createMockToken();
                }
                setIsAuthenticated(true);
                setLoading(false);
                Logger.info('Dashboard', 'Dev mode: Auto authenticated');
                return;
            }
            
            if (!token) {
                Logger.warn('Dashboard', 'No authentication token found');
                router.push('/login');
                return;
            }
            
            setIsAuthenticated(true);
            Logger.info('Dashboard', 'User authenticated');
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Authentication check failed';
            setError(errorMessage);
            Logger.error('Dashboard', 'Auth check error', err);
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
            Logger.info('Dashboard', 'Tab changed', { tabId });
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Failed to change tab';
            setError(errorMessage);
            Logger.error('Dashboard', 'Tab change error', err);
        }
    }, []);

    // Handle logout
    const handleLogout = useCallback(async () => {
        try {
            setLoading(true);
            AuthService.logout();
            Logger.info('Dashboard', 'Logout successful');
            router.push('/login');
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Logout failed';
            setError(errorMessage);
            Logger.error('Dashboard', 'Logout error', err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Loading state
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingSpinner}>
                    <p>Loading...</p>
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
                    <h1 className={styles.headerTitle}>Dashboard</h1>
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

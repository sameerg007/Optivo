'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import styles from './dashboard.module.css';

// Constants
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Logger utility for production
const logger = {
    info: (message, data) => {
        if (!IS_PRODUCTION) {
            console.log(`[INFO] ${message}`, data);
        }
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);
    },
    warn: (message, data) => {
        if (!IS_PRODUCTION) {
            console.warn(`[WARN] ${message}`, data);
        }
    }
};

// Tab data
const TABS = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
];

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('tab1');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Ref to track authentication check
    const authCheckRef = useRef(false);

    // Check authentication on mount and remove the dev mode dependency in this when apis are integrated
    useEffect(() => {
        if (authCheckRef.current) return;
        authCheckRef.current = true;

        try {
            const token = localStorage?.getItem('authToken');
            const isDev = process.env.NODE_ENV === 'development';
            
            if (!token && !isDev) {
                logger.warn('No authentication token found');
                router.push('/login');
                return;
            }
            
            // In dev mode, create a mock token if it doesn't exist
            if (!token && isDev) {
                localStorage?.setItem('authToken', 'mock-dev-token');
                logger.info('Dev mode: Mock token created for testing');
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
            logger.info('Logout initiated');
            
            // Clear local storage
            localStorage?.removeItem('authToken');
            localStorage?.removeItem('refreshToken');
            
            // Redirect to login
            router.push('/login');
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Logout failed';
            setError(errorMessage);
            logger.error('Logout error', err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Render tab content based on active tab
    const renderTabContent = useCallback(() => {
        switch (activeTab) {
            case 'tab1':
                return (
                    <div className={styles.tabContent}>
                        <h2>Tab 1 Content</h2>
                        <p>This is the content for Tab 1. Backend integration will be added here.</p>
                    </div>
                );
            case 'tab2':
                return (
                    <div className={styles.tabContent}>
                        <h2>Tab 2 Content</h2>
                        <p>This is the content for Tab 2. Backend integration will be added here.</p>
                    </div>
                );
            case 'tab3':
                return (
                    <div className={styles.tabContent}>
                        <h2>Tab 3 Content</h2>
                        <p>This is the content for Tab 3. Backend integration will be added here.</p>
                    </div>
                );
            default:
                return null;
        }
    }, [activeTab]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingSpinner}>
                    <Typography>Loading...</Typography>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.container}>
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

            {error && (
                <div className={styles.errorMessage} role="alert">
                    ⚠️ {error}
                </div>
            )}

            <div className={styles.mainContent}>
                {renderTabContent()}
            </div>

            {/* Footer with Tabs */}
            <div className={styles.footer}>
                <div className={styles.tabNavigation}>
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => handleTabChange(tab.id)}
                            aria-selected={activeTab === tab.id}
                            role="tab"
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

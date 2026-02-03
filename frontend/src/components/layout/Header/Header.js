/**
 * Header Component
 * Main application header with navigation
 */

'use client';

import React from 'react';
import styles from './Header.module.css';

const Header = ({
    title = 'Optivo',
    showLogout = true,
    onLogout,
    loading = false,
    children
}) => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.actions}>
                    {children}
                    {showLogout && onLogout && (
                        <button
                            type="button"
                            className={styles.logoutButton}
                            onClick={onLogout}
                            disabled={loading}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

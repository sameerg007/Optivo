'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';
import { AuthService, Logger } from '@/services';

const Profile = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Handle logout
    const handleLogout = useCallback(async () => {
        try {
            setLoading(true);
            AuthService.logout();
            Logger.info('Profile', 'Logout successful');
            router.push('/login');
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Logout failed';
            Logger.error('Profile', 'Logout error', err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    return (
        <div className={styles.profileContainer}>
            {/* Profile Header */}
            <div className={styles.profileHeader}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatar}>
                        <span className={styles.avatarIcon}>👤</span>
                    </div>
                    <div className={styles.userInfo}>
                        <h2 className={styles.userName}>User</h2>
                        <p className={styles.userEmail}>user@example.com</p>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className={styles.profileContent}>
                {/* Account Settings Section */}
                <div className={styles.settingsSection}>
                    <h3 className={styles.sectionTitle}>Account Settings</h3>
                    
                    <div className={styles.settingsList}>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingIcon}>🔔</span>
                                <span className={styles.settingLabel}>Notifications</span>
                            </div>
                            <span className={styles.settingArrow}>›</span>
                        </div>

                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingIcon}>🔒</span>
                                <span className={styles.settingLabel}>Privacy & Security</span>
                            </div>
                            <span className={styles.settingArrow}>›</span>
                        </div>

                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingIcon}>🎨</span>
                                <span className={styles.settingLabel}>Appearance</span>
                            </div>
                            <span className={styles.settingArrow}>›</span>
                        </div>

                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingIcon}>❓</span>
                                <span className={styles.settingLabel}>Help & Support</span>
                            </div>
                            <span className={styles.settingArrow}>›</span>
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className={styles.logoutSection}>
                    <button
                        type="button"
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

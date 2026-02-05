'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';
import AddCategoryModal from './AddCategoryModal';
import { AuthService, Logger } from '@/services';


const CATEGORY_STORAGE_KEY = 'optivo_user_categories';

const defaultCategories = [
    { name: 'Food', icon: '🍔', color: '#FF6B6B' },
    { name: 'Transport', icon: '🚗', color: '#4ECDC4' },
    { name: 'Entertainment', icon: '🎬', color: '#45B7D1' },
    { name: 'Utilities', icon: '💡', color: '#FFA502' },
    { name: 'Shopping', icon: '🛍️', color: '#FF69B4' },
    { name: 'Health', icon: '🏥', color: '#6BCB77' },
    { name: 'Other', icon: '📌', color: '#9D84B7' }
];

const Profile = () => {
        const router = useRouter();
        const [loading, setLoading] = useState(false);
        const [notificationsEnabled, setNotificationsEnabled] = useState(true);
        const [categories, setCategories] = useState(defaultCategories);
        const [showAddCategory, setShowAddCategory] = useState(false);

        // Load categories from localStorage
        useEffect(() => {
            const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);
            if (saved) {
                try {
                    setCategories(JSON.parse(saved));
                } catch {}
            }
        }, []);

        // Save categories to localStorage
        useEffect(() => {
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
        }, [categories]);
        const handleAddCategory = (cat) => {
            setCategories((prev) => [...prev, cat]);
        };

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

    const settingsItems = [
        {
            id: 'notifications',
            icon: '🔔',
            label: 'Notifications',
            description: 'Manage alerts and reminders',
            type: 'toggle',
            value: notificationsEnabled,
            onToggle: () => setNotificationsEnabled(!notificationsEnabled)
        },
        {
            id: 'privacy',
            icon: '🔒',
            label: 'Privacy & Security',
            description: 'Password and data protection',
            type: 'arrow'
        },
        {
            id: 'appearance',
            icon: '🎨',
            label: 'Appearance',
            description: 'Theme and display settings',
            type: 'arrow'
        },
        {
            id: 'help',
            icon: '❓',
            label: 'Help & Support',
            description: 'FAQs and contact support',
            type: 'arrow'
        },
        {
            id: 'about',
            icon: 'ℹ️',
            label: 'About',
            description: 'App info and legal',
            type: 'arrow'
        }
    ];

    return (
        <div className={styles.profileContainer}>
            {/* Profile Header Card */}
            <div className={styles.profileHeader}>
                <div className={styles.headerGradient}></div>
                <div className={styles.headerContent}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            <span className={styles.avatarIcon}>👤</span>
                        </div>
                        <div className={styles.userInfo}>
                            <h2 className={styles.userName}>User</h2>
                            <p className={styles.userEmail}>user@example.com</p>
                            <div className={styles.userBadge}>
                                <span className={styles.badgeIcon}>✓</span>
                                <span className={styles.badgeText}>Verified Account</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                        {/* Profile Content */}
                        <div className={styles.profileContent}>
                                {/* Categories Section */}
                                <div className={styles.settingsSection}>
                                    <div className={styles.sectionHeader}>
                                        <h3 className={styles.sectionTitle}>Expense Categories</h3>
                                        <button className={styles.addExpenseBtn} style={{marginLeft:'auto'}} onClick={()=>setShowAddCategory(true)}>
                                            + Add Category
                                        </button>
                                    </div>
                                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',padding:'1rem'}}>
                                        {categories.map((cat, idx) => (
                                            <div key={cat.name+idx} style={{display:'flex',alignItems:'center',gap:8,background:'#262932',borderRadius:8,padding:'0.5rem 1rem',minWidth:90}}>
                                                <span style={{fontSize:'1.25rem'}}>{cat.icon}</span>
                                                <span style={{fontWeight:600,color:cat.color}}>{cat.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            <AddCategoryModal isOpen={showAddCategory} onClose={()=>setShowAddCategory(false)} onAddCategory={handleAddCategory} />
                {/* Account Settings Section */}
                <div className={styles.settingsSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Account Settings</h3>
                    </div>
                    
                    <div className={styles.settingsList}>
                        {settingsItems.map((item) => (
                            <div 
                                key={item.id} 
                                className={styles.settingItem}
                                onClick={item.type === 'toggle' ? item.onToggle : undefined}
                            >
                                <div className={styles.settingInfo}>
                                    <div className={`${styles.settingIconWrapper} ${styles[item.id]}`}>
                                        <span className={styles.settingIcon}>{item.icon}</span>
                                    </div>
                                    <div className={styles.settingDetails}>
                                        <span className={styles.settingLabel}>{item.label}</span>
                                        <span className={styles.settingDescription}>{item.description}</span>
                                    </div>
                                </div>
                                {item.type === 'toggle' ? (
                                    <div className={`${styles.toggleSwitch} ${item.value ? styles.active : ''}`}></div>
                                ) : (
                                    <span className={styles.settingArrow}>›</span>
                                )}
                            </div>
                        ))}
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

                {/* App Info */}
                <div className={styles.appInfo}>
                    <span className={styles.appVersion}>Optivo v1.0.0</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;

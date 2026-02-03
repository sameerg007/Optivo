'use client';

import React from 'react';
import styles from '../dashboard.module.css';
import { TABS } from '../config';

const TabNavigation = ({ activeTab, onTabChange }) => {
    return (
        <div className={styles.footer}>
            <div className={styles.tabNavigation}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => onTabChange(tab.id)}
                        aria-selected={activeTab === tab.id}
                        role="tab"
                        title={tab.label}
                    >
                        <span className={styles.tabIcon}>{tab.icon}</span>
                        <span className={styles.tabLabel}>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabNavigation;

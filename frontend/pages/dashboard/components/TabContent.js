'use client';

import React, { useMemo } from 'react';
import styles from '../dashboard.module.css';
import { TAB_CONTENT } from '../config';

const TabContent = ({ activeTab }) => {
    const tabData = useMemo(() => {
        return TAB_CONTENT[activeTab] || null;
    }, [activeTab]);

    if (!tabData) {
        return (
            <div className={styles.tabContent}>
                <h2>Content Not Found</h2>
                <p>The selected tab content is not available.</p>
            </div>
        );
    }

    return (
        <div className={styles.tabContent}>
            <h2>{tabData.title}</h2>
            <p>{tabData.description}</p>
        </div>
    );
};

export default TabContent;

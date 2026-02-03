'use client';

import React from 'react';
import styles from './summaryCard.module.css';

export default function SummaryCard({ totalSpent, monthlyBudget, remaining }) {
    const spentPercentage = ((parseFloat(totalSpent) / monthlyBudget) * 100).toFixed(1);

    return (
        <div className={styles.summaryCard}>
            {/* Gradient Background */}
            <div className={styles.gradientBg} />

            <div className={styles.cardContent}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>This Month</h2>
                    <span className={styles.percentage}>{spentPercentage}%</span>
                </div>

                {/* Total Spent */}
                <div className={styles.totalSpent}>
                    <span className={styles.label}>Total Spent</span>
                    <h1 className={styles.amount}>₹{parseFloat(totalSpent).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                </div>

                {/* Stats Row */}
                <div className={styles.statsRow}>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Budget</span>
                        <p className={styles.statValue}>₹{monthlyBudget.toLocaleString('en-IN')}</p>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Remaining</span>
                        <p className={`${styles.statValue} ${parseFloat(remaining) < 0 ? styles.negative : styles.positive}`}>
                            ₹{parseFloat(remaining).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import styles from './budgetStatus.module.css';

export default function BudgetStatus({ spent, budget, percentage }) {
    const remaining = budget - spent;
    const isOverBudget = remaining < 0;

    // Get status color based on percentage - professional palette
    const getStatusColor = () => {
        if (percentage <= 50) return '#059669'; // Emerald
        if (percentage <= 80) return '#d97706'; // Amber
        return '#dc2626'; // Red
    };

    const statusColor = getStatusColor();

    return (
        <div className={styles.budgetCard}>
            <h3 className={styles.title}>Budget Status</h3>

            {/* Circular Progress */}
            <div className={styles.progressContainer}>
                <svg className={styles.progressRing} viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        className={styles.bgCircle}
                    />
                    {/* Progress circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        className={styles.progressCircle}
                        style={{
                            strokeDashoffset: 339.29 * (1 - percentage / 100),
                            stroke: statusColor
                        }}
                    />
                </svg>

                {/* Center Text */}
                <div className={styles.centerText}>
                    <span className={styles.percentage}>{percentage.toFixed(0)}%</span>
                    <span className={styles.label}>Used</span>
                </div>
            </div>

            {/* Status Information */}
            <div className={styles.statusInfo}>
                <div className={styles.spent}>
                    <span className={styles.label}>Spent</span>
                    <p className={styles.amount}>₹{spent.toFixed(0)}</p>
                </div>
                <div className={styles.budget}>
                    <span className={styles.label}>Budget</span>
                    <p className={styles.amount}>₹{budget.toFixed(0)}</p>
                </div>
            </div>

            {/* Remaining Status */}
            <div className={`${styles.remainingStatus} ${isOverBudget ? styles.over : styles.safe}`}>
                {isOverBudget ? (
                    <>
                        <span className={styles.label}>Over Budget</span>
                        <p className={styles.amount}>₹{Math.abs(remaining).toFixed(0)}</p>
                    </>
                ) : (
                    <>
                        <span className={styles.label}>Remaining</span>
                        <p className={styles.amount}>₹{remaining.toFixed(0)}</p>
                    </>
                )}
            </div>
        </div>
    );
}

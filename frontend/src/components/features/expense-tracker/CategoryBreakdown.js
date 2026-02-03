'use client';

import React, { useMemo } from 'react';
import styles from './categoryBreakdown.module.css';
import { CATEGORIES } from './config';

export default function CategoryBreakdown({ expenses, onCategorySelect, selectedCategory, categories }) {
    // Calculate category totals
    const categoryTotals = useMemo(() => {
        const totals = {};
        Object.keys(categories).forEach((key) => {
            totals[key] = 0;
        });

        expenses.forEach((exp) => {
            if (totals.hasOwnProperty(exp.category)) {
                totals[exp.category] += exp.amount;
            }
        });

        return totals;
    }, [expenses, categories]);

    // Calculate total for percentage
    const totalAmount = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

    // Sort categories by amount (descending)
    const sortedCategories = useMemo(() => {
        return Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6); // Top 6 categories
    }, [categoryTotals]);

    return (
        <div className={styles.breakdownCard}>
            <h3 className={styles.title}>Spending by Category</h3>

            <div className={styles.categoriesList}>
                {sortedCategories.map(([catKey, amount]) => {
                    const percentage = ((amount / totalAmount) * 100).toFixed(1);
                    const category = categories[catKey];

                    return (
                        <button
                            key={catKey}
                            className={`${styles.categoryItem} ${selectedCategory === catKey ? styles.active : ''}`}
                            onClick={() => onCategorySelect(catKey)}
                        >
                            {/* Icon */}
                            <span className={styles.icon}>{category.icon}</span>

                            {/* Category Info */}
                            <div className={styles.categoryInfo}>
                                <span className={styles.categoryName}>{category.name}</span>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progress}
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: category.color
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Amount and Percentage */}
                            <div className={styles.categoryAmount}>
                                <span className={styles.amount}>₹{amount.toFixed(0)}</span>
                                <span className={styles.percent}>{percentage}%</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Legend Note */}
            <p className={styles.note}>Click category to filter transactions</p>
        </div>
    );
}

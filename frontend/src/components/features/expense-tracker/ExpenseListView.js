'use client';

import React, { useMemo } from 'react';
import styles from './expenseListView.module.css';

/**
 * ListView Component
 * Displays expenses in a stack-like list format, latest at top
 * 
 * @param {Array} expenses - Array of expense objects
 * @param {Object} categories - Category configuration object
 * @param {Function} onExpenseClick - Callback when expense is clicked
 */
export default function ExpenseListView({ expenses, categories, onExpenseClick }) {
    // Sort expenses by date (latest first)
    const sortedExpenses = useMemo(() => {
        return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [expenses]);

    // Group expenses by date
    const groupedByDate = useMemo(() => {
        const groups = {};
        sortedExpenses.forEach((expense) => {
            const dateKey = formatDateKey(expense.date);
            if (!groups[dateKey]) {
                groups[dateKey] = {
                    label: formatDateLabel(expense.date),
                    expenses: [],
                    total: 0,
                };
            }
            groups[dateKey].expenses.push(expense);
            groups[dateKey].total += expense.amount;
        });
        return Object.values(groups);
    }, [sortedExpenses]);

    return (
        <div className={styles.listViewContainer}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>All Expenses</h2>
                <span className={styles.count}>{expenses.length} transactions</span>
            </div>

            {/* Expense Stack */}
            <div className={styles.expenseStack}>
                {groupedByDate.map((group, groupIndex) => (
                    <div key={group.label} className={styles.dateGroup}>
                        {/* Date Header */}
                        <div className={styles.dateHeader}>
                            <span className={styles.dateLabel}>{group.label}</span>
                            <span className={styles.dateTotal}>₹{group.total.toFixed(2)}</span>
                        </div>

                        {/* Expenses for this date */}
                        <div className={styles.expenseList}>
                            {group.expenses.map((expense, index) => {
                                const category = categories[expense.category] || {
                                    name: expense.category,
                                    icon: '📝',
                                    color: '#6B7280',
                                };

                                return (
                                    <div
                                        key={expense.id || `${groupIndex}-${index}`}
                                        className={styles.expenseCard}
                                        onClick={() => onExpenseClick?.(expense)}
                                        style={{ '--delay': `${index * 0.05}s` }}
                                    >
                                        {/* Left: Icon & Info */}
                                        <div className={styles.expenseLeft}>
                                            <div
                                                className={styles.iconWrapper}
                                                style={{ backgroundColor: `${category.color}15` }}
                                            >
                                                <span className={styles.icon}>{category.icon}</span>
                                            </div>
                                            <div className={styles.expenseInfo}>
                                                <span className={styles.expenseName}>
                                                    {expense.name || expense.description}
                                                    {expense.bill && (
                                                        <span className={styles.receiptBadge} title="Receipt attached">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                                <polyline points="14 2 14 8 20 8" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </span>
                                                <span className={styles.categoryName}>{category.name}</span>
                                            </div>
                                        </div>

                                        {/* Right: Amount & Time */}
                                        <div className={styles.expenseRight}>
                                            <span className={styles.amount}>-₹{expense.amount.toFixed(2)}</span>
                                            <span className={styles.time}>{formatTime(expense.date)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {expenses.length === 0 && (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📭</span>
                        <p>No expenses yet</p>
                        <span className={styles.emptyHint}>Add your first expense to get started</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper functions
function formatDateKey(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function formatDateLabel(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) {
        return 'Today';
    } else if (isSameDay(date, yesterday)) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    }
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

function isSameDay(date1, date2) {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

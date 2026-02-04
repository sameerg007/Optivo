'use client';

import React from 'react';
import styles from './recentTransactions.module.css';

export default function RecentTransactions({ transactions, selectedCategory, categories }) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const dateStr = formatDate(transaction.date);
        if (!groups[dateStr]) {
            groups[dateStr] = [];
        }
        groups[dateStr].push(transaction);
        return groups;
    }, {});

    return (
        <div className={styles.transactionsCard}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {selectedCategory ? 'Filtered Transactions' : 'Recent Transactions'}
                </h3>
                {selectedCategory && (
                    <span className={styles.filterBadge}>
                        {categories[selectedCategory].icon} {categories[selectedCategory].name}
                    </span>
                )}
            </div>

            <div className={styles.transactionsList}>
                {Object.entries(groupedTransactions).map(([date, trans]) => (
                    <div key={date} className={styles.dateGroup}>
                        <div className={styles.dateLabel}>{date}</div>

                        {trans.map((transaction) => {
                            const category = categories[transaction.category];
                            return (
                                <div key={transaction.id} className={styles.transactionItem} style={{ '--category-color': category.color }}>
                                    {/* Icon and Description */}
                                    <div className={styles.transactionInfo}>
                                        <div className={styles.iconBg}>
                                            <span className={styles.icon}>{category.icon}</span>
                                        </div>
                                        <div className={styles.details}>
                                            <p className={styles.description}>
                                                {transaction.description}
                                                {transaction.bill && (
                                                    <span className={styles.receiptBadge} title="Receipt attached">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                            <polyline points="14 2 14 8 20 8" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </p>
                                            <span className={styles.time}>{transaction.time}</span>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className={styles.amount}>
                                        <span className={styles.amountValue}>₹{transaction.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}

                {transactions.length === 0 && (
                    <div className={styles.empty}>
                        <p>No transactions found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

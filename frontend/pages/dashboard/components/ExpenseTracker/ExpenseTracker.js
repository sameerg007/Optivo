'use client';

import React, { useState, useCallback, useMemo } from 'react';
import styles from './expenseTracker.module.css';
import SummaryCard from './SummaryCard';
import CategoryBreakdown from './CategoryBreakdown';
import RecentTransactions from './RecentTransactions';
import BudgetStatus from './BudgetStatus';
import AddExpenseModal from './AddExpenseModal';
import { EXPENSE_DATA, CATEGORIES } from './config';

export default function ExpenseTracker() {
    const [expenses, setExpenses] = useState(EXPENSE_DATA);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate summary metrics
    const summary = useMemo(() => {
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const monthlyBudget = 5000;
        const remaining = monthlyBudget - totalSpent;
        const spentPercentage = (totalSpent / monthlyBudget) * 100;

        return {
            totalSpent: totalSpent.toFixed(2),
            monthlyBudget,
            remaining: remaining.toFixed(2),
            spentPercentage: Math.min(spentPercentage, 100)
        };
    }, [expenses]);

    // Group expenses by category
    const expensesByCategory = useMemo(() => {
        const grouped = {};
        expenses.forEach((exp) => {
            if (!grouped[exp.category]) {
                grouped[exp.category] = [];
            }
            grouped[exp.category].push(exp);
        });
        return grouped;
    }, [expenses]);

    // Get filtered transactions
    const filteredTransactions = useMemo(() => {
        if (!selectedCategory) {
            return expenses.slice(0, 8); // Show last 8 transactions
        }
        return expensesByCategory[selectedCategory] || [];
    }, [expenses, selectedCategory, expensesByCategory]);

    // Handle add expense
    const handleAddExpense = useCallback((newExpense) => {
        setExpenses((prev) => [newExpense, ...prev]);
        setSelectedCategory(null); // Reset filter
    }, []);

    // Handle category filter
    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(selectedCategory === category ? null : category);
    }, [selectedCategory]);

    // Handle modal
    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <div className={styles.expenseTrackerContainer}>
            {/* Summary Card */}
            <div className={styles.summarySection}>
                <SummaryCard
                    totalSpent={summary.totalSpent}
                    monthlyBudget={summary.monthlyBudget}
                    remaining={summary.remaining}
                />
            </div>

            {/* Main Content Grid */}
            <div className={styles.mainGrid}>
                {/* Left Section - Charts */}
                <div className={styles.chartsSection}>
                    {/* Budget Status */}
                    <BudgetStatus
                        spent={parseFloat(summary.totalSpent)}
                        budget={summary.monthlyBudget}
                        percentage={summary.spentPercentage}
                    />

                    {/* Category Breakdown */}
                    <CategoryBreakdown
                        expenses={expenses}
                        onCategorySelect={handleCategorySelect}
                        selectedCategory={selectedCategory}
                        categories={CATEGORIES}
                    />
                </div>

                {/* Right Section - Transactions */}
                <div className={styles.transactionsSection}>
                    <RecentTransactions
                        transactions={filteredTransactions}
                        selectedCategory={selectedCategory}
                        categories={CATEGORIES}
                    />
                </div>
            </div>

            {/* Add Expense Button */}
            <button 
                className={styles.addExpenseButton} 
                onClick={handleOpenModal}
                title="Add new expense"
            >
                <span className={styles.plusIcon}>+</span>
            </button>

            {/* Add Expense Modal */}
            <AddExpenseModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddExpense={handleAddExpense}
            />
        </div>
    );
}

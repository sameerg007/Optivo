'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useCategoryStore } from '@/store/zustandStore';
import styles from './expenseTracker.module.css';
import SummaryCard from './SummaryCard';
import CategoryBreakdown from './CategoryBreakdown';
import RecentTransactions from './RecentTransactions';
import BudgetStatus from './BudgetStatus';
import SpendingTrend from './SpendingTrend';
import AddExpenseModal from './AddExpenseModal';
import ExpenseListView from './ExpenseListView';
import { EXPENSE_DATA } from './config';

// View types
const VIEWS = {
    DASHBOARD: 'dashboard',
    LIST: 'list',
};


export default function ExpenseTracker() {
    const categories = useCategoryStore((state) => state.categories);
    const [expenses, setExpenses] = useState(EXPENSE_DATA);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeView, setActiveView] = useState(VIEWS.DASHBOARD);

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

    // Handle expense click in list view
    const handleExpenseClick = useCallback((expense) => {
        console.log('Expense clicked:', expense);
        // Can be extended to show expense details modal
    }, []);

    return (
        <div className={styles.expenseTrackerContainer}>
            {/* View Toggle */}
            <div className={styles.viewToggleWrapper}>
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.toggleBtn} ${activeView === VIEWS.DASHBOARD ? styles.active : ''}`}
                        onClick={() => setActiveView(VIEWS.DASHBOARD)}
                    >
                        <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Dashboard
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${activeView === VIEWS.LIST ? styles.active : ''}`}
                        onClick={() => setActiveView(VIEWS.LIST)}
                    >
                        <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                            <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                            <circle cx="4" cy="18" r="1.5" fill="currentColor" />
                        </svg>
                        List
                    </button>
                </div>
            </div>

            {/* Dashboard View */}
            {activeView === VIEWS.DASHBOARD && (
                <>
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
                                categories={Object.fromEntries(categories.map(cat => [cat.name.toLowerCase(), cat]))}
                            />

                            {/* Spending Trend Line Graph */}
                            <SpendingTrend expenses={expenses} categories={Object.fromEntries(categories.map(cat => [cat.name.toLowerCase(), cat]))} />
                        </div>

                        {/* Right Section - Transactions */}
                        <div className={styles.transactionsSection}>
                            <RecentTransactions
                                transactions={filteredTransactions}
                                selectedCategory={selectedCategory}
                                categories={Object.fromEntries(categories.map(cat => [cat.name.toLowerCase(), cat]))}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* List View */}
            {activeView === VIEWS.LIST && (
                <ExpenseListView
                    expenses={expenses}
                    categories={Object.fromEntries(categories.map(cat => [cat.name.toLowerCase(), cat]))}
                    onExpenseClick={handleExpenseClick}
                />
            )}

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
                categories={categories}
            />
        </div>
    );
}



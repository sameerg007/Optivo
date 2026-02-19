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




export default function ExpenseTracker() {
    const categories = useCategoryStore((state) => state.categories);
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

    // Handle expense click in list view
    const handleExpenseClick = useCallback((expense) => {
        console.log('Expense clicked:', expense);
        // Can be extended to show expense details modal
    }, []);


    return (
        <div className={styles.expenseTrackerContainer}>
            <ExpenseListView
                expenses={expenses}
                categories={Object.fromEntries(categories.map(cat => [cat.name.toLowerCase(), cat]))}
                onExpenseClick={handleExpenseClick}
            />

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



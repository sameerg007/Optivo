'use client';

import React, { useState, useCallback } from 'react';
import styles from './addExpenseModal.module.css';
import { CATEGORIES } from './config';

export default function AddExpenseModal({ isOpen, onClose, onAddExpense }) {
    const [formData, setFormData] = useState({
        category: 'food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        return newErrors;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 300));

            const newExpense = {
                id: Date.now().toString(),
                category: formData.category,
                amount: parseFloat(formData.amount),
                description: formData.description,
                date: formData.date,
                time: new Date().toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
            };

            onAddExpense(newExpense);

            // Reset form
            setFormData({
                category: 'food',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });

            onClose();
        } catch (error) {
            setErrors({ submit: 'Failed to add expense. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.title}>Add Expense</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Category */}
                    <div className={styles.formGroup}>
                        <label htmlFor="category" className={styles.label}>
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={styles.select}
                        >
                            {Object.entries(CATEGORIES).map(([key, cat]) => (
                                <option key={key} value={key}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div className={styles.formGroup}>
                        <label htmlFor="amount" className={styles.label}>
                            Amount (₹)
                        </label>
                        <input
                            id="amount"
                            type="number"
                            name="amount"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className={`${styles.input} ${errors.amount ? styles.inputError : ''}`}
                        />
                        {errors.amount && (
                            <span className={styles.errorText}>{errors.amount}</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.label}>
                            Description
                        </label>
                        <input
                            id="description"
                            type="text"
                            name="description"
                            placeholder="What did you spend on?"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`${styles.input} ${errors.description ? styles.inputError : ''}`}
                        />
                        {errors.description && (
                            <span className={styles.errorText}>{errors.description}</span>
                        )}
                    </div>

                    {/* Date */}
                    <div className={styles.formGroup}>
                        <label htmlFor="date" className={styles.label}>
                            Date
                        </label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                        />
                        {errors.date && (
                            <span className={styles.errorText}>{errors.date}</span>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className={styles.submitError}>{errors.submit}</div>
                    )}

                    {/* Buttons */}
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

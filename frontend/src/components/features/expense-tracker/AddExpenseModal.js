'use client';

import React, { useState, useCallback, useRef } from 'react';
import styles from './addExpenseModal.module.css';
import { CATEGORIES, PAYMENT_MODES, SAVED_CARDS } from './config';

export default function AddExpenseModal({ isOpen, onClose, onAddExpense }) {
    const [formData, setFormData] = useState({
        category: 'food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'upi',
        selectedCard: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [billImage, setBillImage] = useState(null);
    const [billPreview, setBillPreview] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

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

    // Handle file upload
    const handleFileUpload = useCallback((file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                bill: 'Please upload an image (JPEG, PNG, GIF, WebP) or PDF'
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                bill: 'File size must be less than 5MB'
            }));
            return;
        }

        setBillImage(file);
        setErrors((prev) => ({ ...prev, bill: '' }));

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBillPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            // For PDF, show a placeholder
            setBillPreview('pdf');
        }
    }, []);

    // Handle file input change
    const handleFileInputChange = useCallback((e) => {
        const file = e.target.files?.[0];
        handleFileUpload(file);
    }, [handleFileUpload]);

    // Handle drag events
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const file = e.dataTransfer.files?.[0];
        handleFileUpload(file);
    }, [handleFileUpload]);

    // Remove uploaded bill
    const handleRemoveBill = useCallback(() => {
        setBillImage(null);
        setBillPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Trigger file input click
    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

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
                }),
                paymentMode: formData.paymentMode,
                selectedCard: (formData.paymentMode === 'credit_card' || formData.paymentMode === 'debit_card') 
                    ? formData.selectedCard 
                    : null,
                bill: billImage ? {
                    name: billImage.name,
                    type: billImage.type,
                    size: billImage.size,
                    preview: billPreview
                } : null
            };

            onAddExpense(newExpense);

            // Reset form
            setFormData({
                category: 'food',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                paymentMode: 'upi',
                selectedCard: ''
            });
            setBillImage(null);
            setBillPreview(null);

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

                    {/* Payment Mode */}
                    <div className={styles.formGroup}>
                        <label htmlFor="paymentMode" className={styles.label}>
                            Payment Mode
                        </label>
                        <div className={styles.paymentModeGrid}>
                            {Object.entries(PAYMENT_MODES).map(([key, mode]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`${styles.paymentModeButton} ${formData.paymentMode === key ? styles.paymentModeActive : ''}`}
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            paymentMode: key,
                                            selectedCard: ''
                                        }));
                                    }}
                                    style={{
                                        '--mode-color': mode.color
                                    }}
                                >
                                    <span className={styles.paymentModeIcon}>{mode.icon}</span>
                                    <span className={styles.paymentModeName}>{mode.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Card Selection - Only show for credit/debit card */}
                    {(formData.paymentMode === 'credit_card' || formData.paymentMode === 'debit_card') && (
                        <div className={styles.formGroup}>
                            <label htmlFor="selectedCard" className={styles.label}>
                                Select {formData.paymentMode === 'credit_card' ? 'Credit' : 'Debit'} Card
                            </label>
                            <div className={styles.cardSelectionGrid}>
                                {(formData.paymentMode === 'credit_card' ? SAVED_CARDS.credit : SAVED_CARDS.debit).map((card) => (
                                    <button
                                        key={card.id}
                                        type="button"
                                        className={`${styles.cardOption} ${formData.selectedCard === card.id ? styles.cardOptionActive : ''}`}
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                selectedCard: card.id
                                            }));
                                        }}
                                        style={{
                                            '--card-color': card.color
                                        }}
                                    >
                                        <div className={styles.cardIcon}>💳</div>
                                        <div className={styles.cardDetails}>
                                            <span className={styles.cardName}>{card.name}</span>
                                            <span className={styles.cardNumber}>•••• {card.lastFour}</span>
                                        </div>
                                        <span className={styles.cardNetwork}>{card.network}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.selectedCard && (
                                <span className={styles.errorText}>{errors.selectedCard}</span>
                            )}
                        </div>
                    )}

                    {/* Bill Upload */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Receipt / Bill (Optional)
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileInputChange}
                            className={styles.hiddenInput}
                        />
                        
                        {!billPreview ? (
                            <div
                                className={`${styles.uploadZone} ${isDragOver ? styles.uploadZoneDragOver : ''}`}
                                onClick={handleUploadClick}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className={styles.uploadIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>
                                <p className={styles.uploadText}>
                                    <span className={styles.uploadLink}>Click to upload</span> or drag and drop
                                </p>
                                <p className={styles.uploadHint}>
                                    PNG, JPG, GIF, WebP or PDF (max 5MB)
                                </p>
                            </div>
                        ) : (
                            <div className={styles.previewContainer}>
                                {billPreview === 'pdf' ? (
                                    <div className={styles.pdfPreview}>
                                        <svg className={styles.pdfIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        <span className={styles.pdfName}>{billImage?.name}</span>
                                    </div>
                                ) : (
                                    <img
                                        src={billPreview}
                                        alt="Bill preview"
                                        className={styles.imagePreview}
                                    />
                                )}
                                <div className={styles.previewActions}>
                                    <span className={styles.fileName}>{billImage?.name}</span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveBill}
                                        className={styles.removeButton}
                                        aria-label="Remove file"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        {errors.bill && (
                            <span className={styles.errorText}>{errors.bill}</span>
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

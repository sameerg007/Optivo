'use client';

import React, { useState, useCallback } from 'react';
import styles from './addCardModal.module.css';
import { CARD_NETWORKS } from './config';
import Button from '@/components/common/Button';

// Card color options
const CARD_COLORS = [
    { id: 'blue', color: '#1e40af', name: 'Blue' },
    { id: 'purple', color: '#7c3aed', name: 'Purple' },
    { id: 'teal', color: '#0f766e', name: 'Teal' },
    { id: 'red', color: '#be185d', name: 'Red' },
    { id: 'green', color: '#15803d', name: 'Green' },
    { id: 'orange', color: '#c2410c', name: 'Orange' },
    { id: 'slate', color: '#475569', name: 'Slate' },
];

export default function AddCardModal({ isOpen, onClose, onAddCard, cardType }) {
    const [formData, setFormData] = useState({
        name: '',
        lastFour: '',
        network: 'Visa',
        color: CARD_COLORS[0].color
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // For lastFour, only allow digits and max 4
        if (name === 'lastFour') {
            const digits = value.replace(/\D/g, '').slice(0, 4);
            setFormData(prev => ({ ...prev, [name]: digits }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Card name is required';
        }

        if (!formData.lastFour || formData.lastFour.length !== 4) {
            newErrors.lastFour = 'Please enter last 4 digits of card';
        }

        if (!formData.network) {
            newErrors.network = 'Please select a network';
        }

        return newErrors;
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const newCard = {
                id: `${cardType === 'credit' ? 'cc' : 'dc'}_${Date.now()}`,
                name: formData.name.trim(),
                lastFour: formData.lastFour,
                network: formData.network,
                color: formData.color,
                type: cardType
            };

            onAddCard(newCard);

            // Reset form
            setFormData({
                name: '',
                lastFour: '',
                network: 'Visa',
                color: CARD_COLORS[0].color
            });
            setErrors({});
            onClose();
        } catch (error) {
            setErrors({ submit: 'Failed to add card. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, cardType, onAddCard, onClose]);

    const handleClose = useCallback(() => {
        setFormData({
            name: '',
            lastFour: '',
            network: 'Visa',
            color: CARD_COLORS[0].color
        });
        setErrors({});
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.title}>
                        Add {cardType === 'credit' ? 'Credit' : 'Debit'} Card
                    </h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Card Preview */}
                <div 
                    className={styles.cardPreview}
                    style={{ '--card-color': formData.color }}
                >
                    <div className={styles.cardType}>
                        {cardType === 'credit' ? 'CREDIT' : 'DEBIT'}
                    </div>
                    <div className={styles.cardNumber}>
                        •••• •••• •••• {formData.lastFour || '••••'}
                    </div>
                    <div className={styles.cardBottom}>
                        <div className={styles.cardName}>
                            {formData.name || 'Card Name'}
                        </div>
                        <div className={styles.cardNetwork}>
                            {formData.network}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Card Name */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Card Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="e.g., HDFC Credit Card"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        />
                        {errors.name && (
                            <span className={styles.errorText}>{errors.name}</span>
                        )}
                    </div>

                    {/* Last 4 Digits */}
                    <div className={styles.formGroup}>
                        <label htmlFor="lastFour" className={styles.label}>
                            Last 4 Digits
                        </label>
                        <input
                            id="lastFour"
                            type="text"
                            name="lastFour"
                            placeholder="1234"
                            value={formData.lastFour}
                            onChange={handleInputChange}
                            maxLength={4}
                            className={`${styles.input} ${errors.lastFour ? styles.inputError : ''}`}
                        />
                        {errors.lastFour && (
                            <span className={styles.errorText}>{errors.lastFour}</span>
                        )}
                    </div>

                    {/* Network */}
                    <div className={styles.formGroup}>
                        <label htmlFor="network" className={styles.label}>
                            Card Network
                        </label>
                        <select
                            id="network"
                            name="network"
                            value={formData.network}
                            onChange={handleInputChange}
                            className={styles.select}
                        >
                            {CARD_NETWORKS.map((network) => (
                                <option key={network} value={network}>
                                    {network}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Color */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Card Color
                        </label>
                        <div className={styles.colorGrid}>
                            {CARD_COLORS.map((colorOption) => (
                                <button
                                    key={colorOption.id}
                                    type="button"
                                    className={`${styles.colorOption} ${formData.color === colorOption.color ? styles.colorOptionActive : ''}`}
                                    style={{ '--option-color': colorOption.color }}
                                    onClick={() => setFormData(prev => ({ ...prev, color: colorOption.color }))}
                                    aria-label={colorOption.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className={styles.submitError}>{errors.submit}</div>
                    )}

                    {/* Buttons */}
                    <div className={styles.buttonGroup}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className={styles.submitButton}
                        >
                            Add Card
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

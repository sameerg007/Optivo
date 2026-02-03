/**
 * Button Component
 * Reusable button with variants and loading state
 */

'use client';

import React from 'react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    type = 'button',
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    className = '',
    ...props
}) => {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <>
                    <span className={styles.spinner} />
                    <span className={styles.loadingText}>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;

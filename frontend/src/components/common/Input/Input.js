/**
 * Input Component
 * Reusable input with error states and labels
 */

'use client';

import React from 'react';
import styles from './Input.module.css';

const Input = ({
    type = 'text',
    label,
    error,
    placeholder,
    value,
    onChange,
    disabled = false,
    required = false,
    name,
    id,
    autoComplete,
    className = '',
    ...props
}) => {
    const inputId = id || name;
    
    return (
        <div className={`${styles.inputWrapper} ${className}`}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <input
                id={inputId}
                name={name}
                type={type}
                className={`${styles.input} ${error ? styles.error : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
                {...props}
            />
            {error && (
                <span id={`${inputId}-error`} className={styles.errorText} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;

/**
 * Utility Functions - Validators
 * Validation helpers for forms and data
 */

import { REGEX_PATTERNS, ERROR_MESSAGES } from '../constants';
import APP_CONFIG from '../config/app.config';

/**
 * Validate email
 */
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }
    
    if (!REGEX_PATTERNS.EMAIL.test(email)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
    }
    
    return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    const minLength = APP_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return {
        isValid,
        error: isValid ? null : ERROR_MESSAGES.WEAK_PASSWORD,
        requirements: {
            minLength: password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar
        }
    };
};

/**
 * Validate amount
 */
export const validateAmount = (amount) => {
    if (!amount || amount === '') {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
    }

    return { isValid: true };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
    if (!phone) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (!REGEX_PATTERNS.PHONE.test(phone)) {
        return { isValid: false, error: 'Please enter a valid 10-digit phone number.' };
    }

    return { isValid: true };
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
    if (!url) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (!REGEX_PATTERNS.URL.test(url)) {
        return { isValid: false, error: 'Please enter a valid URL.' };
    }

    return { isValid: true };
};

/**
 * Validate field (generic)
 */
export const validateField = (value, fieldName, rules = {}) => {
    // Check required
    if (rules.required && !value) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
        return { isValid: false, error: `Minimum length is ${rules.minLength} characters.` };
    }

    // Check max length
    if (rules.maxLength && value.length > rules.maxLength) {
        return { isValid: false, error: `Maximum length is ${rules.maxLength} characters.` };
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        return { isValid: false, error: rules.patternError || 'Invalid format.' };
    }

    return { isValid: true };
};

/**
 * Validate form object
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
        const rules = validationRules[field];
        const value = formData[field];

        if (rules.required && !value) {
            errors[field] = ERROR_MESSAGES.REQUIRED_FIELD;
            isValid = false;
        } else if (rules.validator) {
            const result = rules.validator(value);
            if (!result.isValid) {
                errors[field] = result.error;
                isValid = false;
            }
        }
    });

    return { isValid, errors };
};

export default {
    validateEmail,
    validatePassword,
    validateAmount,
    validatePhone,
    validateURL,
    validateField,
    validateForm
};

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import styles from './signUp.module.css';
import TermsModal from '../termsModal/TermsModal';

// Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const SIGNUP_TIMEOUT = 30000; // 30 seconds
const MAX_SIGNUP_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Password requirements validation
const PASSWORD_REQUIREMENTS = {
    minLength: { regex: /.{8,}/, label: 'At least 8 characters' },
    uppercase: { regex: /[A-Z]/, label: 'One uppercase letter' },
    lowercase: { regex: /[a-z]/, label: 'One lowercase letter' },
    number: { regex: /[0-9]/, label: 'One number' },
    special: { regex: /[!@#$%^&*]/, label: 'One special character (!@#$%^&*)' },
};

// Logger utility for production
const logger = {
    info: (message, data) => {
        if (!IS_PRODUCTION) {
            console.log(`[INFO] ${message}`, data);
        }
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);
    },
    warn: (message, data) => {
        if (!IS_PRODUCTION) {
            console.warn(`[WARN] ${message}`, data);
        }
    }
};

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({});
    const [showTermsModal, setShowTermsModal] = useState(false);

    // Refs for abuse prevention
    const signupAttemptsRef = useRef(0);
    const lockoutTimeRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Validate email format
    const isValidEmail = useCallback((emailValue) => {
        if (!emailValue) return false;
        return EMAIL_REGEX.test(emailValue.trim());
    }, []);

    // Validate password strength
    const validatePasswordStrength = useCallback((passwordValue) => {
        const strength = {};
        Object.keys(PASSWORD_REQUIREMENTS).forEach((key) => {
            strength[key] = PASSWORD_REQUIREMENTS[key].regex.test(passwordValue);
        });
        return strength;
    }, []);

    // Check if password meets all requirements
    const isPasswordStrong = useCallback((passwordValue) => {
        const strength = validatePasswordStrength(passwordValue);
        return Object.values(strength).every(val => val === true);
    }, [validatePasswordStrength]);

    // Check if account is locked
    const isAccountLocked = useCallback(() => {
        if (lockoutTimeRef.current) {
            const now = Date.now();
            if (now < lockoutTimeRef.current) {
                const remainingTime = Math.ceil((lockoutTimeRef.current - now) / 1000);
                return { locked: true, remainingTime };
            } else {
                signupAttemptsRef.current = 0;
                lockoutTimeRef.current = null;
                return { locked: false, remainingTime: 0 };
            }
        }
        return { locked: false, remainingTime: 0 };
    }, []);

    // Handle input changes
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e?.target || {};
        
        // Open modal for terms checkbox instead of directly checking
        if (name === 'agreeToTerms' && !formData.agreeToTerms) {
            e.preventDefault();
            setShowTermsModal(true);
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error and success messages on input change
        if (error) setError('');
        if (success) setSuccess('');

        // Validate password strength in real-time
        if (name === 'password') {
            const strength = validatePasswordStrength(value);
            setPasswordStrength(strength);
        }
    }, [error, success, validatePasswordStrength, formData.agreeToTerms]);

    // Handle signup
    const handleSignUp = useCallback(async (e) => {
        e?.preventDefault?.();

        try {
            // Check for account lockout
            const lockoutStatus = isAccountLocked();
            if (lockoutStatus.locked) {
                const errorMsg = `Too many signup attempts. Please try again in ${lockoutStatus.remainingTime} seconds.`;
                setError(errorMsg);
                logger.warn('Signup attempt during lockout', { email: formData.email.substring(0, 3) + '***' });
                return;
            }

            // Validate all inputs
            if (!formData.firstName.trim()) {
                setError('First name is required');
                return;
            }

            if (!formData.lastName.trim()) {
                setError('Last name is required');
                return;
            }

            if (!formData.email.trim()) {
                setError('Email is required');
                return;
            }

            if (!isValidEmail(formData.email)) {
                setError('Please enter a valid email address');
                return;
            }

            if (!formData.password) {
                setError('Password is required');
                return;
            }

            if (!isPasswordStrong(formData.password)) {
                setError('Password does not meet all requirements');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (!formData.agreeToTerms) {
                setError('You must agree to the Terms of Service and Privacy Policy');
                return;
            }

            // Clear messages and set loading
            setError('');
            setSuccess('');
            setLoading(true);

            // Abort previous request if pending
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            logger.info('Signup attempt initiated', { email: formData.email.substring(0, 3) + '***' });

            // Make API call with timeout
            const controller = abortControllerRef.current;
            const timeoutId = setTimeout(() => controller.abort(), SIGNUP_TIMEOUT);

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle response
            if (!response.ok) {
                signupAttemptsRef.current += 1;

                if (signupAttemptsRef.current >= MAX_SIGNUP_ATTEMPTS) {
                    lockoutTimeRef.current = Date.now() + LOCKOUT_DURATION;
                    setError('Too many signup attempts. Please try again in 15 minutes.');
                    logger.warn('Account locked due to multiple failed attempts', { email: formData.email.substring(0, 3) + '***' });
                    return;
                }

                const data = await response?.json?.().catch(() => ({}));
                const errorMsg = data?.message || 'Signup failed. Please try again.';
                setError(errorMsg);
                logger.warn('Signup failed', { status: response.status, email: formData.email.substring(0, 3) + '***' });
                return;
            }

            // Reset attempts on success
            signupAttemptsRef.current = 0;
            lockoutTimeRef.current = null;

            const data = await response?.json?.();

            // Store token if provided
            if (data?.token) {
                localStorage?.setItem('authToken', data.token);
                if (data?.refreshToken) {
                    localStorage?.setItem('refreshToken', data.refreshToken);
                }
            }

            logger.info('Signup successful', { email: formData.email.substring(0, 3) + '***' });

            // Show success message and redirect
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err) {
            if (err?.name === 'AbortError') {
                setError('Signup request timed out. Please try again.');
                logger.error('Signup timeout', err);
            } else {
                const errorMessage = err instanceof Error ? err?.message : 'An unexpected error occurred. Please try again.';
                setError(errorMessage);
                logger.error('Signup error', err);
            }
            signupAttemptsRef.current += 1;
        } finally {
            setLoading(false);
        }
    }, [formData, isValidEmail, isPasswordStrong, isAccountLocked, router]);

    // Handle login redirect
    const handleLoginRedirect = useCallback(() => {
        try {
            logger.info('Redirecting to login page');
            router.push('/login');
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Failed to redirect. Please try again.';
            setError(errorMessage);
            logger.error('Login redirect error', err);
        }
    }, [router]);

    // Handle agreeing to terms
    const handleAgreeToTerms = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            agreeToTerms: true,
        }));
        setShowTermsModal(false);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <Typography variant="h4" className={styles.title}>
                    Optivo
                </Typography>

                <Typography className={styles.subtitle}>
                    Join us today! Create your account in seconds
                </Typography>

                <form onSubmit={handleSignUp} noValidate>
                    <div className={styles.formGroup}>
                        <div className={styles.inputField}>
                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName || ''}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="given-name"
                                required
                                aria-label="First Name"
                            />
                        </div>

                        <div className={styles.inputField}>
                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName || ''}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="family-name"
                                required
                                aria-label="Last Name"
                            />
                        </div>

                        <div className={styles.inputField}>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="email"
                                required
                                aria-label="Email Address"
                            />
                        </div>

                        <div className={styles.inputField}>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password || ''}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="new-password"
                                required
                                aria-label="Password"
                            />
                            {formData.password && (
                                <div className={styles.passwordRequirements}>
                                    {Object.entries(PASSWORD_REQUIREMENTS).map(([key, req]) => (
                                        <div key={key} className={styles.requirementItem}>
                                            <span className={`${styles.requirementIcon} ${passwordStrength[key] ? styles.met : styles.unmet}`}>
                                                {passwordStrength[key] ? '✓' : '○'}
                                            </span>
                                            {req.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.inputField}>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword || ''}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="new-password"
                                required
                                aria-label="Confirm Password"
                            />
                        </div>

                        <div className={styles.termsCheckbox}>
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                                disabled={loading}
                                className={styles.checkbox}
                                aria-label="Agree to Terms of Service"
                            />
                            <label htmlFor="agreeToTerms" className={styles.termsText}>
                                I agree to the{' '}
                                <a href="/terms" className={styles.termsLink} target="_blank" rel="noopener noreferrer">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className={styles.termsLink} target="_blank" rel="noopener noreferrer">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {error && (
                            <div className={styles.errorMessage} role="alert">
                                ⚠️ {error}
                            </div>
                        )}

                        {success && (
                            <div className={styles.successMessage} role="status">
                                ✓ {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className={styles.footerText}>
                    Already have an account?{' '}
                    <span
                        className={styles.footerLink}
                        onClick={handleLoginRedirect}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e?.key === 'Enter' || e?.key === ' ') {
                                handleLoginRedirect();
                            }
                        }}
                    >
                        Sign in
                    </span>
                </div>
            </div>

            {/* Terms Modal */}
            <TermsModal 
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                onAgree={handleAgreeToTerms}
            />
        </div>
    );
}
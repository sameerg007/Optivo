'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import styles from './forgotPassword.module.css';

// Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_TIMEOUT = 30000; // 30 seconds
const MAX_RESET_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

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

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Refs for performance and abuse prevention
    const resetAttemptsRef = useRef(0);
    const lockoutTimeRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Validate email format
    const isValidEmail = useCallback((emailValue) => {
        if (!emailValue) return false;
        return EMAIL_REGEX.test(emailValue.trim());
    }, []);

    // Check if account is locked due to too many attempts
    const isAccountLocked = useCallback(() => {
        if (lockoutTimeRef.current) {
            const now = Date.now();
            if (now < lockoutTimeRef.current) {
                const remainingTime = Math.ceil((lockoutTimeRef.current - now) / 1000);
                return { locked: true, remainingTime };
            } else {
                // Lockout expired, reset
                resetAttemptsRef.current = 0;
                lockoutTimeRef.current = null;
                return { locked: false, remainingTime: 0 };
            }
        }
        return { locked: false, remainingTime: 0 };
    }, []);

    // Handle forgot password with proper error handling and security
    const handleResetRequest = useCallback(async (e) => {
        e.preventDefault();

        try {
            // Check for account lockout
            const lockoutStatus = isAccountLocked();
            if (lockoutStatus.locked) {
                const errorMsg = `Too many reset attempts. Please try again in ${lockoutStatus.remainingTime} seconds.`;
                setError(errorMsg);
                logger.warn('Reset attempt during lockout', { email: email.substring(0, 3) + '***' });
                return;
            }

            // Validate input
            if (!email.trim()) {
                setError('Please enter your email address');
                return;
            }

            if (!isValidEmail(email)) {
                setError('Please enter a valid email address');
                return;
            }

            // Clear previous messages and set loading
            setError('');
            setSuccess('');
            setLoading(true);

            // Abort previous request if still pending
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            logger.info('Password reset request initiated', { email: email.substring(0, 3) + '***' });

            // Make API call with timeout
            const controller = abortControllerRef.current;
            const timeoutId = setTimeout(() => controller.abort(), RESET_TIMEOUT);

            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    email: email.trim(),
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle response
            if (!response.ok) {
                resetAttemptsRef.current += 1;

                if (resetAttemptsRef.current >= MAX_RESET_ATTEMPTS) {
                    lockoutTimeRef.current = Date.now() + LOCKOUT_DURATION;
                    setError('Too many password reset attempts. Please try again in 15 minutes.');
                    logger.warn('Account locked due to multiple failed reset attempts', { email: email.substring(0, 3) + '***' });
                    return;
                }

                const data = await response?.json?.().catch(() => ({}));
                const errorMsg = data?.message || 'Failed to send reset email. Please try again.';
                setError(errorMsg);
                logger.warn('Password reset request failed', { status: response.status, email: email.substring(0, 3) + '***' });
                return;
            }

            // Reset attempts on success
            resetAttemptsRef.current = 0;
            lockoutTimeRef.current = null;

            const data = await response?.json?.();

            logger.info('Password reset email sent successfully', { email: email.substring(0, 3) + '***' });

            // Show success message
            setSuccess('Password reset link has been sent to your email. Please check your inbox.');
            setEmail('');

            // Optional: Redirect to login after delay
            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (err) {
            // Handle abort and timeout errors
            if (err?.name === 'AbortError') {
                setError('Request timed out. Please try again.');
                logger.error('Password reset timeout', err);
            } else {
                const errorMessage = err instanceof Error ? err?.message : 'An unexpected error occurred. Please try again.';
                setError(errorMessage);
                logger.error('Password reset error', err);
            }
            resetAttemptsRef.current += 1;
        } finally {
            setLoading(false);
        }
    }, [email, isValidEmail, isAccountLocked, router]);

    // Handle back to login
    const handleBackToLogin = useCallback(() => {
        try {
            logger.info('Redirecting back to login page');
            router.push('/login');
        } catch (err) {
            const errorMessage = err instanceof Error ? err?.message : 'Failed to redirect. Please try again.';
            setError(errorMessage);
            logger.error('Login redirect error', err);
        }
    }, [router]);

    // Handle email change
    const handleEmailChange = useCallback((e) => {
        setEmail(e?.target?.value || '');
        if (error) setError(''); // Clear error on input change
        if (success) setSuccess(''); // Clear success on input change
    }, [error, success]);

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <Typography variant="h4" className={styles.title}>
                    Optivo
                </Typography>

                <Typography className={styles.subtitle}>
                    Reset Your Password
                </Typography>

                <Typography className={styles.description}>
                    Enter your email address and we'll send you a link to reset your password.
                </Typography>

                <form onSubmit={handleResetRequest} noValidate>
                    <div className={styles.formGroup}>
                        <div className={styles.inputField}>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                value={email || ''}
                                onChange={handleEmailChange}
                                disabled={loading}
                                autoComplete="email"
                                required
                                aria-label="Email Address"
                            />
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
                            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>

                <div className={styles.footerText}>
                    Remember your password?{' '}
                    <span
                        className={styles.footerLink}
                        onClick={handleBackToLogin}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e?.key === 'Enter' || e?.key === ' ') {
                                handleBackToLogin();
                            }
                        }}
                    >
                        Back to Login
                    </span>
                </div>
            </div>
        </div>
    );
}

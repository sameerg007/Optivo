'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Typography } from '@mui/material';
import styles from './login.module.css';

// Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_TIMEOUT = 30000; // 30 seconds
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Logger utility for production
const logger = {
    info: (message, data) => {
        if (!IS_PRODUCTION) {
            console.log(`[INFO] ${message}`, data);
        }
        // In production, send to monitoring service (e.g., Sentry, LogRocket)
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);
        // In production, send to error tracking service
    },
    warn: (message, data) => {
        if (!IS_PRODUCTION) {
            console.warn(`[WARN] ${message}`, data);
        }
    }
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Refs for performance and abuse prevention
    const loginAttemptsRef = useRef(0);
    const lockoutTimeRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Validate email format
    const isValidEmail = useCallback((emailValue) => {
        if (!emailValue) return false;
        return EMAIL_REGEX.test(emailValue.trim());
    }, []);

    // Validate password
    const isValidPassword = useCallback((passwordValue) => {
        return passwordValue && passwordValue.length >= 6;
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
                loginAttemptsRef.current = 0;
                lockoutTimeRef.current = null;
                return { locked: false, remainingTime: 0 };
            }
        }
        return { locked: false, remainingTime: 0 };
    }, []);

    // Handle login with proper error handling and security
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();

        try {
            // Check for account lockout
            const lockoutStatus = isAccountLocked();
            if (lockoutStatus.locked) {
                const errorMsg = `Too many login attempts. Please try again in ${lockoutStatus.remainingTime} seconds.`;
                setError(errorMsg);
                logger.warn('Login attempt during lockout', { email: email.substring(0, 3) + '***' });
                return;
            }

            // Validate inputs
            if (!email.trim() || !password) {
                setError('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                setError('Please enter a valid email address');
                return;
            }

            if (!isValidPassword(password)) {
                setError('Password must be at least 6 characters long');
                return;
            }

            // Clear previous errors and set loading
            setError('');
            setLoading(true);

            // Abort previous request if still pending
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            logger.info('Login attempt initiated', { email: email.substring(0, 3) + '***' });

            // Make API call with timeout
            const controller = abortControllerRef.current;
            const timeoutId = setTimeout(() => controller.abort(), LOGIN_TIMEOUT);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password, // Never log password
                    rememberMe,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle response
            if (!response.ok) {
                loginAttemptsRef.current += 1;

                if (loginAttemptsRef.current >= MAX_LOGIN_ATTEMPTS) {
                    lockoutTimeRef.current = Date.now() + LOCKOUT_DURATION;
                    setError('Too many failed login attempts. Please try again in 15 minutes.');
                    logger.warn('Account locked due to multiple failed attempts', { email: email.substring(0, 3) + '***' });
                    return;
                }

                const data = await response.json().catch(() => ({}));
                const errorMsg = data.message || 'Login failed. Please check your credentials.';
                setError(errorMsg);
                logger.warn('Login failed', { status: response.status, email: email.substring(0, 3) + '***' });
                return;
            }

            // Reset login attempts on success
            loginAttemptsRef.current = 0;
            lockoutTimeRef.current = null;

            const data = await response.json();

            // Store token securely (use httpOnly cookies in production)
            if (data.token) {
                // localStorage is used here as example; httpOnly cookies recommended
                localStorage.setItem('authToken', data.token);
                if (rememberMe && data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
            }

            logger.info('Login successful', { email: email.substring(0, 3) + '***' });

            // Redirect on success
            window.location.href = '/dashboard';

        } catch (err) {
            // Handle abort and timeout errors
            if (err.name === 'AbortError') {
                setError('Login request timed out. Please try again.');
                logger.error('Login timeout', err);
            } else {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
                setError(errorMessage);
                logger.error('Login error', err);
            }
            loginAttemptsRef.current += 1;
        } finally {
            setLoading(false);
        }
    }, [email, password, rememberMe, isValidEmail, isValidPassword, isAccountLocked]);

    // Handle sign up with error handling
    const handleSignUp = useCallback(() => {
        try {
            logger.info('Redirecting to sign up page');
            window.location.href = '/signup';
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to redirect. Please try again.';
            setError(errorMessage);
            logger.error('Sign up redirect error', err);
        }
    }, []);

    // Prevent form submission while loading
    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
        if (error) setError(''); // Clear error on input change
    }, [error]);

    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
        if (error) setError(''); // Clear error on input change
    }, [error]);

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <Typography variant="h4" className={styles.title}>
                    Optivo
                </Typography>

                <Typography className={styles.subtitle}>
                    Welcome back! Please login to your account
                </Typography>

                <form onSubmit={handleLogin} noValidate>
                    <div className={styles.formGroup}>
                        <div className={styles.inputField}>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={handleEmailChange}
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
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={loading}
                                autoComplete="current-password"
                                required
                                aria-label="Password"
                            />
                        </div>

                        <div className={styles.passwordOptions}>
                            <div className={styles.rememberMe}>
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className={styles.checkbox}
                                    disabled={loading}
                                    aria-label="Remember me"
                                />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="/forgot-password" className={styles.forgotPassword}>
                                Forgot password?
                            </a>
                        </div>

                        {error && (
                            <div className={styles.errorMessage} role="alert">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className={styles.footerText}>
                    Don't have an account?{' '}
                    <span
                        className={styles.footerLink}
                        onClick={handleSignUp}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleSignUp();
                            }
                        }}
                    >
                        Sign up
                    </span>
                </div>
            </div>
        </div>
    );
}
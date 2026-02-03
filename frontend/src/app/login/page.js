'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { AuthService, Logger } from '@/services';
import { validateEmail, validatePassword } from '@/utils/validators';
import Button from '@/components/common/Button';

// Constants
const LOGIN_TIMEOUT = 30000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Refs for performance and abuse prevention
    const loginAttemptsRef = useRef(0);
    const lockoutTimeRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Check if account is locked
    const isAccountLocked = useCallback(() => {
        if (lockoutTimeRef.current) {
            const now = Date.now();
            if (now < lockoutTimeRef.current) {
                const remainingTime = Math.ceil((lockoutTimeRef.current - now) / 1000);
                return { locked: true, remainingTime };
            } else {
                loginAttemptsRef.current = 0;
                lockoutTimeRef.current = null;
            }
        }
        return { locked: false, remainingTime: 0 };
    }, []);

    // Handle login
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();

        try {
            const lockoutStatus = isAccountLocked();
            if (lockoutStatus.locked) {
                setError(`Too many login attempts. Please try again in ${lockoutStatus.remainingTime} seconds.`);
                return;
            }

            if (!email.trim() || !password) {
                setError('Please fill in all fields');
                return;
            }

            const emailValidation = validateEmail(email);
            if (!emailValidation.isValid) {
                setError(emailValidation.error);
                return;
            }

            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                setError(passwordValidation.error);
                return;
            }

            setError('');
            setLoading(true);

            Logger.info('Login', 'Login attempt initiated');

            const result = await AuthService.login(email, password);

            if (result.success) {
                loginAttemptsRef.current = 0;
                lockoutTimeRef.current = null;
                Logger.info('Login', 'Login successful');
                router.push('/dashboard');
            } else {
                loginAttemptsRef.current += 1;
                if (loginAttemptsRef.current >= MAX_LOGIN_ATTEMPTS) {
                    lockoutTimeRef.current = Date.now() + LOCKOUT_DURATION;
                    setError('Too many failed login attempts. Please try again in 15 minutes.');
                } else {
                    setError(result.error || 'Login failed. Please check your credentials.');
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
            Logger.error('Login', 'Login error', err);
            loginAttemptsRef.current += 1;
        } finally {
            setLoading(false);
        }
    }, [email, password, isAccountLocked, router]);

    const handleSignUp = useCallback(() => {
        router.push('/signup');
    }, [router]);

    const handleEmailChange = useCallback((e) => {
        setEmail(e?.target?.value || '');
        if (error) setError('');
    }, [error]);

    const handlePasswordChange = useCallback((e) => {
        setPassword(e?.target?.value || '');
        if (error) setError('');
    }, [error]);

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Optivo</h1>
                <p className={styles.subtitle}>Welcome back! Please login to your account</p>

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

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                        >
                            Sign In
                        </Button>
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
                            if (e?.key === 'Enter' || e?.key === ' ') handleSignUp();
                        }}
                    >
                        Sign up
                    </span>
                </div>
            </div>
        </div>
    );
}

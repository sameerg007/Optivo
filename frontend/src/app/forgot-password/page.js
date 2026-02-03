'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './forgotPassword.module.css';
import { Logger } from '@/services';
import { validateEmail } from '@/utils/validators';
import Button from '@/components/common/Button';

const MAX_RESET_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const resetAttemptsRef = useRef(0);
    const lockoutTimeRef = useRef(null);

    const isAccountLocked = useCallback(() => {
        if (lockoutTimeRef.current) {
            const now = Date.now();
            if (now < lockoutTimeRef.current) {
                const remainingTime = Math.ceil((lockoutTimeRef.current - now) / 1000);
                return { locked: true, remainingTime };
            } else {
                resetAttemptsRef.current = 0;
                lockoutTimeRef.current = null;
            }
        }
        return { locked: false, remainingTime: 0 };
    }, []);

    const handleResetRequest = useCallback(async (e) => {
        e.preventDefault();

        try {
            const lockoutStatus = isAccountLocked();
            if (lockoutStatus.locked) {
                setError(`Too many reset attempts. Please try again in ${lockoutStatus.remainingTime} seconds.`);
                return;
            }

            if (!email.trim()) {
                setError('Please enter your email address');
                return;
            }

            const emailValidation = validateEmail(email);
            if (!emailValidation.isValid) {
                setError(emailValidation.error);
                return;
            }

            setError('');
            setSuccess('');
            setLoading(true);

            Logger.info('ForgotPassword', 'Password reset request initiated');

            // Simulate API call - in production, this would call the backend
            await new Promise(resolve => setTimeout(resolve, 1500));

            resetAttemptsRef.current = 0;
            setSuccess('Password reset link has been sent to your email. Please check your inbox.');
            setEmail('');

            Logger.info('ForgotPassword', 'Password reset email sent');

            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
            Logger.error('ForgotPassword', 'Password reset error', err);
            resetAttemptsRef.current += 1;
            
            if (resetAttemptsRef.current >= MAX_RESET_ATTEMPTS) {
                lockoutTimeRef.current = Date.now() + LOCKOUT_DURATION;
            }
        } finally {
            setLoading(false);
        }
    }, [email, isAccountLocked, router]);

    const handleBackToLogin = useCallback(() => {
        router.push('/login');
    }, [router]);

    const handleEmailChange = useCallback((e) => {
        setEmail(e?.target?.value || '');
        if (error) setError('');
        if (success) setSuccess('');
    }, [error, success]);

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Optivo</h1>
                <p className={styles.subtitle}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleResetRequest} noValidate>
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

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                        >
                            Send Reset Link
                        </Button>
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
                            if (e?.key === 'Enter' || e?.key === ' ') handleBackToLogin();
                        }}
                    >
                        Back to login
                    </span>
                </div>
            </div>
        </div>
    );
}

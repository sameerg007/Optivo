'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signUp.module.css';
import { AuthService, Logger } from '@/services';
import { validateEmail } from '@/utils/validators';

// Password requirements
const PASSWORD_REQUIREMENTS = {
    minLength: { regex: /.{8,}/, label: 'At least 8 characters' },
    uppercase: { regex: /[A-Z]/, label: 'One uppercase letter' },
    lowercase: { regex: /[a-z]/, label: 'One lowercase letter' },
    number: { regex: /[0-9]/, label: 'One number' },
    special: { regex: /[!@#$%^&*]/, label: 'One special character (!@#$%^&*)' },
};

const MAX_SIGNUP_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export default function SignUpPage() {
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

    const signupAttemptsRef = useRef(0);
    const lockoutTimeRef = useRef(null);

    const validatePasswordStrength = useCallback((passwordValue) => {
        const strength = {};
        Object.keys(PASSWORD_REQUIREMENTS).forEach((key) => {
            strength[key] = PASSWORD_REQUIREMENTS[key].regex.test(passwordValue);
        });
        return strength;
    }, []);

    const isPasswordStrong = useCallback((passwordValue) => {
        const strength = validatePasswordStrength(passwordValue);
        return Object.values(strength).every(val => val === true);
    }, [validatePasswordStrength]);

    const isAccountLocked = useCallback(() => {
        if (lockoutTimeRef.current) {
            const now = Date.now();
            if (now < lockoutTimeRef.current) {
                const remainingTime = Math.ceil((lockoutTimeRef.current - now) / 1000);
                return { locked: true, remainingTime };
            } else {
                signupAttemptsRef.current = 0;
                lockoutTimeRef.current = null;
            }
        }
        return { locked: false, remainingTime: 0 };
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e?.target || {};
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (error) setError('');
        if (success) setSuccess('');

        if (name === 'password') {
            const strength = validatePasswordStrength(value);
            setPasswordStrength(strength);
        }
    }, [error, success, validatePasswordStrength]);

    const handleSignUp = useCallback(async (e) => {
        e?.preventDefault?.();

        try {
            const lockoutStatus = isAccountLocked();
            if (lockoutStatus.locked) {
                setError(`Too many signup attempts. Please try again in ${lockoutStatus.remainingTime} seconds.`);
                return;
            }

            if (!formData.firstName.trim()) {
                setError('First name is required');
                return;
            }

            if (!formData.lastName.trim()) {
                setError('Last name is required');
                return;
            }

            const emailValidation = validateEmail(formData.email);
            if (!emailValidation.isValid) {
                setError(emailValidation.error);
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

            setError('');
            setSuccess('');
            setLoading(true);

            Logger.info('SignUp', 'Signup attempt initiated');

            const result = await AuthService.signup(formData);

            if (result.success) {
                signupAttemptsRef.current = 0;
                setSuccess('Account created successfully! Redirecting...');
                Logger.info('SignUp', 'Signup successful');
                
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                signupAttemptsRef.current += 1;
                if (signupAttemptsRef.current >= MAX_SIGNUP_ATTEMPTS) {
                    lockoutTimeRef.current = Date.now() + LOCKOUT_DURATION;
                    setError('Too many signup attempts. Please try again in 15 minutes.');
                } else {
                    setError(result.error || 'Signup failed. Please try again.');
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
            Logger.error('SignUp', 'Signup error', err);
            signupAttemptsRef.current += 1;
        } finally {
            setLoading(false);
        }
    }, [formData, isPasswordStrong, isAccountLocked, router]);

    const handleBackToLogin = useCallback(() => {
        router.push('/login');
    }, [router]);

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Optivo</h1>
                <p className={styles.subtitle}>Create your account to get started</p>

                <form onSubmit={handleSignUp} noValidate>
                    <div className={styles.formGroup}>
                        <div className={styles.nameFields}>
                            <div className={styles.inputField}>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className={styles.inputField}>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputField}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className={styles.inputField}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        {formData.password && (
                            <div className={styles.passwordRequirements}>
                                {Object.entries(PASSWORD_REQUIREMENTS).map(([key, req]) => (
                                    <div 
                                        key={key} 
                                        className={`${styles.requirement} ${passwordStrength[key] ? styles.met : ''}`}
                                    >
                                        {passwordStrength[key] ? '✓' : '○'} {req.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.inputField}>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                disabled={loading}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className={styles.termsCheckbox}>
                            <input
                                type="checkbox"
                                id="terms"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                            <label htmlFor="terms">
                                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
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
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className={styles.footerText}>
                    Already have an account?{' '}
                    <span
                        className={styles.footerLink}
                        onClick={handleBackToLogin}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e?.key === 'Enter' || e?.key === ' ') handleBackToLogin();
                        }}
                    >
                        Sign in
                    </span>
                </div>
            </div>
        </div>
    );
}

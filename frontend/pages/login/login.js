'use client';

import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import styles from './login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            return;
        }
        
        setError('');
        console.log('Login attempt:', { email, password });
        // Add your login API call here
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <Typography variant="h4" className={styles.title}>
                    Optivo
                </Typography>
                
                <Typography className={styles.subtitle}>
                    Welcome back! Please login to your account
                </Typography>

                <form onSubmit={handleLogin}>
                    <Box className={styles.formGroup}>
                        <div className={styles.inputField}>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputField}>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#" className={styles.forgotPassword}>Forgot password?</a>
                        </div>

                        {error && (
                            <div className={styles.errorMessage}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button type="submit" className={styles.submitButton}>
                            Sign In
                        </button>
                    </Box>
                </form>

                <div className={styles.footerText}>
                    Don't have an account? <span className={styles.footerLink}>Sign up</span>
                </div>
            </div>
        </div>
    );
}
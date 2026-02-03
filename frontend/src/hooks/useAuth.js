/**
 * Custom Hook - useAuth
 * Authentication state management hook
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '../../services/auth/auth.service';
import logger from '../../services/logger.service';

export const useAuth = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            try {
                const isAuth = AuthService.checkAuth();
                const currentUser = AuthService.getCurrentUser();
                
                setIsAuthenticated(isAuth);
                setUser(currentUser);
                setError(null);
            } catch (err) {
                logger.error('useAuth', 'Failed to check authentication', err);
                setError('Failed to check authentication');
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login handler
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await AuthService.login(email, password);

            if (result.success) {
                setIsAuthenticated(true);
                setUser(result.user);
                router.push('/dashboard');
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            logger.error('useAuth', 'Login error', err);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // Signup handler
    const signup = useCallback(async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await AuthService.signup(userData);

            if (result.success) {
                setIsAuthenticated(true);
                setUser(result.user);
                router.push('/dashboard');
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Signup failed';
            setError(errorMessage);
            logger.error('useAuth', 'Signup error', err);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // Logout handler
    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await AuthService.logout();
            setIsAuthenticated(false);
            setUser(null);
            router.push('/login');
            return { success: true };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Logout failed';
            setError(errorMessage);
            logger.error('useAuth', 'Logout error', err);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout
    };
};

export default useAuth;

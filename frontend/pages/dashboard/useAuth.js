// Custom hook for dashboard authentication
import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService, logger } from './utils';

export const useAuth = () => {
    const router = useRouter();
    const authCheckRef = useRef(false);

    const checkAuth = useCallback(async () => {
        try {
            let token = authService.getAuthToken();
            const isDev = authService.isDevelopment();

            if (!token && !isDev) {
                logger.warn('No authentication token found');
                router.push('/login');
                return false;
            }

            if (!token && isDev) {
                token = authService.createMockToken();
            }

            logger.info('User authenticated');
            return true;
        } catch (err) {
            logger.error('Auth check error', err);
            router.push('/login');
            return false;
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            logger.info('Logout initiated');
            authService.clearAuthTokens();
            router.push('/login');
        } catch (err) {
            logger.error('Logout error', err);
            throw err;
        }
    }, [router]);

    return {
        checkAuth,
        logout,
        authCheckRef
    };
};

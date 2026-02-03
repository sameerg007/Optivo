/**
 * Custom Hook - useFetch
 * Generic data fetching hook with loading/error states
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import logger from '../../services/logger.service';

export const useFetch = (fetchFn, dependencies = []) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const fetchData = useCallback(async () => {
        if (!isMountedRef.current) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchFn();

            if (isMountedRef.current) {
                if (result.success) {
                    setData(result.data);
                    setError(null);
                } else {
                    setData(null);
                    setError(result.error || 'Failed to fetch data');
                }
            }
        } catch (err) {
            if (isMountedRef.current) {
                const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                setError(errorMessage);
                setData(null);
                logger.error('useFetch', 'Fetch error', err);
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [fetchFn]);

    useEffect(() => {
        fetchData();
    }, dependencies);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        isLoading,
        error,
        refetch
    };
};

export default useFetch;

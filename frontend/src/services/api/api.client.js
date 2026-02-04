/**
 * API Client Service
 * Centralized HTTP client for API requests with interceptors
 */

import APP_CONFIG from '../../config/app.config';
import logger from '../logger.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HTTP_STATUS } from '../../constants';
import storageService from '../storage/storage.service';

class APIClient {
    constructor() {
        this.baseURL = APP_CONFIG.API.BASE_URL;
        this.timeout = APP_CONFIG.API.TIMEOUT;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Get Authorization header
     */
    getAuthHeader() {
        const token = storageService.getAuthToken();
        
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    }

    /**
     * Build request config
     */
    buildRequestConfig(method, url, options = {}) {
        const headers = {
            ...this.defaultHeaders,
            ...this.getAuthHeader(),
            ...(options.headers || {})
        };

        const config = {
            method,
            headers,
            ...(options.params && { params: options.params }),
            ...(options.body && { body: JSON.stringify(options.body) })
        };

        return config;
    }

    /**
     * Handle response
     */
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        let data = null;

        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const error = new Error(data?.message || 'API request failed');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    /**
     * Execute API request
     */
    async request(method, url, options = {}) {
        const fullURL = `${this.baseURL}${url}`;
        const config = this.buildRequestConfig(method, url, options);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(fullURL, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await this.handleResponse(response);

            logger.info('APIClient', `${method} ${url} - ${response.status}`, {
                status: response.status
            });

            return {
                success: true,
                data,
                status: response.status
            };
        } catch (error) {
            logger.error('APIClient', `${method} ${url}`, error);

            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    // HTTP Methods
    get(url, options = {}) {
        return this.request('GET', url, options);
    }

    post(url, body, options = {}) {
        return this.request('POST', url, { ...options, body });
    }

    put(url, body, options = {}) {
        return this.request('PUT', url, { ...options, body });
    }

    patch(url, body, options = {}) {
        return this.request('PATCH', url, { ...options, body });
    }

    delete(url, options = {}) {
        return this.request('DELETE', url, options);
    }
}

export default new APIClient();

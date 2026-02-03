/**
 * Expense Service
 * Handles expense-related API calls and business logic
 */

import APIClient from '../api/api.client';
import logger from '../logger.service';
import { API_ENDPOINTS } from '../../config/api.endpoints';

class ExpenseService {
    /**
     * Get all expenses
     */
    async getExpenses(params = {}) {
        try {
            const response = await APIClient.get(API_ENDPOINTS.EXPENSES.LIST, { params });

            if (!response.success) {
                throw new Error(response.error);
            }

            logger.info('ExpenseService', 'Expenses fetched');
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('ExpenseService', 'Failed to fetch expenses', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get single expense
     */
    async getExpense(id) {
        try {
            const url = API_ENDPOINTS.EXPENSES.GET.replace(':id', id);
            const response = await APIClient.get(url);

            if (!response.success) {
                throw new Error(response.error);
            }

            logger.info('ExpenseService', `Expense ${id} fetched`);
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('ExpenseService', 'Failed to fetch expense', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create expense
     */
    async createExpense(expenseData) {
        try {
            const response = await APIClient.post(API_ENDPOINTS.EXPENSES.CREATE, expenseData);

            if (!response.success) {
                throw new Error(response.error);
            }

            logger.info('ExpenseService', 'Expense created');
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('ExpenseService', 'Failed to create expense', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update expense
     */
    async updateExpense(id, expenseData) {
        try {
            const url = API_ENDPOINTS.EXPENSES.UPDATE.replace(':id', id);
            const response = await APIClient.put(url, expenseData);

            if (!response.success) {
                throw new Error(response.error);
            }

            logger.info('ExpenseService', `Expense ${id} updated`);
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('ExpenseService', 'Failed to update expense', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete expense
     */
    async deleteExpense(id) {
        try {
            const url = API_ENDPOINTS.EXPENSES.DELETE.replace(':id', id);
            const response = await APIClient.delete(url);

            if (!response.success) {
                throw new Error(response.error);
            }

            logger.info('ExpenseService', `Expense ${id} deleted`);
            return { success: true };
        } catch (error) {
            logger.error('ExpenseService', 'Failed to delete expense', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get expenses by category
     */
    async getExpensesByCategory(category) {
        try {
            const url = API_ENDPOINTS.EXPENSES.GET_BY_CATEGORY.replace(':category', category);
            const response = await APIClient.get(url);

            if (!response.success) {
                throw new Error(response.error);
            }

            logger.info('ExpenseService', `Expenses for category ${category} fetched`);
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('ExpenseService', 'Failed to fetch category expenses', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get expense summary
     */
    async getExpenseSummary() {
        try {
            const response = await APIClient.get(API_ENDPOINTS.EXPENSES.GET_SUMMARY);

            if (!response.success) {
                throw new Error(response.error);
            }

            logger.info('ExpenseService', 'Expense summary fetched');
            return { success: true, data: response.data };
        } catch (error) {
            logger.error('ExpenseService', 'Failed to fetch expense summary', error);
            return { success: false, error: error.message };
        }
    }
}

export default new ExpenseService();

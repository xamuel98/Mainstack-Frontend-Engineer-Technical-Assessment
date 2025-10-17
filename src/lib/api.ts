/**
 * @description
 * API Client Configuration and Endpoints
 * Handles all HTTP requests to the Mainstack API
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-17
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { User, Wallet, Transaction, ApiError } from '@/types';

// Base API configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      code: error.code,
    };

    // Log error for debugging
    console.error('API Error:', apiError);

    return Promise.reject(apiError);
  }
);

/**
 * Fetch user profile information
 * GET /user
 */
export const fetchUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/user');
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

/**
 * Fetch wallet information
 * GET /wallet
 */
export const fetchWallet = async (): Promise<Wallet> => {
  try {
    const response = await apiClient.get<Wallet>('/wallet');
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

/**
 * Fetch transaction history
 * GET /transactions
 */
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await apiClient.get<Transaction[]>('/transactions');
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export default apiClient;
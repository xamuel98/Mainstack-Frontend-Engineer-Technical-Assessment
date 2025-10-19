/**
 * @description
 * API Response Types
 * Based on the Mainstack API endpoints
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-17
 * @version 1.0.0
 */

// User API Response
export interface User {
    first_name: string;
    last_name: string;
    email: string;
}

// Wallet API Response
export interface Wallet {
    balance: number;
    total_payout: number;
    total_revenue: number;
    pending_payout: number;
    ledger_balance: number;
}

// Transaction Metadata (optional for some transactions)
export interface TransactionMetadata {
    name: string;
    type: string;
    email: string;
    quantity: number;
    country: string;
    product_name: string;
}

// Transaction API Response
export interface Transaction {
    amount: number;
    metadata?: TransactionMetadata;
    payment_reference?: string;
    status: 'successful' | 'pending' | 'failed';
    type: 'deposit' | 'withdrawal';
    date: string;
}

// API Error Response
export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

// Generic API Response wrapper
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

/**
 * Error handling utilities
 * Following Single Responsibility Principle - dedicated to error handling
 */

import { APIError } from '../types/models';

/**
 * Custom error class for API errors
 */
export class ApiRequestError extends Error {
    public status: number;
    public code: string;
    public details?: Record<string, string[]>;

    constructor(message: string, status: number, code: string, details?: Record<string, string[]>) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
        this.code = code;
        this.details = details;

        // Maintains proper stack trace for where our error was thrown (available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiRequestError);
        }
    }

    /**
     * Convert to APIError interface
     */
    toAPIError(): APIError {
        return {
            message: this.message,
            status: this.status,
            code: this.code,
            details: this.details,
        };
    }
}

/**
 * Network error for connection issues
 */
export class NetworkError extends Error {
    constructor(message: string = 'Network connection failed. Please check your internet connection.') {
        super(message);
        this.name = 'NetworkError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NetworkError);
        }
    }
}

/**
 * Authentication error for 401/403 responses
 */
export class AuthenticationError extends Error {
    public status: number;

    constructor(message: string = 'Authentication required', status: number = 401) {
        super(message);
        this.name = 'AuthenticationError';
        this.status = status;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthenticationError);
        }
    }
}

/**
 * Validation error for form and data validation failures
 */
export class ValidationError extends Error {
    public errors: Record<string, string[]>;

    constructor(errors: Record<string, string[]>) {
        const message = 'Validation failed';
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }

    /**
     * Get first error message
     */
    getFirstError(): string {
        const firstKey = Object.keys(this.errors)[0];
        return this.errors[firstKey]?.[0] || 'Validation failed';
    }

    /**
     * Get all error messages as array
     */
    getAllErrors(): string[] {
        return Object.values(this.errors).flat();
    }
}

/**
 * Parse axios error into appropriate custom error
 */
export function parseError(error: any): Error {
    // Network error (no response from server)
    if (!error.response) {
        return new NetworkError(error.message || 'Network error occurred');
    }

    const { status, data } = error.response;

    // Authentication errors
    if (status === 401 || status === 403) {
        return new AuthenticationError(
            data?.message || data?.detail || 'Authentication required',
            status
        );
    }

    // Validation errors
    if (status === 400 && data && typeof data === 'object') {
        // Check if it's a validation error with field errors
        const hasFieldErrors = Object.keys(data).some(
            key => Array.isArray(data[key]) && key !== 'message' && key !== 'detail'
        );

        if (hasFieldErrors) {
            return new ValidationError(data);
        }
    }

    // Generic API error
    const message = data?.message || data?.detail || error.message || 'An error occurred';
    const code = data?.code || `HTTP_${status}`;
    const details = data?.errors || data?.details;

    return new ApiRequestError(message, status, code, details);
}

/**
 * User-friendly error messages
 */
export function getUserFriendlyErrorMessage(error: Error): string {
    if (error instanceof NetworkError) {
        return 'Unable to connect. Please check your internet connection and try again.';
    }

    if (error instanceof AuthenticationError) {
        return 'You need to be logged in to perform this action.';
    }

    if (error instanceof ValidationError) {
        return error.getFirstError();
    }

    if (error instanceof ApiRequestError) {
        // Map common status codes to user-friendly messages
        switch (error.status) {
            case 404:
                return 'The requested resource was not found.';
            case 429:
                return 'Too many requests. Please slow down and try again later.';
            case 500:
                return 'Server error occurred. Please try again later.';
            case 503:
                return 'Service temporarily unavailable. Please try again later.';
            default:
                return error.message;
        }
    }

    return error.message || 'An unexpected error occurred.';
}

/**
 * Log error to console in development
 */
export function logError(error: Error, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
        console.group(`❌ Error${context ? ` in ${context}` : ''}`);
        console.error('Error:', error);
        if (error instanceof ApiRequestError) {
            console.error('Status:', error.status);
            console.error('Code:', error.code);
            if (error.details) {
                console.error('Details:', error.details);
            }
        }
        console.groupEnd();
    }
}

/**
 * Handle error and return user-friendly message
 */
export function handleError(error: any, context?: string): string {
    const parsedError = parseError(error);
    logError(parsedError, context);
    return getUserFriendlyErrorMessage(parsedError);
}

/**
 * ErrorMessage Component
 * Single Responsibility: Display error messages with retry option
 */

import React from 'react';

interface ErrorMessageProps {
    message: string;
    title?: string;
    onRetry?: () => void;
    className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    title = 'Error',
    onRetry,
    className = '',
}) => {
    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
            <div className="text-red-600 mb-2">
                <svg
                    className="w-12 h-12 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
            </div>
            <p className="text-red-600 font-medium mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;

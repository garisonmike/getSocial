/**
 * Reusable UI Components
 * Following Single Responsibility Principle - each component has one purpose
 */

import React from 'react';

// LoadingSpinner Component
interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    className = ''
}) => {
    const sizeClasses = {
        small: 'w-5 h-5 border-2',
        medium: 'w-8 h-8 border-3',
        large: 'w-16 h-16 border-4',
    };

    return (
        <div className={`relative ${className}`}>
            <div className={`${sizeClasses[size]} border-blue-200 rounded-full`}></div>
            <div
                className={`${sizeClasses[size]} border-blue-500 rounded-full animate-spin border-t-transparent absolute top-0 left-0`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;

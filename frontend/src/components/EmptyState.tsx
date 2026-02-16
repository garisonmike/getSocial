/**
 * EmptyState Component
 * Single Responsibility: Display empty state messages
 */

import React from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = '📭',
    title,
    message,
    action,
    className = '',
}) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center ${className}`}>
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;

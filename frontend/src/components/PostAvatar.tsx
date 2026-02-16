/**
 * PostAvatar Component
 * Single Responsibility: Display user avatar with gradient fallback
 */

import React from 'react';

interface PostAvatarProps {
    src: string | null;
    username: string;
    isVerified?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const PostAvatar: React.FC<PostAvatarProps> = ({
    src,
    username,
    isVerified = false,
    size = 'medium',
    className = '',
}) => {
    const sizeClasses = {
        small: 'w-8 h-8 text-sm',
        medium: 'w-11 h-11 text-lg',
        large: 'w-16 h-16 text-2xl',
    };

    const initial = username?.[0]?.toUpperCase() || '?';

    return (
        <div className={`relative group ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={username}
                    className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white group-hover:ring-blue-500 transition-all`}
                />
            ) : (
                <div
                    className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold ring-2 ring-white group-hover:ring-blue-500 transition-all`}
                >
                    {initial}
                </div>
            )}
            {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default PostAvatar;

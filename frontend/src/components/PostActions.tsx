/**
 * PostActions Component
 * Single Responsibility: Display post action buttons (like, comment, share, bookmark)
 */

import React from 'react';
import { Post } from '../types/models';

interface PostActionsProps {
    post: Post;
    isLiked: boolean;
    likesCount: number;
    isLiking: boolean;
    onLike: (e: React.MouseEvent) => void;
    onComment?: (e: React.MouseEvent) => void;
    onShare?: (e: React.MouseEvent) => void;
    onBookmark?: (e: React.MouseEvent) => void;
    className?: string;
}

const PostActions: React.FC<PostActionsProps> = ({
    post,
    isLiked,
    likesCount,
    isLiking,
    onLike,
    onComment,
    onShare,
    onBookmark,
    className = '',
}) => {
    return (
        <div className={`px-4 py-3 border-t border-gray-100 ${className}`}>
            <div className="flex items-center justify-between">
                {/* Like Button */}
                <button
                    onClick={onLike}
                    disabled={isLiking}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isLiked
                            ? 'text-red-500 bg-red-50 hover:bg-red-100'
                            : 'text-gray-600 hover:bg-gray-100'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={isLiked ? 'Unlike post' : 'Like post'}
                >
                    <svg
                        className={`w-6 h-6 transition-transform ${isLiked ? 'scale-110 fill-current' : ''}`}
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <span className="font-semibold text-sm">
                        {likesCount > 0 ? likesCount.toLocaleString() : ''}
                    </span>
                </button>

                {/* Comment Button */}
                <button
                    onClick={onComment}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                    aria-label="Comment on post"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <span className="font-semibold text-sm">
                        {post.comments_count > 0 ? post.comments_count.toLocaleString() : ''}
                    </span>
                </button>

                {/* Share Button */}
                <button
                    onClick={onShare}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                    aria-label="Share post"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    <span className="font-semibold text-sm">
                        {post.shares_count > 0 ? post.shares_count.toLocaleString() : ''}
                    </span>
                </button>

                {/* Bookmark Button */}
                <button
                    onClick={onBookmark}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                    aria-label="Bookmark post"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default React.memo(PostActions);

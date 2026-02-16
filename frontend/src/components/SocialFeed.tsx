/**
 * SocialFeed Component (TypeScript)
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders the feed, delegates logic to hooks
 * - Open/Closed: Extensible through props, closed for modification
 * - Dependency Inversion: Depends on hooks abstraction, not concrete implementation
 */

import React from 'react';
import { usePosts } from '../hooks/usePosts';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import SocialPostCard from './SocialPostCard';

interface SocialFeedProps {
    /** Optional className for custom styling */
    className?: string;
    /** Callback when a post is clicked */
    onPostClick?: (postId: number) => void;
}

/**
 * SocialFeed Component
 * Displays a paginated feed of social posts with modern UI
 */
const SocialFeed: React.FC<SocialFeedProps> = ({ className = '', onPostClick }) => {
    const {
        posts,
        isLoading,
        error,
        hasMore,
        loadMore,
        refresh,
        updatePost,
    } = usePosts();

    // Handle like updates from child components
    const handleLikeUpdate = (postId: number, isLiked: boolean, newCount: number) => {
        updatePost(postId, { is_liked: isLiked, likes_count: newCount });
    };

    // Loading state for initial load
    if (isLoading && posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner size="large" />
                <p className="mt-4 text-gray-600 font-medium">Loading your feed...</p>
            </div>
        );
    }

    // Error state
    if (error && posts.length === 0) {
        return (
            <ErrorMessage
                message={error}
                onRetry={refresh}
                title="Failed to load feed"
            />
        );
    }

    // Empty state
    if (posts.length === 0) {
        return (
            <EmptyState
                icon="📭"
                title="No posts yet"
                message="Be the first to share something!"
            />
        );
    }

    // Main feed display
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Posts list */}
            {posts.map((post) => (
                <SocialPostCard
                    key={post.id}
                    post={post}
                    onLikeUpdate={handleLikeUpdate}
                    onClick={() => onPostClick?.(post.id)}
                />
            ))}

            {/* Load more button */}
            {hasMore && (
                <div className="flex justify-center py-8">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isLoading ? (
                            <span className="flex items-center space-x-2">
                                <LoadingSpinner size="small" />
                                <span>Loading...</span>
                            </span>
                        ) : (
                            'Load More'
                        )}
                    </button>
                </div>
            )}

            {/* End of feed message */}
            {!hasMore && posts.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p className="font-medium">You've reached the end! 🎉</p>
                </div>
            )}

            {/* Error banner for pagination errors */}
            {error && posts.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800 text-sm">{error}</p>
                    <button
                        onClick={loadMore}
                        className="mt-2 text-sm text-yellow-900 font-semibold hover:underline"
                    >
                        Try again
                    </button>
                </div>
            )}
        </div>
    );
};

export default SocialFeed;

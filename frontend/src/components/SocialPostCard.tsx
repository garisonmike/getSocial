/**
 * SocialPostCard Component (TypeScript)
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Displays a single post, delegates like logic to hook
 * - Open/Closed: Extensible through props
 * - Liskov Substitution: Can be used anywhere a post card is needed
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { usePostLike } from '../hooks/usePosts';
import { Post } from '../types/models';
import { formatRelativeTime } from '../utils/dateUtils';
import PostActions from './PostActions';
import PostAvatar from './PostAvatar';

interface SocialPostCardProps {
    /** Post data to display */
    post: Post;
    /** Callback when like count changes */
    onLikeUpdate?: (postId: number, isLiked: boolean, newCount: number) => void;
    /** Callback when post is clicked */
    onClick?: () => void;
    /** Optional className for custom styling */
    className?: string;
}

/**
 * SocialPostCard Component
 * Displays a single post with modern Instagram/Twitter-style design
 */
const SocialPostCard: React.FC<SocialPostCardProps> = ({
    post,
    onLikeUpdate,
    onClick,
    className = '',
}) => {
    const { isLiked, likesCount, isLoading, toggleLike } = usePostLike(post);

    // Notify parent when like state changes
    React.useEffect(() => {
        if (onLikeUpdate) {
            onLikeUpdate(post.id, isLiked, likesCount);
        }
    }, [isLiked, likesCount, post.id, onLikeUpdate]);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card onClick from firing
        await toggleLike();
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <article
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}
            onClick={handleCardClick}
            role="article"
            aria-label={`Post by ${post.author_username}`}
        >
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <Link
                        to={`/profile/${post.author_username}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PostAvatar
                            src={post.author_profile?.avatar || null}
                            username={post.author_username}
                            isVerified={post.author_profile?.is_verified || false}
                        />
                    </Link>
                    <div>
                        <Link
                            to={`/profile/${post.author_username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            {post.author_username}
                            {post.author_profile?.is_verified && (
                                <span className="ml-1 text-blue-500" title="Verified">
                                    ✓
                                </span>
                            )}
                        </Link>
                        <p className="text-sm text-gray-500">
                            {formatRelativeTime(post.created_at)}
                        </p>
                    </div>
                </div>

                {/* Options menu button */}
                <button
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Post options"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </p>
            </div>

            {/* Post Image */}
            {post.image && (
                <div className="w-full">
                    <img
                        src={post.image}
                        alt="Post content"
                        className="w-full object-cover max-h-[600px]"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Post Actions */}
            <PostActions
                post={post}
                isLiked={isLiked}
                likesCount={likesCount}
                isLiking={isLoading}
                onLike={handleLikeClick}
            />

            {/* Likes info */}
            {likesCount > 0 && (
                <div className="px-4 pb-3 text-sm text-gray-600">
                    <span className="font-semibold">
                        {likesCount === 1 ? '1 like' : `${likesCount.toLocaleString()} likes`}
                    </span>
                </div>
            )}
        </article>
    );
};

export default React.memo(SocialPostCard);

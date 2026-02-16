import { useState } from 'react'
import { Link } from 'react-router-dom'
import { postsAPI } from '../services/api'

export default function SocialPostCard({ post, onLikeUpdate }) {
    const [isLiked, setIsLiked] = useState(post.is_liked || false)
    const [likesCount, setLikesCount] = useState(post.likes_count || 0)
    const [isLiking, setIsLiking] = useState(false)

    const handleLike = async () => {
        if (isLiking) return // Prevent multiple clicks

        // Optimistic update
        const previousIsLiked = isLiked
        const previousLikesCount = likesCount
        const newIsLiked = !isLiked
        const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1

        setIsLiked(newIsLiked)
        setLikesCount(newLikesCount)
        setIsLiking(true)

        // Notify parent component
        if (onLikeUpdate) {
            onLikeUpdate(post.id, newIsLiked, newLikesCount)
        }

        try {
            if (previousIsLiked) {
                await postsAPI.unlike(post.id)
            } else {
                await postsAPI.like(post.id)
            }
        } catch (error) {
            console.error('Error toggling like:', error)
            // Revert on error
            setIsLiked(previousIsLiked)
            setLikesCount(previousLikesCount)
            if (onLikeUpdate) {
                onLikeUpdate(post.id, previousIsLiked, previousLikesCount)
            }
        } finally {
            setIsLiking(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now - date) / 1000)

        if (diffInSeconds < 60) return 'just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <Link to={`/profile/${post.author_username || post.author}`}>
                        <div className="relative group">
                            {post.author_avatar ? (
                                <img
                                    src={post.author_avatar}
                                    alt={post.author_username || post.author}
                                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white group-hover:ring-blue-500 transition-all"
                                />
                            ) : (
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white group-hover:ring-blue-500 transition-all">
                                    {(post.author_username || post.author || '?')[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                    </Link>
                    <div>
                        <Link
                            to={`/profile/${post.author_username || post.author}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            {post.author_username || post.author}
                        </Link>
                        <p className="text-sm text-gray-500">
                            {formatDate(post.created_at)}
                        </p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all">
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
                    />
                </div>
            )}

            {/* Post Actions */}
            <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    {/* Like Button */}
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isLiked
                                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                : 'text-gray-600 hover:bg-gray-100'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                            {likesCount > 0 ? likesCount : ''}
                        </span>
                    </button>

                    {/* Comment Button */}
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span className="font-semibold text-sm">
                            {post.comments_count > 0 ? post.comments_count : ''}
                        </span>
                    </button>

                    {/* Share Button */}
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                        </svg>
                        <span className="font-semibold text-sm">
                            {post.shares_count > 0 ? post.shares_count : ''}
                        </span>
                    </button>

                    {/* Bookmark Button */}
                    <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
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

            {/* Likes Info (if any) */}
            {likesCount > 0 && (
                <div className="px-4 pb-3 text-sm text-gray-600">
                    <span className="font-semibold">
                        {likesCount === 1 ? '1 like' : `${likesCount.toLocaleString()} likes`}
                    </span>
                </div>
            )}
        </article>
    )
}

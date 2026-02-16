import { useState } from 'react'
import { Link } from 'react-router-dom'
import { postsAPI } from '../services/api'

export default function PostCard({ post, onUpdate }) {
    const [isLiked, setIsLiked] = useState(post.is_liked)
    const [likesCount, setLikesCount] = useState(post.likes_count)
    const [showComments, setShowComments] = useState(false)

    const handleLike = async () => {
        try {
            if (isLiked) {
                await postsAPI.unlike(post.id)
                setIsLiked(false)
                setLikesCount(prev => prev - 1)
            } else {
                await postsAPI.like(post.id)
                setIsLiked(true)
                setLikesCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('Error toggling like:', error)
        }
    }

    return (
        <div className="card mb-4">
            {/* Post Header */}
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {post.author_avatar ? (
                        <img src={post.author_avatar} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                        <span className="text-lg">👤</span>
                    )}
                </div>
                <div className="ml-3">
                    <Link
                        to={`/profile/${post.author_username}`}
                        className="font-semibold text-gray-900 hover:text-primary-600"
                    >
                        {post.author_username}
                    </Link>
                    <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-4">{post.content}</p>

            {/* Post Image */}
            {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg mb-4"
                />
            )}

            {/* Post Actions */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 pt-4 border-t">
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 hover:text-primary-600 ${isLiked ? 'text-primary-600 font-semibold' : ''
                        }`}
                >
                    <span>{isLiked ? '❤️' : '🤍'}</span>
                    <span>{likesCount} Likes</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 hover:text-primary-600"
                >
                    <span>💬</span>
                    <span>{post.comments_count} Comments</span>
                </button>

                <button className="flex items-center space-x-2 hover:text-primary-600">
                    <span>🔄</span>
                    <span>{post.shares_count} Shares</span>
                </button>
            </div>
        </div>
    )
}

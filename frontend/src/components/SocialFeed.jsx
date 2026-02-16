import { useEffect, useState } from 'react'
import { postsAPI } from '../services/api'
import SocialPostCard from './SocialPostCard'

export default function SocialFeed() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchPosts()
    }, [page])

    const fetchPosts = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await postsAPI.getAll(page)

            const newPosts = response.data.results || response.data

            if (page === 1) {
                setPosts(newPosts)
            } else {
                setPosts(prev => [...prev, ...newPosts])
            }

            // Check if there are more posts
            setHasMore(response.data.next !== null)
        } catch (err) {
            console.error('Error fetching posts:', err)
            setError('Failed to load posts. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLikeUpdate = (postId, isLiked, newCount) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, is_liked: isLiked, likes_count: newCount }
                    : post
            )
        )
    }

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1)
        }
    }

    if (isLoading && page === 1) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading your feed...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                    onClick={() => {
                        setPage(1)
                        fetchPosts()
                    }}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">Be the first to share something!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {posts.map(post => (
                <SocialPostCard
                    key={post.id}
                    post={post}
                    onLikeUpdate={handleLikeUpdate}
                />
            ))}

            {hasMore && (
                <div className="flex justify-center py-8">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isLoading ? (
                            <span className="flex items-center space-x-2">
                                <div className="w-5 h-5 border-2 border-gray-400 rounded-full animate-spin border-t-transparent"></div>
                                <span>Loading...</span>
                            </span>
                        ) : (
                            'Load More'
                        )}
                    </button>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p className="font-medium">You've reached the end! 🎉</p>
                </div>
            )}
        </div>
    )
}

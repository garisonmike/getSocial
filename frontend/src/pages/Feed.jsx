import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import { postsAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function Feed() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { isAuthenticated } = useAuthStore()

    useEffect(() => {
        fetchFeed()
    }, [])

    const fetchFeed = async () => {
        try {
            const response = await postsAPI.getFeed()
            setPosts(response.data.results || response.data)
        } catch (error) {
            console.error('Error fetching feed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts])
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Feed</h1>

            <CreatePost onPostCreated={handlePostCreated} />

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600">Loading feed...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600 mb-4">No posts in your feed yet.</p>
                    <p className="text-sm text-gray-500">
                        Follow some users to see their posts here!
                    </p>
                </div>
            ) : (
                <div>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} onUpdate={fetchFeed} />
                    ))}
                </div>
            )}
        </div>
    )
}

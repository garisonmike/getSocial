import { Navigate } from 'react-router-dom'
import CreatePost from '../components/CreatePost'
import SocialFeed from '../components/SocialFeed'
import { useAuthStore } from '../store/authStore'

export default function SocialFeedPage() {
    const { isAuthenticated, user } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-2xl mx-auto px-4">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Social Feed</h1>
                    <p className="text-gray-600">See what's happening in your network</p>
                </div>

                {/* Create Post Section */}
                <div className="mb-6">
                    <CreatePost onPostCreated={(newPost) => {
                        // Optionally refresh feed or prepend new post
                        window.location.reload()
                    }} />
                </div>

                {/* Social Feed */}
                <SocialFeed />
            </div>
        </div>
    )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { postsAPI, profilesAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
    const { username } = useParams()
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthStore()

    useEffect(() => {
        fetchProfile()
    }, [username])

    const fetchProfile = async () => {
        try {
            // In a real app, you'd have an endpoint to get profile by username
            const response = await profilesAPI.getMe()
            setProfile(response.data)

            // Fetch user's posts
            const postsResponse = await postsAPI.getAll()
            setPosts(postsResponse.data.results || [])
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="card mb-8">
                <div className="flex items-start space-x-6">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-4xl">
                        {profile?.avatar ? (
                            <img src={profile.avatar} alt="" className="w-24 h-24 rounded-full" />
                        ) : (
                            '👤'
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                            <h1 className="text-2xl font-bold">{profile?.username}</h1>
                            {profile?.is_verified && <span className="text-primary-600">✓</span>}
                        </div>

                        <p className="text-gray-600 mb-4">{profile?.bio || 'No bio yet'}</p>

                        <div className="flex space-x-8 text-sm">
                            <div>
                                <span className="font-semibold">{profile?.posts_count}</span>
                                <span className="text-gray-600 ml-1">Posts</span>
                            </div>
                            <div>
                                <span className="font-semibold">{profile?.followers_count}</span>
                                <span className="text-gray-600 ml-1">Followers</span>
                            </div>
                            <div>
                                <span className="font-semibold">{profile?.following_count}</span>
                                <span className="text-gray-600 ml-1">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div>
                <h2 className="text-xl font-bold mb-4">Posts</h2>
                {posts.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-600">No posts yet</p>
                    </div>
                ) : (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                )}
            </div>
        </div>
    )
}

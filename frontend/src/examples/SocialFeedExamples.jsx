import SocialFeed from '../components/SocialFeed'
import SocialPostCard from '../components/SocialPostCard'

// Example 1: Basic Social Feed
export function BasicSocialFeed() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Social Feed</h1>
            <SocialFeed />
        </div>
    )
}

// Example 2: Social Feed with Custom Styling
export function CustomStyledFeed() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Discover Posts
                    </h1>
                    <p className="text-gray-600 mt-2">
                        See what's trending in your network
                    </p>
                </div>
                <SocialFeed />
            </div>
        </div>
    )
}

// Example 3: Single Post Display
export function SinglePostExample() {
    const samplePost = {
        id: 1,
        content: "Just launched my new project! 🚀 Check it out and let me know what you think!",
        image: "https://via.placeholder.com/600x400",
        author: "johndoe",
        author_username: "johndoe",
        author_avatar: null,
        created_at: new Date().toISOString(),
        likes_count: 42,
        comments_count: 8,
        shares_count: 3,
        is_liked: false
    }

    const handleLikeUpdate = (postId, isLiked, newCount) => {
        console.log(`Post ${postId} - Liked: ${isLiked}, Count: ${newCount}`)
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <SocialPostCard
                post={samplePost}
                onLikeUpdate={handleLikeUpdate}
            />
        </div>
    )
}

// Example 4: Feed with Side Panel
export function FeedWithSidebar() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Feed */}
                    <div className="lg:col-span-2">
                        <SocialFeed />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
                            <h3 className="font-bold text-lg mb-4">Trending Topics</h3>
                            <div className="space-y-3">
                                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <p className="font-semibold text-sm">#WebDevelopment</p>
                                    <p className="text-xs text-gray-500">1.2K posts</p>
                                </div>
                                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <p className="font-semibold text-sm">#ReactJS</p>
                                    <p className="text-xs text-gray-500">856 posts</p>
                                </div>
                                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <p className="font-semibold text-sm">#Django</p>
                                    <p className="text-xs text-gray-500">643 posts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Example 5: Feed with Tabs
export function FeedWithTabs() {
    const [activeTab, setActiveTab] = useState('for-you')

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Tabs */}
            <div className="bg-white rounded-t-xl border-b border-gray-200 flex">
                <button
                    onClick={() => setActiveTab('for-you')}
                    className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'for-you'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    For You
                </button>
                <button
                    onClick={() => setActiveTab('following')}
                    className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'following'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Following
                </button>
            </div>

            {/* Feed Content */}
            <div className="mt-6">
                <SocialFeed />
            </div>
        </div>
    )
}

// Don't forget to import useState for Example 5
import { useState } from 'react'

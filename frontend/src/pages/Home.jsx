import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center min-h-screen text-center py-12">
                    <h1 className="text-6xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="text-primary-600">getSocial</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-2xl">
                        Connect with friends, share your moments, and discover what's happening around you.
                    </p>

                    <div className="flex space-x-4">
                        <Link to="/register" className="btn-primary text-lg px-8 py-3">
                            Get Started
                        </Link>
                        <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                            Sign In
                        </Link>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
                        <div className="card text-center">
                            <div className="text-4xl mb-4">📸</div>
                            <h3 className="font-semibold text-lg mb-2">Share Moments</h3>
                            <p className="text-gray-600 text-sm">
                                Post photos, videos, and updates with your network
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="font-semibold text-lg mb-2">Connect</h3>
                            <p className="text-gray-600 text-sm">
                                Follow friends and discover new connections
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="font-semibold text-lg mb-2">Engage</h3>
                            <p className="text-gray-600 text-sm">
                                Like, comment, and share with your community
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

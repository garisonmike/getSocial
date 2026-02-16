import { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex items-center">
                                <span className="text-2xl font-bold text-primary-600">getSocial</span>
                            </Link>

                            {isAuthenticated && (
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <Link
                                        to="/feed"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                                    >
                                        Feed
                                    </Link>
                                    <Link
                                        to={`/profile/${user?.username}`}
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                                    >
                                        Profile
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-sm text-gray-700">
                                        {user?.username}
                                    </span>
                                    <button onClick={logout} className="btn-secondary">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-secondary">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn-primary">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © 2026 getSocial. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

import { Link } from 'react-router-dom'

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>

                <div className="card">
                    <p className="text-center text-gray-600 mb-4">
                        Registration form coming soon!
                    </p>
                    <p className="text-center text-sm text-gray-500">
                        For now, create an account via Django admin:
                        <br />
                        <a href="/admin" className="text-primary-600 hover:underline">
                            /admin
                        </a>
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
import { useState } from 'react'
import { postsAPI } from '../services/api'

export default function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState('')
    const [image, setImage] = useState(null)
    const [visibility, setVisibility] = useState('public')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('content', content)
            formData.append('visibility', visibility)
            if (image) {
                formData.append('image', image)
            }

            const response = await postsAPI.create(formData)
            setContent('')
            setImage(null)
            setVisibility('public')

            if (onPostCreated) {
                onPostCreated(response.data)
            }
        } catch (error) {
            console.error('Error creating post:', error)
            alert('Failed to create post')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="card mb-6">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="textarea mb-4"
                    rows="3"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <label className="cursor-pointer text-sm text-gray-600 hover:text-primary-600">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            📷 Photo
                        </label>

                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                            <option value="public">Public</option>
                            <option value="followers">Followers Only</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>

                {image && (
                    <p className="text-sm text-gray-600 mt-2">
                        Selected: {image.name}
                    </p>
                )}
            </form>
        </div>
    )
}

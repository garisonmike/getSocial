import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// API endpoints
export const postsAPI = {
    getFeed: () => api.get('/posts/feed/'),
    getAll: (page = 1) => api.get(`/posts/?page=${page}`),
    getById: (id) => api.get(`/posts/${id}/`),
    create: (data) => api.post('/posts/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.patch(`/posts/${id}/`, data),
    delete: (id) => api.delete(`/posts/${id}/`),
    like: (id) => api.post(`/posts/${id}/like/`),
    unlike: (id) => api.post(`/posts/${id}/unlike/`),
    getComments: (id) => api.get(`/posts/${id}/comments/`),
}

export const commentsAPI = {
    create: (data) => api.post('/comments/', data),
    update: (id, data) => api.patch(`/comments/${id}/`, data),
    delete: (id) => api.delete(`/comments/${id}/`),
    like: (id) => api.post(`/comments/${id}/like/`),
    unlike: (id) => api.post(`/comments/${id}/unlike/`),
}

export const profilesAPI = {
    getMe: () => api.get('/profiles/me/'),
    getById: (id) => api.get(`/profiles/${id}/`),
    update: (id, data) => api.patch(`/profiles/${id}/`, data),
    getFollowers: (id) => api.get(`/profiles/${id}/followers/`),
    getFollowing: (id) => api.get(`/profiles/${id}/following/`),
}

export const followsAPI = {
    follow: (userId) => api.post('/follows/', { following_id: userId }),
    unfollow: (userId) => api.post('/follows/unfollow/', { following_id: userId }),
}

export default api

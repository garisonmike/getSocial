import { create } from 'zustand'
import { profilesAPI } from '../services/api'

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    logout: () => {
        localStorage.removeItem('token')
        set({ user: null, isAuthenticated: false })
    },

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                const response = await profilesAPI.getMe()
                set({ user: response.data, isAuthenticated: true, isLoading: false })
            } else {
                set({ isLoading: false })
            }
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false })
        }
    },
}))

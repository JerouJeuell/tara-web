import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/axios'

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            // ── Register ──
            register: async (data) => {
                const response = await api.post('/api/auth/register', data)
                const { user, token } = response.data

                localStorage.setItem('token', token)
                set({ user, token, isAuthenticated: true })

                return user
            },

            // ── Login ──
            login: async (data) => {
                const response = await api.post('/api/auth/login', data)
                const { user, token } = response.data

                localStorage.setItem('token', token)
                set({ user, token, isAuthenticated: true })

                return user
            },

            // ── Logout ──
            logout: async () => {
                try {
                    await api.post('/api/auth/logout')
                } catch (e) {
                    // logout even if request fails
                }
                localStorage.removeItem('token')
                set({ user: null, token: null, isAuthenticated: false })
            },

            // ── Update user in store ──
            setUser: (user) => set({ user }),
        }),
        {
            name: 'tara-auth',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

export default useAuthStore
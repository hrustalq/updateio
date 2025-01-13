import axios from 'axios'
import { useAuthStore } from '@/lib/auth'

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for cookies
})

// Add auth header interceptor
authApi.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Add response interceptor for token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const response = await authApi.post('/v1/auth/refresh')
        const { accessToken } = response.data

        // Update access token
        useAuthStore.getState().setAccessToken(accessToken)

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return authApi(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout user
        useAuthStore.getState().logout()
        throw refreshError
      }
    }

    return Promise.reject(error)
  }
)

interface LoginCredentials {
  email: string
  password: string
}

interface AuthResponse {
  user: {
    id: string
    email: string
    username: string
    role: 'admin' | 'user'
  }
  accessToken: string
}

export const login = async (credentials: LoginCredentials) => {
  const response = await authApi.post<AuthResponse>('/v1/auth/login', credentials)
  return response.data
}

export const logout = async () => {
  await authApi.post('/v1/auth/logout')
  useAuthStore.getState().logout()
}

export const getCurrentUser = async () => {
  const response = await authApi.get<AuthResponse>('/v1/auth/me')
  return response.data
}

export default authApi 
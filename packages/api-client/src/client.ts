import axios from 'axios'
import type { paths } from './schema'
import { useAuthStore } from '@repo/auth-store'

const getEnvVar = (key: string): string | undefined => {
  // Vite environment
  // @ts-ignore - Vite defines import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore - Vite environment variables
    return import.meta.env[key]
  }

  // Node.js / Next.js environment
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]
  }

  return undefined
}

// Default API URL if environment variables are not set
const DEFAULT_API_URL = getEnvVar('FALLBACK_API_URL');

export const apiClient = axios.create({
  baseURL: `${getEnvVar('VITE_API_URL') || getEnvVar('NEXT_PUBLIC_API_URL') || DEFAULT_API_URL}/v1`,
  withCredentials: true,
})

// Add auth header interceptor
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Don't attempt refresh if:
    // 1. It's not a 401 error
    // 2. It's a 401 from the auth endpoints (login, refresh, etc)
    // 3. We've already tried to refresh
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/token/refresh')
    ) {
      originalRequest._retry = true

      try {
        const response = await apiClient.post<paths['/auth/token/refresh']['post']['responses']['201']['content']['application/json']>('/auth/token/refresh')
        const { data } = response.data
        if (!data) {
          throw new Error('No data returned from refresh endpoint')
        }
        const { access_token: accessToken } = data

        useAuthStore.getState().setAccessToken(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Clear token and reject with original error
        useAuthStore.getState().setAccessToken(null)
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
export const auth = {
  login: async (credentials: paths['/auth/login']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/auth/login']['post']['responses']['201']['content']['application/json']>('/auth/login', credentials)
    useAuthStore.getState().setAccessToken(response.data.data?.access_token ?? null)
    return response.data
  },

  telegramLogin: async (data: paths['/auth/telegram/login']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/auth/telegram/login']['post']['responses']['201']['content']['application/json']>('/auth/telegram/login', data)
    return response.data
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
    useAuthStore.getState().setAccessToken(null)
  },

  verify: async (token: string) => {
    const response = await apiClient.get<paths['/auth/verify']['get']['responses']['200']['content']['application/json']>('/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<paths['/auth/me']['get']['responses']['200']['content']['application/json']>('/auth/me')
    return response.data
  },

  refreshToken: async () => {
    const response = await apiClient.post<paths['/auth/token/refresh']['post']['responses']['201']['content']['application/json']>('/auth/token/refresh')
    if (response.data.data?.access_token) {
      useAuthStore.getState().setAccessToken(response.data.data.access_token)
    }
    return response.data
  },
}

// Users endpoints
export const users = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<paths['/users']['get']['responses']['200']['content']['application/json']>('/users', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/users/{id}']['get']['responses']['200']['content']['application/json']>(`/users/${id}`)
    return response.data
  },

  getByTelegramId: async (telegramId: string) => {
    const response = await apiClient.get<paths['/users/telegram/{telegramId}']['get']['responses']['200']['content']['application/json']>(`/users/telegram/${telegramId}`)
    return response.data
  },

  create: async (data: paths['/users']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/users']['post']['responses']['201']['content']['application/json']>('/users', data)
    return response.data
  },

  update: async (id: string, data: paths['/users/{id}']['patch']['requestBody']['content']['application/json']) => {
    const response = await apiClient.patch<paths['/users/{id}']['patch']['responses']['200']['content']['application/json']>(`/users/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/users/${id}`)
  },
}

// Game providers endpoints
export const gameProviders = {
  getAll: async (params?: paths['/game-providers']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/game-providers']['get']['responses']['200']['content']['application/json']>('/game-providers', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/game-providers/{id}']['get']['responses']['200']['content']['application/json']>(`/game-providers/${id}`)
    return response.data
  },

  create: async (data: FormData) => {
    const response = await apiClient.post<paths['/game-providers']['post']['responses']['201']['content']['application/json']>('/game-providers', data)
    return response.data
  },

  update: async (id: string, data: FormData) => {
    const response = await apiClient.patch<paths['/game-providers/{id}']['patch']['responses']['200']['content']['application/json']>(`/game-providers/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/game-providers/${id}`)
  },
}

// Games endpoints
export const games = {
  getAll: async (params?: paths['/games']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/games']['get']['responses']['200']['content']['application/json']>('/games', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/games/{id}']['get']['responses']['200']['content']['application/json']>(`/games/${id}`)
    return response.data
  },

  create: async (data: FormData) => {
    const response = await apiClient.post<paths['/games']['post']['responses']['201']['content']['application/json']>('/games', data)
    return response.data
  },

  update: async (id: string, data: FormData) => {
    const response = await apiClient.patch<paths['/games/{id}']['patch']['responses']['200']['content']['application/json']>(`/games/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/games/${id}`)
  },
}

// Subscriptions endpoints
export const subscriptions = {
  getAll: async (params: paths['/subscriptions']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/subscriptions']['get']['responses']['200']['content']['application/json']>('/subscriptions', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/subscriptions/{id}']['get']['responses']['200']['content']['application/json']>(`/subscriptions/${id}`)
    return response.data
  },

  create: async (data: paths['/subscriptions']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/subscriptions']['post']['responses']['201']['content']['application/json']>('/subscriptions', data)
    return response.data
  },

  update: async (id: string, data: paths['/subscriptions/{id}']['patch']['requestBody']['content']['application/json']) => {
    const response = await apiClient.patch<paths['/subscriptions/{id}']['patch']['responses']['200']['content']['application/json']>(`/subscriptions/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/subscriptions/${id}`)
  },
}

// Notifications endpoints
export const notifications = {
  getAll: async (params: paths['/notifications']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/notifications']['get']['responses']['200']['content']['application/json']>('/notifications', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/notifications/{id}']['get']['responses']['200']['content']['application/json']>(`/notifications/${id}`)
    return response.data
  },

  create: async (data: paths['/notifications']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/notifications']['post']['responses']['201']['content']['application/json']>('/notifications', data)
    return response.data
  },

  update: async (id: string, data: paths['/notifications/{id}']['patch']['requestBody']['content']['application/json']) => {
    const response = await apiClient.patch<paths['/notifications/{id}']['patch']['responses']['200']['content']['application/json']>(`/notifications/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/notifications/${id}`)
  },
}

// Reports endpoints
export const reports = {
  getAll: async (params: paths['/reports']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/reports']['get']['responses']['200']['content']['application/json']>('/reports', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/reports/{id}']['get']['responses']['200']['content']['application/json']>(`/reports/${id}`)
    return response.data
  },

  create: async (data: paths['/reports']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/reports']['post']['responses']['201']['content']['application/json']>('/reports', data)
    return response.data
  },

  update: async (id: string, data: paths['/reports/{id}']['patch']['requestBody']['content']['application/json']) => {
    const response = await apiClient.patch<paths['/reports/{id}']['patch']['responses']['200']['content']['application/json']>(`/reports/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/reports/${id}`)
  },
}

// Update commands endpoints
export const updateCommands = {
  getAll: async (params: paths['/update-commands']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/update-commands']['get']['responses']['200']['content']['application/json']>('/update-commands', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/update-commands/{id}']['get']['responses']['200']['content']['application/json']>(`/update-commands/${id}`)
    return response.data
  },

  create: async (data: paths['/update-commands']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/update-commands']['post']['responses']['201']['content']['application/json']>('/update-commands', data)
    return response.data
  },

  update: async (id: string, data: paths['/update-commands/{id}']['patch']['requestBody']['content']['application/json']) => {
    const response = await apiClient.patch<paths['/update-commands/{id}']['patch']['responses']['200']['content']['application/json']>(`/update-commands/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/update-commands/${id}`)
  },
}

// Updates endpoints
export const updates = {
  getAll: async (params?: paths['/updates']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/updates']['get']['responses']['200']['content']['application/json']>('/updates', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/updates/{id}']['get']['responses']['200']['content']['application/json']>(`/updates/${id}`)
    return response.data
  },

  create: async (data: paths['/updates']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/updates']['post']['responses']['201']['content']['application/json']>('/updates', data)
    return response.data
  },

  update: async (id: string, data: paths['/updates/{id}']['patch']['requestBody']['content']['application/json']) => {
    const response = await apiClient.patch<paths['/updates/{id}']['patch']['responses']['200']['content']['application/json']>(`/updates/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/updates/${id}`)
  },
}


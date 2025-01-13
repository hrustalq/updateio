import axios from 'axios'
import type { paths } from './schema'
import { useAuthStore } from '@repo/auth'

export const apiClient = axios.create({
  baseURL: process.env.VITE_API_URL,
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await apiClient.post<paths['/auth/refresh']['post']['responses']['201']['content']['application/json']>('/auth/refresh')
        const { data } = response.data
        if (!data) {
          throw new Error('No data returned from refresh endpoint')
        }
        const { access_token: accessToken } = data

        useAuthStore.getState().setAccessToken(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        throw refreshError
      }
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
export const auth = {
  login: async (credentials: paths['/auth/login']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/auth/login']['post']['responses']['201']['content']['application/json']>('/auth/login', credentials)
    return response.data
  },

  logout: async () => {
    await apiClient.post('/v1/auth/logout')
  },

  verify: async (token: string) => {
    const response = await apiClient.get<paths['/auth/verify']['get']['responses']['200']['content']['application/json']>('/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<paths['/auth/me']['get']['responses']['200']['content']['application/json']>('/auth/me')
    return response.data
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

  create: async (data: paths['/game-providers']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/game-providers']['post']['responses']['201']['content']['application/json']>('/game-providers', data)
    return response.data
  },

  update: async (id: string, data: paths['/game-providers/{id}']['patch']['requestBody']['content']['application/json']) => {
    const response = await apiClient.patch<paths['/game-providers/{id}']['patch']['responses']['200']['content']['application/json']>(`/game-providers/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/v1/game-providers/${id}`)
  },
}

// Games endpoints
export const games = {
  getAll: async (params?: paths['/games']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/games']['get']['responses']['200']['content']['application/json']>('/games', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<paths['/games/{id}']['get']['responses']['200']['content']['application/json']>(`/v1/games/${id}`)
    return response.data
  },

  create: async (data: paths['/games']['post']['requestBody']['content']['application/json']) => {
    const response = await apiClient.post<paths['/games']['post']['responses']['201']['content']['application/json']>('/games', data)
    return response.data
  },

  update: async (id: string, data: paths['/games/{id}']['patch']['requestBody']['content']['application/json']) => {
    const response = await apiClient.patch<paths['/games/{id}']['patch']['responses']['200']['content']['application/json']>(`/games/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/v1/games/${id}`)
  },
}

// Notifications endpoints
export const notifications = {
  getAll: async (params?: paths['/notifications']['get']['parameters']['query']) => {
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
    await apiClient.delete(`/v1/notifications/${id}`)
  },
}

// Update commands endpoints
export const updateCommands = {
  getAll: async (params?: paths['/update-commands']['get']['parameters']['query']) => {
    const response = await apiClient.get<paths['/update-commands']['get']['responses']['200']['content']['application/json']>('/update-commands', { params })
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
    await apiClient.delete(`/v1/update-commands/${id}`)
  },
}

import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@repo/credentials'
import { ApiConfigProvider } from '@repo/api-client'

import { routeTree } from './routeTree.gen'

import "@repo/ui/globals.css"
import './style.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:3000',
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <ApiConfigProvider value={apiConfig}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider
            onAuthStateChange={(isAuthenticated) => {
              if (isAuthenticated) {
                router.navigate({ to: '/' })
              } else {
                router.navigate({ to: '/login' })
              }
            }}
          >
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </ApiConfigProvider>
    </StrictMode>,
  )
}
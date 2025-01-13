import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuthStore } from '@/lib/auth'
import { getCurrentUser } from '@/api/auth'

import PageHeader from '../components/PageHeader'

export const Route = createRootRoute({
  beforeLoad: async ({ context, location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && location.pathname !== '/login') {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }

    // Try to get current user if authenticated but no user data
    if (isAuthenticated && !useAuthStore.getState().user) {
      try {
        const response = await getCurrentUser()
        useAuthStore.getState().setUser(response.user)
      } catch (error) {
        useAuthStore.getState().logout()
        throw redirect({
          to: '/login',
          search: {
            redirect: location.pathname,
          },
        })
      }
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const { isAuthenticated } = useAuthStore()
  const isLoginPage = window.location.pathname === '/login'

  // Show only the login page content when not authenticated
  if (!isAuthenticated && isLoginPage) {
    return (
      <div className="min-h-screen flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </div>
    )
  }

  // Show full layout when authenticated
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  )
}
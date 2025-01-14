import React from 'react'
import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuthStore } from '@/lib/auth'

import PageHeader from '../components/PageHeader'

export const Route = createRootRoute({
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
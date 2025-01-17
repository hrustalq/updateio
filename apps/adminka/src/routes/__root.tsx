import React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import PageHeader from '../components/PageHeader'

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: (search: Record<string, unknown>) => search,
})

function RootComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  );
}
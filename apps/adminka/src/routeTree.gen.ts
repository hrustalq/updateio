/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UsersImport } from './routes/users'
import { Route as UnauthorizedImport } from './routes/unauthorized'
import { Route as SettingsImport } from './routes/settings'
import { Route as MessagesImport } from './routes/messages'
import { Route as LoginImport } from './routes/login'
import { Route as GamesImport } from './routes/games'
import { Route as GameProvidersImport } from './routes/game-providers'
import { Route as UsersUserIdImport } from './routes/users.$userId'

// Create Virtual Routes

const MetricsLazyImport = createFileRoute('/metrics')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const MetricsLazyRoute = MetricsLazyImport.update({
  id: '/metrics',
  path: '/metrics',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/metrics.lazy').then((d) => d.Route))

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const UsersRoute = UsersImport.update({
  id: '/users',
  path: '/users',
  getParentRoute: () => rootRoute,
} as any)

const UnauthorizedRoute = UnauthorizedImport.update({
  id: '/unauthorized',
  path: '/unauthorized',
  getParentRoute: () => rootRoute,
} as any)

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const MessagesRoute = MessagesImport.update({
  id: '/messages',
  path: '/messages',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const GamesRoute = GamesImport.update({
  id: '/games',
  path: '/games',
  getParentRoute: () => rootRoute,
} as any)

const GameProvidersRoute = GameProvidersImport.update({
  id: '/game-providers',
  path: '/game-providers',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const UsersUserIdRoute = UsersUserIdImport.update({
  id: '/$userId',
  path: '/$userId',
  getParentRoute: () => UsersRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/game-providers': {
      id: '/game-providers'
      path: '/game-providers'
      fullPath: '/game-providers'
      preLoaderRoute: typeof GameProvidersImport
      parentRoute: typeof rootRoute
    }
    '/games': {
      id: '/games'
      path: '/games'
      fullPath: '/games'
      preLoaderRoute: typeof GamesImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/messages': {
      id: '/messages'
      path: '/messages'
      fullPath: '/messages'
      preLoaderRoute: typeof MessagesImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/unauthorized': {
      id: '/unauthorized'
      path: '/unauthorized'
      fullPath: '/unauthorized'
      preLoaderRoute: typeof UnauthorizedImport
      parentRoute: typeof rootRoute
    }
    '/users': {
      id: '/users'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof UsersImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/metrics': {
      id: '/metrics'
      path: '/metrics'
      fullPath: '/metrics'
      preLoaderRoute: typeof MetricsLazyImport
      parentRoute: typeof rootRoute
    }
    '/users/$userId': {
      id: '/users/$userId'
      path: '/$userId'
      fullPath: '/users/$userId'
      preLoaderRoute: typeof UsersUserIdImport
      parentRoute: typeof UsersImport
    }
  }
}

// Create and export the route tree

interface UsersRouteChildren {
  UsersUserIdRoute: typeof UsersUserIdRoute
}

const UsersRouteChildren: UsersRouteChildren = {
  UsersUserIdRoute: UsersUserIdRoute,
}

const UsersRouteWithChildren = UsersRoute._addFileChildren(UsersRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/game-providers': typeof GameProvidersRoute
  '/games': typeof GamesRoute
  '/login': typeof LoginRoute
  '/messages': typeof MessagesRoute
  '/settings': typeof SettingsRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/users': typeof UsersRouteWithChildren
  '/about': typeof AboutLazyRoute
  '/metrics': typeof MetricsLazyRoute
  '/users/$userId': typeof UsersUserIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/game-providers': typeof GameProvidersRoute
  '/games': typeof GamesRoute
  '/login': typeof LoginRoute
  '/messages': typeof MessagesRoute
  '/settings': typeof SettingsRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/users': typeof UsersRouteWithChildren
  '/about': typeof AboutLazyRoute
  '/metrics': typeof MetricsLazyRoute
  '/users/$userId': typeof UsersUserIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/game-providers': typeof GameProvidersRoute
  '/games': typeof GamesRoute
  '/login': typeof LoginRoute
  '/messages': typeof MessagesRoute
  '/settings': typeof SettingsRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/users': typeof UsersRouteWithChildren
  '/about': typeof AboutLazyRoute
  '/metrics': typeof MetricsLazyRoute
  '/users/$userId': typeof UsersUserIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/game-providers'
    | '/games'
    | '/login'
    | '/messages'
    | '/settings'
    | '/unauthorized'
    | '/users'
    | '/about'
    | '/metrics'
    | '/users/$userId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/game-providers'
    | '/games'
    | '/login'
    | '/messages'
    | '/settings'
    | '/unauthorized'
    | '/users'
    | '/about'
    | '/metrics'
    | '/users/$userId'
  id:
    | '__root__'
    | '/'
    | '/game-providers'
    | '/games'
    | '/login'
    | '/messages'
    | '/settings'
    | '/unauthorized'
    | '/users'
    | '/about'
    | '/metrics'
    | '/users/$userId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  GameProvidersRoute: typeof GameProvidersRoute
  GamesRoute: typeof GamesRoute
  LoginRoute: typeof LoginRoute
  MessagesRoute: typeof MessagesRoute
  SettingsRoute: typeof SettingsRoute
  UnauthorizedRoute: typeof UnauthorizedRoute
  UsersRoute: typeof UsersRouteWithChildren
  AboutLazyRoute: typeof AboutLazyRoute
  MetricsLazyRoute: typeof MetricsLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  GameProvidersRoute: GameProvidersRoute,
  GamesRoute: GamesRoute,
  LoginRoute: LoginRoute,
  MessagesRoute: MessagesRoute,
  SettingsRoute: SettingsRoute,
  UnauthorizedRoute: UnauthorizedRoute,
  UsersRoute: UsersRouteWithChildren,
  AboutLazyRoute: AboutLazyRoute,
  MetricsLazyRoute: MetricsLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/game-providers",
        "/games",
        "/login",
        "/messages",
        "/settings",
        "/unauthorized",
        "/users",
        "/about",
        "/metrics"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/game-providers": {
      "filePath": "game-providers.tsx"
    },
    "/games": {
      "filePath": "games.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/messages": {
      "filePath": "messages.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/unauthorized": {
      "filePath": "unauthorized.tsx"
    },
    "/users": {
      "filePath": "users.tsx",
      "children": [
        "/users/$userId"
      ]
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/metrics": {
      "filePath": "metrics.lazy.tsx"
    },
    "/users/$userId": {
      "filePath": "users.$userId.tsx",
      "parent": "/users"
    }
  }
}
ROUTE_MANIFEST_END */

import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from '@tanstack/react-router'
import { AppLayout } from './components/AppLayout'
import HomePage from './pages/HomePage'
import InventoryPage from './pages/InventoryPage'
import { TOKEN_KEY } from './services/apiClient'

function requireAuth() {
  if (!localStorage.getItem(TOKEN_KEY)) {
    throw redirect({ to: '/' })
  }
}

function redirectIfAuthenticated() {
  if (localStorage.getItem(TOKEN_KEY)) {
    throw redirect({ to: '/inventario' })
  }
}

const rootRoute = createRootRoute({
  component: AppLayout,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: redirectIfAuthenticated,
  component: HomePage,
})

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventario',
  beforeLoad: requireAuth,
  component: InventoryPage,
})

const routeTree = rootRoute.addChildren([homeRoute, inventoryRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: false,
})

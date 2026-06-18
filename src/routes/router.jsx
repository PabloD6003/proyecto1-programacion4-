import { createRouter, createRoute, createRootRoute, redirect, Outlet } from '@tanstack/react-router'
import RegistroDeGastos from '../components/RegistroDeGastos'
import App from '../App'
import InventarioPage from '../pages/InventarioPage'
import DonacionesPage from '../pages/Donaciones/DonacionesPage'
import BeneficiariosLayout from '../features/beneficiarios/BeneficiariosLayout'
import BeneficiariosPage from '../features/beneficiarios/pages/BeneficiariosPage'
import AsistenciaPage from '../features/beneficiarios/pages/AsistenciaPage'
import AccesoGuard from '../modules/acceso/pages/AccesoGuard'
import LoginPage from '../modules/auth/pages/LoginPage'
import RegistroPage from '../modules/auth/pages/RegistroPage'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registro',
  component: RegistroPage,
})

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: App,
  beforeLoad: ({ context }) => {
    if (!context.auth?.sesionIniciada) {
      throw redirect({ to: '/login' })
    }
  },
})

const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: () => <h1>Bienvenido al Sistema SIGAC</h1>,
})

const donacionesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/donaciones',
  component: DonacionesPage,
})

const inventarioRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/inventario',
  component: InventarioPage,
})

const gastosRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/gastos',
  component: () => <RegistroDeGastos/>,
})

const beneficiariosLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/beneficiarios',
  component: BeneficiariosLayout,
})

const beneficiariosIndexRoute = createRoute({
  getParentRoute: () => beneficiariosLayoutRoute,
  path: '/',
  component: BeneficiariosPage,
})

const asistenciaRoute = createRoute({
  getParentRoute: () => beneficiariosLayoutRoute,
  path: '/asistencia',
  component: AsistenciaPage,
})

const accesoRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/acceso',
  component: AccesoGuard,
})

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    loginRoute,
    registroRoute,
    appLayoutRoute.addChildren([
      indexRoute,
      donacionesRoute,
      inventarioRoute,
      gastosRoute,
      beneficiariosLayoutRoute.addChildren([beneficiariosIndexRoute, asistenciaRoute]),
      accesoRoute,
    ]),
  ]),
  context: {
    auth: undefined,
  },
})

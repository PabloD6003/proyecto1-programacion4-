import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import RegistroDeGastos from '../components/RegistroDeGastos'
import App from '../App'
import BeneficiariosLayout from '../features/beneficiarios/BeneficiariosLayout'
import BeneficiariosPage from '../features/beneficiarios/pages/BeneficiariosPage'
import AsistenciaPage from '../features/beneficiarios/pages/AsistenciaPage'
import DonacionesPage from '../pages/Donaciones/DonacionesPage'

const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <h1>Bienvenido al Sistema SIGAC</h1>,
})

const donacionesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donaciones',
  component: DonacionesPage,
})

const inventarioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventario',
  component: () => <h2>Inventario</h2>,
})

const gastosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gastos',
  component: () => <RegistroDeGastos/>,
})

const beneficiariosLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
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
  getParentRoute: () => rootRoute,
  path: '/acceso',
  component: () => <h2>Gestión de Acceso</h2>,
})

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    donacionesRoute,
    inventarioRoute,
    gastosRoute,
    beneficiariosLayoutRoute.addChildren([beneficiariosIndexRoute, asistenciaRoute]),
    accesoRoute,
  ]),
})

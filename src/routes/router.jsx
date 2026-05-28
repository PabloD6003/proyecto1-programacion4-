import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import RegistroDeGastos from '../Components/Registro de gastos'
import App from '../App'

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
  component: () => <h2>Donaciones</h2>,
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

const beneficiariosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/beneficiarios',
  component: () => <h2>Gestión de Beneficiarios</h2>,
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
    beneficiariosRoute,
    accesoRoute,
  ]),
})
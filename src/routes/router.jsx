import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import App from '../App'
<<<<<<< HEAD
import BeneficiariosLayout from '../features/beneficiarios/BeneficiariosLayout'
import BeneficiariosPage from '../features/beneficiarios/pages/BeneficiariosPage'
import AsistenciaPage from '../features/beneficiarios/pages/AsistenciaPage'
import DonacionesPage from '../pages/Donaciones/DonacionesPage'
=======
import AccesoPage from '../modules/acceso/pages/AccesoPage'
>>>>>>> df378e6 (feat(acceso): integrar AccesoPage y conectar ruta en router)

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
<<<<<<< HEAD
  component: DonacionesPage,
=======
  component: () => <h2>Donaciones</h2>,
>>>>>>> df378e6 (feat(acceso): integrar AccesoPage y conectar ruta en router)
})

const inventarioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventario',
  component: () => <h2>Inventario</h2>,
})

const gastosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gastos',
  component: () => <h2>Registro de Gastos</h2>,
})

<<<<<<< HEAD
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
=======
const beneficiariosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/beneficiarios',
  component: () => <h2>Gestión de Beneficiarios</h2>,
>>>>>>> df378e6 (feat(acceso): integrar AccesoPage y conectar ruta en router)
})

const accesoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/acceso',
<<<<<<< HEAD
  component: () => <h2>Gestión de Acceso</h2>,
=======
  component: AccesoPage,
>>>>>>> df378e6 (feat(acceso): integrar AccesoPage y conectar ruta en router)
})

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    donacionesRoute,
    inventarioRoute,
    gastosRoute,
<<<<<<< HEAD
    beneficiariosLayoutRoute.addChildren([beneficiariosIndexRoute, asistenciaRoute]),
    accesoRoute,
  ]),
})
=======
    beneficiariosRoute,
    accesoRoute,
  ]),
})
>>>>>>> df378e6 (feat(acceso): integrar AccesoPage y conectar ruta en router)

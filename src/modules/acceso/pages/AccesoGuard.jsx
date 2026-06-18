import useAuth from '../../auth/hooks/useAuth'
import AccesoPage from './AccesoPage'
import SinPermisoPage from './SinPermisoPage'

export default function AccesoGuard() {
  const { tienePermiso } = useAuth()
  const puedeAcceder = tienePermiso('roles.gestionar') || tienePermiso('roles.asignar')

  return puedeAcceder ? <AccesoPage /> : <SinPermisoPage />
}

import useAuth from '../../auth/hooks/useAuth'
import SinPermisoPage from './SinPermisoPage'

export default function AccesoGuard({ permiso, children }) {
  const { usuario, tienePermiso } = useAuth()

  const esAdminOSuper =
    usuario?.rol === 'superusuario' || usuario?.rol === 'administrador'

  const permisosRequeridos = Array.isArray(permiso)
    ? permiso
    : permiso
    ? [permiso]
    : []

  const tieneAlguno = permisosRequeridos.some((clave) => tienePermiso(clave))
  const puedeAcceder =
    esAdminOSuper || permisosRequeridos.length === 0 || tieneAlguno

  return puedeAcceder ? <>{children}</> : <SinPermisoPage />
}

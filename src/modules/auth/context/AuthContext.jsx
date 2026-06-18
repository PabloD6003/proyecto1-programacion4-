import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'
import { TOKEN_STORAGE_KEY } from '../../../services/apiClient'
import { AuthContext } from './authContextBase'

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [usuario, setUsuario] = useState(null)
  const [permisos, setPermisos] = useState([])
  const [cargando, setCargando] = useState(true)

  const aplicarSesion = useCallback((data) => {
    setToken(data.token)
    setUsuario(data.usuario)
    setPermisos(data.permisos ?? [])
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
  }, [])

  const limpiarSesion = useCallback(() => {
    setToken(null)
    setUsuario(null)
    setPermisos([])
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }, [])

  useEffect(() => {
    const hidratar = async () => {
      if (!token) {
        setCargando(false)
        return
      }
      try {
        const data = await authService.me()
        setUsuario(data.usuario)
        setPermisos(data.permisos ?? [])
      } catch {
        limpiarSesion()
      } finally {
        setCargando(false)
      }
    }

    hidratar()
  }, [])

  const login = useCallback(
    async (credenciales) => {
      const data = await authService.login(credenciales)
      aplicarSesion(data)
      return data
    },
    [aplicarSesion],
  )

  const register = useCallback(
    async (datos) => {
      const data = await authService.register(datos)
      aplicarSesion(data)
      return data
    },
    [aplicarSesion],
  )

  const logout = useCallback(() => {
    limpiarSesion()
  }, [limpiarSesion])

  const tienePermiso = useCallback((clave) => permisos.includes(clave), [permisos])

  const value = useMemo(
    () => ({
      token,
      usuario,
      permisos,
      cargando,
      sesionIniciada: Boolean(token && usuario),
      login,
      register,
      logout,
      tienePermiso,
    }),
    [token, usuario, permisos, cargando, login, register, logout, tienePermiso],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { createContext, useCallback, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/authService'
import { TOKEN_KEY } from '../services/apiClient'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem('auth_email')
    return email ? { email } : null
  })

  const login = useCallback(async (email, password) => {
    const newToken = await loginRequest(email, password)
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem('auth_email', email)
    setToken(newToken)
    setUser({ email })
    return newToken
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('auth_email')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

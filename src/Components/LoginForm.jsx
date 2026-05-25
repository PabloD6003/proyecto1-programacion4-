import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      setLoading(false)
      navigate({ to: '/inventario' })
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Credenciales inválidas')
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError(
          'No se pudo conectar al API. Inicia el backend (dotnet run) en http://localhost:5219 y reinicia Vite.',
        )
      } else {
        setError(err.message || 'Error al iniciar sesión')
      }
      setLoading(false)
    }
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <p className="hint">Prueba: admin / 1234</p>

      <label>
        Email
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}

import { useState } from 'react'

export function UserForm({ onSubmit }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!nombre.trim()) {
      setError('El nombre es requerido')
      return
    }
    if (!email.includes('@')) {
      setError('Email inválido')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ nombre, email })
      setNombre('')
      setEmail('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={submitting}
        />
      </label>
      <label>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={submitting}>
        Agregar Usuario
      </button>
    </form>
  )
}

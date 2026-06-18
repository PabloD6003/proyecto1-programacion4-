import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import useAuth from '../hooks/useAuth'

export default function RegistroPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [enviando, setEnviando] = useState(false)
  const [errorBackend, setErrorBackend] = useState(null)

  const form = useForm({
    defaultValues: { nombre: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      setErrorBackend(null)
      setEnviando(true)
      try {
        await register(value)
        navigate({ to: '/' })
      } catch (err) {
        setErrorBackend(err?.response?.data?.mensaje ?? 'No se pudo completar el registro')
      } finally {
        setEnviando(false)
      }
    },
  })

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <h1>Crear cuenta</h1>

        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) => (!value?.trim() ? 'El nombre es requerido' : undefined),
          }}
        >
          {(field) => (
            <div className="auth-field">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => (!value?.trim() ? 'El email es requerido' : undefined),
          }}
        >
          {(field) => (
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => (!value ? 'La contraseña es requerida' : undefined),
          }}
        >
          {(field) => (
            <div className="auth-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
            </div>
          )}
        </form.Field>

        {errorBackend ? <p className="auth-error">{errorBackend}</p> : null}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </div>
  )
}

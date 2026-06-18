import { Link } from '@tanstack/react-router'

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '12px',
        padding: '40px',
      }}
    >
      <h1 style={{ fontSize: '48px', margin: 0 }}>404</h1>
      <h2 style={{ margin: 0 }}>Página no encontrada</h2>
      <p style={{ color: '#6b7280', maxWidth: '420px' }}>
        La ruta que intentas abrir no existe o fue movida.
      </p>
      <Link to="/" style={{ color: '#2563eb', fontWeight: 600 }}>
        Volver al inicio
      </Link>
    </div>
  )
}

import { LoginForm } from '../components/LoginForm'

export default function HomePage() {
  return (
    <section className="page home-page">
      <h1>Bienvenido</h1>
      <p>Inicia sesión para gestionar el inventario.</p>
      <LoginForm />
    </section>
  )
}

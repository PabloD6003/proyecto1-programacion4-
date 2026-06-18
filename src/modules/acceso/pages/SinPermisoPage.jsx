import './AccesoPage.css'

export default function SinPermisoPage() {
  return (
    <div className="acc-alert acc-alert--error">
      <i className="fas fa-lock" />
      No tenés permiso para acceder a esta sección.
    </div>
  )
}

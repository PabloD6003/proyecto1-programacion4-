import useGastos from '../hooks/useGastos'
import FormularioGasto from './FormularioGasto'
import TablaGastos from './TablaGastos'
import './RegistroDeGastos.css'
import useAuth from '../modules/auth/hooks/useAuth'
import SinPermisoPage from '../modules/auth/pages/SinPermisoPage'

export default function RegistroDeGastos() {
  const { gastos, loading, error, agregarGasto } = useGastos()
  const { usuario } = useAuth()

  if (usuario?.rol !== 'superusuario' && usuario?.rol !== 'administrador') {
    return <SinPermisoPage />
  }

  return (
    <div className="registro-gastos">
      <h2> Registro de Gastos </h2>
      {error && <p className="error-msg">{error}</p>}
      <div className="registro-gastos-content">
        <FormularioGasto onAgregar={agregarGasto} loading={loading} />
        <TablaGastos gastos={gastos} loading={loading} />
      </div>
    </div>
  )
}
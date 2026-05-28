import useGastos from '../hooks/useGastos'
import FormularioGasto from './FormularioGasto'
import TablaGastos from './TablaGastos'
import './RegistroDeGastos.css'

export default function RegistroDeGastos() {
  const { gastos, loading, error, agregarGasto } = useGastos()

  return (
    <div className="registro-gastos">
      <h2>Registro de Gastos</h2>
      {error && <p className="error-msg">{error}</p>}
      <div className="registro-gastos-content">
        <FormularioGasto onAgregar={agregarGasto} loading={loading} />
        <TablaGastos gastos={gastos} loading={loading} />
      </div>
    </div>
  )
}
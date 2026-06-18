export default function ConfirmModal({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p className="modal-mensaje">{mensaje}</p>
        <div className="modal-acciones">
          <button className="modal-btn modal-btn--cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="modal-btn modal-btn--confirmar" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
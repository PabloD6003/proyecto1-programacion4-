function Toolbar({ filtro, onFiltroChange, onNuevoBeneficiario }) {
  return (
    <div className="toolbar">
      <div className="toolbar-search">
        <i className="fas fa-search toolbar-search__icon" />
        <input
          type="text"
          className="toolbar-search__input"
          placeholder="Buscar por nombre, cédula, tipo..."
          value={filtro}
          onChange={(e) => onFiltroChange(e.target.value)}
        />
        {filtro && (
          <button
            className="toolbar-search__clear"
            onClick={() => onFiltroChange('')}
            title="Limpiar búsqueda"
          >
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      <button className="btn btn-primary" onClick={onNuevoBeneficiario}>
        <i className="fas fa-plus" />
        Nuevo Beneficiario
      </button>
    </div>
  )
}

export default Toolbar

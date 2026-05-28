import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useMemo } from 'react'

const TIPO_LABELS = {
  jefa_de_hogar: 'Jefa de Hogar',
  adulto_mayor: 'Adulto Mayor',
  familia: 'Familia',
  nino: 'Niño/a',
  vulnerable: 'Vulnerable',
}

function BeneficiariosTable({ data, globalFilter, onEditar, onToggleStatus }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombreCompleto',
        header: 'Nombre Completo',
        cell: ({ getValue }) => (
          <span className="cell-name">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'cedula',
        header: 'Cédula',
      },
      {
        accessorKey: 'tipoBeneficiario',
        header: 'Tipo',
        cell: ({ getValue }) => {
          const tipo = getValue()
          return (
            <span className={`badge badge--tipo badge--${tipo}`}>
              {TIPO_LABELS[tipo] ?? tipo}
            </span>
          )
        },
      },
      {
        accessorKey: 'telefono',
        header: 'Teléfono',
        cell: ({ getValue }) =>
          getValue() ? getValue() : <span className="text-muted">—</span>,
      },
      {
        accessorKey: 'activo',
        header: 'Estado',
        cell: ({ getValue }) => (
          <span className={`badge ${getValue() ? 'badge--activo' : 'badge--inactivo'}`}>
            <i className="fas fa-circle badge__dot" />
            {getValue() ? 'Activo' : 'Inactivo'}
          </span>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
          const b = row.original
          return (
            <div className="table-actions">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => onEditar(b)}
                title="Editar beneficiario"
              >
                <i className="fas fa-pencil" />
              </button>
              <button
                className={`btn btn-sm ${b.activo ? 'btn-warning' : 'btn-success'}`}
                onClick={() => onToggleStatus(b.id)}
                title={b.activo ? 'Desactivar' : 'Activar'}
              >
                <i className={`fas ${b.activo ? 'fa-ban' : 'fa-check'}`} />
              </button>
            </div>
          )
        },
      },
    ],
    [onEditar, onToggleStatus],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    initialState: { pagination: { pageSize: 5 } },
  })

  const totalFiltrados = table.getFilteredRowModel().rows.length
  const { pageIndex } = table.getState().pagination

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                <i className="fas fa-inbox" />
                <p>No se encontraron beneficiarios</p>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={!row.original.activo ? 'row--inactivo' : ''}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span className="pagination-info">
          {totalFiltrados} registro{totalFiltrados !== 1 ? 's' : ''}
        </span>

        <div className="pagination-controls">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <i className="fas fa-chevron-left" />
          </button>

          <span className="pagination-page">
            Página {pageIndex + 1} / {table.getPageCount() || 1}
          </span>

          <button
            className="btn btn-sm btn-outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default BeneficiariosTable

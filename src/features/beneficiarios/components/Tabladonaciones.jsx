import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'

const TablaDonaciones = ({ donaciones, onAnular, onEditar }) => {
  const columns = [
    {
      header: 'Donante',
      accessorKey: 'donante',
      cell: ({ getValue }) => (
        <span className="don-cell-name">{getValue()}</span>
      ),
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      cell: ({ getValue, row }) => {
        const tipo = getValue()
        const estado = row.original.estado
        return (
          <span className={`don-badge don-badge--${estado === 'anulada' ? 'anulada' : tipo?.toLowerCase()}`}>
            <i className={tipo === 'Dinero' ? 'fas fa-coins' : 'fas fa-box'} />
            {tipo}
          </span>
        )
      },
    },
    {
      header: 'Detalle',
      cell: ({ row }) => {
        const { tipo, monto, descripcion, cantidad, unidad } = row.original
        if (tipo === 'Dinero') {
          return <span>₡{Number(monto).toLocaleString('es-CR')}</span>
        }
        if (tipo === 'Especie') {
          return <span>{descripcion} — {cantidad} {unidad}</span>
        }
        return <span className="don-text-muted">—</span>
      },
    },
    {
      header: 'Fecha',
      accessorKey: 'fecha',
      cell: ({ getValue }) => (
        <span className="don-text-muted">{getValue()}</span>
      ),
    },
    {
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="don-table-actions">
          <button
            className="don-btn don-btn--outline don-btn--sm"
            onClick={() => onEditar(row.index, row.original)}
          >
            <i className="fas fa-pen" />
            Editar
          </button>
          <button
            className={`don-btn don-btn--sm ${row.original.estado === 'anulada' ? 'don-btn--outline' : 'don-btn--danger'}`}
            onClick={() => onAnular(row.index)}
          >
            <i className={row.original.estado === 'anulada' ? 'fas fa-rotate-left' : 'fas fa-ban'} />
            {row.original.estado === 'anulada' ? 'Reactivar' : 'Anular'}
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: donaciones,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="don-table-wrapper">
      <table className="don-table">
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
              <td colSpan={5} className="don-table-empty">
                <i className="fas fa-hand-holding-heart" />
                No hay donaciones registradas
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={row.original.estado === 'anulada' ? 'don-row--anulada' : ''}>
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
    </div>
  )
}

export default TablaDonaciones

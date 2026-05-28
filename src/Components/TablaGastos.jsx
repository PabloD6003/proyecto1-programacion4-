import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useState, useMemo, useEffect } from 'react'

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => <span style={{ color: '#6b7280', fontSize: '12px' }}>{info.getValue()}</span>,
  },
  {
    accessorKey: 'detalle',
    header: 'Detalle',
  },
  {
    accessorKey: 'monto',
    header: 'Precio',
    cell: (info) =>
      new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
      }).format(info.getValue()),
  },
  {
    accessorKey: 'fecha_gasto',
    header: 'Fecha',
    cell: (info) => {
      const value = info.getValue()
      const date = new Date(value)
      return isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString('es-CR')
    },
  },
]

export default function TablaGastos({ gastos, loading }) {
  'use no memo'
  const [sorting, setSorting] = useState([])

  const data = useMemo(() => gastos, [gastos])
  const memoColumns = useMemo(() => columns, [])
  const [selectedGasto, setSelectedGasto] = useState(null)

  useEffect(() => {
    if (selectedGasto && !gastos.some((g) => g.id === selectedGasto.id)) {
      setSelectedGasto(null)
    }
  }, [gastos, selectedGasto])

  const table = useReactTable({
    data: data,
    columns: memoColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Total de gastos
  const total = gastos.reduce((acc, g) => acc + (g.monto ?? 0), 0)

  if (loading) return <p>Cargando gastos...</p>

  return (
    <div className="tabla-container">
      <table className="tabla-gastos">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* Indicador de ordenamiento */}
                  {header.column.getIsSorted() === 'asc'
                    ? ' ↑'
                    : header.column.getIsSorted() === 'desc'
                    ? ' ↓'
                    : ' ↕'}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                No hay gastos registrados aún.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              const gasto = row.original
              const isSelected = selectedGasto?.id === gasto.id

              return (
                <tr
                  key={row.id}
                  onClick={() => setSelectedGasto(gasto)}
                  className={isSelected ? 'selected-row' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
        {gastos.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={2}><strong>Total</strong></td>
              <td colSpan={2}>
                <strong>
                  {new Intl.NumberFormat('es-CR', {
                    style: 'currency',
                    currency: 'CRC',
                  }).format(total)}
                </strong>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      {selectedGasto && (
        <div className="descripcion-panel">
          <div className="descripcion-panel-header">
            <h3>Descripción del gasto</h3>
            <div className="descripcion-meta">
              <span>{`ID: ${selectedGasto.id}`}</span>
              <span>{`Detalle: ${selectedGasto.detalle}`}</span>
            </div>
          </div>
          <p>{selectedGasto.descripcion?.trim() || 'No hay descripción disponible.'}</p>
        </div>
      )}
    </div>
  )
}
import { useMemo, useRef } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { getStockLabel, getStockStatus } from '../utils/inventory'

const columnHelper = createColumnHelper()

export function InventoryTable({ items, onEdit, onDelete, onMovement }) {
  const onEditRef = useRef(onEdit)
  const onDeleteRef = useRef(onDelete)
  const onMovementRef = useRef(onMovement)

  onEditRef.current = onEdit
  onDeleteRef.current = onDelete
  onMovementRef.current = onMovement

  const columns = useMemo(
    () => [
      columnHelper.accessor('sku', { header: 'SKU' }),
      columnHelper.accessor('nombre', { header: 'Nombre' }),
      columnHelper.accessor('cantidad', { header: 'Existencia' }),
      columnHelper.accessor('stockMinimo', { header: 'Mínimo' }),
      columnHelper.display({
        id: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
          const status = getStockStatus(row.original)
          return (
            <span className={`badge badge-stock badge-${status}`}>
              {getStockLabel(status)}
            </span>
          )
        },
      }),
      columnHelper.accessor('ubicacion', { header: 'Ubicación' }),
      columnHelper.display({
        id: 'movimientos',
        header: 'Movimientos',
        cell: ({ row }) => row.original.movimientos?.length ?? 0,
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="row-actions">
            <button
              type="button"
              onClick={() => onMovementRef.current(row.original.id)}
            >
              Entrada/Salida
            </button>
            <button
              type="button"
              onClick={() => onEditRef.current(row.original)}
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDeleteRef.current(row.original.id)}
            >
              Eliminar
            </button>
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
  })

  if (items.length === 0) {
    return <p className="empty">No hay recursos en inventario.</p>
  }

  return (
    <table className="data-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

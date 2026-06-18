import { useMemo } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const columnHelper = createColumnHelper()

export default function RolesTable({ roles, onEditar, onEliminar }) {
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
      }),
      columnHelper.accessor('nombre', {
        header: 'Nombre',
      }),
      columnHelper.accessor('descripcion', {
        header: 'Descripción',
      }),
      columnHelper.accessor('permisos', {
        header: 'Permisos',
        cell: ({ getValue }) => (getValue() ?? []).join(', '),
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row, table }) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => table.options.meta.onEditar(row.original)}>
              Editar
            </button>
            <button type="button" onClick={() => table.options.meta.onEliminar(row.original.id)}>
              Eliminar
            </button>
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onEditar,
      onEliminar,
    },
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

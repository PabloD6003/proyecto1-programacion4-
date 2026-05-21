import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'

const TablaDonaciones = ({ donaciones, onEliminar, onEditar }) => {
  const columns = [
    {
      header: 'Donante',
      accessorKey: 'donante',
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
    },
    {
      header: 'Monto',
      accessorKey: 'monto',
    },
    {
      header: 'Fecha',
      accessorKey: 'fecha',
    },
    {
      header: 'Acciones',
      cell: ({ row }) => (
        <div>
          <button onClick={() => onEditar(row.index, row.original)}>Editar</button>
          <button onClick={() => onEliminar(row.index)}>Eliminar</button>
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
    <table>
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

export default TablaDonaciones
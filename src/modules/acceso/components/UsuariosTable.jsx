import { useMemo } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const columnHelper = createColumnHelper()

const nombreRol = (rol) => (typeof rol === 'object' ? rol?.nombre : rol) ?? '-'

export default function UsuariosTable({ usuarios, roles, onAsignarRol }) {
  const columns = useMemo(
    () => [
      columnHelper.accessor('nombre', {
        header: 'Nombre',
      }),
      columnHelper.accessor('email', {
        header: 'Email',
      }),
      columnHelper.accessor('rol', {
        header: 'Rol actual',
        cell: ({ getValue }) => nombreRol(getValue()),
      }),
      columnHelper.display({
        id: 'asignar',
        header: 'Asignar rol',
        cell: ({ row, table }) => (
          <select
            defaultValue=""
            onChange={(event) => {
              const rolId = event.target.value
              if (rolId) table.options.meta.onAsignarRol(row.original.id, rolId)
            }}
          >
            <option value="" disabled>
              Seleccionar rol
            </option>
            {table.options.meta.roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: usuarios,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onAsignarRol,
      roles,
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

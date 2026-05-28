export function UserTable({ users, onDelete }) {
  if (!users.length) {
    return <p className="empty">No hay usuarios.</p>
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.nombre}</td>
            <td>{user.email}</td>
            <td>
              <button type="button" onClick={() => onDelete(user.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

import { useUsers } from '../hooks/useUsers'
import { UserTable } from '../components/UserTable'
import { UserForm }  from '../components/UserForm'

export default function UsersPage() {
  const { users, loading, addUser, deleteUser } = useUsers()

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <UserForm onSubmit={addUser} />
      <UserTable users={users} onDelete={deleteUser} />
    </div>
  )
}
import { useCallback, useEffect, useState } from 'react'
import { jsonbinClient } from '../services/inventoryBinService'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persist = async (updatedUsers) => {
    await jsonbinClient.put('', { users: updatedUsers })
    setUsers(updatedUsers)
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await jsonbinClient.get('/latest')
      setUsers(res.data.record?.users || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addUser = async (newUser) => {
    const updated = [...users, { ...newUser, id: Date.now() }]
    await persist(updated)
  }

  const updateUser = async (id, data) => {
    const updated = users.map((u) => (u.id === id ? { ...u, ...data } : u))
    await persist(updated)
  }

  const deleteUser = async (id) => {
    const updated = users.filter((u) => u.id !== id)
    await persist(updated)
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, addUser, updateUser, deleteUser }
}

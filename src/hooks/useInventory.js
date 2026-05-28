import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  applyMovement,
  createMovement,
  getAllMovements,
  getLowStockItems,
  normalizeItem,
} from '../utils/inventory'
import {
  fetchInventoryFromBin,
  getApiErrorMessage,
  saveInventoryToBin,
} from '../services/inventoryBinService'

export function useInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchInventory = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)
    try {
      const data = await fetchInventoryFromBin()
      setItems(data)
    } catch (err) {
      setError(getApiErrorMessage(err))
      if (!isRefresh) setItems([])
    } finally {
      if (isRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }, [])

  const persist = useCallback(async (inventory) => {
    setSaving(true)
    setError(null)
    try {
      const saved = await saveInventoryToBin(inventory)
      setItems(saved)
      return saved
    } catch (err) {
      const msg = getApiErrorMessage(err)
      setError(msg)
      throw new Error(msg)
    } finally {
      setSaving(false)
    }
  }, [])

  const addItem = useCallback(
    async (item) => {
      const current = await fetchInventoryFromBin()
      const newItem = normalizeItem({ ...item, id: Date.now() })
      return persist([...current, newItem])
    },
    [persist],
  )

  const updateItem = useCallback(
    async (id, data) => {
      const current = await fetchInventoryFromBin()
      const updated = current.map((i) =>
        i.id === id ? normalizeItem({ ...i, ...data }) : i,
      )
      return persist(updated)
    },
    [persist],
  )

  const deleteItem = useCallback(
    async (id) => {
      const current = await fetchInventoryFromBin()
      return persist(current.filter((i) => i.id !== id))
    },
    [persist],
  )

  const recordMovement = useCallback(
    async (itemId, movementInput) => {
      const current = await fetchInventoryFromBin()
      const movement = createMovement(movementInput)
      let movementError = null

      const updated = current.map((item) => {
        if (item.id !== itemId) return item
        try {
          const withStock = applyMovement(item, movement)
          return {
            ...withStock,
            movimientos: [movement, ...(item.movimientos || [])],
          }
        } catch (err) {
          movementError = err.message
          return item
        }
      })

      if (movementError) throw new Error(movementError)
      await persist(updated)
      return movement
    },
    [persist],
  )

  const lowStockItems = useMemo(() => getLowStockItems(items), [items])
  const allMovements = useMemo(() => getAllMovements(items), [items])

  useEffect(() => {
    fetchInventory(false)
  }, [fetchInventory])

  return {
    items,
    loading,
    refreshing,
    saving,
    error,
    lowStockItems,
    allMovements,
    addItem,
    updateItem,
    deleteItem,
    recordMovement,
    refetch: () => fetchInventory(true),
  }
}

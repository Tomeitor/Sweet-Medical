import { useEffect, useMemo, useState } from 'react'
import { createSlotId, STORAGE_KEY } from '../utils/preselection.js'
import { PreselectionContext } from './preselection-context.js'

export function PreselectionProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return []
    }

    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo(
    () => ({
      items,
      total: items.length,
      totalEstimatedCost: items.reduce((acc, item) => acc + (item.costoPaciente ?? 0), 0),
      addItem: (slot) => {
        const item = { ...slot, frontendId: createSlotId(slot) }

        setItems((current) => {
          if (current.some((existing) => existing.frontendId === item.frontendId)) {
            return current
          }

          return [...current, item]
        })
      },
      removeItem: (frontendId) => {
        setItems((current) => current.filter((item) => item.frontendId !== frontendId))
      },
      clearItems: () => setItems([]),
      hasItem: (slot) => items.some((item) => item.frontendId === createSlotId(slot)),
    }),
    [items],
  )

  return <PreselectionContext.Provider value={value}>{children}</PreselectionContext.Provider>
}

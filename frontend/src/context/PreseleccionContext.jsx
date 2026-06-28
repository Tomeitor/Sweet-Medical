import { useEffect, useMemo, useState } from 'react'
import { CLAVE_ALMACENAMIENTO, crearIdTurno } from '../utils/preseleccion.js'
import { PreseleccionContexto } from './preseleccion-contexto.js'

export function PreseleccionProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = window.localStorage.getItem(CLAVE_ALMACENAMIENTO)

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
    window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(items))
  }, [items])

  const value = useMemo(
    () => ({
      items,
      total: items.length,
      totalEstimatedCost: items.reduce((acc, item) => acc + (item.costoPaciente ?? 0), 0),
      addItem: (slot) => {
        const item = { ...slot, frontendId: crearIdTurno(slot) }

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
      hasItem: (slot) => items.some((item) => item.frontendId === crearIdTurno(slot)),
    }),
    [items],
  )

  return <PreseleccionContexto.Provider value={value}>{children}</PreseleccionContexto.Provider>
}

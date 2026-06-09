import { useContext } from 'react'
import { PreselectionContext } from '../context/preselection-context.js'

export function usePreselection() {
  const context = useContext(PreselectionContext)

  if (!context) {
    throw new Error('usePreselection debe usarse dentro de PreselectionProvider')
  }

  return context
}

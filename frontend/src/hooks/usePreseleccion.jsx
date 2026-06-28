import { useContext } from 'react'
import { PreseleccionContexto } from '../context/preseleccion-contexto.js'

export function usePreseleccion() {
  const context = useContext(PreseleccionContexto)

  if (!context) {
    throw new Error('usePreseleccion debe usarse dentro de PreseleccionProvider')
  }

  return context
}

export const STORAGE_KEY = 'sweet-medical-preseleccion'

export function createSlotId(slot) {
  return [slot.medico?.id, slot.fechaHora, slot.sede, slot.practica].join('|')
}

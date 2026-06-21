export const CLAVE_ALMACENAMIENTO = 'sweet-medical-preseleccion'

export function crearIdTurno(slot) {
  return [slot.medico?.id, slot.fechaHora, slot.sede, slot.practica].join('|')
}

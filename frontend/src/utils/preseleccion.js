export const CLAVE_ALMACENAMIENTO = 'sweet-medical-preseleccion'

export function obtenerPracticaValida(slot) {
  const practica = typeof slot?.practica === 'string' ? slot.practica.trim() : ''

  return practica || null
}

export function tienePracticaValida(slot) {
  return obtenerPracticaValida(slot) !== null
}

export function crearIdTurno(slot) {
  return [slot.medico?.id, slot.fechaHora, slot.sede, slot.practica].join('|')
}

export function mapearPreseleccionATurnoPayload(item) {
  const practica = obtenerPracticaValida(item)

  if (!practica) {
    throw new Error('El turno preseleccionado no incluye una práctica válida')
  }

  return {
    medicoId: item.medico?.id ?? '',
    fechaHora: new Date(item.fechaHora).toISOString(),
    sede: item.sede ?? '',
    practica,
    costo: item.costoBase ?? item.costoPaciente ?? 0,
  }
}

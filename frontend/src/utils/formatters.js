export function formatDateTime(value) {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}

export function formatCoverageLevel(value) {
  const labels = {
    TOTAL: 'Cobertura total',
    PARCIAL: 'Cobertura parcial',
    NO_CUBIERTA: 'Sin cobertura',
  }

  return labels[value] ?? 'Cobertura no informada'
}

export function formatIsoDate(date) {
  if (!date) {
    return ''
  }

  return new Date(date).toISOString()
}

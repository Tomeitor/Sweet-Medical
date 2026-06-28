const argDateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Argentina/Buenos_Aires',
})

const utcCivilDateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})

function parseUtcSerializedLocalDate(value) {
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?Z$/)

  if (!match) {
    return null
  }

  const [, year, month, day, hour, minute, second = '00'] = match

  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)))
}

export function formatDateTime(value) {
  const serializedLocalDate = parseUtcSerializedLocalDate(value)

  if (serializedLocalDate) {
    return utcCivilDateTimeFormatter.format(serializedLocalDate)
  }

  return argDateTimeFormatter.format(new Date(value))
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

export const demoPatients = [
  { id: '1', nombre: 'Juan Perez', plan: 'OSDE 210' },
  { id: '2', nombre: 'Maria Lopez', plan: 'Swiss Medical SMG20' },
]

export function buildCatalog(doctors) {
  const especialidades = new Set()
  const practicas = new Set()
  const sedes = new Set()

  doctors.forEach((doctor) => {
    doctor.especialidades?.forEach((value) => especialidades.add(value))
    doctor.practicas?.forEach((value) => practicas.add(value))
    doctor.sedes?.forEach((value) => sedes.add(value))
  })

  return {
    especialidades: [...especialidades].sort((a, b) => a.localeCompare(b)),
    practicas: [...practicas].sort((a, b) => a.localeCompare(b)),
    sedes: [...sedes].sort((a, b) => a.localeCompare(b)),
  }
}

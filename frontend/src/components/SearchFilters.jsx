const sortOptions = [
  { value: 'fecha-asc', label: 'Fecha más próxima' },
  { value: 'fecha-desc', label: 'Fecha más lejana' },
  { value: 'costo-asc', label: 'Menor costo' },
  { value: 'costo-desc', label: 'Mayor costo' },
]

function Field({ label, htmlFor, hint, children }) {
  return (
    <label className="field" htmlFor={htmlFor}>
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      {children}
    </label>
  )
}

export function SearchFilters({
  filters,
  onChange,
  onSubmit,
  isLoading,
  doctors,
  catalog,
  patients,
}) {
  return (
    <form className="filters-panel" onSubmit={onSubmit} aria-label="Formulario de búsqueda de turnos">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Paso 1</p>
          <h2>Elegí qué turno querés buscar</h2>
        </div>
        <p className="panel-copy">
          La búsqueda usa el backend real para traer disponibilidad, cobertura y costo estimado.
        </p>
      </div>

      <div className="filters-grid">
        <Field label="Paciente" htmlFor="pacienteId" hint="Necesario para calcular cobertura.">
          <select
            id="pacienteId"
            value={filters.pacienteId}
            onChange={(event) => onChange('pacienteId', event.target.value)}
          >
            <option value="">Seleccionar paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.nombre} · {patient.plan}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Especialidad" htmlFor="especialidad" hint="Podés usar especialidad o práctica.">
          <select
            id="especialidad"
            value={filters.especialidad}
            onChange={(event) => onChange('especialidad', event.target.value)}
          >
            <option value="">Todas</option>
            {catalog.especialidades.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Práctica" htmlFor="practica" hint="Refiná la búsqueda si ya sabés qué necesitás.">
          <select
            id="practica"
            value={filters.practica}
            onChange={(event) => onChange('practica', event.target.value)}
          >
            <option value="">Todas</option>
            {catalog.practicas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Médico" htmlFor="medicoId">
          <select
            id="medicoId"
            value={filters.medicoId}
            onChange={(event) => onChange('medicoId', event.target.value)}
          >
            <option value="">Todos</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.nombre} · MP {doctor.matricula}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sede" htmlFor="sede">
          <select id="sede" value={filters.sede} onChange={(event) => onChange('sede', event.target.value)}>
            <option value="">Todas</option>
            {catalog.sedes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Desde" htmlFor="fechaDesde">
          <input
            id="fechaDesde"
            type="datetime-local"
            value={filters.fechaDesde}
            onChange={(event) => onChange('fechaDesde', event.target.value)}
          />
        </Field>

        <Field label="Hasta" htmlFor="fechaHasta">
          <input
            id="fechaHasta"
            type="datetime-local"
            value={filters.fechaHasta}
            onChange={(event) => onChange('fechaHasta', event.target.value)}
          />
        </Field>

        <Field label="Orden" htmlFor="sortBy">
          <select id="sortBy" value={filters.sortBy} onChange={(event) => onChange('sortBy', event.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="actions-row">
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Buscando disponibilidad…' : 'Buscar turnos disponibles'}
        </button>
        <p className="inline-note">
          Si no elegís práctica ni especialidad, el backend devuelve validación y la mostramos en pantalla.
        </p>
      </div>
    </form>
  )
}

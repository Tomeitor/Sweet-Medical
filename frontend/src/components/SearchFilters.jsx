function CampoFiltro({ label, htmlFor, children }) {
  return (
    <label className="field" htmlFor={htmlFor}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  )
}

const filterConfig = [
  {
    id: 'medicoId',
    label: 'Médico',
    render: ({ filters, onChange, doctors }) => (
      <select id="medicoId" value={filters.medicoId} onChange={(event) => onChange('medicoId', event.target.value)}>
        <option value="">Todos</option>
        {doctors.map((doctor) => (
          <option key={doctor._id} value={doctor._id}>
            {doctor.nombre} · MP {doctor.matricula}
          </option>
        ))}
      </select>
    ),
  },
  {
    id: 'especialidad',
    label: 'Especialidad',
    render: ({ filters, onChange, catalog }) => (
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
    ),
  },
  {
    id: 'practica',
    label: 'Práctica',
    render: ({ filters, onChange, catalog }) => (
      <select id="practica" value={filters.practica} onChange={(event) => onChange('practica', event.target.value)}>
        <option value="">Todas</option>
        {catalog.practicas.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    ),
  },
  {
    id: 'sede',
    label: 'Sede',
    render: ({ filters, onChange, catalog }) => (
      <select id="sede" value={filters.sede} onChange={(event) => onChange('sede', event.target.value)}>
        <option value="">Todas</option>
        {catalog.sedes.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    ),
  },
  {
    id: 'fechaDesde',
    label: 'Desde',
    render: ({ filters, onChange }) => (
      <input
        id="fechaDesde"
        type="datetime-local"
        value={filters.fechaDesde}
        onChange={(event) => onChange('fechaDesde', event.target.value)}
      />
    ),
  },
  {
    id: 'fechaHasta',
    label: 'Hasta',
    render: ({ filters, onChange }) => (
      <input
        id="fechaHasta"
        type="datetime-local"
        value={filters.fechaHasta}
        onChange={(event) => onChange('fechaHasta', event.target.value)}
      />
    ),
  },
]

export function SearchFilters({ filters, onChange, onClear, doctors, catalog }) {
  return (
    <section className="filters-panel filters-panel--advanced" aria-label="Filtros avanzados de búsqueda">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Filtros</p>
          <h3>Refiná la disponibilidad</h3>
        </div>
      </div>

      <div className="filters-grid">
        {filterConfig.map((field) => (
          <CampoFiltro key={field.id} label={field.label} htmlFor={field.id}>
            {field.render({ filters, onChange, doctors, catalog })}
          </CampoFiltro>
        ))}
      </div>

      <div className="actions-row actions-row--compact">
        <button type="button" className="text-button" onClick={onClear}>
          Limpiar filtros
        </button>
      </div>
    </section>
  )
}

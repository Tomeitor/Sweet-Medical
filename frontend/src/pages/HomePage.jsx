import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Turnos por especialidad',
    description: 'Encontrá disponibilidad para clínica médica, cardiología, pediatría y otras áreas en pocos pasos.',
  },
  {
    title: 'Profesionales y sedes',
    description: 'Consultá médicos, prácticas, cobertura y ubicación antes de decidir dónde atenderte.',
  },
  {
    title: 'Preselección ordenada',
    description: 'Guardá horarios como si fuera un carrito de turnos para revisarlos con tranquilidad.',
  },
]

const trustPoints = [
  'Atención ambulatoria y estudios programados en un solo lugar.',
  'Información visible sobre cobertura, sede y costo estimado.',
  'Experiencia simple para pacientes que necesitan resolver rápido.',
]

const serviceAreas = [
  'Clínica médica y medicina familiar',
  'Cardiología, diagnóstico y controles',
  'Pediatría y seguimiento integral',
  'Prácticas y estudios con agenda disponible',
]

export function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Sweet Medical</p>
          <h2>Tu atención médica, organizada desde el primer clic</h2>
          <p>
            Gestioná turnos médicos, revisá disponibilidad por especialidad y elegí la opción más conveniente para vos o tu
            familia desde una experiencia simple, confiable y clara.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/buscar">
              Buscar turnos
            </Link>
          </div>
        </div>

        <div className="status-card" aria-label="Resumen de experiencia">
          <strong>Por qué elegir Sweet Medical</strong>
          <ul>
            {trustPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-grid columns-3">
        {highlights.map((item) => (
          <article key={item.title} className="info-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="content-grid two-columns">
        <article className="info-card">
          <p className="eyebrow">Servicios</p>
          <h3>Áreas con disponibilidad para reservar</h3>
          <ul className="bullet-list">
            {serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </article>

        <article className="info-card emphasis-card">
          <p className="eyebrow">Pacientes</p>
          <h3>Una experiencia pensada para resolver sin fricción</h3>
          <p>
            Desde la búsqueda hasta la preselección, cada pantalla prioriza lectura clara, acciones visibles y contexto
            suficiente para tomar una decisión sin vueltas.
          </p>
        </article>
      </section>
    </div>
  )
}

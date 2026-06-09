import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Búsqueda guiada',
    description: 'Filtrá por especialidad, práctica, sede, médico y rango de fechas con mensajes claros.',
  },
  {
    title: 'Resultados con contexto',
    description: 'Ves cobertura, costo estimado y disponibilidad sin tener que adivinar qué significa cada dato.',
  },
  {
    title: 'Preselección tipo carrito',
    description: 'Compará varios turnos antes de decidir cuál te conviene más.',
  },
]

const pages = [
  'Inicio con explicación del flujo',
  'Búsqueda integrada con backend',
  'Resumen de preselección de turnos',
  'Pantalla de ayuda y pasos del proceso',
]

export function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Entrega 3 · UI + Integración</p>
          <h2>Una experiencia de reserva pensada para pacientes reales</h2>
          <p>
            Acá no hay humo, loco. Tenés navegación clara, feedback visual, búsqueda integrada con backend y un módulo
            de preselección para comparar turnos antes de reservar.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/buscar">
              Empezar búsqueda
            </Link>
            <Link className="secondary-button" to="/como-funciona">
              Ver flujo guiado
            </Link>
          </div>
        </div>

        <div className="status-card" aria-label="Resumen de experiencia">
          <strong>Qué resuelve esta entrega</strong>
          <ul>
            <li>Integra la búsqueda de turnos con el backend.</li>
            <li>Permite preseleccionar múltiples opciones desde el frontend.</li>
            <li>Explica el proceso con patrones visuales de ecommerce.</li>
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
          <p className="eyebrow">Navegabilidad</p>
          <h3>Pantallas incluidas</h3>
          <ul className="bullet-list">
            {pages.map((page) => (
              <li key={page}>{page}</li>
            ))}
          </ul>
        </article>

        <article className="info-card emphasis-card">
          <p className="eyebrow">Accesibilidad y claridad</p>
          <h3>Diseño pensado para usarlo sin fricción</h3>
          <p>
            Contraste alto, foco visible por teclado, etiquetas semánticas, tamaños táctiles cómodos y mensajes de carga
            o error en cada interacción relevante.
          </p>
        </article>
      </section>
    </div>
  )
}

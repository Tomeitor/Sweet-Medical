const steps = [
  {
    title: '1. Elegí paciente y criterio de búsqueda',
    description: 'La interfaz explica qué filtros son obligatorios y cuáles ayudan a refinar resultados.',
  },
  {
    title: '2. Revisá la disponibilidad devuelta por backend',
    description: 'Cada tarjeta muestra médico, práctica, fecha, sede, cobertura y costo estimado.',
  },
  {
    title: '3. Preseleccioná opciones',
    description: 'El módulo lateral funciona como un carrito para comparar turnos antes de decidir.',
  },
  {
    title: '4. Confirmá en una próxima iteración',
    description: 'Esta entrega deja listo el flujo de exploración y selección previa, con base técnica sólida.',
  },
]

const nonFunctional = [
  'Interfaz intuitiva: navegación visible y pocas acciones para llegar a la búsqueda.',
  'Feedback visual: alerts, estados de carga y mensajes de validación.',
  'Responsive: grillas fluidas, columnas que colapsan y botones amplios.',
  'Accesibilidad: skip link, foco visible, semántica HTML y aria-live.',
  'Consistencia visual: tokens, componentes reutilizables y tipografía homogénea.',
]

export function GuidancePage() {
  return (
    <div className="stack-xl">
      <section className="info-card stack-md">
        <div>
          <p className="eyebrow">Guía de uso</p>
          <h2>Así se recorre el flujo de reserva en esta iteración</h2>
        </div>

        <div className="content-grid columns-2">
          {steps.map((step) => (
            <article key={step.title} className="inline-card">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="info-card">
        <p className="eyebrow">Justificación</p>
        <h2>Cumplimiento de requerimientos no funcionales</h2>
        <ul className="bullet-list">
          {nonFunctional.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

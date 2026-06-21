import { Link } from 'react-router-dom'
import { ResumenSeleccion } from '../components/ResumenSeleccion.jsx'

const reminders = [
  'Revisá profesional, práctica, sede y horario antes de decidir.',
  'Eliminá opciones que no te sirvan y dejá sólo las más convenientes.'
]

export function PreseleccionPage() {
  return (
    <div className="content-grid two-columns align-start">
      <ResumenSeleccion />

      <section className="info-card stack-md cart-support-panel">
        <div>
          <p className="eyebrow">Resumen del paciente</p>
          <h2>Revisá tu selección antes de continuar</h2>
        </div>

        <ul className="bullet-list">
          {reminders.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="inline-card">
          <strong>¿Te falta comparar opciones?</strong>
          <p>Volvé a la búsqueda para agregar más horarios disponibles a tu carrito de turnos.</p>
          <Link to="/buscar" className="primary-button">
            Seguir buscando
          </Link>
        </div>

        <div className="inline-card hospital-note">
          <strong>Sweet Medical</strong>
          <p>
            Nuestro equipo trabaja con agendas por sede y especialidad para que puedas elegir la alternativa que mejor se
            adapte a tu cobertura y disponibilidad.
          </p>
        </div>
      </section>
    </div>
  )
}

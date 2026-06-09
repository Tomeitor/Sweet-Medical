import { Link } from 'react-router-dom'
import { SelectionSummary } from '../components/SelectionSummary.jsx'

const reminders = [
  'La preselección vive sólo en el frontend y sirve para comparar opciones.',
  'Podés eliminar cualquier turno antes de confirmar tu decisión.',
  'El siguiente paso natural sería conectar la reserva definitiva con backend en una próxima iteración.',
]

export function PreselectionPage() {
  return (
    <div className="content-grid two-columns align-start">
      <SelectionSummary />

      <section className="info-card stack-md">
        <div>
          <p className="eyebrow">Paso 4</p>
          <h2>Qué podés hacer desde acá</h2>
        </div>

        <ul className="bullet-list">
          {reminders.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="inline-card">
          <strong>¿Querés seguir explorando?</strong>
          <p>Volvé a la búsqueda para sumar o comparar más horarios disponibles.</p>
          <Link to="/buscar" className="primary-button">
            Seguir buscando
          </Link>
        </div>
      </section>
    </div>
  )
}

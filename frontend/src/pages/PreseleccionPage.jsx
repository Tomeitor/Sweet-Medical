import { Link } from 'react-router-dom'
import { ResumenSeleccion } from '../components/ResumenSeleccion.jsx'

export function PreseleccionPage() {
  return (
    <div className="content-grid two-columns align-start">
      <ResumenSeleccion />

      <section className="info-card stack-md cart-support-panel">
        <div>
          <p className="eyebrow">Resumen del paciente</p>
          <h2>Revisá tu selección antes de continuar</h2>
        </div>

        <div className="inline-card">
          <strong>¿Te falta comparar opciones?</strong>
          <p>Volvé a la búsqueda para agregar más horarios disponibles a tu carrito de turnos.</p>
          <Link to="/buscar" className="primary-button">
            Seguir buscando
          </Link>
        </div>
      </section>
    </div>
  )
}

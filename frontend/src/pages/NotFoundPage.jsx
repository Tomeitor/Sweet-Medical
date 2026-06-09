import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="info-card stack-md">
      <p className="eyebrow">404</p>
      <h2>La pantalla que buscás no existe</h2>
      <p>Volvé al inicio o andá directo a la búsqueda para seguir con el flujo principal.</p>
      <div className="hero-actions">
        <Link to="/" className="secondary-button">
          Ir al inicio
        </Link>
        <Link to="/buscar" className="primary-button">
          Buscar turnos
        </Link>
      </div>
    </section>
  )
}

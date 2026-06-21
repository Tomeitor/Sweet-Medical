import { Link } from 'react-router-dom'
import { usePreselection } from '../hooks/usePreselection.jsx'
import { formatCurrency, formatDateTime } from '../utils/formatters.js'

export function SelectionSummary({ compact = false }) {
  const { items, total, totalEstimatedCost, removeItem, clearItems } = usePreselection()

  return (
    <aside className={`summary-panel ${compact ? 'summary-panel--compact' : 'summary-panel--cart'}`} aria-labelledby="summary-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Preselección</p>
          <h2 id="summary-title">{compact ? 'Turnos guardados' : 'Carrito de turnos'}</h2>
        </div>
        {items.length > 0 ? (
          <button type="button" className="text-button" onClick={clearItems}>
            Vaciar
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="empty-box">
          <p>Todavía no agregaste turnos. Sumá opciones desde la búsqueda para revisarlas antes de avanzar.</p>
        </div>
      ) : (
        <>
          <ul className="selection-list">
            {items.map((item) => (
              <li key={item.frontendId} className="selection-item">
                <div>
                  <strong>{item.medico.nombre}</strong>
                  <p>{item.practica}</p>
                  <p className="muted-text">{formatDateTime(item.fechaHora)} · {item.sede}</p>
                </div>
                <div className="selection-item__actions">
                  <span>{formatCurrency(item.costoPaciente)}</span>
                  <button type="button" className="text-button" onClick={() => removeItem(item.frontendId)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="summary-footer">
            <div>
              <p className="muted-text">Turnos guardados</p>
              <strong>{total}</strong>
            </div>
            <div>
              <p className="muted-text">Costo estimado total</p>
              <strong>{formatCurrency(totalEstimatedCost)}</strong>
            </div>
          </div>
        </>
      )}

      {compact ? <Link className="secondary-button summary-link" to="/preseleccion">Ver detalle completo</Link> : null}
    </aside>
  )
}

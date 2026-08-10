import { Link } from 'react-router-dom'
import { usePreseleccion } from '../hooks/usePreseleccion.jsx'
import { formatCurrency, formatDateTime } from '../utils/formatters.js'
import { obtenerPracticaValida } from '../utils/preseleccion.js'

export function ResumenSeleccion({ compact = false, footer = null }) {
  const { items, total, totalEstimatedCost, removeItem, clearItems } = usePreseleccion()

  return (
    <aside className={`panel-resumen ${compact ? 'panel-resumen--compacto' : 'panel-resumen--carrito'}`} aria-labelledby="summary-title">
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
          <ul className="lista-seleccion">
            {items.map((item) => (
              <li key={item.frontendId} className="item-seleccion">
                <div>
                  <strong>{item.medico.nombre}</strong>
                  <p>{obtenerPracticaValida(item) ?? `${item.especialidad ?? 'Práctica pendiente'} · requiere una práctica válida`}</p>
                  <p className="muted-text">{formatDateTime(item.fechaHora)} · {item.sede}</p>
                </div>
                <div className="item-seleccion__acciones">
                  <span>{formatCurrency(item.costoPaciente)}</span>
                  <button type="button" className="text-button" onClick={() => removeItem(item.frontendId)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="pie-resumen">
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

      {footer}
      {compact ? <Link className="secondary-button enlace-resumen" to="/preseleccion">Ver detalle completo</Link> : null}
    </aside>
  )
}

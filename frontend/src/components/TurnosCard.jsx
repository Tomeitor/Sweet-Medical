import { formatCoverageLevel, formatCurrency, formatDateTime } from '../utils/formatters.js'

export function TurnosCard({ slot, isSelected, onAdd, onRemove }) {
  return (
    <article className="result-card" data-testid="shift-card" aria-label={`Turno con ${slot.medico.nombre}`}>
      <div className="result-card__header">
        <div>
          <p className="eyebrow">{slot.especialidad ?? slot.practica}</p>
          <h3>{slot.medico.nombre}</h3>
          <p className="muted-text">Matrícula {slot.medico.matricula}</p>
        </div>

        <div className="price-box">
          <span>{formatCurrency(slot.costoPaciente)}</span>
          <small>Costo estimado</small>
        </div>
      </div>

      <dl className="result-meta">
        <div>
          <dt>Fecha</dt>
          <dd>{formatDateTime(slot.fechaHora)}</dd>
        </div>
        <div>
          <dt>Sede</dt>
          <dd>{slot.sede}</dd>
        </div>
        <div>
          <dt>Práctica</dt>
          <dd>{slot.practica}</dd>
        </div>
        <div>
          <dt>Cobertura</dt>
          <dd>{formatCoverageLevel(slot.cobertura)}</dd>
        </div>
      </dl>

      <div className="card-tags" aria-label="Información complementaria">
        <span className="tag tag--accent">Disponible</span>
        <span className="tag">{slot.hora}</span>
        <span className="tag">Base {formatCurrency(slot.costoBase)}</span>
      </div>

      <div className="card-actions">
        {isSelected ? (
          <button type="button" className="secondary-button" onClick={() => onRemove(slot)}>
            Quitar de preselección
          </button>
        ) : (
          <button type="button" className="primary-button" onClick={() => onAdd(slot)}>
            Preseleccionar turno
          </button>
        )}
      </div>
    </article>
  )
}

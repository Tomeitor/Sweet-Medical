import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ResumenSeleccion } from '../components/ResumenSeleccion.jsx'
import { usePreseleccion } from '../hooks/usePreseleccion.jsx'
import { useSession } from '../hooks/useSession.jsx'
import { createTurno, handleApiError } from '../services/api.js'

const reminders = [
  'Revisá profesional, práctica, sede y horario antes de decidir.',
]

export function PreseleccionPage() {
  const { items, removeItem, clearItems } = usePreseleccion()
  const { currentSession, isPatient } = useSession()
  const [reservingIds, setReservingIds] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function reserveItem(item) {
    if (!isPatient || !currentSession?.patientId) {
      setError('Cambiá a una sesión de paciente para reservar turnos.')
      return
    }

    if (!item.costoPaciente || item.costoPaciente <= 0) {
      setError('Este turno no puede reservarse porque el backend exige un costo positivo.')
      return
    }

    try {
      setError('')
      setMessage('')
      setReservingIds((current) => [...current, item.frontendId])

      await createTurno({
        medicoId: item.medico.id,
        pacienteId: currentSession.patientId,
        fechaHora: new Date(item.fechaHora).toISOString(),
        sede: item.sede,
        practica: item.practica,
        costo: item.costoPaciente,
      })

      removeItem(item.frontendId)
      setMessage(`Turno reservado con ${item.medico.nombre} para ${item.sede}.`)
    } catch (requestError) {
      setError(handleApiError(requestError))
    } finally {
      setReservingIds((current) => current.filter((id) => id !== item.frontendId))
    }
  }

  async function reserveAll() {
    for (const item of items) {
      // Reserva secuencial para respetar errores individuales.
      await reserveItem(item)
    }
  }

  return (
    <div className="content-grid two-columns align-start">
      <ResumenSeleccion onReserveItem={reserveItem} reservingIds={reservingIds} />

      <section className="info-card stack-md cart-support-panel">
        <div>
          <p className="eyebrow">Resumen del paciente</p>
          <h2>Revisá tu selección antes de continuar</h2>
        </div>

        <div className="inline-card">
          <strong>Sesión actual</strong>
          <p>{currentSession?.label ?? 'Sin sesión seleccionada'}</p>
          <p className="muted-text">{currentSession?.subtitle}</p>
        </div>

        {error ? <div className="alert alert-error">{error}</div> : null}
        {message ? <div className="alert alert-success">{message}</div> : null}

        <div className="actions-row">
          <button type="button" className="primary-button" onClick={reserveAll} disabled={!isPatient || items.length === 0}>
            Reservar todos los turnos
          </button>
          <button type="button" className="secondary-button" onClick={clearItems} disabled={items.length === 0}>
            Vaciar preselección
          </button>
        </div>

        <div className="inline-card">
          <strong>¿Te falta comparar opciones?</strong>
          <p>Volvé a la búsqueda para agregar más horarios disponibles a tu carrito de turnos.</p>
          <Link to="/buscar" className="primary-button">
            Seguir buscando
          </Link>
        </div>

        <div className="inline-card">
          <strong>Recordatorios</strong>
          <ul className="bullet-list">
            {reminders.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

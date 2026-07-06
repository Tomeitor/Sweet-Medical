import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ResumenSeleccion } from '../components/ResumenSeleccion.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { usePreseleccion } from '../hooks/usePreseleccion.jsx'
import { createAppointment, handleApiError } from '../services/api.js'
import { mapearPreseleccionATurnoPayload, tienePracticaValida } from '../utils/preseleccion.js'

export function PreseleccionPage() {
  const { user } = useAuth()
  const { items, removeItems } = usePreseleccion()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const canSubmit = user?.role === 'PACIENTE' && items.length > 0 && !isSubmitting

  async function handleSubmitSelectedAppointments() {
    if (!canSubmit) {
      return
    }

    try {
      setIsSubmitting(true)
      setFeedback({ type: '', message: '' })

      const validItems = items.filter(tienePracticaValida)
      const invalidItems = items.filter((item) => !tienePracticaValida(item))

      if (validItems.length === 0) {
        setFeedback({
          type: 'error',
          message: 'Los turnos seleccionados no incluyen una práctica válida. Quitalos del carrito y volvé a elegir un horario con práctica.',
        })
        return
      }

      const results = await Promise.allSettled(
        validItems.map(async (item) => ({
          frontendId: item.frontendId,
          response: await createAppointment(mapearPreseleccionATurnoPayload(item)),
        })),
      )

      const successfulIds = []
      const errors = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulIds.push(result.value.frontendId)
          return
        }

        errors.push(`• ${validItems[index].medico?.nombre ?? 'Turno'}: ${handleApiError(result.reason)}`)
      })

      invalidItems.forEach((item) => {
        errors.push(`• ${item.medico?.nombre ?? 'Turno'}: falta la práctica asociada para reservar este horario.`)
      })

      if (successfulIds.length > 0) {
        removeItems(successfulIds)
      }

      if (errors.length > 0) {
        const successPrefix = successfulIds.length > 0
          ? `Se solicitaron ${successfulIds.length} turno(s) correctamente. `
          : ''

        setFeedback({
          type: 'error',
          message: `${successPrefix}${errors.join(' ')}`,
        })
        return
      }

      setFeedback({
        type: 'success',
        message: `Se solicitaron ${successfulIds.length} turno(s) correctamente.`,
      })
    } catch (error) {
      setFeedback({ type: 'error', message: handleApiError(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="content-grid two-columns align-start">
      <ResumenSeleccion
        footer={(
          <div className="inline-card stack-sm">
            <strong>¿Listo para avanzar?</strong>
            <p>Solicitá los turnos preseleccionados para que queden reservados y pendientes de confirmación.</p>

            {user?.role !== 'PACIENTE' ? <p className="muted-text">Iniciá sesión como paciente para solicitar turnos.</p> : null}

            <button type="button" className="primary-button" onClick={handleSubmitSelectedAppointments} disabled={!canSubmit}>
              {isSubmitting ? 'Solicitando…' : 'Solicitar turnos'}
            </button>
          </div>
        )}
      />

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

        {feedback.message ? <div className={`alert alert-${feedback.type}`}>{feedback.message}</div> : null}
      </section>
    </div>
  )
}

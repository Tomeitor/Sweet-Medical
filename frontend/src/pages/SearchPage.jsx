import { useEffect, useMemo, useState } from 'react'
import { AppointmentCard } from '../components/AppointmentCard.jsx'
import { LoadingSkeleton } from '../components/LoadingSkeleton.jsx'
import { SearchFilters } from '../components/SearchFilters.jsx'
import { SelectionSummary } from '../components/SelectionSummary.jsx'
import { usePreselection } from '../hooks/usePreselection.jsx'
import { fetchAvailableAppointments, fetchDoctors, normalizeError } from '../services/api.js'
import { buildCatalog, demoPatients } from '../utils/catalog.js'
import { formatIsoDate } from '../utils/formatters.js'

const initialFilters = {
  pacienteId: '',
  medicoId: '',
  especialidad: 'Cardiologia',
  practica: '',
  sede: '',
  fechaDesde: '',
  fechaHasta: '',
  sortBy: 'fecha-asc',
}

function splitSort(value) {
  const [ordenarPor, orden] = value.split('-')
  return { ordenarPor, orden }
}

function buildRequestParams(filters) {
  const { ordenarPor, orden } = splitSort(filters.sortBy)

  return Object.fromEntries(
    Object.entries({
      pacienteId: filters.pacienteId,
      medicoId: filters.medicoId || undefined,
      especialidad: filters.especialidad || undefined,
      practica: filters.practica || undefined,
      sede: filters.sede || undefined,
      fechaDesde: filters.fechaDesde ? formatIsoDate(filters.fechaDesde) : undefined,
      fechaHasta: filters.fechaHasta ? formatIsoDate(filters.fechaHasta) : undefined,
      ordenarPor,
      orden,
      page: 1,
      limit: 12,
    }).filter(([, currentValue]) => currentValue !== undefined && currentValue !== '')
  )
}

export function SearchPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [doctors, setDoctors] = useState([])
  const [results, setResults] = useState([])
  const [meta, setMeta] = useState(null)
  const [catalogError, setCatalogError] = useState('')
  const [searchError, setSearchError] = useState('')
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { addItem, removeItem, hasItem } = usePreselection()

  useEffect(() => {
    async function loadDoctors() {
      try {
        setIsLoadingCatalog(true)
        const response = await fetchDoctors()
        setDoctors(response)
      } catch (error) {
        setCatalogError(normalizeError(error))
      } finally {
        setIsLoadingCatalog(false)
      }
    }

    loadDoctors()
  }, [])

  const catalog = useMemo(() => buildCatalog(doctors), [doctors])

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
    setSearchError('')
    setSuccessMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSearchError('')
    setSuccessMessage('')

    try {
      setIsLoadingResults(true)
      const response = await fetchAvailableAppointments(buildRequestParams(filters))
      const items = response.items ?? response.data ?? []

      setResults(items)
      setMeta(response.pagination ?? null)
      setSuccessMessage(
        items.length > 0
          ? `Encontramos ${items.length} turnos para que compares y preselecciones.`
          : 'La búsqueda terminó bien, pero no hay disponibilidad con esos filtros.',
      )
    } catch (error) {
      setResults([])
      setMeta(null)
      setSearchError(normalizeError(error))
    } finally {
      setIsLoadingResults(false)
    }
  }

  function handleAdd(slot) {
    addItem(slot)
    setSuccessMessage('Turno agregado a la preselección. Podés seguir comparando opciones.')
  }

  function handleRemove(slot) {
    removeItem([slot.medico?.id, slot.fechaHora, slot.sede, slot.practica].join('|'))
    setSuccessMessage('Turno removido de la preselección.')
  }

  return (
    <div className="search-layout">
      <section className="stack-lg">
        {catalogError ? <div className="alert alert-error">{catalogError}</div> : null}

        <SearchFilters
          filters={filters}
          onChange={updateFilter}
          onSubmit={handleSubmit}
          isLoading={isLoadingResults}
          doctors={doctors}
          catalog={catalog}
          patients={demoPatients}
        />

        {searchError ? <div className="alert alert-error" role="alert">{searchError}</div> : null}
        {successMessage ? <div className="alert alert-success" role="status">{successMessage}</div> : null}

        <section className="results-section" aria-live="polite">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Paso 3</p>
              <h2>Resultados de búsqueda</h2>
            </div>
            {meta ? (
              <p className="panel-copy">
                Página {meta.page ?? 1} · {meta.total ?? results.length} resultados totales
              </p>
            ) : null}
          </div>

          {isLoadingCatalog || isLoadingResults ? (
            <LoadingSkeleton />
          ) : results.length > 0 ? (
            <div className="results-grid">
              {results.map((slot) => (
                <AppointmentCard
                  key={[slot.medico.id, slot.fechaHora, slot.sede, slot.practica].join('|')}
                  slot={slot}
                  isSelected={hasItem(slot)}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <div className="empty-box">
              <p>
                Todavía no hay resultados para mostrar. Usá los filtros, lanzá la búsqueda y el sistema te devuelve las
                opciones disponibles desde el backend.
              </p>
            </div>
          )}
        </section>
      </section>

      <SelectionSummary compact />
    </div>
  )
}

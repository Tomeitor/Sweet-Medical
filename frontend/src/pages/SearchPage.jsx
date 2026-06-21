import { useEffect, useMemo, useState } from "react";
import { AppointmentCard } from "../components/AppointmentCard.jsx";
import { LoadingSkeleton } from "../components/LoadingSkeleton.jsx";
import { ResumenSeleccion } from "../components/ResumenSeleccion.jsx";
import { usePreseleccion } from "../hooks/usePreseleccion.jsx";
import {
  fetchAvailableAppointments,
  fetchDoctors,
  normalizeError,
} from "../services/api.js";
import { buildCatalog, demoPatients } from "../utils/catalog.js";
import { formatIsoDate } from "../utils/formatters.js";

const initialFilters = {
  medicoId: "",
  especialidad: "",
  practica: "",
  sede: "",
  fechaDesde: "",
  fechaHasta: "",
};

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const { addItem, removeItem, hasItem } = usePreseleccion();

  useEffect(() => {
    async function loadDoctors() {
      try {
        const response = await fetchDoctors();
        setDoctors(response);
      } catch (error) {
        setCatalogError(normalizeError(error));
      }
    }
    loadDoctors();
  }, []);

  const catalog = useMemo(() => buildCatalog(doctors), [doctors]);

  function buildRequestParams() {
    const params = {
      pacienteId: "1",
      page: currentPage,
      limit: 12,
      ordenarPor: "fecha",
      orden: "asc",
    };

    if (searchQuery.trim()) {
      params.q = searchQuery;
    }
    if (filters.medicoId) {
      params.medicoId = filters.medicoId;
    }
    if (filters.especialidad) {
      params.especialidad = filters.especialidad;
    }
    if (filters.practica) {
      params.practica = filters.practica;
    }
    if (filters.sede) {
      params.sede = filters.sede;
    }
    if (filters.fechaDesde) {
      params.fechaDesde = formatIsoDate(filters.fechaDesde);
    }
    if (filters.fechaHasta) {
      params.fechaHasta = formatIsoDate(filters.fechaHasta);
    }

    return params;
  }

  async function handleSearch(e) {
    e.preventDefault();
    setSearchError("");
    setSuccessMessage("");
    setCurrentPage(1);

    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);

      const params = buildRequestParams();
      params.page = 1;
      const response = await fetchAvailableAppointments(params);
      const items = response.items ?? response.data ?? [];
      const paginationInfo = response.pagination ?? {
        page: 1,
        limit: 12,
        total: items.length,
        totalPages: 1,
      };

      setResults(items);
      setPagination(paginationInfo);
      setSuccessMessage(
        items.length > 0
          ? `Encontramos ${paginationInfo.total} turnos que coinciden.`
          : "No hay turnos disponibles con esa búsqueda.",
      );
    } catch (error) {
      setResults([]);
      setSearchError(normalizeError(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearchAll() {
    setSearchError("");
    setSuccessMessage("");
    setCurrentPage(1);

    try {
      setIsLoading(true);
      setHasSearched(true);

      const params = buildRequestParams();
      params.page = 1;
      delete params.q; // Sin búsqueda de texto

      const response = await fetchAvailableAppointments(params);
      const items = response.items ?? response.data ?? [];
      const paginationInfo = response.pagination ?? {
        page: 1,
        limit: 12,
        total: items.length,
        totalPages: 1,
      };

      setResults(items);
      setPagination(paginationInfo);
      setSuccessMessage(
        items.length > 0
          ? `Encontramos ${paginationInfo.total} turnos disponibles.`
          : "No hay turnos disponibles con esos filtros.",
      );
    } catch (error) {
      setResults([]);
      setSearchError(normalizeError(error));
    } finally {
      setIsLoading(false);
    }
  }

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  async function handleNextPage() {
    if (currentPage < pagination.totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await performSearch(nextPage);
    }
  }

  async function handlePreviousPage() {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      await performSearch(prevPage);
    }
  }

  async function performSearch(page) {
    try {
      setIsLoading(true);

      const params = buildRequestParams();
      params.page = page;

      const response = await fetchAvailableAppointments(params);
      const items = response.items ?? response.data ?? [];
      const paginationInfo = response.pagination ?? {
        page,
        limit: 12,
        total: items.length,
        totalPages: 1,
      };

      setResults(items);
      setPagination(paginationInfo);
    } catch (error) {
      setSearchError(normalizeError(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleAdd(slot) {
    addItem(slot);
    setSuccessMessage("Turno agregado a la preselección.");
  }

  function handleRemove(slot) {
    removeItem(
      [slot.medico.id, slot.fechaHora, slot.sede, slot.practica].join("|"),
    );
    setSuccessMessage("Turno removido de la preselección.");
  }

  return (
    <div className="search-layout">
      <section className="stack-lg">
        {catalogError ? (
          <div className="alert alert-error">{catalogError}</div>
        ) : null}

        {/* Buscador simple */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Búsqueda</p>
              <h2>Busca turnos por palabra clave</h2>
            </div>
            <p className="panel-copy">
              Escribe un nombre, especialidad, práctica o sede.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: Cardiologia, Dr. Ana, Electrocardiograma..."
              style={{
                flex: 1,
                minWidth: "250px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "1rem",
              }}
            />
            <button
              type="submit"
              className="primary-button"
              disabled={isLoading}
            >
              {isLoading ? "Buscando..." : "Buscar"}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Cerrar filtros" : "Filtros"}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={handleSearchAll}
              disabled={isLoading}
            >
              Buscar todos
            </button>
          </div>
        </form>

        {/* Panel de filtros (desplegable) */}
        {showFilters && (
          <div
            className="filters-panel"
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "var(--surface-muted)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}
          >
            <div className="panel-heading">
              <h3>Filtros avanzados</h3>
            </div>

            <div className="filters-grid">
              <label className="field" htmlFor="medicoId">
                <span className="field-label">Médico</span>
                <select
                  id="medicoId"
                  value={filters.medicoId}
                  onChange={(event) =>
                    updateFilter("medicoId", event.target.value)
                  }
                >
                  <option value="">Todos</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.nombre} · MP {doctor.matricula}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" htmlFor="especialidad">
                <span className="field-label">Especialidad</span>
                <select
                  id="especialidad"
                  value={filters.especialidad}
                  onChange={(event) =>
                    updateFilter("especialidad", event.target.value)
                  }
                >
                  <option value="">Todas</option>
                  {catalog.especialidades?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" htmlFor="practica">
                <span className="field-label">Práctica</span>
                <select
                  id="practica"
                  value={filters.practica}
                  onChange={(event) =>
                    updateFilter("practica", event.target.value)
                  }
                >
                  <option value="">Todas</option>
                  {catalog.practicas?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" htmlFor="sede">
                <span className="field-label">Sede</span>
                <select
                  id="sede"
                  value={filters.sede}
                  onChange={(event) => updateFilter("sede", event.target.value)}
                >
                  <option value="">Todas</option>
                  {catalog.sedes?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" htmlFor="fechaDesde">
                <span className="field-label">Desde</span>
                <input
                  id="fechaDesde"
                  type="datetime-local"
                  value={filters.fechaDesde}
                  onChange={(event) =>
                    updateFilter("fechaDesde", event.target.value)
                  }
                />
              </label>

              <label className="field" htmlFor="fechaHasta">
                <span className="field-label">Hasta</span>
                <input
                  id="fechaHasta"
                  type="datetime-local"
                  value={filters.fechaHasta}
                  onChange={(event) =>
                    updateFilter("fechaHasta", event.target.value)
                  }
                />
              </label>
            </div>

            <div
              className="actions-row"
              style={{ marginTop: "16px", display: "flex", gap: "12px" }}
            >
              <button
                type="button"
                className="text-button"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {searchError ? (
          <div className="alert alert-error" role="alert">
            {searchError}
          </div>
        ) : null}
        {successMessage ? (
          <div className="alert alert-success" role="status">
            {successMessage}
          </div>
        ) : null}

        {/* Resultados */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : hasSearched && results.length > 0 ? (
          <section className="results-section" aria-live="polite">
            <div className="panel-heading">
              <div>
                <h2>
                  Resultados ({results.length} de {pagination.total})
                </h2>
                <p
                  className="pagination-info"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    marginTop: "8px",
                  }}
                >
                  Página {pagination.page} de {pagination.totalPages} • Total:{" "}
                  {pagination.total} turnos
                </p>
              </div>
            </div>
            <div className="results-grid">
              {results.map((slot) => (
                <AppointmentCard
                  key={[
                    slot.medico.id,
                    slot.fechaHora,
                    slot.sede,
                    slot.practica,
                  ].join("|")}
                  slot={slot}
                  isSelected={hasItem(slot)}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Controles de paginación */}
            {pagination.totalPages > 1 && (
              <div
                className="pagination-controls"
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoading}
                  style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                  ← Anterior
                </button>
                <span style={{ padding: "0 12px", fontWeight: "500" }}>
                  {currentPage} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleNextPage}
                  disabled={currentPage >= pagination.totalPages || isLoading}
                  style={{
                    opacity: currentPage >= pagination.totalPages ? 0.5 : 1,
                  }}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </section>
        ) : hasSearched && results.length === 0 ? (
          <div className="empty-box">
            <p>No hay turnos disponibles con esa búsqueda o filtros.</p>
          </div>
        ) : (
          <div className="empty-box">
            <p>
              Escribe algo en el buscador o usa "Buscar todos" para encontrar
              turnos.
            </p>
          </div>
        )}
      </section>

      <ResumenSeleccion compact />
    </div>
  );
}

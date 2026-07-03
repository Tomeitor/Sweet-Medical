import { useEffect, useMemo, useState } from "react";
import { TurnosCard } from "../components/TurnosCard.jsx";
import { LoadingSkeleton } from "../components/LoadingSkeleton.jsx";
import { SearchFilters } from "../components/SearchFilters.jsx";
import { usePreseleccion } from "../hooks/usePreseleccion.jsx";
import { useFilters } from "../hooks/useFilters.jsx";
import { usePagination } from "../hooks/usePagination.jsx";
import {
  fetchAvailableAppointments,
  fetchDoctors,
  handleApiError,
} from "../services/api.js";
import { buildCatalog } from "../utils/catalog.js";
import { formatIsoDate } from "../utils/formatters.js";
import { useAuth } from "../context/AuthContext.jsx";
import { DEMO_PATIENT_PROFILE_ID } from "../auth/constants.js";

function getPagination(response, fallbackPage) {
  const items = response.items ?? response.data ?? [];
  const pagination = response.pagination ?? {
    page: fallbackPage,
    limit: 12,
    total: items.length,
    totalPages: 1,
  };

  return { items, pagination };
}

export function SearchPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const { addItem, removeItem, hasItem } = usePreseleccion();
  const { filters, updateFilter, clearFilters } = useFilters();
  const { pagination, setPaginationData } = usePagination();

  useEffect(() => {
    async function loadDoctors() {
      try {
        const response = await fetchDoctors();
        setDoctors(response);
      } catch (error) {
        setCatalogError(handleApiError(error));
      }
    }
    loadDoctors();
  }, []);

  const catalog = useMemo(() => buildCatalog(doctors), [doctors]);

  function buildRequestParams({ page = 1 } = {}) {
    const pacienteId = user?.role === "PACIENTE" ? user.profileId : DEMO_PATIENT_PROFILE_ID;

    const params = {
      pacienteId,
      page,
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

  async function executeSearch({ page = 1 } = {}) {
    try {
      setIsLoading(true);
      setHasSearched(true);
      setSearchError("");

      const response = await fetchAvailableAppointments(buildRequestParams({ page }));
      const { items, pagination: nextPagination } = getPagination(response, page);

      setResults(items);
      setPaginationData(nextPagination);
    } catch (error) {
      setResults([]);
      setSearchError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    await executeSearch({ page: 1 });
  }

  async function changePage(nextPage) {
    await executeSearch({ page: nextPage });
  }

  function handleAdd(slot) {
    addItem(slot);
  }

  function handleRemove(slot) {
    removeItem(
      [slot.medico.id, slot.fechaHora, slot.sede, slot.practica].join("|"),
    );
  }

  const hasActiveFilters = Object.values(filters).some(Boolean) || searchQuery.trim() !== "";
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

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

          <div className="search-toolbar">
            <input
              className="search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: Cardiologia, Dr. Ana, Electrocardiograma..."
            />
            <button
              type="submit"
              className="primary-button"
              disabled={isLoading}
            >
              {isLoading ? "Buscando..." : hasActiveFilters ? "Buscar" : "Buscar todos"}
            </button>
            <button
              type="button"
              className="secondary-button filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg className="filter-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              {showFilters ? "Cerrar filtros" : "Filtros"}
              {activeFilterCount > 0 && <span className="badge">{activeFilterCount}</span>}
            </button>
          </div>
        </form>

        {showFilters && (
          <SearchFilters
            filters={filters}
            onChange={updateFilter}
            onClear={clearFilters}
            doctors={doctors}
            catalog={catalog}
          />
        )}

        {searchError ? (
          <div className="alert alert-error" role="alert">
            {searchError}
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
                <p className="pagination-info">
                  Página {pagination.page} de {pagination.totalPages} • Total:{" "}
                  {pagination.total} turnos
                </p>
              </div>
            </div>
            <div className="results-grid">
              {results.map((slot) => (
                <TurnosCard
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
              <div className="pagination-controls">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page === 1 || isLoading}
                >
                  ← Anterior
                </button>
                <span className="pagination-indicator">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
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
    </div>
  );
}

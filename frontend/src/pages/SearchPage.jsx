import { useEffect, useMemo, useState } from "react";
import { TurnosCard } from "../components/TurnosCard.jsx";
import { LoadingSkeleton } from "../components/LoadingSkeleton.jsx";
import { ResumenSeleccion } from "../components/ResumenSeleccion.jsx";
import { SearchFilters } from "../components/SearchFilters.jsx";
import { usePreseleccion } from "../hooks/usePreseleccion.jsx";
import {
  fetchAvailableAppointments,
  fetchDoctors,
  handleApiError,
} from "../services/api.js";
import { buildCatalog } from "../utils/catalog.js";
import { formatIsoDate } from "../utils/formatters.js";

const initialFilters = {
  medicoId: "",
  especialidad: "",
  practica: "",
  sede: "",
  fechaDesde: "",
  fechaHasta: "",
};

const initialPagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

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
  const [searchMode, setSearchMode] = useState(null);
  const [pagination, setPagination] = useState(initialPagination);
  const { addItem, removeItem, hasItem } = usePreseleccion();

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

  function buildRequestParams({ page = 1, includeQuery = true } = {}) {
    const params = {
      pacienteId: "1",
      page,
      limit: 12,
      ordenarPor: "fecha",
      orden: "asc",
    };

    if (includeQuery && searchQuery.trim()) {
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

  function clearFeedback() {
    setSearchError("");
    setSuccessMessage("");
  }

  function resetResults() {
    setResults([]);
    setPagination(initialPagination);
  }

  async function executeSearch({ page = 1, includeQuery, mode, successMessageBuilder, emptyMessage, preserveMessage = false }) {
    try {
      setIsLoading(true);
      setHasSearched(true);
      setSearchMode(mode);
      setSearchError("");

      if (!preserveMessage) {
        setSuccessMessage("");
      }

      const response = await fetchAvailableAppointments(buildRequestParams({ page, includeQuery }));
      const { items, pagination: nextPagination } = getPagination(response, page);

      setResults(items);
      setPagination(nextPagination);

      if (!preserveMessage) {
        setSuccessMessage(items.length > 0 ? successMessageBuilder(nextPagination) : emptyMessage);
      }
    } catch (error) {
      setResults([]);
      setSearchError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();

    if (!searchQuery.trim()) {
      clearFeedback();
      resetResults();
      setHasSearched(false);
      setSearchMode(null);
      return;
    }

    await executeSearch({
      page: 1,
      includeQuery: true,
      mode: 'query',
      successMessageBuilder: (nextPagination) => `Encontramos ${nextPagination.total} turnos que coinciden.`,
      emptyMessage: 'No hay turnos disponibles con esa búsqueda.',
    });
  }

  async function handleSearchAll() {
    await executeSearch({
      page: 1,
      includeQuery: false,
      mode: 'all',
      successMessageBuilder: (nextPagination) => `Encontramos ${nextPagination.total} turnos disponibles.`,
      emptyMessage: 'No hay turnos disponibles con esos filtros.',
    });
  }

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  async function changePage(nextPage) {
    if (!searchMode) {
      return;
    }

    await executeSearch({
      page: nextPage,
      includeQuery: searchMode === 'query',
      mode: searchMode,
      successMessageBuilder: () => successMessage,
      emptyMessage: '',
      preserveMessage: true,
    });
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

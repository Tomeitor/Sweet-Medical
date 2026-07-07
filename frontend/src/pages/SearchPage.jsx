import { useEffect, useMemo, useState } from "react";
import { Dialog } from "../components/Dialog.jsx";
import { TurnosCard } from "../components/TurnosCard.jsx";
import { LoadingSkeleton } from "../components/LoadingSkeleton.jsx";
import { SearchFilters } from "../components/SearchFilters.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { usePreseleccion } from "../hooks/usePreseleccion.jsx";
import { useFilters } from "../hooks/useFilters.jsx";
import { usePagination } from "../hooks/usePagination.jsx";
import {
  cancelAppointmentByPatient,
  fetchAvailableAppointments,
  fetchDoctors,
  fetchMyAppointmentsHistory,
  fetchNotifications,
  handleApiError,
  markNotificationAsRead,
  notifyNotificationsChanged,
  rescheduleAppointmentByPatient,
  respondToAppointmentProposal,
} from "../services/api.js";
import { buildCatalog } from "../utils/catalog.js";
import { crearIdTurno } from "../utils/preseleccion.js";
import {
  formatDateTimeLocalValue,
  serializeDateTimeLocal,
} from "../utils/dateTime.js";
import { formatIsoDate } from "../utils/formatters.js";

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

function getItemId(item) {
  return item?.id ?? item?._id ?? "";
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function canStillBeCanceled(value) {
  return new Date(value).getTime() - Date.now() >= 60 * 60 * 1000;
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
  const [patientHistory, setPatientHistory] = useState([]);
  const [patientHistoryMessage, setPatientHistoryMessage] = useState("");
  const [patientHistoryMessageType, setPatientHistoryMessageType] =
    useState("success");
  const [busyPatientActionId, setBusyPatientActionId] = useState("");
  const [patientActionDialog, setPatientActionDialog] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [busyNotificationId, setBusyNotificationId] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationMessageType, setNotificationMessageType] =
    useState("success");
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

  useEffect(() => {
    async function loadHistory() {
      if (user?.role !== "PACIENTE" || !user?.profileId) {
        setPatientHistory([]);
        return;
      }

      try {
        const history = await fetchMyAppointmentsHistory(user.profileId);
        setPatientHistory(Array.isArray(history) ? history : []);
        setPatientHistoryMessage("");
      } catch (error) {
        setPatientHistory([]);
        setPatientHistoryMessage(handleApiError(error));
        setPatientHistoryMessageType("error");
      }
    }

    loadHistory();
  }, [user]);

  useEffect(() => {
    async function loadNotifications() {
      if (user?.role !== "PACIENTE" || !user?.username) {
        setUnreadNotifications([]);
        setReadNotifications([]);
        return;
      }

      try {
        const [unread, read] = await Promise.all([
          fetchNotifications(user.username, false),
          fetchNotifications(user.username, true),
        ]);
        setUnreadNotifications(unread);
        setReadNotifications(read);
        setNotificationMessage("");
        notifyNotificationsChanged();
      } catch (error) {
        setUnreadNotifications([]);
        setReadNotifications([]);
        setNotificationMessage(handleApiError(error));
        setNotificationMessageType("error");
      }
    }

    loadNotifications();
  }, [user]);

  const catalog = useMemo(() => buildCatalog(doctors), [doctors]);

  function buildRequestParams({ page = 1 } = {}) {
    const params = {
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

      const response = await fetchAvailableAppointments(
        buildRequestParams({ page }),
      );
      const { items, pagination: nextPagination } = getPagination(
        response,
        page,
      );

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

  async function refreshHistory() {
    if (user?.role !== "PACIENTE" || !user?.profileId) {
      return;
    }

    const history = await fetchMyAppointmentsHistory(user.profileId);
    setPatientHistory(Array.isArray(history) ? history : []);
  }

  async function refreshNotifications() {
    if (user?.role !== "PACIENTE" || !user?.username) {
      return;
    }

    const [unread, read] = await Promise.all([
      fetchNotifications(user.username, false),
      fetchNotifications(user.username, true),
    ]);

    setUnreadNotifications(unread);
    setReadNotifications(read);
    notifyNotificationsChanged();
  }

  async function handleMarkNotificationAsRead(notification) {
    if (!user?.username) {
      return;
    }

    try {
      setBusyNotificationId(getItemId(notification));
      setNotificationMessage("");
      setNotificationMessageType("success");
      await markNotificationAsRead(user.username, getItemId(notification));
      await refreshNotifications();
      setNotificationMessage("Notificación marcada como leída.");
      setNotificationMessageType("success");
    } catch (error) {
      setNotificationMessage(handleApiError(error));
      setNotificationMessageType("error");
    } finally {
      setBusyNotificationId("");
    }
  }

  async function handleProposalResponse(notification, accion) {
    if (!user?.username || !notification?.meta?.turnoId) {
      return;
    }

    try {
      setBusyNotificationId(getItemId(notification));
      setNotificationMessage("");
      setNotificationMessageType("success");
      await respondToAppointmentProposal(
        notification.meta.turnoId,
        getItemId(notification),
        accion,
      );
      await Promise.all([refreshHistory(), refreshNotifications()]);
      setNotificationMessage(
        accion === "ACEPTAR"
          ? "Propuesta aceptada. El turno fue actualizado."
          : "Propuesta rechazada.",
      );
      setNotificationMessageType("success");
    } catch (error) {
      setNotificationMessage(handleApiError(error));
      setNotificationMessageType("error");
    } finally {
      setBusyNotificationId("");
    }
  }

  function openPatientActionDialog(appointment, action) {
    setPatientHistoryMessage("");
    setPatientHistoryMessageType("success");
    setPatientActionDialog({
      action,
      appointmentId: getItemId(appointment),
      reason: "",
      nextDateTime:
        action === "reschedule"
          ? formatDateTimeLocalValue(appointment.fechaHora)
          : "",
      error: "",
    });
  }

  function closePatientActionDialog() {
    if (busyPatientActionId) {
      return;
    }

    setPatientActionDialog(null);
  }

  function updatePatientDialogField(field, value) {
    setPatientActionDialog((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
        error: "",
      };
    });
  }

  async function handlePatientAppointmentAction(event) {
    event.preventDefault();

    if (!patientActionDialog) {
      return;
    }

    const { action, appointmentId, reason, nextDateTime } = patientActionDialog;
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setPatientActionDialog((current) =>
        current ? { ...current, error: "El motivo es obligatorio." } : current,
      );
      return;
    }

    if (action === "reschedule" && !nextDateTime) {
      setPatientActionDialog((current) =>
        current
          ? { ...current, error: "La nueva fecha y hora es obligatoria." }
          : current,
      );
      return;
    }

    try {
      setBusyPatientActionId(`${action}:${appointmentId}`);
      setPatientHistoryMessage("");
      setPatientHistoryMessageType("success");

      if (action === "cancel") {
        await cancelAppointmentByPatient(appointmentId, trimmedReason);
      }

      if (action === "reschedule") {
        await rescheduleAppointmentByPatient(
          appointmentId,
          serializeDateTimeLocal(nextDateTime),
          trimmedReason,
        );
      }

      await refreshHistory();
      await refreshNotifications();
      setPatientHistoryMessage("Turno actualizado.");
      setPatientHistoryMessageType("success");
      setPatientActionDialog(null);
    } catch (error) {
      const message = handleApiError(error);
      setPatientHistoryMessage(message);
      setPatientHistoryMessageType("error");
      setPatientActionDialog((current) =>
        current ? { ...current, error: message } : current,
      );
    } finally {
      setBusyPatientActionId("");
    }
  }

  function handleAdd(slot) {
    addItem(slot);
  }

  function handleRemove(slot) {
    removeItem(crearIdTurno(slot));
  }

  const hasActiveFilters =
    Object.values(filters).some(Boolean) || searchQuery.trim() !== "";
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
              {isLoading
                ? "Buscando..."
                : hasActiveFilters
                  ? "Buscar"
                  : "Buscar todos"}
            </button>
            <button
              type="button"
              className="secondary-button filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg
                className="filter-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {showFilters ? "Cerrar filtros" : "Filtros"}
              {activeFilterCount > 0 && (
                <span className="badge">{activeFilterCount}</span>
              )}
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
                  key={crearIdTurno(slot)}
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
                  disabled={
                    pagination.page >= pagination.totalPages || isLoading
                  }
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

        {user?.role === "PACIENTE" ? (
          <article className="info-card stack-md">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Mi historial</p>
                <h2>Mis turnos</h2>
              </div>
              {patientHistory.length > 0 ? (
                <p className="panel-copy">{patientHistory.length} turnos</p>
              ) : null}
            </div>

            {patientHistoryMessage ? (
              <div className={`alert alert-${patientHistoryMessageType}`}>
                {patientHistoryMessage}
              </div>
            ) : null}

            {patientHistory.length > 0 ? (
              <div className="stack-md">
                {patientHistory.map((appointment) => {
                  const appointmentId = getItemId(appointment);
                  const canCancel = canStillBeCanceled(appointment.fechaHora);
                  const isActive = ![
                    "CANCELADO",
                    "REALIZADO",
                    "RECHAZADO",
                  ].includes(appointment.estado);

                  return (
                    <article
                      key={appointmentId}
                      className="inline-card stack-sm"
                    >
                      <div className="panel-heading">
                        <div>
                          <strong>
                            {formatDateTime(appointment.fechaHora)}
                          </strong>
                          <p>
                            {appointment.medico?.nombre ??
                              appointment.medico?.id ??
                              appointment.medico ??
                              "—"}
                            {" · "}
                            {appointment.practica} · {appointment.sede}
                          </p>
                        </div>
                        <span className="tag">{appointment.estado}</span>
                      </div>

                      {isActive ? (
                        <div className="appointment-actions">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                              openPatientActionDialog(appointment, "reschedule")
                            }
                            disabled={
                              busyPatientActionId ===
                                `reschedule:${appointmentId}` || !canCancel
                            }
                          >
                            Cambiar horario
                          </button>
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                              openPatientActionDialog(appointment, "cancel")
                            }
                            disabled={
                              busyPatientActionId ===
                                `cancel:${appointmentId}` || !canCancel
                            }
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="muted-text">Todavía no tenés turnos registrados.</p>
            )}
          </article>
        ) : null}

        {user?.role === "PACIENTE" ? (
          <article className="info-card stack-md" id="notificaciones">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Notificaciones</p>
                <h2>Mis mensajes</h2>
              </div>
              <p className="panel-copy">
                {unreadNotifications.length} sin leer
              </p>
            </div>

            {notificationMessage ? (
              <div className={`alert alert-${notificationMessageType}`}>
                {notificationMessage}
              </div>
            ) : null}

            <div className="stack-md">
              <div>
                <h3>No leídas</h3>
                {unreadNotifications.length > 0 ? (
                  <div className="stack-md">
                    {unreadNotifications.map((notification) => {
                      const isPendingProposal =
                        notification?.meta?.tipo === "propuesta_cambio" &&
                        notification?.meta?.estado === "PENDIENTE";

                      return (
                        <article
                          key={getItemId(notification)}
                          className="inline-card notification-row"
                        >
                          <div className="stack-sm">
                            <p>{notification.mensaje}</p>
                            {isPendingProposal ? (
                              <div className="appointment-actions">
                                <button
                                  type="button"
                                  className="primary-button"
                                  onClick={() =>
                                    handleProposalResponse(
                                      notification,
                                      "ACEPTAR",
                                    )
                                  }
                                  disabled={
                                    busyNotificationId ===
                                    getItemId(notification)
                                  }
                                >
                                  Aceptar cambio
                                </button>
                                <button
                                  type="button"
                                  className="secondary-button"
                                  onClick={() =>
                                    handleProposalResponse(
                                      notification,
                                      "RECHAZAR",
                                    )
                                  }
                                  disabled={
                                    busyNotificationId ===
                                    getItemId(notification)
                                  }
                                >
                                  Rechazar cambio
                                </button>
                              </div>
                            ) : null}
                          </div>
                          {!isPendingProposal ? (
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() =>
                                handleMarkNotificationAsRead(notification)
                              }
                              disabled={
                                busyNotificationId === getItemId(notification)
                              }
                            >
                              Marcar como leída
                            </button>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="muted-text">No hay notificaciones sin leer.</p>
                )}
              </div>

              <div>
                <h3>Leídas</h3>
                {readNotifications.length > 0 ? (
                  <div className="stack-md">
                    {readNotifications.map((notification) => (
                      <article
                        key={getItemId(notification)}
                        className="inline-card notification-row"
                      >
                        <p>{notification.mensaje}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="muted-text">
                    Aún no hay notificaciones leídas.
                  </p>
                )}
              </div>
            </div>
          </article>
        ) : null}
      </section>

      <Dialog
        isOpen={Boolean(patientActionDialog)}
        title={
          patientActionDialog?.action === "reschedule"
            ? "Cambiar horario"
            : "Cancelar turno"
        }
        description={
          patientActionDialog?.action === "reschedule"
            ? "Elegí la nueva fecha y hora e indicá el motivo del cambio."
            : "Indicá el motivo de la cancelación para continuar."
        }
        onClose={closePatientActionDialog}
        footer={
          <>
            <button
              type="button"
              className="text-button"
              onClick={closePatientActionDialog}
              disabled={Boolean(busyPatientActionId)}
            >
              Volver
            </button>
            <button
              type="submit"
              form="patient-appointment-action-form"
              className="primary-button"
              disabled={Boolean(busyPatientActionId)}
            >
              {busyPatientActionId
                ? "Guardando..."
                : patientActionDialog?.action === "reschedule"
                  ? "Confirmar cambio"
                  : "Confirmar cancelación"}
            </button>
          </>
        }
      >
        <form
          id="patient-appointment-action-form"
          className="stack-md"
          onSubmit={handlePatientAppointmentAction}
        >
          {patientActionDialog?.action === "reschedule" ? (
            <label className="field">
              <span className="field-label">Nueva fecha y hora</span>
              <input
                type="datetime-local"
                step="900"
                value={patientActionDialog?.nextDateTime ?? ""}
                onChange={(event) =>
                  updatePatientDialogField("nextDateTime", event.target.value)
                }
                required
              />
            </label>
          ) : null}

          <label className="field">
            <span className="field-label">Motivo</span>
            <textarea
              rows="4"
              value={patientActionDialog?.reason ?? ""}
              onChange={(event) =>
                updatePatientDialogField("reason", event.target.value)
              }
              placeholder={
                patientActionDialog?.action === "reschedule"
                  ? "Contanos por qué querés cambiar el turno"
                  : "Contanos por qué querés cancelar el turno"
              }
              required
            />
          </label>

          {patientActionDialog?.error ? (
            <div className="alert alert-error">{patientActionDialog.error}</div>
          ) : null}
        </form>
      </Dialog>
    </div>
  );
}

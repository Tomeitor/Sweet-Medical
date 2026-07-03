import { useEffect, useMemo, useState } from "react";
import {
  createAvailability,
  deleteAvailability,
  fetchDoctorAvailabilities,
  fetchDoctors,
  fetchNotifications,
  handleApiError,
  markNotificationAsRead,
} from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const selectedDoctorIdKey = "selectedDoctorId";
const selectedDoctorUserKey = "selectedDoctorUsuarioId";
const days = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

function getItemId(item) {
  return item?.id ?? item?._id ?? "";
}

function unwrapNotifications(response) {
  return Array.isArray(response) ? response : response?.data ?? [];
}

export function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorError, setDoctorError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [availabilities, setAvailabilities] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [availabilityForm, setAvailabilityForm] = useState({
    diaSemana: "LUNES",
    desde: "09:00",
    hasta: "13:00",
  });
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [availabilityMessageType, setAvailabilityMessageType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationMessageType, setNotificationMessageType] = useState("success");
  const [busyAvailabilityId, setBusyAvailabilityId] = useState("");
  const [busyNotificationId, setBusyNotificationId] = useState("");
  const visibleDoctors = useMemo(() => {
    if (user?.role !== "MEDICO") {
      return doctors;
    }

    return doctors.filter((doctor) => getItemId(doctor) === user.profileId);
  }, [doctors, user]);

  const selectedDoctor = useMemo(
    () => visibleDoctors.find((doctor) => getItemId(doctor) === selectedDoctorId) ?? null,
    [selectedDoctorId, visibleDoctors],
  );

  useEffect(() => {
    async function loadDoctors() {
      try {
        const response = await fetchDoctors();
        setDoctors(response);
      } catch (error) {
        setDoctorError(handleApiError(error));
      } finally {
        setIsLoadingDoctors(false);
      }
    }

    loadDoctors();
  }, []);

  useEffect(() => {
    if (!visibleDoctors.length) {
      return;
    }

    const storedId = window.localStorage.getItem(selectedDoctorIdKey);
    const userDoctor = user?.role === "MEDICO"
      ? visibleDoctors.find((doctor) => getItemId(doctor) === user.profileId)
      : null;
    const nextDoctor = visibleDoctors.find((doctor) => getItemId(doctor) === storedId) ?? userDoctor ?? visibleDoctors[0];
    const nextDoctorId = getItemId(nextDoctor);

    if (nextDoctorId && nextDoctorId !== selectedDoctorId) {
      setSelectedDoctorId(nextDoctorId);
    }
  }, [selectedDoctorId, user, visibleDoctors]);

  useEffect(() => {
    if (!selectedDoctor) {
      if (visibleDoctors.length) {
        window.localStorage.removeItem(selectedDoctorIdKey);
        window.localStorage.removeItem(selectedDoctorUserKey);
        window.dispatchEvent(new Event("selected-doctor-changed"));
      }

      return;
    }

    window.localStorage.setItem(selectedDoctorIdKey, getItemId(selectedDoctor));
    window.localStorage.setItem(selectedDoctorUserKey, selectedDoctor.usuario ?? "");
    window.dispatchEvent(new Event("selected-doctor-changed"));
  }, [selectedDoctor, visibleDoctors]);

  useEffect(() => {
    async function loadDetails() {
      if (!selectedDoctor) {
        return;
      }

      try {
        setIsLoadingDetails(true);
        setDetailError("");
        setAvailabilityMessage("");
        setAvailabilityMessageType("success");
        setNotificationMessage("");
        setNotificationMessageType("success");

        const [allAvailabilities, unread, read] = await Promise.all([
          fetchDoctorAvailabilities(),
          fetchNotifications(selectedDoctor.usuario, false),
          fetchNotifications(selectedDoctor.usuario, true),
        ]);

        const doctorId = getItemId(selectedDoctor);
        setAvailabilities(
          allAvailabilities.filter((item) => String(item.idMedico) === String(doctorId)),
        );
        setUnreadNotifications(unwrapNotifications(unread));
        setReadNotifications(unwrapNotifications(read));
      } catch (error) {
        setDetailError(handleApiError(error));
        setAvailabilities([]);
        setUnreadNotifications([]);
        setReadNotifications([]);
      } finally {
        setIsLoadingDetails(false);
      }
    }

    loadDetails();
  }, [selectedDoctor]);

  async function refreshDetails() {
    if (!selectedDoctor) {
      return;
    }

    const [allAvailabilities, unread, read] = await Promise.all([
      fetchDoctorAvailabilities(),
      fetchNotifications(selectedDoctor.usuario, false),
      fetchNotifications(selectedDoctor.usuario, true),
    ]);

    const doctorId = getItemId(selectedDoctor);
    setAvailabilities(allAvailabilities.filter((item) => String(item.idMedico) === String(doctorId)));
    setUnreadNotifications(unwrapNotifications(unread));
    setReadNotifications(unwrapNotifications(read));
  }

  function handleDoctorChange(event) {
    setSelectedDoctorId(event.target.value);
  }

  async function handleAvailabilitySubmit(event) {
    event.preventDefault();

    if (!selectedDoctor || busyAvailabilityId === "create") {
      return;
    }

    try {
      setAvailabilityMessage("");
      setAvailabilityMessageType("success");
      setBusyAvailabilityId("create");
      await createAvailability({
        idMedico: String(getItemId(selectedDoctor)),
        ...availabilityForm,
      });
      await refreshDetails();
      setAvailabilityMessage("Disponibilidad guardada.");
      setAvailabilityMessageType("success");
    } catch (error) {
      setAvailabilityMessage(handleApiError(error));
      setAvailabilityMessageType("error");
    } finally {
      setBusyAvailabilityId("");
    }
  }

  async function handleDeleteAvailability(id) {
    try {
      setBusyAvailabilityId(id);
      setAvailabilityMessage("");
      await deleteAvailability(id);
      await refreshDetails();
      setAvailabilityMessage("Disponibilidad eliminada.");
    } catch (error) {
      setAvailabilityMessage(handleApiError(error));
    } finally {
      setBusyAvailabilityId("");
    }
  }

  async function handleMarkAsRead(notification) {
    if (!selectedDoctor) {
      return;
    }

    try {
      setBusyNotificationId(getItemId(notification));
      setNotificationMessage("");
      setNotificationMessageType("success");
      await markNotificationAsRead(selectedDoctor.usuario, getItemId(notification));
      await refreshDetails();
      setNotificationMessage("Notificación marcada como leída.");
      setNotificationMessageType("success");
      window.dispatchEvent(new Event("selected-doctor-changed"));
    } catch (error) {
      setNotificationMessage(handleApiError(error));
      setNotificationMessageType("error");
    } finally {
      setBusyNotificationId("");
    }
  }

  return (
    <div className="content-grid two-columns align-start doctors-page">
      <section className="stack-lg">
        <div className="info-card stack-md">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Médicos</p>
              <h2>Gestión de médicos</h2>
            </div>
              <p className="panel-copy">
                {user?.role === "MEDICO"
                  ? "Solo podés gestionar tu propio perfil y tus notificaciones."
                  : "Seleccione un médico para revisar la disponibilidad y las notificaciones."}
              </p>
          </div>

          {doctorError ? <div className="alert alert-error">{doctorError}</div> : null}

          <label className="field">
            <span className="field-label">Médico</span>
              <select value={selectedDoctorId} onChange={handleDoctorChange} disabled={isLoadingDoctors || user?.role === "MEDICO"}>
                <option value="">Seleccione un médico</option>
                {visibleDoctors.map((doctor) => (
                  <option key={getItemId(doctor)} value={getItemId(doctor)}>
                    {doctor.nombre}
                  </option>
                ))}
              </select>
            </label>

          {user?.role === "MEDICO" ? (
            <p className="muted-text">Tu selección queda fijada a tu perfil autenticado.</p>
          ) : null}

          {isLoadingDoctors ? <p className="muted-text">Cargando médicos...</p> : null}
        </div>

        <article className="info-card stack-md">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Perfil</p>
              <h2>{selectedDoctor?.nombre ?? "Ningún médico seleccionado"}</h2>
            </div>
            {selectedDoctor?.matricula ? <p className="panel-copy">Matrícula {selectedDoctor.matricula}</p> : null}
          </div>

          {selectedDoctor ? (
            <dl className="doctor-summary">
              <div>
                <dt>Usuario</dt>
                <dd>{selectedDoctor.usuario}</dd>
              </div>
              <div>
                <dt>Especialidades</dt>
                <dd>{selectedDoctor.especialidades?.join(", ") || "—"}</dd>
              </div>
              <div>
                <dt>Prácticas</dt>
                <dd>{selectedDoctor.practicas?.join(", ") || "—"}</dd>
              </div>
              <div>
                <dt>Sedes</dt>
                <dd>{selectedDoctor.sedes?.join(", ") || "—"}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted-text">Elija un médico para ver sus datos.</p>
          )}
        </article>

        <article className="info-card stack-md">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Disponibilidades</p>
              <h2 id="disponibilidades">Gestionar franjas horarias</h2>
            </div>
          </div>

          {detailError ? <div className="alert alert-error">{detailError}</div> : null}

          <form className="doctor-form" onSubmit={handleAvailabilitySubmit}>
            <label className="field">
              <span className="field-label">Día</span>
              <select
                value={availabilityForm.diaSemana}
                onChange={(event) => setAvailabilityForm({ ...availabilityForm, diaSemana: event.target.value })}
                disabled={!selectedDoctor || isLoadingDetails}
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Desde</span>
              <input
                type="time"
                value={availabilityForm.desde}
                onChange={(event) => setAvailabilityForm({ ...availabilityForm, desde: event.target.value })}
                disabled={!selectedDoctor || isLoadingDetails}
              />
            </label>

            <label className="field">
              <span className="field-label">Hasta</span>
              <input
                type="time"
                value={availabilityForm.hasta}
                onChange={(event) => setAvailabilityForm({ ...availabilityForm, hasta: event.target.value })}
                disabled={!selectedDoctor || isLoadingDetails}
              />
            </label>

            <button
              type="submit"
              className="primary-button"
              disabled={!selectedDoctor || isLoadingDetails || busyAvailabilityId === "create"}
            >
              {busyAvailabilityId === "create" ? "Guardando..." : "Agregar disponibilidad"}
            </button>
          </form>

          {availabilityMessage ? (
            <div className={`alert alert-${availabilityMessageType}`}>{availabilityMessage}</div>
          ) : null}

          {isLoadingDetails ? <p className="muted-text">Cargando disponibilidad...</p> : null}

          <div className="stack-md">
            {availabilities.length > 0 ? (
              availabilities.map((item) => (
                <div key={getItemId(item)} className="inline-card availability-row">
                  <div>
                    <strong>{item.diaSemana}</strong>
                    <p>{item.desde} - {item.hasta}</p>
                  </div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleDeleteAvailability(getItemId(item))}
                    disabled={busyAvailabilityId === getItemId(item)}
                  >
                    Eliminar
                  </button>
                </div>
              ))
            ) : (
              <p className="muted-text">Aún no hay disponibilidades registradas.</p>
            )}
          </div>
        </article>
      </section>

      <section className="info-card stack-md" id="notificaciones">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Notificaciones</p>
            <h2>Mensajes no leídos y leídos</h2>
          </div>
          {selectedDoctor ? <p className="panel-copy">{unreadNotifications.length} sin leer</p> : null}
        </div>

        {notificationMessage ? (
          <div className={`alert alert-${notificationMessageType}`}>{notificationMessage}</div>
        ) : null}

        <div className="stack-md">
          <div>
            <h3>No leídas</h3>
            {unreadNotifications.length > 0 ? (
              <div className="stack-md">
                {unreadNotifications.map((notification) => (
                  <article key={getItemId(notification)} className="inline-card notification-row">
                    <div>
                      <p>{notification.mensaje}</p>
                    </div>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleMarkAsRead(notification)}
                      disabled={busyNotificationId === getItemId(notification)}
                    >
                      Marcar como leída
                    </button>
                  </article>
                ))}
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
                  <article key={getItemId(notification)} className="inline-card notification-row">
                    <p>{notification.mensaje}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted-text">Aún no hay notificaciones leídas.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Dialog } from "../components/Dialog.jsx";
import {
  acceptAppointment,
  createAvailability,
  cancelAppointmentByDoctor,
  deleteAvailability,
  fetchDoctorAppointmentsHistory,
  fetchDoctorAvailabilities,
  fetchDoctors,
  fetchPatientAppointmentsHistory,
  fetchNotifications,
  handleApiError,
  notifyNotificationsChanged,
  rejectAppointment,
  markNotificationAsRead,
  markAppointmentAsCompleted,
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
  return (new Date(value).getTime() - Date.now()) >= 60 * 60 * 1000;
}

function buildPatientHistoryOptions(appointments) {
  const patientsById = new Map();
  const nameOccurrences = new Map();

  appointments.forEach((appointment) => {
    const patient = appointment?.paciente;
    const id = getItemId(patient) || (typeof patient === "string" ? patient : "");

    if (!id || patientsById.has(id)) {
      return;
    }

    const rawName = typeof patient === "object" ? patient?.nombre : "";
    const name = rawName?.trim() ?? "";

    if (name) {
      nameOccurrences.set(name, (nameOccurrences.get(name) ?? 0) + 1);
    }

    patientsById.set(id, {
      id,
      name,
    });
  });

  return [...patientsById.values()]
    .map((patient) => ({
      ...patient,
      label: patient.name
        ? (nameOccurrences.get(patient.name) ?? 0) > 1
          ? `${patient.name} (${patient.id})`
          : patient.name
        : `Paciente ${patient.id}`,
    }))
    .sort((patientA, patientB) =>
      patientA.label.localeCompare(patientB.label, "es", { sensitivity: "base" }),
    );
}

export function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    () => window.localStorage.getItem(selectedDoctorIdKey) ?? "",
  );
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
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [appointmentMessage, setAppointmentMessage] = useState("");
  const [appointmentMessageType, setAppointmentMessageType] = useState("success");
  const [busyAppointmentId, setBusyAppointmentId] = useState("");
  const [cancelDialog, setCancelDialog] = useState(null);
  const [patientHistorySelection, setPatientHistorySelection] = useState("");
  const [patientHistory, setPatientHistory] = useState([]);
  const [patientHistoryMessage, setPatientHistoryMessage] = useState("");
  const [patientHistoryMessageType, setPatientHistoryMessageType] = useState("success");
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const visibleDoctors = useMemo(() => {
    if (user?.role !== "MEDICO") {
      return doctors;
    }

    return doctors.filter((doctor) => getItemId(doctor) === user.profileId);
  }, [doctors, user]);

  const selectedDoctor = useMemo(() => {
    if (!visibleDoctors.length) {
      return null;
    }

    if (user?.role === "MEDICO") {
      return visibleDoctors.find((doctor) => getItemId(doctor) === user.profileId) ?? visibleDoctors[0] ?? null;
    }

    return visibleDoctors.find((doctor) => getItemId(doctor) === selectedDoctorId) ?? visibleDoctors[0] ?? null;
  }, [selectedDoctorId, user, visibleDoctors]);

  const patientHistoryOptions = useMemo(
    () => buildPatientHistoryOptions(doctorAppointments),
    [doctorAppointments],
  );

  const selectedPatientHistoryOption = useMemo(
    () => patientHistoryOptions.find((option) => option.label === patientHistorySelection) ?? null,
    [patientHistoryOptions, patientHistorySelection],
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
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 60_000);

    return () => window.clearInterval(timer);
  }, []);

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
        setAppointmentMessage("");
        setAppointmentMessageType("success");

        const requests = [
          fetchDoctorAvailabilities(),
          fetchNotifications(selectedDoctor.usuario, false),
          fetchNotifications(selectedDoctor.usuario, true),
        ];

        if (user?.role === "MEDICO") {
          requests.push(fetchDoctorAppointmentsHistory(getItemId(selectedDoctor)));
        }

        const results = await Promise.all(requests);
        const [allAvailabilities, unread, read, appointments = []] = results;

        const doctorId = getItemId(selectedDoctor);
        setAvailabilities(
          allAvailabilities.filter((item) => String(item.idMedico) === String(doctorId)),
        );
        setUnreadNotifications(unwrapNotifications(unread));
        setReadNotifications(unwrapNotifications(read));
        setDoctorAppointments(Array.isArray(appointments) ? appointments : []);
      } catch (error) {
        setDetailError(handleApiError(error));
        setAvailabilities([]);
        setUnreadNotifications([]);
        setReadNotifications([]);
        setDoctorAppointments([]);
      } finally {
        setIsLoadingDetails(false);
      }
    }

    loadDetails();
  }, [selectedDoctor, user?.role]);

  async function refreshDetails() {
    if (!selectedDoctor) {
      return;
    }

    const requests = [
      fetchDoctorAvailabilities(),
      fetchNotifications(selectedDoctor.usuario, false),
      fetchNotifications(selectedDoctor.usuario, true),
    ];

    if (user?.role === "MEDICO") {
      requests.push(fetchDoctorAppointmentsHistory(getItemId(selectedDoctor)));
    }

    const results = await Promise.all(requests);
    const [allAvailabilities, unread, read, appointments = []] = results;

    const doctorId = getItemId(selectedDoctor);
    setAvailabilities(allAvailabilities.filter((item) => String(item.idMedico) === String(doctorId)));
    setUnreadNotifications(unwrapNotifications(unread));
    setReadNotifications(unwrapNotifications(read));
    setDoctorAppointments(Array.isArray(appointments) ? appointments : []);
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
      notifyNotificationsChanged();
      window.dispatchEvent(new Event("selected-doctor-changed"));
    } catch (error) {
      setNotificationMessage(handleApiError(error));
      setNotificationMessageType("error");
    } finally {
      setBusyNotificationId("");
    }
  }

  function openCancelDialog(appointmentId) {
    setAppointmentMessage("");
    setAppointmentMessageType("success");
    setCancelDialog({
      appointmentId,
      reason: "",
      error: "",
    });
  }

  function closeCancelDialog() {
    if (busyAppointmentId) {
      return;
    }

    setCancelDialog(null);
  }

  function updateCancelDialogReason(value) {
    setCancelDialog((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        reason: value,
        error: "",
      };
    });
  }

  async function handleAppointmentAction(appointmentId, action) {
    try {
      setBusyAppointmentId(`${action}:${appointmentId}`);
      setAppointmentMessage("");
      setAppointmentMessageType("success");

      if (action === "accept") {
        await acceptAppointment(appointmentId);
      } else if (action === "reject") {
        await rejectAppointment(appointmentId);
      } else if (action === "complete") {
        await markAppointmentAsCompleted(appointmentId);
      }

      await refreshDetails();
      setAppointmentMessage("Turno actualizado.");
      setAppointmentMessageType("success");
    } catch (error) {
      setAppointmentMessage(handleApiError(error));
      setAppointmentMessageType("error");
    } finally {
      setBusyAppointmentId("");
    }
  }

  async function handleDoctorCancelSubmit(event) {
    event.preventDefault();

    if (!cancelDialog) {
      return;
    }

    const trimmedReason = cancelDialog.reason.trim();

    if (!trimmedReason) {
      setCancelDialog((current) =>
        current ? { ...current, error: "El motivo es obligatorio." } : current,
      );
      return;
    }

    try {
      setBusyAppointmentId(`cancel:${cancelDialog.appointmentId}`);
      setAppointmentMessage("");
      setAppointmentMessageType("success");
      await cancelAppointmentByDoctor(cancelDialog.appointmentId, trimmedReason);
      await refreshDetails();
      setAppointmentMessage("Turno actualizado.");
      setAppointmentMessageType("success");
      setCancelDialog(null);
    } catch (error) {
      const message = handleApiError(error);
      setAppointmentMessage(message);
      setAppointmentMessageType("error");
      setCancelDialog((current) =>
        current ? { ...current, error: message } : current,
      );
    } finally {
      setBusyAppointmentId("");
    }
  }

  async function handlePatientHistorySubmit(event) {
    event.preventDefault();

    if (!selectedPatientHistoryOption) {
      return;
    }

    try {
      setPatientHistoryMessage("");
      setPatientHistoryMessageType("success");
      const history = await fetchPatientAppointmentsHistory(selectedPatientHistoryOption.id);
      setPatientHistory(Array.isArray(history) ? history : []);
      setPatientHistoryMessage("Historial cargado.");
      setPatientHistoryMessageType("success");
    } catch (error) {
      setPatientHistory([]);
      setPatientHistoryMessage(handleApiError(error));
      setPatientHistoryMessageType("error");
    }
  }

  function handlePatientHistorySelectionChange(value) {
    setPatientHistorySelection(value);
    setPatientHistory([]);
    setPatientHistoryMessage("");
    setPatientHistoryMessageType("success");
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
              <select value={selectedDoctor ? getItemId(selectedDoctor) : selectedDoctorId} onChange={handleDoctorChange} disabled={isLoadingDoctors || user?.role === "MEDICO"}>
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

      <section className="stack-lg">
        {user?.role === "MEDICO" ? (
          <article className="info-card stack-md">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Turnos</p>
                <h2>Mi historial y gestión</h2>
              </div>
              {doctorAppointments.length > 0 ? <p className="panel-copy">{doctorAppointments.length} turnos</p> : null}
            </div>

            {appointmentMessage ? (
              <div className={`alert alert-${appointmentMessageType}`}>{appointmentMessage}</div>
            ) : null}

            {doctorAppointments.length > 0 ? (
              <div className="stack-md">
                {doctorAppointments.map((appointment) => {
                  const appointmentId = getItemId(appointment);
                  const canCancel = canStillBeCanceled(appointment.fechaHora);
                  const isReserved = appointment.estado === "RESERVADO";
                  const isConfirmed = appointment.estado === "CONFIRMADO";
                  const isPast = new Date(appointment.fechaHora).getTime() <= currentTime;

                  return (
                    <article key={appointmentId} className="inline-card stack-sm">
                      <div className="panel-heading">
                        <div>
                          <strong>{formatDateTime(appointment.fechaHora)}</strong>
                          <p>{appointment.practica} · {appointment.sede}</p>
                        </div>
                        <span className="tag">{appointment.estado}</span>
                      </div>

                      <p className="muted-text">Paciente: {appointment.paciente?.nombre ?? appointment.paciente?.id ?? appointment.paciente ?? "—"}</p>

                      {user?.role === "MEDICO" ? (
                        <div className="appointment-actions">
                          {isReserved ? (
                            <>
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => handleAppointmentAction(appointmentId, "accept")}
                                disabled={busyAppointmentId === `accept:${appointmentId}`}
                              >
                                Aceptar
                              </button>
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => handleAppointmentAction(appointmentId, "reject")}
                                disabled={busyAppointmentId === `reject:${appointmentId}`}
                              >
                                Rechazar
                              </button>
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => openCancelDialog(appointmentId)}
                                disabled={busyAppointmentId === `cancel:${appointmentId}` || !canCancel}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : null}

                          {isConfirmed ? (
                            <>
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => handleAppointmentAction(appointmentId, "complete")}
                                disabled={busyAppointmentId === `complete:${appointmentId}` || !isPast}
                              >
                                Completar
                              </button>
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => openCancelDialog(appointmentId)}
                                disabled={busyAppointmentId === `cancel:${appointmentId}` || !canCancel}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="muted-text">Aún no hay turnos registrados.</p>
            )}
          </article>
        ) : null}

        {user?.role === "MEDICO" ? (
          <article className="info-card stack-md">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Historial de paciente</p>
                <h2>Consultar historial por nombre</h2>
              </div>
            </div>

            <form className="doctor-form" onSubmit={handlePatientHistorySubmit}>
              <label className="field">
                <span className="field-label">Paciente</span>
                <input
                  list="doctor-patient-history-options"
                  value={patientHistorySelection}
                  onChange={(event) => handlePatientHistorySelectionChange(event.target.value)}
                  placeholder={
                    patientHistoryOptions.length > 0
                      ? "Buscá o seleccioná un paciente"
                      : "No hay pacientes disponibles todavía"
                  }
                  disabled={patientHistoryOptions.length === 0}
                />
                <datalist id="doctor-patient-history-options">
                  {patientHistoryOptions.map((patient) => (
                    <option key={patient.id} value={patient.label} />
                  ))}
                </datalist>
              </label>

              <button
                type="submit"
                className="primary-button"
                disabled={!selectedPatientHistoryOption}
              >
                Buscar historial
              </button>
            </form>

            {!selectedPatientHistoryOption && patientHistorySelection.trim() ? (
              <p className="muted-text">Seleccioná un paciente desde las opciones sugeridas.</p>
            ) : null}

            {patientHistoryOptions.length === 0 ? (
              <p className="muted-text">
                Todavía no hay pacientes en tu historial para seleccionar.
              </p>
            ) : null}

            {patientHistoryMessage ? (
              <div className={`alert alert-${patientHistoryMessageType}`}>{patientHistoryMessage}</div>
            ) : null}

            {patientHistory.length > 0 ? (
              <div className="stack-md">
                {patientHistory.map((appointment) => (
                  <article key={getItemId(appointment)} className="inline-card stack-sm">
                    <div className="panel-heading">
                      <div>
                          <strong>{formatDateTime(appointment.fechaHora)}</strong>
                          <p>
                            {appointment.medico?.nombre ?? appointment.medico?.id ?? appointment.medico ?? "—"}
                            {" · "}
                            {appointment.practica} · {appointment.sede}
                          </p>
                        </div>
                      <span className="tag">{appointment.estado}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted-text">No se cargó ningún historial todavía.</p>
            )}
          </article>
        ) : null}

        <article className="info-card stack-md" id="notificaciones">
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
        </article>
      </section>

      <Dialog
        isOpen={Boolean(cancelDialog)}
        title="Cancelar turno"
        description="Indicá el motivo de la cancelación para notificar correctamente al paciente."
        onClose={closeCancelDialog}
        footer={(
          <>
            <button
              type="button"
              className="text-button"
              onClick={closeCancelDialog}
              disabled={Boolean(busyAppointmentId)}
            >
              Volver
            </button>
            <button
              type="submit"
              form="doctor-cancel-appointment-form"
              className="primary-button"
              disabled={Boolean(busyAppointmentId)}
            >
              {busyAppointmentId ? "Guardando..." : "Confirmar cancelación"}
            </button>
          </>
        )}
      >
        <form
          id="doctor-cancel-appointment-form"
          className="stack-md"
          onSubmit={handleDoctorCancelSubmit}
        >
          <label className="field">
            <span className="field-label">Motivo</span>
            <textarea
              rows="4"
              value={cancelDialog?.reason ?? ""}
              onChange={(event) => updateCancelDialogReason(event.target.value)}
              placeholder="Contanos por qué necesitás cancelar el turno"
              required
            />
          </label>

          {cancelDialog?.error ? (
            <div className="alert alert-error">{cancelDialog.error}</div>
          ) : null}
        </form>
      </Dialog>
    </div>
  );
}

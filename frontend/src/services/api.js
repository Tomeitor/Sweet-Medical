import axios from 'axios'
import { AUTH_TOKEN_KEY } from '../auth/constants.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

function handleApiError(error) {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((item) => item.message).join(' · ')
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Probá nuevamente.'
  }

  return 'No pudimos conectar con el backend.'
}

export async function fetchDoctors() {
  const response = await api.get('/medicos')
  return response.data
}

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data.data
}

export async function fetchCurrentSession() {
  const response = await api.get('/auth/me')
  return response.data.data
}

export async function fetchAvailableAppointments(filters) {
  const response = await api.get('/turnos/disponibles', { params: filters })
  return response.data
}

export async function createAppointment(payload) {
  const response = await api.post('/turnos', payload)
  return response.data
}

export async function fetchDoctorAppointmentsHistory(medicoId) {
  const response = await api.get(`/turnos/medicos/${medicoId}/historial`)
  return response.data
}

export async function fetchPatientAppointmentsHistory(pacienteId) {
  const response = await api.get(`/turnos/pacientes/${pacienteId}/historial`)
  return response.data
}

export async function fetchMyAppointmentsHistory(pacienteId) {
  const response = await api.get(`/turnos/historial/${pacienteId}`)
  return response.data
}

export async function cancelAppointmentByPatient(id, motivo) {
  const response = await api.delete(`/turnos/${id}`, { data: { motivo } })
  return response.data
}

export async function rescheduleAppointmentByPatient(id, fechaHora, motivo) {
  const response = await api.patch(`/turnos/${id}/cambio`, { fechaHora, motivo })
  return response.data
}

export async function proposeAppointmentChange(id, fechaHora, motivo) {
  const response = await api.patch(`/turnos/${id}/proponer-cambio`, { fechaHora, motivo })
  return response.data
}

export async function respondToAppointmentProposal(id, notificacionId, accion) {
  const response = await api.patch(`/turnos/${id}/propuesta/responder`, { notificacionId, accion })
  return response.data
}

export async function acceptAppointment(id) {
  const response = await api.patch(`/turnos/${id}/aceptar`, {})
  return response.data
}

export async function rejectAppointment(id) {
  const response = await api.patch(`/turnos/${id}/rechazar`, {})
  return response.data
}

export async function cancelAppointmentByDoctor(id, motivo) {
  const response = await api.patch(`/turnos/${id}/cancelacion-medico`, { motivo })
  return response.data
}

export async function markAppointmentAsCompleted(id) {
  const response = await api.patch(`/turnos/${id}/realizado`, {})
  return response.data
}

export async function fetchDoctorAvailabilities() {
  const response = await api.get('/disponibilidades')
  return response.data
}

export async function createAvailability(payload) {
  const response = await api.post('/disponibilidades', payload)
  return response.data
}

export async function deleteAvailability(id) {
  const response = await api.delete(`/disponibilidades/${id}`)
  return response.data
}

export async function fetchNotifications(usuarioId, leida) {
  const response = await api.get(`/notificaciones/usuarios/${usuarioId}/notificaciones`, {
    params: { leida: String(leida) },
  })

  return response.data.data ?? []
}

export async function markNotificationAsRead(usuarioId, notificacionId) {
  const response = await api.patch(`/notificaciones/usuarios/${usuarioId}/notificaciones/${notificacionId}`, {
    leida: true,
  })

  return response.data.data
}

export function notifyNotificationsChanged() {
  window.dispatchEvent(new Event('notifications-changed'))
}

export { handleApiError }

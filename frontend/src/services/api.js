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

export { handleApiError }

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  timeout: 10000,
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

export async function fetchAvailableAppointments(filters) {
  const response = await api.get('/turnos/disponibles', { params: filters })
  return response.data
}

export { handleApiError }

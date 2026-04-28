import dayjs from 'dayjs';


export function obtenerBloqueTurno(fechaOriginal, duracionMinutos = 15) {
  const base = dayjs(fechaOriginal);
  const minutosDesdeHora = base.minute();
  const bloqueActual = Math.floor(minutosDesdeHora / duracionMinutos);
  const minutosInicioBloque = bloqueActual * duracionMinutos;
  const inicio = base.second(0).millisecond(0).minute(minutosInicioBloque);
  const fin = inicio.add(duracionMinutos, 'minute');
  return { inicio, fin };
}

export function obtenerBloqueTurnoDate(fechaOriginal, duracionMinutos = 15) {
  const { inicio, fin } = obtenerBloqueTurno(fechaOriginal, duracionMinutos);
  return { inicio: inicio.toDate(), fin: fin.toDate() };
}

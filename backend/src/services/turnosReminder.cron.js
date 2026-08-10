import { TurnoService } from "./turnos.service.js";

const service = new TurnoService();
let reminderInterval = null;

async function ejecutarRecordatorios() {
  try {
    await service.generarRecordatoriosTurnosDelDiaSiguiente();
  } catch (error) {
    console.error("Error generating appointment reminders", error);
  }
}

export function iniciarRecordatoriosTurnos() {
  if (reminderInterval) {
    return;
  }

  ejecutarRecordatorios();
  reminderInterval = setInterval(ejecutarRecordatorios, 24 * 60 * 60 * 1000);
}

import { BadRequestError } from "../errors/AppError.js";

export class Notificacion {
  constructor({
    id,
    destinatario,
    remitente,
    mensaje,
    fechaHoraCreacion,
    fechaHoraLeida,
  }) {
    this.id = id;
    this.destinatario = destinatario;
    this.remitente = remitente;
    this.mensaje = mensaje;
    this.fechaHoraCreacion = fechaHoraCreacion || new Date();
    this.leida = fechaHoraLeida ? true : false;
    this.fechaHoraLeida = fechaHoraLeida || null;
    this.meta = null;
  }

  marcarComoLeida() {
    if (this.leida) {
      throw new BadRequestError("La notificación ya fue leída anteriormente");
    }
    this.leida = true;
    this.fechaHoraLeida = new Date();
  }

  desmarcarComoLeida() {
    this.leida = false;
    this.fechaHoraLeida = null;
  }

  actualizarMeta(nuevaMeta) {
    this.meta = nuevaMeta;
  }
}

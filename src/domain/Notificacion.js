import { BadRequestError } from "../errors/AppError.js";

export class Notificacion {
    constructor ({_id, id, destinatarioId, remitenteId, mensaje, fechaHoraCreacion, fechaHoraLeida, leida}) {
        this._id = _id ?? id ?? null;
        this.destinatarioId = destinatarioId;
        this.remitenteId = remitenteId;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = fechaHoraCreacion || new Date();
        this.leida = leida ?? Boolean(fechaHoraLeida);
        this.fechaHoraLeida = fechaHoraLeida || null;
    }

    marcarComoLeida() {
        if (this.leida) {
            throw new BadRequestError("La notificación ya fue leída anteriormente");
        }
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }
}

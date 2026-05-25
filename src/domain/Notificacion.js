import { BadRequestError } from "../errors/AppError.js";

export class Notificacion {
    constructor ({id, destinatarioId, remitenteId, mensaje, fechaHoraCreacion, fechaHoraLeida}) {
        this.id = id;
        this.destinatarioId = destinatarioId;
        this.remitenteId = remitenteId;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = fechaHoraCreacion || new Date();
        this.leida = fechaHoraLeida ? true : false;
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


import { NotFoundError } from "../errors/AppError.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";

export class NotificacionService {
    constructor() {
        this.repo = notificacionRepository; 
    }

    async obtenerPorEstado(usuarioId, estaLeida) {
        return await this.repo.findByDestinatarioYEstado(usuarioId, estaLeida);
    }

    async actualizarEstadoLectura(idNotificacion, usuarioId, nuevoEstadoLeida) {
        if (typeof nuevoEstadoLeida === 'undefined' && typeof usuarioId === 'boolean') {
            nuevoEstadoLeida = usuarioId;
            usuarioId = undefined;
        }

        const notificacion = await this.repo.findById(idNotificacion);
        
        if (!notificacion) {
            throw new NotFoundError(`No se encontró la notificación con ID ${idNotificacion}`);
        }

        if (usuarioId !== undefined && String(notificacion.destinatario?.id) !== String(usuarioId)) {
            throw new NotFoundError(`No se encontró la notificación con ID ${idNotificacion}`);
        }

        if (nuevoEstadoLeida === true) {
            notificacion.marcarComoLeida();
        } else {
            notificacion.desmarcarComoLeida();
        }

        await this.repo.update(notificacion);

        return notificacion;
    }
}

export const notificacionService = new NotificacionService();

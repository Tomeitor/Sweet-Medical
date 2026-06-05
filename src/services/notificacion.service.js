
import { NotFoundError } from "../errors/AppError.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";

export class NotificacionService {
    constructor() {
        this.repo = notificacionRepository; 
    }

    async obtenerPorEstado(usuarioId, estaLeida) {
        return await this.repo.findByDestinatarioYEstado(usuarioId, estaLeida);
    }

    async actualizarEstadoLectura(idNotificacion, nuevoEstadoLeida) {
        const notificacion = await this.repo.findById(idNotificacion);
        
        if (!notificacion) {
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
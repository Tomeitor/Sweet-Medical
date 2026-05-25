
import { NotFoundError } from "../errors/AppError.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";

export class NotificacionService {
    constructor() {
        this.repo = notificacionRepository; 
    }

    async obtenerSinLeer(usuarioId) {
        return await this.repo.findByDestinatarioYEstado(usuarioId, false);
    }

    async obtenerLeidas(usuarioId) {
        return await this.repo.findByDestinatarioYEstado(usuarioId, true);
    }

    async marcarComoLeida(idNotificacion) {
        const notificacion = await this.repo.findById(idNotificacion);
        
        if (!notificacion) {
            throw new NotFoundError(`No se encontró la notificación con ID ${idNotificacion}`);
        }

        notificacion.marcarComoLeida(); 

        await this.repo.update(notificacion);

        return notificacion;
    }
}

export const notificacionService = new NotificacionService();
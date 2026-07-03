import { NotificacionModel } from "../schemas/notificacionSchema.js";

export class NotificacionRepository {
    constructor() {
        this.model = NotificacionModel;
    }

    async findByDestinatarioYEstado(usuarioId, estaLeida) {
        return await this.model.find({ 'destinatario.id': usuarioId, leida: estaLeida });
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async update(notificacionActualizada) {
        return await this.model.findByIdAndUpdate(notificacionActualizada.id, notificacionActualizada, {new: true});
    }
}

export const notificacionRepository = new NotificacionRepository();

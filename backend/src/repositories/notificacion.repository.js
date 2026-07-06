import { NotificacionModel } from "../schemas/notificacionSchema.js";

export class NotificacionRepository {
    constructor() {
        this.model = NotificacionModel;
    }

    async findByDestinatarioYEstado(usuarioId, estaLeida) {
        return await this.model.find({ 'destinatario.id': usuarioId, leida: estaLeida });
    }

    async findByDestinatarioYMensaje(usuarioId, mensaje) {
        return await this.model.findOne({ 'destinatario.id': usuarioId, mensaje });
    }

    async create(notificacion) {
        return await this.model.create(notificacion);
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async update(notificacionActualizada) {
        return await this.model.findByIdAndUpdate(notificacionActualizada.id, notificacionActualizada, {new: true});
    }
}

export const notificacionRepository = new NotificacionRepository();

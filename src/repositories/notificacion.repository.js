import { NotificacionModel } from "../schemas/notificacionSchema.js";
import { ensureObjectId } from "../utils/objectId.js";

export class NotificacionRepository {
    constructor() {
        this.model = NotificacionModel;
    }

    async findByDestinatarioYEstado(usuarioId, estaLeida) {
        return await this.model.find({ destinatarioId: usuarioId, leida: estaLeida });
    }

    async findById(id) {
        ensureObjectId(id);
        return await this.model.findById(id);
    }

    async update(notificacionActualizada) {
        const id = notificacionActualizada._id ?? notificacionActualizada.id;
        ensureObjectId(id);
        return await this.model.findByIdAndUpdate(id, notificacionActualizada, {new: true, runValidators: true});
    }
}

export const notificacionRepository = new NotificacionRepository();

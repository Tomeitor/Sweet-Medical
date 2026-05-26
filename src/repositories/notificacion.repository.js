import { Notificacion } from "../domain/Notificacion.js";
import { NotificacionModel } from "../schemas/notificacionSchema.js";

export class NotificacionRepository {
    constructor() {

        const usuarioMock = { id: "123" };

        /*
        this.notificacionesDB = [
            new Notificacion({ 
                id: "notif-1", 
                destinatario: usuarioMock,
                mensaje: "Su turno de Odontología fue confirmado", 
            }),
            new Notificacion({ 
                id: "notif-2", 
                destinatario: usuarioMock, 
                mensaje: "Bienvenido a Sweet Medical", 
                fechaHoraLeida: new Date()
            })
        ];
         */

        this.model = NotificacionModel;
    }

    async findByDestinatarioYEstado(usuarioId, estaLeida) {
        /*
        return this.notificacionesDB.filter(n =>
            String(n.destinatario.id) === String(usuarioId) && 
            n.leida === estaLeida
        );
         */

        return await this.model.find({ destinatario: usuarioId, leida: estaLeida });
    }

    async findById(id) {
        //return this.notificacionesDB.find(n => String(n.id) === String(id));
        return await this.model.findById(id);
    }

    async update(notificacionActualizada) {
        /*
        const index = this.notificacionesDB.findIndex(n => String(n.id) === String(notificacionActualizada.id));
        if (index !== -1) {
            this.notificacionesDB[index] = notificacionActualizada;
        }
        return notificacionActualizada;
         */
        return await this.model.findByIdAndUpdate(notificacionActualizada.id, notificacionActualizada, {new: true});
    }
}

export const notificacionRepository = new NotificacionRepository();
import { Notificacion } from "../domain/Notificacion.js";

export class NotificacionRepository {
    constructor() {

        const usuarioMock = { id: "123" };

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
    }

    async findByDestinatarioYEstado(usuarioId, estaLeida) {
        return this.notificacionesDB.filter(n => 
            String(n.destinatario.id) === String(usuarioId) && 
            n.leida === estaLeida
        );
    }

    async findById(id) {
        return this.notificacionesDB.find(n => String(n.id) === String(id));
    }

    async update(notificacionActualizada) {
        const index = this.notificacionesDB.findIndex(n => String(n.id) === String(notificacionActualizada.id));
        if (index !== -1) {
            this.notificacionesDB[index] = notificacionActualizada;
        }
        return notificacionActualizada;
    }
}

export const notificacionRepository = new NotificacionRepository();
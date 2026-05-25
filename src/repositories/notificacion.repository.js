import { Notificacion } from "../domain/Notificacion.js";

export class NotificacionRepository {
    constructor() {
        this.nextId = 1;
        this.notificacionesDB = [
            new Notificacion({ 
                id: "notif-1", 
                destinatarioId: "123",
                mensaje: "Su turno de Odontología fue confirmado", 
            }),
            new Notificacion({ 
                id: "notif-2", 
                destinatarioId: "123", 
                mensaje: "Bienvenido a Sweet Medical", 
                fechaHoraLeida: new Date()
            })
        ]; 
    }

    async add(notificacion) {
        if (!notificacion.id) {
            notificacion.id = this.nextId++;
        }

        this.notificacionesDB.push(notificacion);
        return notificacion;
    }

    async findByDestinatarioYEstado(usuarioId, estaLeida) {
        return this.notificacionesDB.filter(n => 
            String(n.destinatarioId) === String(usuarioId) && 
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

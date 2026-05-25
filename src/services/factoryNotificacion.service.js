import { Notificacion } from "../domain/Notificacion.js"

export class factoryNotificacionService {

    constructor () {
        this.proximoId = 1
    }

    crearSegunEstadoTurno(turno) {

        const hoy = new Date()

        let mensaje = `El turno con el médico ${turno.medico.nombre} cambió su estado a ${turno.estado}.`;

        let nuevaNotificacion = new Notificacion({
            id: this.proximoId,
            destinatarioId: turno.paciente,
            remitenteId: turno.medico.id,
            mensaje,
            fechaHoraCreacion: hoy
        });

        this.proximoId += 1;
        
        return nuevaNotificacion;
    }

    crearPorCambioTurno(turno, paciente) {
        const fechaTurno = new Intl.DateTimeFormat("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(turno.fechaHora);
        const mensaje = `Tu turno con ${turno.medico.nombre} fue reprogramado para el ${fechaTurno}.`;

        const nuevaNotificacion = new Notificacion({
            id: this.proximoId,
            destinatarioId: paciente.usuarioId,
            remitenteId: turno.medico.usuarioId,
            mensaje,
            fechaHoraCreacion: new Date()
        });

        this.proximoId += 1;

        return nuevaNotificacion;
    }

}

export const factoryNotificacion = new factoryNotificacionService();

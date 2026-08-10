import { Turno } from "../domain/Turno.js"
import { Notificacion } from "../domain/Notificacion.js"

export class factoryNotificacionService {

    constructor () {
        this.proximoId = 1
    }

    crearSegunEstadoTurno(turno) {

        const hoy = new Date()

        let mensaje = `El turno con el médico ${turno.medico} cambió su estado a ${turno.estado}.`;

        let nuevaNotificacion = new Notificacion({
            id: this.proximoId,
            destinatario: { id: String(turno.paciente?.id ?? turno.paciente) },
            remitente: { id: String(turno.medico?.id ?? turno.medico) },
            mensaje,
            fechaHoraCreacion: hoy,
        });

        this.proximoId += 1;
        
        return nuevaNotificacion;
    }

}

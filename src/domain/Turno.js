import { EstadoTurno } from "./EstadoTurno.js";

export class Turno {

    constructor(id, medico, paciente, fechaHora, sede, practica, costo) {
        this.id = id;
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.costo = costo;
        this.estado = EstadoTurno.RESERVADO;
        this.historialEstados = []
    }

    actualizarEstado(nuevoEstado, quien, motivo) {
        
        if (this.estado === EstadoTurno.CANCELADO) return;

        const cambio = {
            fechaHora: new Date(),
            estado: nuevoEstado,
            quien: quien,
            motivo: motivo
        };

        this.historialEstados.push(cambio);
        this.estado = nuevoEstado;
    }
}
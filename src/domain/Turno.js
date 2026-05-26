import { EstadoTurno } from "./EstadoTurno.js";

export class Turno {

    constructor({ _id = null, medico, pacienteId, fechaHora, sede, practica, costo, estado = EstadoTurno.RESERVADO, historialEstados = [] }) {
        this._id = _id;
        this.medico = medico;
        this.pacienteId = pacienteId;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.costo = costo;
        this.estado = estado;
        this.historialEstados = historialEstados;
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

    cambiarFechaHora(nuevaFechaHora, quien, motivo) {
        const cambio = {
            fechaHora: new Date(),
            estado: this.estado,
            quien: quien,
            motivo: motivo,
            fechaHoraAnterior: this.fechaHora,
            fechaHoraNueva: nuevaFechaHora
        };

        this.historialEstados.push(cambio);
        this.fechaHora = nuevaFechaHora;
    }
}

import { es } from "zod/locales"
import { EstadoTurno } from "./estadoTurno.js";

export class TurnoDomain {

    constructor(id, medico, paciente, fechaHora, sede, practica, estado, historialDeEstados,costo) {
        this.id = id;
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = EstadoTurno.RESERVADO;
        this.historialEstados = []
    }

    actualizarEstado(nuevoEstado, quien, motivo) {
        
        if (this.estado === EstadoTurno.CANCELADO) return;

        const cambio = {
      fechaHoraIngreso: new Date(),
      estado: nuevoEstado,
      usuario: quien,
      motivo: motivo
    };

    this.historialEstados.push(cambio);
    this.estado = nuevoEstado;
    }
}
import { Turno } from '../domain/Turno.js';
import { TurnosRepository } from '../repositories/turnos.repository.js';
import { MedicoRepository } from '../repositories/medicos.repository.js';
import { DiaSemana } from '../domain/diaSemana.js';
import { EstadoTurno } from '../domain/EstadoTurno.js';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const turnosRepository = new TurnosRepository();
const medicoRepository = new MedicoRepository();

export class TurnoService {

    async darDeAlta(medicoId, pacienteId, fechaHora, sede, practica, costo) {
        const fechaTurno = new Date(fechaHora);

        const medico = medicoRepository.getById(medicoId);
        if (!medico) throw new Error("El médico no existe");

        const atiende = this.validarAgendaMedico(medico, fechaTurno);
        if (!atiende) throw new Error("El médico no atiende en ese horario");

        const ocupado = turnosRepository.findByMedicoYFecha(medicoId, fechaTurno);
        if (ocupado) throw new Error("Horario ya reservado");

        const nuevoTurno = new Turno(
            Date.now().toString(),
            medico, 
            pacienteId, 
            fechaTurno,
            sede, 
            practica, 
            costo
        );

        return turnosRepository.add(nuevoTurno);
    }

    validarAgendaMedico(medico, fecha) {
        const fechaDayjs = dayjs(fecha);
        
        const mapeoDias = [
            DiaSemana.DOMINGO, DiaSemana.LUNES, DiaSemana.MARTES, 
            DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES, DiaSemana.SABADO
        ];
        const diaDelTurno = mapeoDias[fechaDayjs.day()];
        
        const horaPedido = fechaDayjs.format('HH:mm');

        const disponibilidadEncontrada = medico.disponibilidades?.find(disp => {
            return disp.diaSemana === diaDelTurno && 
            horaPedido >= disp.desde && 
            horaPedido < disp.hasta;
        });

        return !!disponibilidadEncontrada;
    }

    async darDeBaja(turnoId) {
        const turno = turnosRepository.findById(turnoId);
        if (!turno) {
            throw new Error("El turno que querés cancelar no existe");
        }
        
        const ahora = dayjs();
        const horaDelTurno = dayjs(turno.fechaHora);
        const diferenciaHoras = horaDelTurno.diff(ahora, 'hour', true);

        if (diferenciaHoras < 1) {
            throw new Error("No podés dar de baja: falta menos de una hora para el turno");
        }

        turno.actualizarEstado(EstadoTurno.CANCELADO, "SISTEMA", "Cancelación por el usuario");
        
        return turnosRepository.update(turno);
    }

    getAll() {
        return turnosRepository.getAll();
    }

    getById(id) {
        return turnosRepository.findById(id);
    }

    getByPaciente(pacienteId) {
        return turnosRepository.getByPaciente(pacienteId);
    }
}
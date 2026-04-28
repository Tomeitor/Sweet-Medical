import { Turno } from '../domain/Turno.js';
import { turnosRepository } from '../repositories/turnos.repository.js';
import { medicoRepository } from '../repositories/medicos.repository.js';
import { disponibilidadesRepository } from '../repositories/disponibilidades.repository.js';
import { DiaSemana } from '../domain/diaSemana.js';
import { EstadoTurno } from '../domain/EstadoTurno.js';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { ConflictError, NotFoundError } from '../errors/AppError.js';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export class TurnoService {

    async darDeAlta(medicoId, pacienteId, fechaHora, sede, practica, costo) {
        const fechaTurno = new Date(fechaHora);

        const medico = await medicoRepository.getById(medicoId);
        if (!medico) throw new NotFoundError("El médico no existe");

        const atiende = await this.validarAgendaMedico(medicoId, fechaTurno);
        if (!atiende) throw new ConflictError("El médico no atiende en ese horario");

        const ocupado = turnosRepository.findByMedicoYFecha(medicoId, fechaTurno);
        if (ocupado) throw new ConflictError("Horario ya reservado");

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

    async validarAgendaMedico(medicoId, fecha) {
        const fechaDayjs = dayjs(fecha);
        
        const mapeoDias = [
            DiaSemana.DOMINGO, DiaSemana.LUNES, DiaSemana.MARTES, 
            DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES, DiaSemana.SABADO
        ];
        const diaDelTurno = mapeoDias[fechaDayjs.day()];
        
        const horaPedido = fechaDayjs.format('HH:mm');

        console.log(`Validando disponibilidad para el día ${diaDelTurno} a las ${horaPedido}`);

        const disponibilidades = disponibilidadesRepository.getByMedico(medicoId);

        const disponibilidadEncontrada = disponibilidades.find(disp => {
            return disp.diaSemana === diaDelTurno && 
            horaPedido >= disp.desde && 
            horaPedido < disp.hasta;
        });

        return !!disponibilidadEncontrada;
    }

    async darDeBaja(turnoId) {
        const turno = turnosRepository.findById(turnoId);
        if (!turno) {
            throw new NotFoundError("El turno que querés cancelar no existe");
        }
        
        const ahora = dayjs();
        const horaDelTurno = dayjs(turno.fechaHora);
        const diferenciaHoras = horaDelTurno.diff(ahora, 'hour', true).toFixed();

        if (diferenciaHoras < 1) {
            throw new ConflictError("No podés dar de baja: el turno ya pasó o falta menos de una hora para el turno");
        }

        turno.actualizarEstado(EstadoTurno.CANCELADO, "SISTEMA", "Cancelación por el usuario");
        
        return turnosRepository.update(turno);
    }

    async getAll() {
        return turnosRepository.getAll();
    }

    async getById(id) {
        return turnosRepository.findById(id);
    }

    async getByPaciente(pacienteId) {
        return turnosRepository.getByPaciente(pacienteId);
    }
}

import { Turno } from '../domain/Turno.js';
import { turnosRepository } from '../repositories/turnos.repository.js';
import { medicoRepository } from '../repositories/medicos.repository.js';
import { disponibilidadesRepository } from '../repositories/disponibilidades.repository.js';
import { notificacionRepository } from '../repositories/notificacion.repository.js';
import { factoryNotificacion } from './factoryNotificacion.service.js';
import { DiaSemana } from '../domain/DiaSemana.js';
import { EstadoTurno } from '../domain/EstadoTurno.js';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { BadRequestError, ConflictError, NotFoundError, TurnoFuturoError } from '../errors/AppError.js';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const DIAS_SEMANA = [
    DiaSemana.DOMINGO, DiaSemana.LUNES, DiaSemana.MARTES,
    DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES, DiaSemana.SABADO
];

const DURACION_TURNO_MINUTOS = 15;

export class TurnoService {

    async darDeAlta(medicoId, pacienteId, fechaHora, sede, practica, costo) {
        const fechaTurno = new Date(fechaHora);

        if (!dayjs(fechaTurno).isAfter(dayjs())) {
            throw new ConflictError("No se puede reservar un turno en el pasado");
        }

        // Validar que el horario sea en punto, y 15, y 30 o y 45
        if (!this.esHorarioValidoParaTurno(fechaTurno)) {
            throw new ConflictError("Los turnos solo pueden ser a horarios en punto, y 15, y 30 o y 45");
        }

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
        const diaDelTurno = DIAS_SEMANA[fechaDayjs.day()];
        
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

    async darDeBaja(turnoId, motivo) {
        const turno = turnosRepository.findById(turnoId);
        if (!turno) {
            throw new NotFoundError("El turno que querés cancelar no existe");
        }

        this.validarTurnoPuedeModificarse(turno, "dar de baja");

        turno.actualizarEstado(EstadoTurno.CANCELADO, "SISTEMA", motivo);

        return turnosRepository.update(turno);
    }

    async cambiarTurno(turnoId, nuevaFechaHora, motivo) {
        const turno = turnosRepository.findById(turnoId);
        if (!turno) {
            throw new NotFoundError("El turno que querés cambiar no existe");
        }

        const fechaTurnoNueva = new Date(nuevaFechaHora);
        this.validarTurnoPuedeModificarse(turno, "cambiar");

        if (!dayjs(fechaTurnoNueva).isAfter(dayjs())) {
            throw new ConflictError("No se puede cambiar a un turno en el pasado");
        }

        if (!this.esHorarioValidoParaTurno(fechaTurnoNueva)) {
            throw new ConflictError("Los turnos solo pueden ser a horarios en punto, y 15, y 30 o y 45");
        }

        const atiende = await this.validarAgendaMedico(turno.medico.id, fechaTurnoNueva);
        if (!atiende) throw new ConflictError("El médico no atiende en ese horario");

        const ocupado = turnosRepository.findByMedicoYFecha(turno.medico.id, fechaTurnoNueva);
        if (ocupado) throw new ConflictError("Horario ya reservado");

        turno.cambiarFechaHora(fechaTurnoNueva, "SISTEMA", motivo);

        const turnoActualizado = turnosRepository.update(turno);
        await this.notificarPacientePorCambioTurno(turnoActualizado);

        return turnoActualizado;
    }

    async notificarPacientePorCambioTurno(turno) {
        const paciente = await this.getPacienteById(turno.paciente);
        if (!paciente?.usuarioId) return;

        const notificacion = factoryNotificacion.crearPorCambioTurno(turno, paciente);
        await notificacionRepository.add(notificacion);
    }

    async getPacienteById(pacienteId) {
        const pacientesRepository = await this.getPacientesRepository();
        if (!pacientesRepository) return null;

        if (typeof pacientesRepository.getById === "function") {
            return pacientesRepository.getById(pacienteId);
        }

        if (typeof pacientesRepository.findById === "function") {
            return pacientesRepository.findById(pacienteId);
        }

        return null;
    }

    async getPacientesRepository() {
        try {
            const modulo = await import('../repositories/pacientes.repository.js');
            return modulo.pacientesRepository ?? modulo.pacienteRepository ?? modulo.default ?? null;
        } catch (error) {
            if (error.code === 'ERR_MODULE_NOT_FOUND' && error.message.includes('pacientes.repository.js')) {
                return null;
            }

            throw error;
        }
    }

    validarTurnoPuedeModificarse(turno, accion) {
        if (turno.estado === EstadoTurno.CANCELADO) {
            throw new ConflictError(`No se puede ${accion}: el turno ya está cancelado`);
        }

        if (turno.estado === EstadoTurno.REALIZADO) {
            throw new ConflictError(`No se puede ${accion}: el turno ya está realizado`);
        }

        const ahora = dayjs();
        const horaDelTurno = dayjs(turno.fechaHora);
        const diferenciaHoras = horaDelTurno.diff(ahora, 'hour', true);

        if (diferenciaHoras < 1) {
            throw new ConflictError(`No podés ${accion}: el turno ya pasó o falta menos de una hora para el turno`);
        }
    }

    async marcarComoRealizado(turnoId) {
        const turno = turnosRepository.findById(turnoId);
        if (!turno) {
            throw new NotFoundError("El turno no existe");
        }

        if (turno.estado === EstadoTurno.CANCELADO) {
            throw new ConflictError("No se puede marcar como realizado un turno cancelado");
        }

        if (dayjs(turno.fechaHora).isAfter(dayjs())) {
            throw new TurnoFuturoError();
        }

        turno.actualizarEstado(EstadoTurno.REALIZADO, "SISTEMA", "Turno marcado como realizado");

        return turnosRepository.update(turno);
    }

    async getAll() {
        return turnosRepository.getAll();
    }

    async getById(id) {
        return turnosRepository.findById(id);
    }

    async getHistorialPaciente(pacienteId) {
        return turnosRepository
            .findByPaciente(pacienteId)
            .sort((turnoA, turnoB) => turnoA.fechaHora.getTime() - turnoB.fechaHora.getTime());
    }

    async getTurnosDisponibles({ especialidad, practica }) {
        if (!especialidad && !practica) {
            throw new BadRequestError("Debe indicar una especialidad o una práctica");
        }

        const medicos = await medicoRepository.getAll();
        const medicosFiltrados = medicos.filter(medico => this.medicoCoincideConFiltro(medico, especialidad, practica));

        return medicosFiltrados
            .flatMap(medico => this.generarTurnosDisponiblesParaMedico(medico))
            .sort((turnoA, turnoB) => new Date(turnoA.fechaHora).getTime() - new Date(turnoB.fechaHora).getTime());
    }

    medicoCoincideConFiltro(medico, especialidad, practica) {
        const coincideEspecialidad = !especialidad || medico.especialidades
            .some(esp => esp.toLowerCase() === especialidad.toLowerCase());
        const coincidePractica = !practica || medico.practicas
            .some(prac => prac.toLowerCase() === practica.toLowerCase());

        return coincideEspecialidad && coincidePractica;
    }

    generarTurnosDisponiblesParaMedico(medico) {
        const ahora = dayjs();
        const disponibilidades = disponibilidadesRepository.getByMedico(medico.id);
        const turnosDisponibles = [];

        for (let i = 0; i < 7; i++) {
            const fecha = ahora.startOf('day').add(i, 'day');
            const diaSemana = DIAS_SEMANA[fecha.day()];
            const disponibilidadesDelDia = disponibilidades.filter(disp => disp.diaSemana === diaSemana);

            disponibilidadesDelDia.forEach(disponibilidad => {
                turnosDisponibles.push(...this.generarSlotsDisponibles(medico, disponibilidad, fecha, ahora));
            });
        }

        return turnosDisponibles;
    }

    generarSlotsDisponibles(medico, disponibilidad, fecha, ahora) {
        const [horaDesde, minutoDesde] = disponibilidad.desde.split(':').map(Number);
        const [horaHasta, minutoHasta] = disponibilidad.hasta.split(':').map(Number);
        let slot = fecha.hour(horaDesde).minute(minutoDesde).second(0).millisecond(0);
        const finDisponibilidad = fecha.hour(horaHasta).minute(minutoHasta).second(0).millisecond(0);
        const slots = [];

        while (slot.isBefore(finDisponibilidad)) {
            if (!slot.isBefore(ahora) && !turnosRepository.findByMedicoYFecha(medico.id, slot.toDate())) {
                slots.push({
                    medico: {
                        id: medico.id,
                        nombre: medico.nombre,
                        matricula: medico.matricula,
                    },
                    fechaHora: slot.toDate(),
                    diaSemana: disponibilidad.diaSemana,
                    hora: slot.format('HH:mm'),
                    especialidades: medico.especialidades,
                    practicas: medico.practicas,
                });
            }

            slot = slot.add(DURACION_TURNO_MINUTOS, 'minute');
        }

        return slots;
    }

    esHorarioValidoParaTurno(fecha) {
        return fecha instanceof Date &&
            !Number.isNaN(fecha.getTime()) &&
            fecha.getTime() % (DURACION_TURNO_MINUTOS * 60 * 1000) === 0;
    }
}

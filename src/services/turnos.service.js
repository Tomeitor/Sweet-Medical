import { TurnoDomain } from '../domain/turnos.domain.js';
import * as TurnosRepo from './turnos.repository.js';
import * as MedicosRepo from '../medicos/medicos.repository.js';
import { DiaSemana } from '../domain/diaSemana.js';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

class turnoService {

    async darDeAlta(medicoId, pacienteId, fechaHora, sede, practica, costo) {
    const fechaTurno = new Date(fechaHora);

    // 1. Buscamos al médico (Recordá que guardamos en memoria [cite: 36])
    const medico = await MedicosRepo.findById(medicoId);
    if (!medico) throw new Error("El médico no existe");

    // 2. Validamos disponibilidad horaria (La lógica que ya vimos)
    const atiende = this.validarAgendaMedico(medico, fechaTurno);
    if (!atiende) throw new Error("El médico no atiende en ese horario");

    // 3. Validamos que no esté ocupado
    const ocupado = await TurnosRepo.findByMedicoYFecha(medicoId, fechaTurno);
    if (ocupado) throw new Error("Horario ya reservado");

    // 4. Creamos el objeto final para guardar
    const nuevoTurno = new Turno(
      Date.now().toString(),
      medico, 
      pacienteId, 
      fechaTurno,
      sede, 
      practica, 
      costo
    );

    return TurnosRepo.save(nuevoTurno);
  }

  validarAgendaMedico(medico, fecha) {
    const fechaDayjs = dayjs(fecha);
    
    //mapea el número de día de Day.js (0-6) con el Enum
    const mapeoDias = [
      DiaSemana.DOMINGO, DiaSemana.LUNES, DiaSemana.MARTES, 
      DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES, DiaSemana.SABADO
    ];
    const diaDelTurno = mapeoDias[fechaDayjs.day()];
    
    const horaPedido = fechaDayjs.format('HH:mm');

    //verifica la disponibilidad en la agenda del medico 
    const disponibilidadEncontrada = medico.disponibilidades.find(disp => {
      return disp.diaSemana === diaDelTurno && 
      horaPedido >= disp.horaDesde && 
      horaPedido < disp.horaHasta;
    });

    return !!disponibilidadEncontrada;
  }

  async darDeBaja(turnoId) {
    //busca el turno en memoria
    const turno = await TurnosRepo.findById(turnoId);
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
    
    return await TurnosRepo.update(turno);
  }


}
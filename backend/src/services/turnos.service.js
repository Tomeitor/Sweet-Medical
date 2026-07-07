import { Turno } from "../domain/Turno.js";
import { turnosRepository } from "../repositories/turnos.repository.js";
import { medicoRepository } from "../repositories/medicos.repository.js";
import { disponibilidadesRepository } from "../repositories/disponibilidades.repository.js";
import {
  pacientesRepository,
  NivelCobertura,
} from "../repositories/pacientes.repository.js";
import { prestacionesRepository } from "../repositories/prestaciones.repository.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";
import { DiaSemana } from "../domain/DiaSemana.js";
import { EstadoTurno } from "../domain/EstadoTurno.js";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  TurnoFuturoError,
} from "../errors/AppError.js";

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const ARGENTINA_TZ = "America/Argentina/Buenos_Aires";

const DIAS_SEMANA = [
  DiaSemana.DOMINGO,
  DiaSemana.LUNES,
  DiaSemana.MARTES,
  DiaSemana.MIERCOLES,
  DiaSemana.JUEVES,
  DiaSemana.VIERNES,
  DiaSemana.SABADO,
];

const DURACION_TURNO_MINUTOS = 15;
const CANTIDAD_DIAS_BUSQUEDA_DEFAULT = 7;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export class TurnoService {
  construirSufijoMotivoNotificacion(motivo) {
    const motivoNormalizado = typeof motivo === "string" ? motivo.trim() : "";

    if (!motivoNormalizado) {
      return "";
    }

    return ` Motivo: ${motivoNormalizado}.`;
  }

  formatearFechaArgentina(fecha) {
    if (!fecha) return fecha;
    return dayjs(fecha).tz(ARGENTINA_TZ).format();
  }

  normalizarTurnoParaRespuesta(turno) {
    const t = turno?.toObject ? turno.toObject() : { ...turno };
    if (!t) return t;

    t.fechaHora = this.formatearFechaArgentina(t.fechaHora);

    if (Array.isArray(t.historialEstados)) {
      t.historialEstados = t.historialEstados.map((cambio) => ({
        ...cambio,
        fechaHora: this.formatearFechaArgentina(cambio.fechaHora),
        fechaHoraAnterior: this.formatearFechaArgentina(
          cambio.fechaHoraAnterior,
        ),
        fechaHoraNueva: this.formatearFechaArgentina(cambio.fechaHoraNueva),
      }));
    }

    return t;
  }

  construirResumenMedico(turno, medico) {
    const medicoTurno = turno?.medico;
    const medicoId = this.obtenerMedicoIdTurno(turno);

    if (!medico && medicoTurno && typeof medicoTurno === "object") {
      return {
        ...medicoTurno,
        id: medicoId || medicoTurno.id || medicoTurno._id,
      };
    }

    if (!medico) {
      return medicoId ? { id: medicoId } : medicoTurno;
    }

    return {
      id: this.normalizarIdEntidad(medico) || medicoId,
      nombre: medico.nombre,
      matricula: medico.matricula,
      usuario: medico.usuario,
    };
  }

  construirResumenPaciente(turno, paciente) {
    const pacienteTurno = turno?.paciente;
    const pacienteId = this.obtenerPacienteIdTurno(turno);

    if (!paciente && pacienteTurno && typeof pacienteTurno === "object") {
      return {
        ...pacienteTurno,
        id: pacienteId || pacienteTurno.id || pacienteTurno._id,
      };
    }

    if (!paciente) {
      return pacienteId ? { id: pacienteId } : pacienteTurno;
    }

    return {
      id: this.normalizarIdEntidad(paciente) || pacienteId,
      nombre: paciente.nombre,
      usuario: paciente.usuario,
    };
  }

  async enriquecerTurnosConNombres(turnos) {
    const idsMedicos = [
      ...new Set(
        turnos.map((turno) => this.obtenerMedicoIdTurno(turno)).filter(Boolean),
      ),
    ];
    const idsPacientes = [
      ...new Set(
        turnos
          .map((turno) => this.obtenerPacienteIdTurno(turno))
          .filter(Boolean),
      ),
    ];

    const [medicos, pacientes] = await Promise.all([
      Promise.all(
        idsMedicos.map(async (id) => [id, await medicoRepository.getById(id)]),
      ),
      Promise.all(
        idsPacientes.map(async (id) => [
          id,
          await pacientesRepository.getById(id),
        ]),
      ),
    ]);

    const medicosPorId = new Map(medicos);
    const pacientesPorId = new Map(pacientes);

    return turnos.map((turno) => {
      const turnoNormalizado = this.normalizarTurnoParaRespuesta(turno);
      const medicoId = this.obtenerMedicoIdTurno(turnoNormalizado);
      const pacienteId = this.obtenerPacienteIdTurno(turnoNormalizado);

      return {
        ...turnoNormalizado,
        medico: this.construirResumenMedico(
          turnoNormalizado,
          medicosPorId.get(medicoId) ?? null,
        ),
        paciente: this.construirResumenPaciente(
          turnoNormalizado,
          pacientesPorId.get(pacienteId) ?? null,
        ),
      };
    });
  }

  convertirValorIdAString(valor) {
    if (typeof valor === "string" || typeof valor === "number") {
      return String(valor).trim();
    }

    if (
      valor &&
      typeof valor === "object" &&
      typeof valor.toString === "function"
    ) {
      const representacion = valor.toString().trim();

      if (representacion && representacion !== "[object Object]") {
        return representacion;
      }
    }

    return "";
  }

  esIdValido(id) {
    if (!id) {
      return false;
    }

    return (
      OBJECT_ID_REGEX.test(id) || (!Number.isNaN(Number(id)) && Number(id) > 0)
    );
  }

  normalizarIdEntidad(entidad) {
    const candidatos = [entidad?.id, entidad?._id, entidad];

    for (const candidato of candidatos) {
      const id = this.convertirValorIdAString(candidato);

      if (this.esIdValido(id)) {
        return id;
      }
    }

    return "";
  }

  async darDeAlta(medicoId, pacienteId, fechaHora, sede, practica, costo) {
    const fechaTurno = new Date(fechaHora);

    if (!dayjs(fechaTurno).isAfter(dayjs())) {
      throw new ConflictError("No se puede reservar un turno en el pasado");
    }

    // Validar que el horario sea en punto, y 15, y 30 o y 45
    //if(fechaHora.getTime() % (15 * 60 * 1000) !== 0){
    if (!this.esHorarioValidoParaTurno(fechaTurno)) {
      throw new ConflictError(
        "Los turnos solo pueden ser a horarios en punto, y 15, y 30 o y 45",
      );
    }

    const medico = await medicoRepository.getById(medicoId);
    if (!medico) throw new NotFoundError("El médico no existe");

    const atiende = await this.validarAgendaMedico(medicoId, fechaTurno);
    if (!atiende)
      throw new ConflictError("El médico no atiende en ese horario");

    const ocupado = await turnosRepository.findByMedicoYFecha(
      medicoId,
      fechaTurno,
    );
    if (ocupado) throw new ConflictError("Horario ya reservado");

    const medicoTurnoId = this.normalizarIdEntidad(medico) || String(medicoId);

    const nuevoTurno = new Turno(
      Date.now().toString(),
      medicoTurnoId,
      { id: pacienteId },
      fechaTurno,
      sede,
      practica,
      costo,
    );

    const turnoCreado = await turnosRepository.add(nuevoTurno);
    return this.normalizarTurnoParaRespuesta(turnoCreado);
  }

  async validarAgendaMedico(medicoId, fecha) {
    const fechaDayjs = dayjs(fecha);
    const diaDelTurno = DIAS_SEMANA[fechaDayjs.day()];

    const horaPedido = fechaDayjs.format("HH:mm");

    console.log(
      `Validando disponibilidad para el día ${diaDelTurno} a las ${horaPedido}`,
    );

    const disponibilidades =
      await disponibilidadesRepository.getByMedico(medicoId);

    const disponibilidadEncontrada = disponibilidades.find((disp) => {
      return (
        disp.diaSemana === diaDelTurno &&
        horaPedido >= disp.desde &&
        horaPedido < disp.hasta
      );
    });

    return !!disponibilidadEncontrada;
  }

  obtenerPacienteIdTurno(turno) {
    return this.normalizarIdEntidad(turno?.paciente);
  }

  obtenerMedicoIdTurno(turno) {
    return this.normalizarIdEntidad(turno?.medico);
  }

  async crearNotificacionParaUsuario(usuarioId, mensaje) {
    if (!usuarioId) {
      return;
    }

    const existente = await notificacionRepository.findByDestinatarioYMensaje(
      usuarioId,
      mensaje,
    );

    if (existente) {
      return;
    }

    await notificacionRepository.create({
      destinatario: { id: usuarioId },
      remitente: { id: "SYSTEM" },
      mensaje,
      fechaHoraCreacion: new Date(),
      leida: false,
      fechaHoraLeida: null,
    });
  }

  async obtenerUsuarioPacienteTurno(turno) {
    const pacienteId = this.obtenerPacienteIdTurno(turno);

    if (!pacienteId) {
      return null;
    }

    const paciente = await pacientesRepository.getById(pacienteId);

    return paciente?.usuario ?? null;
  }

  async obtenerUsuarioMedicoTurno(turno) {
    const medicoId = this.obtenerMedicoIdTurno(turno);

    if (!medicoId) {
      return null;
    }

    const medico = await medicoRepository.getById(medicoId);

    return medico?.usuario ?? null;
  }

  async darDeBaja(turnoId, motivo, pacienteId) {
    const turno = await turnosRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError("El turno que querés cancelar no existe");
    }

    if (
      pacienteId !== undefined &&
      String(pacienteId) !== this.obtenerPacienteIdTurno(turno)
    ) {
      throw new ForbiddenError("No podés cancelar un turno que no es tuyo");
    }

    this.validarTurnoPuedeModificarse(turno, "dar de baja");

    turno.actualizarEstado(EstadoTurno.CANCELADO, "SISTEMA", motivo);

    const turnoActualizado = await turnosRepository.update(turno);
    await this.crearNotificacionParaUsuario(
      await this.obtenerUsuarioMedicoTurno(turnoActualizado),
      `El paciente canceló el turno del ${this.formatearFechaArgentina(turnoActualizado.fechaHora)}.${this.construirSufijoMotivoNotificacion(motivo)}`,
    );

    return this.normalizarTurnoParaRespuesta(turnoActualizado);
  }

  async darDeBajaPorMedico(turnoId, motivo, medicoId) {
    const turno = await turnosRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError("El turno que querés cancelar no existe");
    }

    if (
      medicoId !== undefined &&
      String(medicoId) !== this.obtenerMedicoIdTurno(turno)
    ) {
      throw new ForbiddenError("No podés cancelar un turno que no es tuyo");
    }

    this.validarTurnoPuedeModificarse(turno, "cancelar");

    turno.actualizarEstado(EstadoTurno.CANCELADO, "MEDICO", motivo);

    const turnoActualizado = await turnosRepository.update(turno);
    await this.crearNotificacionParaUsuario(
      await this.obtenerUsuarioPacienteTurno(turnoActualizado),
      `Tu turno del ${this.formatearFechaArgentina(turnoActualizado.fechaHora)} fue cancelado por el médico.${this.construirSufijoMotivoNotificacion(motivo)}`,
    );

    return this.normalizarTurnoParaRespuesta(turnoActualizado);
  }

  async aceptarTurno(turnoId, medicoId) {
    const turno = await turnosRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError("El turno no existe");
    }

    if (
      medicoId !== undefined &&
      String(medicoId) !== this.obtenerMedicoIdTurno(turno)
    ) {
      throw new ForbiddenError("No podés aceptar un turno que no es tuyo");
    }

    if (turno.estado !== EstadoTurno.RESERVADO) {
      throw new ConflictError("Solo se puede aceptar un turno reservado");
    }

    turno.actualizarEstado(EstadoTurno.CONFIRMADO, "MEDICO");

    const turnoActualizado = await turnosRepository.update(turno);
    await this.crearNotificacionParaUsuario(
      await this.obtenerUsuarioPacienteTurno(turnoActualizado),
      `Tu turno del ${this.formatearFechaArgentina(turnoActualizado.fechaHora)} fue confirmado por el médico.`,
    );

    return this.normalizarTurnoParaRespuesta(turnoActualizado);
  }

  async rechazarTurno(turnoId, medicoId) {
    const turno = await turnosRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError("El turno no existe");
    }

    if (
      medicoId !== undefined &&
      String(medicoId) !== this.obtenerMedicoIdTurno(turno)
    ) {
      throw new ForbiddenError("No podés rechazar un turno que no es tuyo");
    }

    if (turno.estado !== EstadoTurno.RESERVADO) {
      throw new ConflictError("Solo se puede rechazar un turno reservado");
    }

    turno.actualizarEstado(EstadoTurno.RECHAZADO, "MEDICO");

    const turnoActualizado = await turnosRepository.update(turno);
    return this.normalizarTurnoParaRespuesta(turnoActualizado);
  }

  async cambiarTurno(turnoId, nuevaFechaHora, motivo, pacienteId) {
    const turno = await turnosRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError("El turno que querés cambiar no existe");
    }

    const fechaTurnoNueva = new Date(nuevaFechaHora);
    if (
      pacienteId !== undefined &&
      String(pacienteId) !== this.obtenerPacienteIdTurno(turno)
    ) {
      throw new ForbiddenError("No podés cambiar un turno que no es tuyo");
    }

    this.validarTurnoPuedeModificarse(turno, "cambiar");

    if (!dayjs(fechaTurnoNueva).isAfter(dayjs())) {
      throw new ConflictError("No se puede cambiar a un turno en el pasado");
    }

    if (!this.esHorarioValidoParaTurno(fechaTurnoNueva)) {
      throw new ConflictError(
        "Los turnos solo pueden ser a horarios en punto, y 15, y 30 o y 45",
      );
    }

    const medicoIdTurno = this.obtenerMedicoIdTurno(turno);

    const atiende = await this.validarAgendaMedico(
      medicoIdTurno,
      fechaTurnoNueva,
    );
    if (!atiende)
      throw new ConflictError("El médico no atiende en ese horario");

    const ocupado = await turnosRepository.findByMedicoYFecha(
      medicoIdTurno,
      fechaTurnoNueva,
    );
    if (ocupado) throw new ConflictError("Horario ya reservado");

    turno.cambiarFechaHora(fechaTurnoNueva, "SISTEMA", motivo);

    const turnoActualizado = await turnosRepository.update(turno);
    return this.normalizarTurnoParaRespuesta(turnoActualizado);
  }

  async proponerCambio(turnoId, nuevaFechaHora, motivo, medicoId) {
    const turno = await turnosRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError("El turno que querés modificar no existe");
    }

    if (
      medicoId !== undefined &&
      String(medicoId) !== this.obtenerMedicoIdTurno(turno)
    ) {
      throw new ForbiddenError(
        "No podés proponer cambios para un turno que no es tuyo",
      );
    }

    this.validarTurnoPuedeModificarse(turno, "proponer cambio");

    const fechaTurnoNueva = new Date(nuevaFechaHora);

    if (!dayjs(fechaTurnoNueva).isAfter(dayjs())) {
      throw new ConflictError("No se puede proponer un turno en el pasado");
    }

    if (!this.esHorarioValidoParaTurno(fechaTurnoNueva)) {
      throw new ConflictError(
        "Los turnos solo pueden ser a horarios en punto, y 15, y 30 o y 45",
      );
    }

    const medicoIdTurno = this.obtenerMedicoIdTurno(turno);

    const atiende = await this.validarAgendaMedico(
      medicoIdTurno,
      fechaTurnoNueva,
    );
    if (!atiende)
      throw new ConflictError("El médico no atiende en ese horario");

    const ocupado = await turnosRepository.findByMedicoYFecha(
      medicoIdTurno,
      fechaTurnoNueva,
    );
    if (ocupado) throw new ConflictError("Horario ya reservado");

    // Crear notificación para el paciente con la propuesta
    const pacienteUsuario = await this.obtenerUsuarioPacienteTurno(turno);
    const mensaje =
      `El médico propone cambiar tu turno del ${this.formatearFechaArgentina(turno.fechaHora)} al ${this.formatearFechaArgentina(fechaTurnoNueva)}.` +
      this.construirSufijoMotivoNotificacion(motivo);

    const notificacionCreada = await notificacionRepository.create({
      destinatario: { id: pacienteUsuario },
      remitente: { id: await this.obtenerUsuarioMedicoTurno(turno) },
      mensaje,
      fechaHoraCreacion: new Date(),
      leida: false,
      fechaHoraLeida: null,
      meta: {
        tipo: "propuesta_cambio",
        turnoId: String(turno.id ?? turno._id),
        fechaHoraPropuesta: fechaTurnoNueva,
        motivo: motivo,
        estado: "PENDIENTE",
      },
    });

    return notificacionCreada;
  }

  async responderPropuesta(notificacionId, accion, usuarioId) {
    const notificacion = await notificacionRepository.findById(notificacionId);
    if (!notificacion) throw new NotFoundError("Notificación no encontrada");

    if (String(notificacion.destinatario?.id) !== String(usuarioId)) {
      throw new ForbiddenError(
        "No podés responder una notificación que no es tuya",
      );
    }

    const meta = notificacion.meta || {};
    if (meta.tipo !== "propuesta_cambio") {
      throw new BadRequestError(
        "La notificación no corresponde a una propuesta de cambio",
      );
    }

    if (meta.estado !== "PENDIENTE") {
      throw new ConflictError("La propuesta ya fue respondida");
    }

    const turno = await turnosRepository.findById(meta.turnoId);
    if (!turno) throw new NotFoundError("Turno asociado no encontrado");

    if (accion === "ACEPTAR") {
      // volver a verificar disponibilidad
      const fechaNueva = new Date(meta.fechaHoraPropuesta);
      const medicoIdTurno = this.obtenerMedicoIdTurno(turno);
      const ocupado = await turnosRepository.findByMedicoYFecha(
        medicoIdTurno,
        fechaNueva,
      );
      if (ocupado) throw new ConflictError("Horario ya reservado");

      turno.cambiarFechaHora(
        fechaNueva,
        "PACIENTE",
        `Aceptó propuesta. ${meta.motivo ?? ""}`,
      );
      const turnoActualizado = await turnosRepository.update(turno);

      // actualizar notificacion meta
      meta.estado = "ACEPTADA";
      notificacion.actualizarMeta(meta);
      notificacion.marcarComoLeida();
      await notificacionRepository.update(notificacion);

      // notificar al medico
      await this.crearNotificacionParaUsuario(
        await this.obtenerUsuarioMedicoTurno(turnoActualizado),
        `El paciente aceptó el cambio del turno al ${this.formatearFechaArgentina(turnoActualizado.fechaHora)}.`,
      );

      return this.normalizarTurnoParaRespuesta(turnoActualizado);
    } else if (accion === "RECHAZAR") {
      meta.estado = "RECHAZADA";
      notificacion.actualizarMeta(meta);
      notificacion.marcarComoLeida();
      await notificacionRepository.update(notificacion);

      // notificar al medico
      await this.crearNotificacionParaUsuario(
        await this.obtenerUsuarioMedicoTurno(turno),
        `El paciente rechazó la propuesta de cambio para el turno del ${this.formatearFechaArgentina(turno.fechaHora)}.`,
      );

      return { message: "Propuesta rechazada" };
    } else {
      throw new BadRequestError("Acción inválida. Debe ser ACEPTAR o RECHAZAR");
    }
  }

  validarTurnoPuedeModificarse(turno, accion) {
    if (
      [
        EstadoTurno.CANCELADO,
        EstadoTurno.REALIZADO,
        EstadoTurno.RECHAZADO,
      ].includes(turno.estado)
    ) {
      throw new ConflictError(
        `No se puede ${accion}: el turno ya no se puede modificar`,
      );
    }

    const ahora = dayjs();
    const horaDelTurno = dayjs(turno.fechaHora);
    const diferenciaHoras = horaDelTurno.diff(ahora, "hour", true);

    if (diferenciaHoras < 1) {
      throw new ConflictError(
        `No podés ${accion}: el turno ya pasó o falta menos de una hora para el turno`,
      );
    }
  }

  async marcarComoRealizado(turnoId, medicoId) {
    const turno = await turnosRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError("El turno no existe");
    }

    if (
      medicoId !== undefined &&
      String(medicoId) !== this.obtenerMedicoIdTurno(turno)
    ) {
      throw new ForbiddenError(
        "No podés marcar como realizado un turno de otro médico",
      );
    }

    if (turno.estado === EstadoTurno.REALIZADO) {
      throw new ConflictError("El turno ya está marcado como realizado");
    }

    if (turno.estado !== EstadoTurno.CONFIRMADO) {
      throw new ConflictError(
        "Solo se puede marcar como realizado un turno confirmado",
      );
    }

    if (dayjs(turno.fechaHora).isAfter(dayjs())) {
      throw new TurnoFuturoError();
    }

    turno.actualizarEstado(
      EstadoTurno.REALIZADO,
      "SISTEMA",
      "Turno marcado como realizado",
    );

    const turnoActualizado = await turnosRepository.update(turno);
    return this.normalizarTurnoParaRespuesta(turnoActualizado);
  }

  async getAll() {
    return await turnosRepository.getAll();
  }

  async getById(id) {
    const turno = await turnosRepository.findById(id);
    return this.normalizarTurnoParaRespuesta(turno);
  }

  async getHistorialPaciente(pacienteId) {
    const turnos = await turnosRepository.findByPaciente(pacienteId);
    return this.enriquecerTurnosConNombres(
      turnos.sort(
        (turnoA, turnoB) =>
          turnoA.fechaHora.getTime() - turnoB.fechaHora.getTime(),
      ),
    );
  }

  async getHistorialMedico(medicoId) {
    const turnos = await turnosRepository.findByMedico(medicoId);
    return this.enriquecerTurnosConNombres(
      turnos.sort(
        (turnoA, turnoB) =>
          turnoB.fechaHora.getTime() - turnoA.fechaHora.getTime(),
      ),
    );
  }

  async generarRecordatoriosTurnosDelDiaSiguiente() {
    const manana = dayjs().tz(ARGENTINA_TZ).add(1, "day");
    const inicioManana = manana.startOf("day");
    const finManana = manana.endOf("day");
    const turnos = await turnosRepository.getAll();

    const turnosDelDiaSiguiente = turnos.filter((turno) => {
      if (
        ![EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO].includes(turno.estado)
      ) {
        return false;
      }

      return dayjs(turno.fechaHora)
        .tz(ARGENTINA_TZ)
        .isBetween(inicioManana, finManana, null, "[]");
    });

    for (const turno of turnosDelDiaSiguiente) {
      const mensaje = `Recordatorio: tenés un turno mañana a las ${dayjs(turno.fechaHora).tz(ARGENTINA_TZ).format("HH:mm")}.`;
      const medicoUsuarioId = await this.obtenerUsuarioMedicoTurno(turno);
      const pacienteUsuarioId = await this.obtenerUsuarioPacienteTurno(turno);

      await Promise.all([
        this.crearNotificacionParaUsuario(medicoUsuarioId, mensaje),
        this.crearNotificacionParaUsuario(pacienteUsuarioId, mensaje),
      ]);
    }
  }

  async getTurnosDisponibles(filtros) {
    const paciente = await pacientesRepository.getById(filtros.pacienteId);
    if (!paciente) {
      throw new NotFoundError("El paciente no existe");
    }

    const rangoFechas = this.normalizarRangoFechas(
      filtros.fechaDesde,
      filtros.fechaHasta,
    );
    const medicos = await medicoRepository.getAll();
    const medicosFiltrados = medicos.filter((medico) =>
      this.medicoCoincideConFiltro(medico, filtros),
    );

    const resultados = await Promise.all(
      medicosFiltrados.map((medico) =>
        this.generarTurnosDisponiblesParaMedicoConBusqueda(
          medico,
          filtros,
          paciente,
          rangoFechas,
        ),
      ),
    );
    const items = resultados
      .flat()
      .sort((turnoA, turnoB) =>
        this.compararTurnosDisponibles(
          turnoA,
          turnoB,
          filtros.ordenarPor,
          filtros.orden,
        ),
      );

    return this.paginarTurnosDisponibles(
      items,
      filtros.page,
      filtros.limit,
      filtros.ordenarPor,
      filtros.orden,
    );
  }

  medicoCoincideConFiltro(
    medico,
    { medicoId, especialidad, practica, sede, q },
  ) {
    const coincideMedico = !medicoId || String(medico.id) === String(medicoId);
    const coincideEspecialidad =
      !especialidad ||
      medico.especialidades.some(
        (esp) => esp.toLowerCase() === especialidad.toLowerCase(),
      );
    const coincidePractica =
      !practica ||
      medico.practicas.some(
        (prac) => prac.toLowerCase() === practica.toLowerCase(),
      );
    const coincideSede =
      !sede ||
      medico.sedes.some(
        (sedeMedico) => String(sedeMedico).toLowerCase() === sede.toLowerCase(),
      );

    let coincideTexto = true;
    if (q) {
      const termino = q.trim().toLowerCase();
      coincideTexto =
        medico.nombre.toLowerCase().includes(termino) ||
        medico.matricula.toLowerCase().includes(termino) ||
        medico.especialidades.some((esp) =>
          esp.toLowerCase().includes(termino),
        ) ||
        medico.practicas.some((prac) => prac.toLowerCase().includes(termino)) ||
        medico.sedes.some((sed) => String(sed).toLowerCase().includes(termino));
    }

    return (
      coincideMedico &&
      coincideEspecialidad &&
      coincidePractica &&
      coincideSede &&
      coincideTexto
    );
  }

  async generarTurnosDisponiblesParaMedicoConBusqueda(
    medico,
    filtros,
    paciente,
    rangoFechas,
  ) {
    const disponibilidades = await disponibilidadesRepository.getByMedico(
      medico.id,
    );
    const turnosDisponibles = [];
    const sedes = this.obtenerSedesAplicables(medico, filtros.sede);
    const duracionTurno = this.obtenerDuracionTurnoMedico(medico);

    if (sedes.length === 0) {
      return turnosDisponibles;
    }

    // Determina qué prestaciones mostrar según filtros o búsqueda
    let prestacionesAMostrar = [];

    if (filtros.especialidad) {
      const espec = prestacionesRepository.getEspecialidadByNombre(
        filtros.especialidad,
      );
      if (!espec)
        throw new BadRequestError("La especialidad indicada no existe");
      prestacionesAMostrar = [
        { tipo: "especialidad", nombre: espec.nombre, costo: espec.costo },
      ];
    } else if (filtros.practica) {
      const prac = prestacionesRepository.getPracticaByNombre(filtros.practica);
      if (!prac) throw new BadRequestError("La práctica indicada no existe");
      prestacionesAMostrar = [
        { tipo: "practica", nombre: prac.nombre, costo: prac.costo },
      ];
    } else if (filtros.q) {
      // Búsqueda por texto: encuentra prestaciones que coincidan con el médico y el texto
      prestacionesAMostrar = this.obtenerPrestacionesPorBusqueda(
        medico,
        filtros.q,
      );
    } else {
      // "Buscar todos": todas las prestaciones del médico
      medico.especialidades.forEach((esp) => {
        const especObj = prestacionesRepository.getEspecialidadByNombre(esp);
        if (especObj) {
          prestacionesAMostrar.push({
            tipo: "especialidad",
            nombre: especObj.nombre,
            costo: especObj.costo,
          });
        }
      });
      medico.practicas.forEach((prac) => {
        const pracObj = prestacionesRepository.getPracticaByNombre(prac);
        if (pracObj) {
          prestacionesAMostrar.push({
            tipo: "practica",
            nombre: pracObj.nombre,
            costo: pracObj.costo,
          });
        }
      });
    }

    if (prestacionesAMostrar.length === 0) {
      return turnosDisponibles;
    }

    let fecha = rangoFechas.desde.startOf("day");
    const ultimaFecha = rangoFechas.hasta.endOf("day");

    while (fecha.isBefore(ultimaFecha) || fecha.isSame(ultimaFecha, "day")) {
      const diaSemana = DIAS_SEMANA[fecha.day()];
      const disponibilidadesDelDia = disponibilidades.filter(
        (disp) => disp.diaSemana === diaSemana,
      );

      for (const disponibilidad of disponibilidadesDelDia) {
        const slots = await this.generarSlotsDisponiblesConPrestaciones(
          medico,
          disponibilidad,
          fecha,
          rangoFechas,
          sedes,
          paciente,
          prestacionesAMostrar,
          filtros,
          duracionTurno,
        );
        turnosDisponibles.push(...slots);
      }

      fecha = fecha.add(1, "day");
    }

    return turnosDisponibles;
  }

  async generarSlotsDisponiblesConPrestaciones(
    medico,
    disponibilidad,
    fecha,
    rangoFechas,
    sedes,
    paciente,
    prestaciones,
    filtros,
    duracionTurno,
  ) {
    const [horaDesde, minutoDesde] = disponibilidad.desde
      .split(":")
      .map(Number);
    const [horaHasta, minutoHasta] = disponibilidad.hasta
      .split(":")
      .map(Number);
    let slot = fecha
      .hour(horaDesde)
      .minute(minutoDesde)
      .second(0)
      .millisecond(0);
    const finDisponibilidad = fecha
      .hour(horaHasta)
      .minute(minutoHasta)
      .second(0)
      .millisecond(0);
    const slots = [];

    while (slot.isBefore(finDisponibilidad)) {
      const finSlot = slot.add(duracionTurno, "minute");

      if (finSlot.isAfter(finDisponibilidad)) {
        break;
      }

      if (
        !slot.isBefore(rangoFechas.desde) &&
        !slot.isAfter(rangoFechas.hasta) &&
        !(await turnosRepository.findByMedicoYFecha(medico.id, slot.toDate()))
      ) {
        prestaciones.forEach((prestacion) => {
          const cobertura = this.obtenerCoberturaPaciente(paciente, prestacion);
          const costoPaciente = this.calcularCostoPaciente(
            prestacion.costo,
            cobertura,
          );

          sedes.forEach((sede) => {
            slots.push({
              medico: {
                id: medico.id,
                nombre: medico.nombre,
                matricula: medico.matricula,
              },
              especialidad:
                prestacion.tipo === "especialidad" ? prestacion.nombre : null,
              practica:
                prestacion.tipo === "practica" ? prestacion.nombre : null,
              fechaHora: slot.toDate(),
              diaSemana: disponibilidad.diaSemana,
              hora: slot.format("HH:mm"),
              sede,
              cobertura,
              costoBase: prestacion.costo,
              costoPaciente,
            });
          });
        });
      }

      slot = slot.add(duracionTurno, "minute");
    }

    return slots;
  }

  obtenerPrestacionesPorBusqueda(medico, queryText) {
    const termino = queryText.trim().toLowerCase();
    const prestaciones = [];
    const agregarUnique = (tipo, nombre, costo) => {
      if (!prestaciones.some((p) => p.tipo === tipo && p.nombre === nombre)) {
        prestaciones.push({ tipo, nombre, costo });
      }
    };

    // Búsqueda en especialidades del médico
    medico.especialidades.forEach((esp) => {
      if (esp.toLowerCase().includes(termino)) {
        const especObj = prestacionesRepository.getEspecialidadByNombre(esp);
        if (especObj) {
          agregarUnique("especialidad", especObj.nombre, especObj.costo);
        }
      }
    });

    // Búsqueda en prácticas del médico
    medico.practicas.forEach((prac) => {
      if (prac.toLowerCase().includes(termino)) {
        const pracObj = prestacionesRepository.getPracticaByNombre(prac);
        if (pracObj) {
          agregarUnique("practica", pracObj.nombre, pracObj.costo);
        }
      }
    });

    // Si el nombre del médico o matrícula coinciden, mostrar todas sus prestaciones
    const coincideNombre = medico.nombre.toLowerCase().includes(termino);
    const coincideMatricula = medico.matricula.toLowerCase().includes(termino);

    if (coincideNombre || coincideMatricula) {
      medico.especialidades.forEach((esp) => {
        const especObj = prestacionesRepository.getEspecialidadByNombre(esp);
        if (especObj) {
          agregarUnique("especialidad", especObj.nombre, especObj.costo);
        }
      });
      medico.practicas.forEach((prac) => {
        const pracObj = prestacionesRepository.getPracticaByNombre(prac);
        if (pracObj) {
          agregarUnique("practica", pracObj.nombre, pracObj.costo);
        }
      });
    }

    // Búsqueda en sedes
    medico.sedes.forEach((sede) => {
      if (String(sede).toLowerCase().includes(termino)) {
        medico.especialidades.forEach((esp) => {
          const especObj = prestacionesRepository.getEspecialidadByNombre(esp);
          if (especObj) {
            agregarUnique("especialidad", especObj.nombre, especObj.costo);
          }
        });
        medico.practicas.forEach((prac) => {
          const pracObj = prestacionesRepository.getPracticaByNombre(prac);
          if (pracObj) {
            agregarUnique("practica", pracObj.nombre, pracObj.costo);
          }
        });
      }
    });

    return prestaciones;
  }

  normalizarRangoFechas(fechaDesde, fechaHasta) {
    const desde = fechaDesde ? dayjs(fechaDesde) : dayjs();
    const hasta = fechaHasta
      ? dayjs(fechaHasta)
      : desde.add(CANTIDAD_DIAS_BUSQUEDA_DEFAULT - 1, "day").endOf("day");

    if (hasta.isBefore(desde)) {
      throw new BadRequestError(
        "La fechaHasta no puede ser anterior a fechaDesde",
      );
    }

    return { desde, hasta };
  }

  obtenerSedesAplicables(medico, sede) {
    if (!sede) {
      return medico.sedes;
    }

    return medico.sedes.filter(
      (sedeMedico) => String(sedeMedico).toLowerCase() === sede.toLowerCase(),
    );
  }

  obtenerDuracionTurnoMedico(medico) {
    const duracionesEspecialidad = medico.especialidades
      .map(
        (especialidad) =>
          prestacionesRepository.getEspecialidadByNombre(especialidad)
            ?.duracionTurnoMinutos,
      )
      .filter((duracion) => Number.isInteger(duracion));

    const duracionesPractica = medico.practicas
      .map(
        (practica) =>
          prestacionesRepository.getPracticaByNombre(practica)
            ?.duracionTurnoMinutos,
      )
      .filter((duracion) => Number.isInteger(duracion));

    return Math.max(
      DURACION_TURNO_MINUTOS,
      ...duracionesEspecialidad,
      ...duracionesPractica,
    );
  }

  obtenerCoberturaPaciente(paciente, prestacion) {
    const coberturas =
      prestacion.tipo === "practica"
        ? paciente.plan.coberturasPractica
        : paciente.plan.coberturasEspecialidad;
    const propiedad =
      prestacion.tipo === "practica" ? "practica" : "especialidad";

    return (
      coberturas.find(
        (cobertura) =>
          cobertura[propiedad].toLowerCase() ===
          prestacion.nombre.toLowerCase(),
      )?.nivel ?? NivelCobertura.NO_CUBIERTA
    );
  }

  calcularCostoPaciente(costoBase, cobertura) {
    switch (cobertura) {
      case NivelCobertura.TOTAL:
        return 0;
      case NivelCobertura.PARCIAL:
        return costoBase / 2;
      default:
        return costoBase;
    }
  }

  compararTurnosDisponibles(turnoA, turnoB, ordenarPor, orden) {
    const factorOrden = orden === "desc" ? -1 : 1;

    if (ordenarPor === "costo") {
      const diferenciaCosto =
        (turnoA.costoPaciente - turnoB.costoPaciente) * factorOrden;
      if (diferenciaCosto !== 0) {
        return diferenciaCosto;
      }
    }

    return (
      (new Date(turnoA.fechaHora).getTime() -
        new Date(turnoB.fechaHora).getTime()) *
      factorOrden
    );
  }

  paginarTurnosDisponibles(items, page, limit, ordenarPor, orden) {
    const total = items.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const desde = (page - 1) * limit;
    const hasta = desde + limit;

    return {
      items: items.slice(desde, hasta),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      sort: {
        ordenarPor,
        orden,
      },
    };
  }

  esHorarioValidoParaTurno(fecha) {
    return (
      fecha instanceof Date &&
      !Number.isNaN(fecha.getTime()) &&
      fecha.getTime() % (DURACION_TURNO_MINUTOS * 60 * 1000) === 0
    );
  }
}

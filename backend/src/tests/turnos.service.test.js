import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import dayjs from "dayjs";

import { TurnoService } from "../services/turnos.service.js";
import { DiaSemana } from "../domain/DiaSemana.js";
import { EstadoTurno } from "../domain/EstadoTurno.js";
import { Turno } from "../domain/Turno.js";
import { medicoRepository } from "../repositories/medicos.repository.js";
import { disponibilidadesRepository } from "../repositories/disponibilidades.repository.js";
import { turnosRepository } from "../repositories/turnos.repository.js";
import { pacientesRepository } from "../repositories/pacientes.repository.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";

const obtenerProximoDia = (diaSemana, hora, minuto = 0) => {
  let fecha = dayjs()
    .day(diaSemana)
    .hour(hora)
    .minute(minuto)
    .second(0)
    .millisecond(0);

  if (!fecha.isAfter(dayjs())) {
    fecha = fecha.add(7, "day");
  }

  return fecha;
};

const medicoMock = {
  id: 1,
  nombre: "Dra. Ana Gómez",
  matricula: "12345",
  especialidades: ["Cardiologia"],
  practicas: ["Electrocardiograma"],
  sedes: ["Sede Centro"],
};

const disponibilidadesMock = [
  DiaSemana.DOMINGO,
  DiaSemana.LUNES,
  DiaSemana.MARTES,
  DiaSemana.MIERCOLES,
  DiaSemana.JUEVES,
  DiaSemana.VIERNES,
  DiaSemana.SABADO,
].map((diaSemana) => ({
  diaSemana,
  desde: "08:00",
  hasta: "09:00",
}));

afterEach(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.spyOn(pacientesRepository, "getById").mockImplementation(async (id) => {
    if (String(id) === "999") {
      return null;
    }

    return {
      id: String(id),
      plan: {
        coberturasEspecialidad: [
          { especialidad: "Cardiologia", nivel: "TOTAL" },
        ],
        coberturasPractica: [
          { practica: "Electrocardiograma", nivel: "PARCIAL" },
        ],
      },
    };
  });

  jest.spyOn(medicoRepository, "getAll").mockResolvedValue([medicoMock]);
  jest.spyOn(medicoRepository, "getById").mockResolvedValue(medicoMock);
  jest
    .spyOn(disponibilidadesRepository, "getByMedico")
    .mockResolvedValue(disponibilidadesMock);
  jest.spyOn(turnosRepository, "findByMedicoYFecha").mockResolvedValue(null);
  jest.spyOn(notificacionRepository, "findByDestinatarioYMensaje").mockResolvedValue(null);
  jest.spyOn(notificacionRepository, "create").mockResolvedValue({});
});

describe("TurnoService", () => {
  describe("getTurnosDisponibles", () => {
    it("debe retornar turnos disponibles con cobertura, costo y paginacion", async () => {
      const service = new TurnoService();

      const resultado = await service.getTurnosDisponibles({
        pacienteId: "1",
        especialidad: "Cardiologia",
        fechaDesde: dayjs().toDate(),
        fechaHasta: dayjs().add(7, "day").endOf("day").toDate(),
        page: 1,
        limit: 5,
        ordenarPor: "fecha",
        orden: "asc",
      });

      expect(resultado.items.length).toBeGreaterThan(0);
      expect(resultado.pagination.page).toBe(1);
      expect(resultado.pagination.limit).toBe(5);
      expect(resultado.items[0]).toEqual(
        expect.objectContaining({
          especialidad: "Cardiologia",
          practica: null,
          cobertura: "TOTAL",
          costoBase: 15000,
          costoPaciente: 0,
        }),
      );
    });

    it("debe lanzar error si fechaHasta es anterior a fechaDesde", async () => {
      const service = new TurnoService();

      await expect(
        service.getTurnosDisponibles({
          pacienteId: "1",
          especialidad: "Cardiologia",
          fechaDesde: dayjs().add(5, "day").toDate(),
          fechaHasta: dayjs().add(1, "day").toDate(),
          page: 1,
          limit: 10,
          ordenarPor: "fecha",
          orden: "asc",
        }),
      ).rejects.toThrow("La fechaHasta no puede ser anterior a fechaDesde");
    });

    it("debe lanzar error si el paciente no existe", async () => {
      const service = new TurnoService();

      await expect(
        service.getTurnosDisponibles({
          pacienteId: "999",
          especialidad: "Cardiologia",
          fechaDesde: dayjs().toDate(),
          fechaHasta: dayjs().add(7, "day").endOf("day").toDate(),
          page: 1,
          limit: 10,
          ordenarPor: "fecha",
          orden: "asc",
        }),
      ).rejects.toThrow("El paciente no existe");
    });

    it("debe calcular cobertura parcial para practicas", async () => {
      const service = new TurnoService();

      const resultado = await service.getTurnosDisponibles({
        pacienteId: "1",
        practica: "Electrocardiograma",
        fechaDesde: dayjs().toDate(),
        fechaHasta: dayjs().add(7, "day").endOf("day").toDate(),
        page: 1,
        limit: 5,
        ordenarPor: "fecha",
        orden: "asc",
      });

      expect(resultado.items.length).toBeGreaterThan(0);
      expect(resultado.items[0]).toEqual(
        expect.objectContaining({
          especialidad: null,
          practica: "Electrocardiograma",
          cobertura: "PARCIAL",
          costoBase: 25000,
          costoPaciente: 12500,
        }),
      );
    });

    it("debe excluir slots ya reservados", async () => {
      const service = new TurnoService();
      const fechaReservada = obtenerProximoDia(2, 8, 0).toDate();

      turnosRepository.findByMedicoYFecha.mockImplementation(
        (medicoId, fecha) => {
          if (
            String(medicoId) === "1" &&
            fecha.getTime() === fechaReservada.getTime()
          ) {
            const turno = new Turno(
              "1",
              { id: 1, nombre: "Dra. Ana Gómez", matricula: "12345" },
              "1",
              fechaReservada,
              "Sede Centro",
              null,
              15000,
            );
            turno.estado = EstadoTurno.RESERVADO;
            return turno;
          }

          return null;
        },
      );

      const resultado = await service.getTurnosDisponibles({
        pacienteId: "1",
        especialidad: "Cardiologia",
        fechaDesde: fechaReservada,
        fechaHasta: dayjs(fechaReservada).endOf("day").toDate(),
        page: 1,
        limit: 20,
        ordenarPor: "fecha",
        orden: "asc",
      });

      expect(
        resultado.items.some(
          (item) =>
            item.medico.id === 1 &&
            item.fechaHora.getTime() === fechaReservada.getTime(),
        ),
      ).toBe(false);
    });
  });

  describe("darDeAlta", () => {
    it("debe rechazar horarios fuera de bloques de 15 minutos", async () => {
      const service = new TurnoService();
      const fechaInvalida = obtenerProximoDia(2, 8, 10).toDate();

      await expect(
        service.darDeAlta(1, "1", fechaInvalida, "Sede Centro", null, 15000),
      ).rejects.toThrow(
        "Los turnos solo pueden ser a horarios en punto, y 15, y 30 o y 45",
      );
    });

    it("debe persistir el medico del turno como id compatible con el schema", async () => {
      const service = new TurnoService();
      const fechaValida = obtenerProximoDia(2, 8, 0).toDate();
      const medicoDoc = {
        ...medicoMock,
        id: "507f1f77bcf86cd799439011",
        _id: "507f1f77bcf86cd799439011",
      };

      medicoRepository.getById.mockResolvedValue(medicoDoc);
      jest.spyOn(turnosRepository, "add").mockImplementation(async (turno) => turno);

      await service.darDeAlta(
        medicoDoc.id,
        "1",
        fechaValida,
        "Sede Centro",
        null,
        15000,
      );

      expect(turnosRepository.add).toHaveBeenCalledWith(
        expect.objectContaining({
          medico: medicoDoc.id,
          paciente: { id: "1" },
        }),
      );
    });
  });

  describe("historiales enriquecidos", () => {
    it("debe enriquecer el historial del paciente con el nombre del médico", async () => {
      const service = new TurnoService();
      const fecha = obtenerProximoDia(2, 8, 0).toDate();

      jest.spyOn(turnosRepository, "findByPaciente").mockResolvedValue([
        {
          id: "turno-1",
          medico: "507f1f77bcf86cd799439011",
          paciente: { id: "1" },
          fechaHora: fecha,
          sede: "Sede Centro",
          practica: "Consulta",
          costo: 15000,
          estado: EstadoTurno.RESERVADO,
          historialEstados: [],
        },
      ]);

      medicoRepository.getById.mockResolvedValue({
        id: "507f1f77bcf86cd799439011",
        nombre: "Dra. Ana Gómez",
        matricula: "12345",
        usuario: "medico-1",
      });

      const resultado = await service.getHistorialPaciente("1");

      expect(resultado).toEqual([
        expect.objectContaining({
          medico: expect.objectContaining({
            id: "507f1f77bcf86cd799439011",
            nombre: "Dra. Ana Gómez",
          }),
        }),
      ]);
    });

    it("debe enriquecer el historial del médico con el nombre del paciente", async () => {
      const service = new TurnoService();
      const fecha = obtenerProximoDia(2, 8, 0).toDate();

      jest.spyOn(turnosRepository, "findByMedico").mockResolvedValue([
        {
          id: "turno-2",
          medico: "507f1f77bcf86cd799439011",
          paciente: { id: "1" },
          fechaHora: fecha,
          sede: "Sede Centro",
          practica: "Consulta",
          costo: 15000,
          estado: EstadoTurno.RESERVADO,
          historialEstados: [],
        },
      ]);

      pacientesRepository.getById.mockResolvedValue({
        id: "1",
        nombre: "Juan Pérez",
        usuario: "paciente-1",
      });

      const resultado = await service.getHistorialMedico("507f1f77bcf86cd799439011");

      expect(resultado).toEqual([
        expect.objectContaining({
          paciente: expect.objectContaining({
            id: "1",
            nombre: "Juan Pérez",
          }),
        }),
      ]);
    });
  });

  describe("notificaciones de cancelación", () => {
    it("debe incluir el motivo cuando cancela el paciente", async () => {
      const service = new TurnoService();
      const fecha = obtenerProximoDia(2, 8, 0).toDate();
      const turno = new Turno(
        "507f1f77bcf86cd799439099",
        "507f1f77bcf86cd799439011",
        { id: "1" },
        fecha,
        "Sede Centro",
        "Consulta",
        15000,
      );

      jest.spyOn(turnosRepository, "findById").mockResolvedValue(turno);
      jest.spyOn(turnosRepository, "update").mockImplementation(async (valor) => valor);
      pacientesRepository.getById.mockResolvedValue({ id: "1", usuario: "paciente-1" });
      medicoRepository.getById.mockResolvedValue({
        id: "507f1f77bcf86cd799439011",
        usuario: "medico-1",
      });

      await service.darDeBaja(turno.id, "No puedo asistir", "1");

      expect(notificacionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          destinatario: { id: "medico-1" },
          mensaje: expect.stringContaining("Motivo: No puedo asistir."),
        }),
      );
    });

    it("debe incluir el motivo cuando cancela el médico", async () => {
      const service = new TurnoService();
      const fecha = obtenerProximoDia(2, 8, 0).toDate();
      const turno = new Turno(
        "507f1f77bcf86cd799439100",
        "507f1f77bcf86cd799439011",
        { id: "1" },
        fecha,
        "Sede Centro",
        "Consulta",
        15000,
      );

      jest.spyOn(turnosRepository, "findById").mockResolvedValue(turno);
      jest.spyOn(turnosRepository, "update").mockImplementation(async (valor) => valor);
      pacientesRepository.getById.mockResolvedValue({ id: "1", usuario: "paciente-1" });
      medicoRepository.getById.mockResolvedValue({
        id: "507f1f77bcf86cd799439011",
        usuario: "medico-1",
      });

      await service.darDeBajaPorMedico(turno.id, "Urgencia personal", "507f1f77bcf86cd799439011");

      expect(notificacionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          destinatario: { id: "paciente-1" },
          mensaje: expect.stringContaining("Motivo: Urgencia personal."),
        }),
      );
    });
  });

  describe("generarRecordatoriosTurnosDelDiaSiguiente", () => {
    it("tolera shapes legacy de medico y no revienta si un turno no tiene id valido", async () => {
      const service = new TurnoService();
      const medicoId = "507f1f77bcf86cd799439011";
      const manana = dayjs().add(1, "day").hour(10).minute(0).second(0).millisecond(0).toDate();

      jest.spyOn(turnosRepository, "getAll").mockResolvedValue([
        {
          medico: { _id: medicoId },
          paciente: { id: "1" },
          fechaHora: manana,
          estado: EstadoTurno.RESERVADO,
        },
        {
          medico: { legacy: true },
          paciente: { id: "2" },
          fechaHora: manana,
          estado: EstadoTurno.CONFIRMADO,
        },
      ]);

      pacientesRepository.getById.mockImplementation(async (id) => ({
        id: String(id),
        usuario: `paciente-${id}`,
      }));

      medicoRepository.getById.mockImplementation(async (id) => {
        if (id === medicoId) {
          return { usuario: "medico-1" };
        }

        return null;
      });

      await expect(
        service.generarRecordatoriosTurnosDelDiaSiguiente(),
      ).resolves.toBeUndefined();

      expect(medicoRepository.getById).toHaveBeenCalledTimes(1);
      expect(medicoRepository.getById).toHaveBeenCalledWith(medicoId);
      expect(notificacionRepository.create).toHaveBeenCalledTimes(3);
      expect(notificacionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ destinatario: { id: "medico-1" } }),
      );
      expect(notificacionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ destinatario: { id: "paciente-1" } }),
      );
      expect(notificacionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ destinatario: { id: "paciente-2" } }),
      );
    });
  });
});

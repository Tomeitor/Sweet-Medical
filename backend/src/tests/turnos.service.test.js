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
  jest
    .spyOn(disponibilidadesRepository, "getByMedico")
    .mockResolvedValue(disponibilidadesMock);
  jest.spyOn(turnosRepository, "findByMedicoYFecha").mockResolvedValue(null);
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
  });
});

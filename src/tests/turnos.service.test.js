import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { TurnoService } from "../services/turnos.service.js";
import { turnosRepository } from "../repositories/turnos.repository.js";
import { medicoRepository } from "../repositories/medicos.repository.js";
import { disponibilidadesRepository } from "../repositories/disponibilidades.repository.js";
import { DiaSemana } from "../domain/diaSemana.js";
import Medico from "../domain/Medico.js";

describe("TurnoService - Bloques de Turno", () => {
  let service;
  let mockGetById;
  let mockGetByMedico;
  let mockFindByMedicoYBloque;
  let mockAdd;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TurnoService();

    mockGetById = jest.spyOn(medicoRepository, "getById");
    mockGetByMedico = jest.spyOn(disponibilidadesRepository, "getByMedico");
    mockFindByMedicoYBloque = jest.spyOn(turnosRepository, "findByMedicoYBloque");
    mockAdd = jest.spyOn(turnosRepository, "add");
  });

  describe("darDeAlta con bloques de 15 minutos", () => {
    const medicoMock = new Medico({
      id: 1,
      usuario: "anagomez",
      matricula: "12345",
      nombre: "Dra. Ana Gómez",
      especialidades: [],
      practicas: [],
      sedes: [],
      eliminado: false,
    });

    const disponibilidadMock = {
      idMedico: 1,
      diaSemana: DiaSemana.LUNES,
      desde: "09:00",
      hasta: "11:00",
    };

    beforeEach(() => {
      mockGetById.mockReturnValue(medicoMock);
      mockGetByMedico.mockReturnValue([disponibilidadMock]);
      mockAdd.mockImplementation((turno) => turno);
    });

    it("debe normalizar hora 9:03 al inicio del bloque 9:00", async () => {
      const fecha9_03 = new Date("2026-01-05T09:03:00");

      const resultado = await service.darDeAlta(
        1,
        "paciente1",
        fecha9_03,
        "sede1",
        "consulta",
        500
      );

      expect(resultado.fechaHora.getHours()).toBe(9);
      expect(resultado.fechaHora.getMinutes()).toBe(0);
    });

    it("debe normalizar hora 9:14 al inicio del bloque 9:00", async () => {
      const fecha9_14 = new Date("2026-01-05T09:14:00");

      const resultado = await service.darDeAlta(
        1,
        "paciente1",
        fecha9_14,
        "sede1",
        "consulta",
        500
      );

      expect(resultado.fechaHora.getHours()).toBe(9);
      expect(resultado.fechaHora.getMinutes()).toBe(0);
    });

    it("debe normalizar hora 9:16 al inicio del bloque 9:15", async () => {
      const fecha9_16 = new Date("2026-01-05T09:16:00");

      const resultado = await service.darDeAlta(
        1,
        "paciente1",
        fecha9_16,
        "sede1",
        "consulta",
        500
      );

      expect(resultado.fechaHora.getHours()).toBe(9);
      expect(resultado.fechaHora.getMinutes()).toBe(15);
    });

    it("debe normalizar hora 10:45 al inicio del bloque 10:45", async () => {
      const fecha10_45 = new Date("2026-01-05T10:45:00");

      const resultado = await service.darDeAlta(
        1,
        "paciente1",
        fecha10_45,
        "sede1",
        "consulta",
        500
      );

      expect(resultado.fechaHora.getHours()).toBe(10);
      expect(resultado.fechaHora.getMinutes()).toBe(45);
    });
  });

  describe("detectar conflicto en mismo bloque", () => {
    const medicoMock = new Medico({
      id: 1,
      usuario: "anagomez",
      matricula: "12345",
      nombre: "Dra. Ana Gómez",
      especialidades: [],
      practicas: [],
      sedes: [],
      eliminado: false,
    });

    const disponibilidadMock = {
      idMedico: 1,
      diaSemana: DiaSemana.LUNES,
      desde: "09:00",
      hasta: "11:00",
    };

    beforeEach(() => {
      mockGetById.mockReturnValue(medicoMock);
      mockGetByMedico.mockReturnValue([disponibilidadMock]);
    });

    it("debe rechazar horario 9:04 si el bloque 9:00 ya está ocupado", async () => {
      const fecha9_00 = new Date("2026-01-05T09:00:00");
      turnosRepository.findByMedicoYBloque.mockReturnValue({
        id: 1,
        fechaHora: fecha9_00,
        estado: "RESERVADO",
      });

      const fecha9_04 = new Date("2026-01-05T09:04:00");

      await expect(
        service.darDeAlta(1, "paciente1", fecha9_04, "sede1", "consulta", 500)
      ).rejects.toThrow("Horario ya reservado");
    });

    it("debe aceptar horario 9:16 si el bloque 9:15 está libre", async () => {
      mockFindByMedicoYBloque.mockReturnValue(null);
      mockAdd.mockImplementation((turno) => turno);

      const fecha9_16 = new Date("2026-01-05T09:16:00");

      const resultado = await service.darDeAlta(
        1,
        "paciente1",
        fecha9_16,
        "sede1",
        "consulta",
        500
      );

      expect(resultado.fechaHora.getMinutes()).toBe(15);
    });
  });
});
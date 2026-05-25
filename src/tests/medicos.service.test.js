import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import Medico from "../domain/Medico.js";
import { medicoRepository } from "../repositories/medicos.repository.js";
import MedicoService from "../services/medicos.service.js";

const mockGetAll = jest.fn();
const mockGetById = jest.fn();
const mockAdd = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

medicoRepository.getAll = mockGetAll;
medicoRepository.getById = mockGetById;
medicoRepository.add = mockAdd;
medicoRepository.update = mockUpdate;
medicoRepository.delete = mockDelete;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("MedicoService", () => {
  let service;

  beforeEach(() => {
    service = new MedicoService();
  });

  describe("getAll", () => {
    it("debe retornar todos los medicos", async () => {
      const medicos = [
        new Medico({
          id: 1,
          usuarioId: 101,
          usuario: "anagomez",
          matricula: "12345",
          nombre: "Dra. Ana Gómez",
          especialidades: [],
          practicas: [],
          sedes: [],
          eliminado: false,
        }),
        new Medico({
          id: 2,
          usuarioId: 102,
          usuario: "joseperez",
          matricula: "54321",
          nombre: "Dr. José Perez",
          especialidades: [],
          practicas: [],
          sedes: [],
          eliminado: false,
        }),
        new Medico({
          id: 3,
          usuarioId: 103,
          usuario: "mariafernandez",
          matricula: "67890",
          nombre: "Dra. Maria Fernandez",
          especialidades: [],
          practicas: [],
          sedes: [],
          eliminado: false,
        }),
      ];
      mockGetAll.mockResolvedValue(medicos);

      const result = await service.getAll();

      expect(result).toEqual(medicos);
      expect(mockGetAll).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("debe retornar el medico cuando existe", async () => {
      const medico = new Medico({
        id: 1,
        usuarioId: 101,
        usuario: "anagomez",
        matricula: "12345",
        nombre: "Dra. Ana Gómez",
        especialidades: [],
        practicas: [],
        sedes: [],
        eliminado: false,
      });
      mockGetById.mockReturnValue(medico);

      const result = await service.getById(1);

      expect(result).toEqual(medico);
      expect(mockGetById).toHaveBeenCalledWith(1);
    });

    it("debe lanzar error cuando el medico no existe", async () => {
      mockGetById.mockReturnValue(null);

      await expect(service.getById(999)).rejects.toThrow(
        "El medico no fue encontrado",
      );
    });
  });

  describe("create", () => {
    it("debe crear un nuevo medico", async () => {
      const medicoData = {
        usuarioId: 104,
        usuario: "slopez",
        matricula: "12345",
        nombre: "Dr. Lautaro Lopez",
        especialidades: [],
        practicas: [],
        sedes: [],
        eliminado: false,
      };
      const medico = new Medico({ id: 21, ...medicoData });
      mockAdd.mockReturnValue(medico);

      const result = await service.create(medicoData);

      expect(result).toEqual(medico);
      expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({ usuarioId: 104 }));
    });
  });

  describe("update", () => {
    it("debe actualizar un medico existente", async () => {
      const medico = new Medico({
        id: 1,
        usuarioId: 101,
        usuario: "anagomez",
        matricula: "12345",
        nombre: "Dra. Ana Gómez",
        especialidades: [],
        practicas: [],
        sedes: [],
        eliminado: false,
      });
      mockGetById.mockReturnValue(medico);
      mockUpdate.mockReturnValue({ ...medico, nombre: "Dra. Ana Actualizada" });

      const result = await service.update(1, {
        nombre: "Dra. Ana Actualizada",
      });

      expect(result.nombre).toBe("Dra. Ana Actualizada");
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ usuarioId: 101 }));
    });

    it("debe lanzar error al actualizar medico inexistente", async () => {
      mockGetById.mockReturnValue(null);

      await expect(service.update(999, { nombre: "Test" })).rejects.toThrow(
        "El medico no fue encontrado",
      );
    });
  });

  describe("delete", () => {
    it("debe eliminar un medico existente", async () => {
      const medico = new Medico({
        id: 1,
        usuarioId: 101,
        usuario: "anagomez",
        matricula: "12345",
        nombre: "Dra. Ana Gómez",
        especialidades: [],
        practicas: [],
        sedes: [],
        eliminado: false,
      });
      mockGetById.mockReturnValue(medico);
      mockDelete.mockReturnValue(medico);

      const result = await service.delete(1);

      expect(result).toEqual(medico);
      expect(mockDelete).toHaveBeenCalledWith(1);
    });

    it("debe lanzar error al eliminar medico inexistente", async () => {
      mockGetById.mockReturnValue(null);

      await expect(service.delete(999)).rejects.toThrow(
        "El medico no fue encontrado",
      );
    });
  });
});

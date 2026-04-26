import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Medico } from "../domain/Medico.js";
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
        new Medico({ id: 1, nombre: "Dra. Ana Gómez", especialidad: "Pediatría", matricula: "12345" }),
        new Medico({ id: 2, nombre: "Dr. Luis Pérez", especialidad: "Cardiología", matricula: "67890" }),
      ];
      mockGetAll.mockResolvedValue(medicos);

      const result = await service.getAll();

      expect(result).toEqual(medicos);
      expect(mockGetAll).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("debe retornar el medico cuando existe", async () => {
      const medico = new Medico({ id: 1, nombre: "Dra. Ana Gómez", especialidad: "Pediatría", matricula: "12345" });
      mockGetById.mockReturnValue(medico);

      const result = await service.getById(1);

      expect(result).toEqual(medico);
      expect(mockGetById).toHaveBeenCalledWith(1);
    });

    it("debe lanzar error cuando el medico no existe", async () => {
      mockGetById.mockReturnValue(null);

      await expect(service.getById(999)).rejects.toThrow("Médico no encontrado");
    });
  });

  describe("create", () => {
    it("debe crear un nuevo medico", async () => {
      const medicoData = { nombre: "Dr. Nuevo", especialidad: "Clínica", matricula: "11111" };
      const medico = new Medico({ id: 21, ...medicoData });
      mockAdd.mockReturnValue(medico);

      const result = await service.create(medicoData);

      expect(result).toEqual(medico);
      expect(mockAdd).toHaveBeenCalledWith(expect.any(Medico));
    });
  });

  describe("update", () => {
    it("debe actualizar un medico existente", async () => {
      const medico = new Medico({ id: 1, nombre: "Dra. Ana Gómez", especialidad: "Pediatría", matricula: "12345" });
      mockGetById.mockReturnValue(medico);
      mockUpdate.mockReturnValue({ ...medico, nombre: "Dra. Ana Actualizada" });

      const result = await service.update(1, { nombre: "Dra. Ana Actualizada" });

      expect(result.nombre).toBe("Dra. Ana Actualizada");
      expect(mockUpdate).toHaveBeenCalled();
    });

    it("debe lanzar error al actualizar medico inexistente", async () => {
      mockGetById.mockReturnValue(null);

      await expect(service.update(999, { nombre: "Test" })).rejects.toThrow("Médico no encontrado");
    });
  });

  describe("delete", () => {
    it("debe eliminar un medico existente", async () => {
      const medico = new Medico({ id: 1, nombre: "Dra. Ana Gómez", especialidad: "Pediatría", matricula: "12345" });
      mockGetById.mockReturnValue(medico);
      mockDelete.mockReturnValue(medico);

      const result = await service.delete(1);

      expect(result).toEqual(medico);
      expect(mockDelete).toHaveBeenCalledWith(1);
    });

    it("debe lanzar error al eliminar medico inexistente", async () => {
      mockGetById.mockReturnValue(null);

      await expect(service.delete(999)).rejects.toThrow("Médico no encontrado");
    });
  });
});
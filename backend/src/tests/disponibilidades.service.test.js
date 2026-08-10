import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import Disponibilidad from "../domain/Disponibilidad.js";
import { disponibilidadesRepository } from "../repositories/disponibilidades.repository.js";
import DisponibilidadesService from "../services/disponibilidades.service.js";

const mockGetAll = jest.fn();
const mockGetByMedico = jest.fn();
const mockGetById = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

disponibilidadesRepository.getAll = mockGetAll;
disponibilidadesRepository.getByMedico = mockGetByMedico;
disponibilidadesRepository.getById = mockGetById;
disponibilidadesRepository.create = mockCreate;
disponibilidadesRepository.update = mockUpdate;
disponibilidadesRepository.delete = mockDelete;

describe("DisponibilidadesService", () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DisponibilidadesService();
  });

  it("debe retornar todas las disponibilidades", async () => {
    const disponibilidades = [
      new Disponibilidad({
        id: 1,
        idMedico: 1,
        diaSemana: "LUNES",
        desde: "08:00",
        hasta: "12:00",
      }),
    ];
    mockGetAll.mockResolvedValue(disponibilidades);

    const result = await service.getAll();

    expect(result).toEqual(disponibilidades);
    expect(mockGetAll).toHaveBeenCalled();
  });

  it("debe retornar disponibilidades por medico", async () => {
    const disponibilidades = [
      new Disponibilidad({
        id: 2,
        idMedico: 2,
        diaSemana: "MARTES",
        desde: "09:00",
        hasta: "13:00",
      }),
    ];
    mockGetByMedico.mockResolvedValue(disponibilidades);

    const result = await service.getByMedico(2);

    expect(result).toEqual(disponibilidades);
    expect(mockGetByMedico).toHaveBeenCalledWith(2);
  });

  it("debe lanzar error cuando la disponibilidad no existe", async () => {
    mockGetById.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toThrow(
      "La disponibilidad no fue encontrada",
    );
  });

  it("debe actualizar una disponibilidad existente mergeando los cambios", async () => {
    const disponibilidadExistente = new Disponibilidad({
      id: 1,
      idMedico: 1,
      diaSemana: "LUNES",
      desde: "08:00",
      hasta: "12:00",
    });
    const disponibilidadActualizada = {
      ...disponibilidadExistente,
      hasta: "14:00",
    };

    mockGetById.mockResolvedValue(disponibilidadExistente);
    mockUpdate.mockResolvedValue(disponibilidadActualizada);

    const result = await service.update(1, { hasta: "14:00" });

    expect(result).toEqual(disponibilidadActualizada);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...disponibilidadExistente,
      hasta: "14:00",
    });
  });

  it("debe eliminar una disponibilidad existente", async () => {
    const disponibilidad = {
      id: 1,
      idMedico: 1,
      diaSemana: "LUNES",
      desde: "08:00",
      hasta: "12:00",
      eliminado: true,
    };

    mockGetById.mockResolvedValue({ ...disponibilidad, eliminado: false });
    mockDelete.mockResolvedValue(disponibilidad);

    const result = await service.delete(1);

    expect(result).toEqual(disponibilidad);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });
});

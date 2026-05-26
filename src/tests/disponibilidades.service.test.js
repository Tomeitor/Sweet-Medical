import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import mongoose from "mongoose";

import Disponibilidad from "../domain/Disponibilidad.js";
import { disponibilidadesRepository } from "../repositories/disponibilidades.repository.js";
import DisponibilidadesService from "../services/disponibilidades.service.js";

const objectId = () => new mongoose.Types.ObjectId().toString();

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
        _id: objectId(),
        medico: objectId(),
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
    const medicoId = objectId();
    const disponibilidades = [
      new Disponibilidad({
        _id: objectId(),
        medico: medicoId,
        diaSemana: "MARTES",
        desde: "09:00",
        hasta: "13:00",
      }),
    ];
    mockGetByMedico.mockResolvedValue(disponibilidades);

    const result = await service.getByMedico(medicoId);

    expect(result).toEqual(disponibilidades);
    expect(mockGetByMedico).toHaveBeenCalledWith(medicoId);
  });

  it("debe lanzar error cuando la disponibilidad no existe", async () => {
    mockGetById.mockResolvedValue(null);

    await expect(service.getById(objectId())).rejects.toThrow(
      "La disponibilidad no fue encontrada",
    );
  });

  it("debe actualizar una disponibilidad existente mergeando los cambios", async () => {
    const disponibilidadExistente = new Disponibilidad({
      _id: objectId(),
      medico: objectId(),
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

    const result = await service.update(disponibilidadExistente._id, { hasta: "14:00" });

    expect(result).toEqual(disponibilidadActualizada);
    expect(mockUpdate).toHaveBeenCalledWith(disponibilidadExistente._id, {
      _id: disponibilidadExistente._id,
      hasta: "14:00",
    });
  });

  it("debe eliminar una disponibilidad existente", async () => {
    const disponibilidad = {
      _id: objectId(),
      medico: objectId(),
      diaSemana: "LUNES",
      desde: "08:00",
      hasta: "12:00",
      eliminado: true,
    };

    mockGetById.mockResolvedValue({ ...disponibilidad, eliminado: false });
    mockDelete.mockResolvedValue(disponibilidad);

    const result = await service.delete(disponibilidad._id);

    expect(result).toEqual(disponibilidad);
    expect(mockDelete).toHaveBeenCalledWith(disponibilidad._id);
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Notificacion } from "../domain/Notificacion.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";
import { NotificacionService } from "../services/notificacion.service.js";

const mockFindByDestinatarioYEstado = jest.fn();
const mockFindById = jest.fn();
const mockUpdate = jest.fn();

notificacionRepository.findByDestinatarioYEstado = mockFindByDestinatarioYEstado;
notificacionRepository.findById = mockFindById;
notificacionRepository.update = mockUpdate;

describe("NotificacionService", () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificacionService();
  });

  it("debe retornar notificaciones sin leer", async () => {
    const notificaciones = [
      new Notificacion({
        id: "notif-1",
        destinatario: { id: "123" },
        mensaje: "Mensaje pendiente",
      }),
    ];
    mockFindByDestinatarioYEstado.mockResolvedValue(notificaciones);

    const result = await service.obtenerSinLeer("123");

    expect(result).toEqual(notificaciones);
    expect(mockFindByDestinatarioYEstado).toHaveBeenCalledWith("123", false);
  });

  it("debe retornar notificaciones leidas", async () => {
    const notificaciones = [
      new Notificacion({
        id: "notif-2",
        destinatario: { id: "123" },
        mensaje: "Mensaje leido",
        fechaHoraLeida: new Date(),
      }),
    ];
    mockFindByDestinatarioYEstado.mockResolvedValue(notificaciones);

    const result = await service.obtenerLeidas("123");

    expect(result).toEqual(notificaciones);
    expect(mockFindByDestinatarioYEstado).toHaveBeenCalledWith("123", true);
  });

  it("debe marcar una notificacion como leida", async () => {
    const notificacion = new Notificacion({
      id: "notif-3",
      destinatario: { id: "123" },
      mensaje: "Marcar como leida",
    });
    mockFindById.mockResolvedValue(notificacion);
    mockUpdate.mockResolvedValue(notificacion);

    const result = await service.marcarComoLeida("notif-3");

    expect(result.leida).toBe(true);
    expect(result.fechaHoraLeida).toBeInstanceOf(Date);
    expect(mockFindById).toHaveBeenCalledWith("notif-3");
    expect(mockUpdate).toHaveBeenCalledWith(notificacion);
  });

  it("debe lanzar error si la notificacion no existe", async () => {
    mockFindById.mockResolvedValue(null);

    await expect(service.marcarComoLeida("faltante")).rejects.toThrow(
      "No se encontró la notificación con ID faltante",
    );
  });
});

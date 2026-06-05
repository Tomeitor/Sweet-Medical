import { jest, describe, beforeEach, it, expect } from '@jest/globals';

import { notificacionService } from "../services/notificacion.service.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";
import { NotFoundError } from "../errors/AppError.js";

describe("Capa de Service: NotificacionService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("obtenerPorEstado", () => {
        it("Debería llamar al repositorio pidiendo las notificaciones con leida=false", async () => {
            const mockResultado = [{ id: "1", mensaje: "Hola" }];
            const spyFind = jest.spyOn(notificacionRepository, "findByDestinatarioYEstado").mockResolvedValue(mockResultado);

            const resultado = await notificacionService.obtenerPorEstado("123", false);

            expect(spyFind).toHaveBeenCalledWith("123", false);
            expect(resultado).toEqual(mockResultado);
        });

        it("Debería llamar al repositorio pidiendo las notificaciones con leida=true", async () => {
            const mockResultado = [{ id: "2", mensaje: "Chau" }];
            const spyFind = jest.spyOn(notificacionRepository, "findByDestinatarioYEstado").mockResolvedValue(mockResultado);

            const resultado = await notificacionService.obtenerPorEstado("123", true);

            expect(spyFind).toHaveBeenCalledWith("123", true);
            expect(resultado).toEqual(mockResultado);
        });
    });

    describe("actualizarEstadoLectura", () => {
        it("Debería marcarla como leída si se pasa true en el body", async () => {
            const mockNotificacion = {
                id: "notif-1",
                leida: false,
                marcarComoLeida: jest.fn(), // mock de la acción de marcar
                desmarcarComoLeida: jest.fn() // mock de la acción de desmarcar
            };

            const spyFindById = jest.spyOn(notificacionRepository, "findById").mockResolvedValue(mockNotificacion);
            const spyUpdate = jest.spyOn(notificacionRepository, "update").mockResolvedValue(mockNotificacion);

            // le pide que el nuevo estado sea TRUE
            const resultado = await notificacionService.actualizarEstadoLectura("notif-1", true);

            expect(spyFindById).toHaveBeenCalledWith("notif-1");
            expect(mockNotificacion.marcarComoLeida).toHaveBeenCalled(); // se ejecuto marcar
            expect(mockNotificacion.desmarcarComoLeida).not.toHaveBeenCalled();
            expect(spyUpdate).toHaveBeenCalledWith(mockNotificacion);
            expect(resultado).toBe(mockNotificacion);
        });

        it("Debería desmarcarla como leída si se pasa false en el body", async () => {
            const mockNotificacion = {
                id: "notif-2",
                leida: true,
                marcarComoLeida: jest.fn(),
                desmarcarComoLeida: jest.fn()
            };

            const spyFindById = jest.spyOn(notificacionRepository, "findById").mockResolvedValue(mockNotificacion);
            const spyUpdate = jest.spyOn(notificacionRepository, "update").mockResolvedValue(mockNotificacion);

            const resultado = await notificacionService.actualizarEstadoLectura("notif-2", false);

            expect(spyFindById).toHaveBeenCalledWith("notif-2");
            expect(mockNotificacion.desmarcarComoLeida).toHaveBeenCalled(); // ahora se ejecuto desmarcar
            expect(mockNotificacion.marcarComoLeida).not.toHaveBeenCalled();
            expect(spyUpdate).toHaveBeenCalledWith(mockNotificacion);
            expect(resultado).toBe(mockNotificacion);
        });

        it("Debería lanzar un NotFoundError si el repositorio no encuentra el ID", async () => {
            jest.spyOn(notificacionRepository, "findById").mockResolvedValue(undefined);

            await expect(notificacionService.actualizarEstadoLectura("ID_FALSO", true))
                .rejects
                .toThrow(NotFoundError);
        });
    });
});
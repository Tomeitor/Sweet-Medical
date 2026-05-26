import { jest } from '@jest/globals';

import { notificacionService } from "../services/notificacion.service.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";
import { NotFoundError } from "../errors/AppError.js";

describe("Capa de Service: NotificacionService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("obtenerSinLeer y obtenerLeidas", () => {
        it("Debería llamar al repositorio pidiendo las notificaciones con leida=false", async () => {

            const mockResultado = [{ id: "1", mensaje: "Hola" }];
            const spyFind = jest.spyOn(notificacionRepository, "findByDestinatarioYEstado").mockResolvedValue(mockResultado);

            const resultado = await notificacionService.obtenerSinLeer("123");

            expect(spyFind).toHaveBeenCalledWith("123", false);
            expect(resultado).toEqual(mockResultado);
        });

        it("Debería llamar al repositorio pidiendo las notificaciones con leida=true", async () => {

            const mockResultado = [{ id: "2", mensaje: "Chau" }];
            const spyFind = jest.spyOn(notificacionRepository, "findByDestinatarioYEstado").mockResolvedValue(mockResultado);

            const resultado = await notificacionService.obtenerLeidas("123");

            expect(spyFind).toHaveBeenCalledWith("123", true);
            expect(resultado).toEqual(mockResultado);
        });
    });

    describe("marcarComoLeida", () => {
        it("Debería encontrar la notificación, marcarla como leída y actualizar el repo", async () => {

            const mockNotificacion = {
                id: "notif-1",
                leida: false,
                marcarComoLeida: jest.fn() //un mock de la funcion de dominio
            };

            const spyFindById = jest.spyOn(notificacionRepository, "findById").mockResolvedValue(mockNotificacion);
            const spyUpdate = jest.spyOn(notificacionRepository, "update").mockResolvedValue(mockNotificacion);

            const resultado = await notificacionService.marcarComoLeida("notif-1");

            expect(spyFindById).toHaveBeenCalledWith("notif-1");
            expect(mockNotificacion.marcarComoLeida).toHaveBeenCalled(); //se ejecuto la regla de negocio
            expect(spyUpdate).toHaveBeenCalledWith(mockNotificacion);    //se guardó en la DB
            expect(resultado).toBe(mockNotificacion);
        });

        it("Debería lanzar un NotFoundError si el repositorio no encuentra el ID", async () => {
            //el repo devuelve undefined (no lo encontro)
            jest.spyOn(notificacionRepository, "findById").mockResolvedValue(undefined);

            await expect(notificacionService.marcarComoLeida("ID_FALSO"))
                .rejects
                .toThrow(NotFoundError);
        });
    });
});
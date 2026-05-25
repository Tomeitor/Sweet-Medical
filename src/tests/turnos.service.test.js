import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import Medico from "../domain/Medico.js";
import { Turno } from "../domain/Turno.js";
import { notificacionRepository } from "../repositories/notificacion.repository.js";
import { turnosRepository } from "../repositories/turnos.repository.js";
import { TurnoService } from "../services/turnos.service.js";

const mockFindById = jest.fn();
const mockFindByMedicoYFecha = jest.fn();
const mockUpdate = jest.fn();
const mockAddNotificacion = jest.fn();

turnosRepository.findById = mockFindById;
turnosRepository.findByMedicoYFecha = mockFindByMedicoYFecha;
turnosRepository.update = mockUpdate;
notificacionRepository.add = mockAddNotificacion;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TurnoService", () => {
  describe("cambiarTurno", () => {
    it("debe notificar al usuario del paciente cuando cambia el turno", async () => {
      const medico = new Medico({
        id: 1,
        usuarioId: 501,
        usuario: "anagomez",
        matricula: "12345",
        nombre: "Dra. Ana Gomez",
      });
      const turno = new Turno(
        1,
        medico,
        10,
        new Date("2099-01-01T10:00:00.000Z"),
        "Sede Centro",
        "Consulta",
        1000,
      );
      const service = new TurnoService();
      const nuevaFecha = new Date("2099-01-02T10:15:00.000Z");

      service.validarAgendaMedico = jest.fn().mockResolvedValue(true);
      service.getPacienteById = jest.fn().mockResolvedValue({ id: 10, usuarioId: 900 });
      mockFindById.mockReturnValue(turno);
      mockFindByMedicoYFecha.mockReturnValue(null);
      mockUpdate.mockImplementation((turnoActualizado) => turnoActualizado);
      mockAddNotificacion.mockImplementation((notificacion) => notificacion);

      await service.cambiarTurno(1, nuevaFecha, "Cambio solicitado por el medico");

      expect(service.getPacienteById).toHaveBeenCalledWith(10);
      expect(mockAddNotificacion).toHaveBeenCalledWith(expect.objectContaining({
        destinatarioId: 900,
        remitenteId: 501,
        mensaje: expect.stringContaining("fue reprogramado"),
      }));
    });
  });
});

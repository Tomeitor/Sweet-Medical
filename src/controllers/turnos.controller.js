import { TurnoService } from "../services/turnos.service.js";
import z from "zod";

const crearTurnoSchema = z.object({
  medicoId: z.string({ required_error: "El ID del médico es obligatorio" }),
  pacienteId: z.string().min(1, "El ID del paciente no puede estar vacío"),
  fechaHora: z
    .string()
    .datetime({offset: true, message: "Formato de fecha inválido (debe ser ISO)" })
    .transform(str => new Date(str)),
  sede: z.string().min(1, "La sede es obligatoria"),
  practica: z.string().min(1, "La práctica es obligatoria"),
  costo: z.number().positive("El costo debe ser un valor mayor a cero"),
});

const cancelarTurnoSchema = z.object({
  motivo: z.string().trim().min(1, "El motivo de cancelación es obligatorio"),
});

const historialPacienteParamsSchema = z.object({
  pacienteId: z.string().trim().min(1, "El ID del paciente no puede estar vacío"),
});

const turnosDisponiblesQuerySchema = z.object({
  especialidad: z.string().trim().min(1).optional(),
  practica: z.string().trim().min(1).optional(),
}).refine(data => data.especialidad || data.practica, {
  message: "Debe indicar una especialidad o una práctica",
});

const service = new TurnoService();

export class TurnosController {

  //POST (alta)
  async alta(req, res, next) {
    try {
      const datosValidados = crearTurnoSchema.parse(req.body);
      const nuevoTurno = await service.darDeAlta(
        datosValidados.medicoId,
        datosValidados.pacienteId,
        datosValidados.fechaHora,
        datosValidados.sede,
        datosValidados.practica,
        datosValidados.costo,
      );

      res.status(201).json(nuevoTurno); //si se pudo crear respondo con 201
    } catch (error) {
      next(error);
    }
  }

  //DELETE (baja)
  async baja(req, res, next) {
    try {
      const id = req.params.id;
      const datosValidados = cancelarTurnoSchema.parse(req.body);

      await service.darDeBaja(id, datosValidados.motivo);

      res.status(200).json({ message: "Turno cancelado con éxito" });
    } catch (error) {
      next(error);
    }
  }

  async historialPaciente(req, res, next) {
    try {
      const datosValidados = historialPacienteParamsSchema.parse(req.params);
      const historial = await service.getHistorialPaciente(datosValidados.pacienteId);

      res.status(200).json(historial);
    } catch (error) {
      next(error);
    }
  }

  async marcarComoRealizado(req, res, next) {
    try {
      const { id } = req.params;
      const turno = await service.marcarComoRealizado(id);

      res.status(200).json(turno);
    } catch (error) {
      next(error);
    }
  }

  async disponibles(req, res, next) {
    try {
      const filtros = turnosDisponiblesQuerySchema.parse(req.query);
      const turnosDisponibles = await service.getTurnosDisponibles(filtros);

      res.status(200).json(turnosDisponibles);
    } catch (error) {
      next(error);
    }
  }
}

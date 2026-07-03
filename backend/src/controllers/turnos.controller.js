import { TurnoService } from "../services/turnos.service.js";
import { BadRequestError, ForbiddenError } from "../errors/AppError.js";
import z from "zod";

const optionalDateTimeSchema = z
  .string()
  .datetime({
    offset: true,
    message: "Formato de fecha inválido (debe ser ISO)",
  })
  .transform((str) => new Date(str))
  .optional();

const crearTurnoSchema = z.object({
  medicoId: z
    .string({ required_error: "El ID del médico es obligatorio" })
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "El ID del médico no es válido"),
  fechaHora: z
    .string()
    .datetime({
      offset: true,
      message: "Formato de fecha inválido (debe ser ISO)",
    })
    .transform((str) => new Date(str)),
  sede: z.string().min(1, "La sede es obligatoria"),
  practica: z.string().min(1, "La práctica es obligatoria"),
  costo: z.number().positive("El costo debe ser un valor mayor a cero"),
});

const cancelarTurnoSchema = z.object({
  motivo: z.string().trim().min(1, "El motivo de cancelación es obligatorio"),
});

const cambiarTurnoSchema = z.object({
  fechaHora: z
    .string()
    .datetime({
      offset: true,
      message: "Formato de fecha inválido (debe ser ISO)",
    })
    .transform((str) => new Date(str)),
  motivo: z.string().trim().min(1, "El motivo del cambio es obligatorio"),
});

const historialPacienteParamsSchema = z.object({
  pacienteId: z
    .string()
    .trim()
    .regex(/^([0-9a-fA-F]{24}|\d+)$/, "El ID del paciente no es válido"),
});

const turnosDisponiblesQuerySchema = z.object({
  medicoId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "El ID del médico no es válido")
    .optional(),
  especialidad: z.string().trim().min(1).optional(),
  practica: z.string().trim().min(1).optional(),
  sede: z.string().trim().min(1).optional(),
  fechaDesde: optionalDateTimeSchema,
  fechaHasta: optionalDateTimeSchema,
  page: z.coerce
    .number()
    .int()
    .min(1, "La página debe ser mayor o igual a 1")
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, "El límite debe ser mayor o igual a 1")
    .max(100, "El límite no puede ser mayor a 100")
    .default(10),
  ordenarPor: z.enum(["fecha", "costo"]).default("fecha"),
  orden: z.enum(["asc", "desc"]).default("asc"),
  q: z.string().trim().optional(),
});

const service = new TurnoService();

export class TurnosController {
  //POST (alta)
  async alta(req, res, next) {
    try {
      const datosValidados = crearTurnoSchema.parse(req.body);
      const pacienteId = req.auth?.profileId;

      if (!pacienteId) {
        throw new BadRequestError("Debes iniciar sesión como paciente para reservar un turno");
      }

      const nuevoTurno = await service.darDeAlta(
        datosValidados.medicoId,
        pacienteId,
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

      await service.darDeBaja(id, datosValidados.motivo, req.auth?.profileId);

      res.status(200).json({ message: "Turno cancelado con éxito" });
    } catch (error) {
      next(error);
    }
  }

  async historialPaciente(req, res, next) {
    try {
      const datosValidados = historialPacienteParamsSchema.parse(req.params);
      const pacienteIdAutorizado = req.auth?.profileId;

      if (!pacienteIdAutorizado) {
        throw new BadRequestError("Debes iniciar sesión como paciente para ver tu historial");
      }

      if (String(datosValidados.pacienteId) !== String(pacienteIdAutorizado)) {
        throw new ForbiddenError("No podés ver el historial de otro paciente");
      }

      const historial = await service.getHistorialPaciente(
        pacienteIdAutorizado,
      );

      res.status(200).json(historial);
    } catch (error) {
      next(error);
    }
  }

  async cambiar(req, res, next) {
    try {
      const { id } = req.params;
      const datosValidados = cambiarTurnoSchema.parse(req.body);
      const turno = await service.cambiarTurno(
        id,
        datosValidados.fechaHora,
        datosValidados.motivo,
        req.auth?.profileId,
      );

      res.status(200).json(turno);
    } catch (error) {
      next(error);
    }
  }

  async marcarComoRealizado(req, res, next) {
    try {
      const { id } = req.params;
      const turno = await service.marcarComoRealizado(id, req.auth?.profileId);

      res.status(200).json(turno);
    } catch (error) {
      next(error);
    }
  }

  async disponibles(req, res, next) {
    try {
      const filtros = turnosDisponiblesQuerySchema.parse(req.query);
      const pacienteId = req.auth?.role === 'PACIENTE' ? req.auth.profileId : null;

      if (!pacienteId) {
        throw new BadRequestError("Debes iniciar sesión como paciente para ver los turnos disponibles");
      }

      const turnosDisponibles = await service.getTurnosDisponibles({
        ...filtros,
        pacienteId,
      });

      res.status(200).json(turnosDisponibles);
    } catch (error) {
      next(error);
    }
  }
}

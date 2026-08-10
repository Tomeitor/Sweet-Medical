import { BadRequestError, ForbiddenError } from "../errors/AppError.js";
import DisponibilidadesService from "../services/disponibilidades.service.js";
import z from "zod";

const service = new DisponibilidadesService();

export const disponibilidadSchema = z.object({
  idMedico: z.string({ required_error: "El ID del médico es obligatorio" }).trim().min(1, "El ID del médico no puede estar vacío"),
  diaSemana: z.enum(
    ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"],
    {
      errorMap: () => ({ message: "Día de la semana inválido. Debe ser: LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO o DOMINGO" }),
    },
  ),
  desde: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Debe ser formato HH:MM (ej: 09:00)"),
  hasta: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Debe ser formato HH:MM (ej: 17:00)"),
});

export default class DisponibilidadController {

  getDisponibilidades = async (req, res, next) => {
    try {
      const disponibilidades = await service.getAll();
      res.status(200).json(disponibilidades);
    } catch (error) {
      next(error);
    }
  };

  getDisponibilidadByIdMedico = async (req, res, next) => {
    try {
      const { idMedico } = req.params;
      const disponibilidades = await service.getByMedico(idMedico);
      res.status(200).json(disponibilidades);
    } catch (error) {
      next(error);
    }
  };

  getDisponibilidadById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const disponibilidad = await service.getById(id);
      res.status(200).json(disponibilidad);
    } catch (error) {
      next(error);
    }
  };

  createDisponibilidad = async (req, res, next) => {
    try {
      const result = disponibilidadSchema.safeParse(req.body);
      if (!result.success) {
        const errores = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        throw new BadRequestError(`Datos inválidos: ${errores}`);
      }

      const idMedicoAutorizado = String(req.auth?.profileId ?? result.data.idMedico);

      if (req.auth?.role === 'MEDICO' && String(result.data.idMedico) !== idMedicoAutorizado) {
        throw new ForbiddenError("No podés crear disponibilidades para otro médico");
      }

      const nuevaDisponibilidad = await service.create({
        ...result.data,
        idMedico: idMedicoAutorizado,
      });
      res.status(201).json(nuevaDisponibilidad);
    } catch (error) {
      next(error);
    }
  };

  updateDisponibilidad = async (req, res, next) => {
    try {
      const result = disponibilidadSchema.partial().safeParse(req.body);
      if (!result.success) {
        throw new BadRequestError("Datos invalidos");
      }
      const { id } = req.params;

      const disponibilidadExistente = await service.getById(id);
      if (req.auth?.role === 'MEDICO' && String(disponibilidadExistente.idMedico) !== String(req.auth.profileId)) {
        throw new ForbiddenError("No podés modificar disponibilidades de otro médico");
      }

      const disponibilidad = await service.update(id, req.body);
      res.status(200).json(disponibilidad);
    } catch (error) {
      next(error);
    }
  };

  deleteDisponibilidad = async (req, res, next) => {
    try {
      const { id } = req.params;
      const disponibilidadExistente = await service.getById(id);

      if (req.auth?.role === 'MEDICO' && String(disponibilidadExistente.idMedico) !== String(req.auth.profileId)) {
        throw new ForbiddenError("No podés eliminar disponibilidades de otro médico");
      }

      const disponibilidad = await service.delete(id);
      res.status(200).json(disponibilidad);
    } catch (error) {
      next(error);
    }
  };
}

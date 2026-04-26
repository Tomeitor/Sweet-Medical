import { BadRequestError } from "../errors/AppError.js";
import DisponibilidadesService from "../services/disponibilidades.service.js";
import z from "zod";

const service = new DisponibilidadesService();

export const disponibilidadSchema = z.object({
  diaSemana: z.enum(
    ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"],
    {
      errorMap: () => ({ message: "Día de la semana inválido" }),
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
      const { idMedico, id } = req.params;
      const disponibilidad = await service.getById(idMedico, id);
      res.status(200).json(disponibilidad);
    } catch (error) {
      next(error);
    }
  };

  createDisponibilidad = async (req, res, next) => {
    try {
      const { idMedico } = req.params;

      const result = disponibilidadSchema.safeParse(req.body);
      if (!result.success) {
        throw new BadRequestError("Datos invalidos");
      }

      const nuevaDisponibilidad = await service.create(idMedico, req.body);
      res.status(201).json(nuevaDisponibilidad);
    } catch (error) {
      next(error);
    }
  };

  updateDisponibilidad = async (req, res, next) => {
    try {
      const { idMedico, id } = req.params;

      const disponibilidadActualizada = await service.update(
        idMedico,
        id,
        req.body,
      );
      res.status(200).json(disponibilidadActualizada);
    } catch (error) {
      next(error);
    }
  };

  deleteDisponibilidad = async (req, res, next) => {
    try {
      const { idMedico, id } = req.params;
      await service.delete(idMedico, id);
      res
        .status(200)
        .json({ message: "Disponibilidad eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  };
}

import { BadRequestError } from "../errors/AppError.js";
import MedicoService from "../services/medicos.service.js";
import z from "zod";

const service = new MedicoService();

export const medicoSchema = z.object({
  usuario: z.string().min(1, "El usuario es requerido"),
  matricula: z
    .string()
    .min(3, "La matrícula debe tener al menos 3 caracteres")
    .max(50),
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50),
  especialidades: z.array(z.string()).optional(),
  practicas: z.array(z.string()).optional(),
  sedes: z.array(z.string()).optional()
});


export default class MedicoController {
  async getMedicos(_req, res, next) {
    try {
      const medicos = await service.getAll();
      res.status(200).json(medicos);
    } catch (error) {
      next(error);
    }
  }

  async getMedicoById(req, res, next) {
    try {
      const { id } = req.params;
      const medico = await service.getById(id);
      res.status(200).json(medico);
    } catch (error) {
      next(error);
    }
  }

  createMedico = async (req, res, next) => {
    try {
      const result = medicoSchema.safeParse(req.body);
      if (!result.success) {
        throw new BadRequestError("Datos invalidos");
      }
      const nuevoMedico = await service.create(req.body);
      res.status(201).json(nuevoMedico);
    } catch (error) {
      next(error);
    }
  };

  updateMedico = async (req, res, next) => {
    try {
      const { id } = req.params;
      const medicoActualizado = await service.update(id, req.body);
      res.status(200).json(medicoActualizado);
    } catch (error) {
      next(error);
    }
  };

  deleteMedico = async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(200).json({ message: "Médico eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  };
}

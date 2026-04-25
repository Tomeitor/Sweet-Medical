import MedicoService from "../services/medicos.service.js";
import z from "zod";

const service = new MedicoService();

export default class MedicoController {
  async getMedicos(_req, res) {
    try {
      const medicos = await service.getAll();
      res.status(200).json(medicos);
    } catch (error) {
      next(error);
    }
  }

  async getMedicoById(req, res) {
    try {
      const { id } = req.params;
      const medico = await service.getById(id);
      res.status(200).json(medico);
    } catch (error) {
      next(error);
    }
  }

  medicoSchema = z.object({
    nombre: z.string().min(3).max(50),
    apellido: z.string().min(3).max(50),
    matricula: z.string().min(3).max(50),
    especialidad: z.string().min(3).max(50),
  });

  async createMedico(req, res) {
    try {
      const result = this.medicoSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ message: "Datos inválidos", error: result.error.issues });
      }
      const nuevoMedico = await service.create(req.body);
      res.status(201).json(nuevoMedico);
    } catch (error) {
      next(error);
    }
  }

  async updateMedico(req, res) {
    try {
      const { id } = req.params;
      const medicoActualizado = await service.update(id, req.body);
      res.status(200).json(medicoActualizado);
    } catch (error) {
      next(error);
    }
  }

  async deleteMedico(req, res) {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(200).json({ message: "Médico eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

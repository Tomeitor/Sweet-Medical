import DisponibilidadesService from "../services/disponibilidades.service.js";
import z from "zod";

const service = new DisponibilidadesService();

export default class DisponibilidadController {
  
  // Esquema de validación para las disponibilidades
  disponibilidadSchema = z.object({
    diaSemana: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'], {
      errorMap: () => ({ message: "Día de la semana inválido" })
    }),
    desde: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Debe ser formato HH:MM (ej: 09:00)"),
    hasta: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Debe ser formato HH:MM (ej: 17:00)"),
  });


  getDisponibilidadByIdMedico = async (req, res) => {
    try {
      const { idMedico } = req.params;
      const disponibilidades = await service.getByMedico(idMedico);
      res.status(200).json(disponibilidades);
    } catch (error) {
      const status = error.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({
        message: "Error al obtener las disponibilidades",
        error: error.message,
      });
    }
  }

  getDisponibilidadById = async (req, res) => {
    try {
      const { idMedico, id } = req.params;
      const disponibilidad = await service.getById(idMedico, id);
      res.status(200).json(disponibilidad);
    } catch (error) {
      const status = error.message.includes("no encontrad") ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  }

  createDisponibilidad = async (req, res) => {
    try {
      const { idMedico } = req.params;
      
      const result = this.disponibilidadSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Datos inválidos", error: result.error.issues });
      }

      const nuevaDisponibilidad = await service.create(idMedico, req.body);
      res.status(201).json(nuevaDisponibilidad);
    } catch (error) {
      const status = error.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ message: "Error al crear la disponibilidad", error: error.message });
    }
  }

  updateDisponibilidad = async (req, res) => {
    try {
      const { idMedico, id } = req.params;
      
      const disponibilidadActualizada = await service.update(idMedico, id, req.body);
      res.status(200).json(disponibilidadActualizada);
    } catch (error) {
      const status = error.message.includes("no encontrad") ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  }

  deleteDisponibilidad = async (req, res) => {
    try {
      const { idMedico, id } = req.params;
      await service.delete(idMedico, id);
      res.status(200).json({ message: "Disponibilidad eliminada correctamente" });
    } catch (error) {
      const status = error.message.includes("no encontrad") ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  }
}
import { TurnoService } from "../services/turnos.service.js";
import z from "zod";

const crearTurnoSchema = z.object({
  medicoId: z.string({ required_error: "El ID del médico es obligatorio" }),
  pacienteId: z.string().min(1, "El ID del paciente no puede estar vacío"),
  fechaHora: z
    .string()
    .datetime({ message: "Formato de fecha inválido (debe ser ISO)" }),
  sede: z.string().min(1, "La sede es obligatoria"),
  practica: z.string().min(1, "La práctica es obligatoria"),
  costo: z.number().positive("El costo debe ser un valor mayor a cero"),
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

      await service.darDeBaja(id);

      res.status(200).json({ message: "Turno cancelado con éxito" });
    } catch (error) {
      next(error);
    }
  }
}

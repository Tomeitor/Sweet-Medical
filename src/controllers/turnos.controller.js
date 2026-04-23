import { TurnoService } from "../services/turnos.service.js";
import z from "zod";

export class TurnosController {
    constructor() {
        this.service = new TurnoService();
    }

    crearTurnoSchema = z.object({
        medicoId: z.string({ required_error: "El ID del médico es obligatorio" }),
        pacienteId: z.string().min(1, "El ID del paciente no puede estar vacío"),
        fechaHora: z.string().datetime({ message: "Formato de fecha inválido (debe ser ISO)" }),
        sede: z.string().min(1, "La sede es obligatoria"),
        practica: z.string().min(1, "La práctica es obligatoria"),
        costo: z.number().positive("El costo debe ser un valor mayor a cero")
    });

    //POST (alta)
    async alta(req, res) {
        try {
            const datosValidados = this.crearTurnoSchema.parse(req.body);
            const nuevoTurno = await this.service.darDeAlta(
                datosValidados.medicoId, 
                datosValidados.pacienteId, 
                datosValidados.fechaHora, 
                datosValidados.sede, 
                datosValidados.practica, 
                datosValidados.costo
            );
            
            res.status(201).json(nuevoTurno); //si se pudo crear respondo con 201

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ 
                    error: "Error de validación", 
                    detalles: error.errors.map(e => e.message) 
                });
            }
            
            res.status(400).json({ error: error.message });
        }
    }

    //DELETE (baja)
    async baja(req, res) {
        try {
            const id = req.params.id;

            await this.service.darDeBaja(id);

            res.status(200).json({ message: "Turno cancelado con éxito" });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
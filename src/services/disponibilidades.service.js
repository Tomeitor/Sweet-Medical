import { disponibilidadesRepository } from "../repositories/disponibilidades.repository.js";
import { medicoRepository } from "../repositories/medicos.repository.js";
import { Disponibilidad } from "../domain/Disponibilidad.js";

export class DisponibilidadesService {
    async getByMedico(idMedico) {
        const medico = medicoRepository.getById(idMedico);
        if (!medico) throw new Error("Médico no encontrado");

        return disponibilidadesRepository.getByMedico(idMedico);
    }

    async getById(idMedico, id) {
        const medico = medicoRepository.getById(idMedico);
        if (!medico) throw new Error("Médico no encontrado");

        const disponibilidad = disponibilidadesRepository.findById(id);
        if (!disponibilidad) throw new Error("Disponibilidad no encontrada");
        return disponibilidad;
    }

    async create(idMedico, nuevaDisponibilidad) {
        const medico = medicoRepository.getById(idMedico);
        if (!medico) throw new Error("Médico no encontrado");

        const disponibilidad = new Disponibilidad(
            null,
            parseInt(idMedico),
            nuevaDisponibilidad.diaSemana,
            nuevaDisponibilidad.desde,
            nuevaDisponibilidad.hasta
        );

        return disponibilidadesRepository.add(disponibilidad);
    }

    async update(idMedico, id, disponibilidadActualizada) {
        const medico = medicoRepository.getById(idMedico);
        if (!medico) throw new Error("Médico no encontrado");

        const disponibilidadExistente = disponibilidadesRepository.findById(id);
        if (!disponibilidadExistente) throw new Error("Disponibilidad no encontrada");

        const disponibilidad = new Disponibilidad(
            parseInt(id),
            parseInt(idMedico),
            disponibilidadActualizada.diaSemana,
            disponibilidadActualizada.desde,
            disponibilidadActualizada.hasta
        );

        return disponibilidadesRepository.update(disponibilidad);
    }

    async delete(idMedico, id) {
        const medico = medicoRepository.getById(idMedico);
        if (!medico) throw new Error("Médico no encontrado");

        return disponibilidadesRepository.delete(id);
    }

    async getAll() {
        return disponibilidadesRepository.getAll();
    }
}


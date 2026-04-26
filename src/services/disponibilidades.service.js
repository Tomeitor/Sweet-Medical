import { DisponibilidadesRepository } from "../repositories/disponibilidades.repository.js";
import { MedicoRepository } from "../repositories/medicos.repository.js";

const disponibilidadesRepository = new DisponibilidadesRepository();
const medicoRepository = new MedicoRepository();

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

        const disponibilidad = {
            idMedico,
            ...nuevaDisponibilidad
        };

        return disponibilidadesRepository.add(disponibilidad);
    }

    async update(idMedico, id, disponibilidadActualizada) {
        const medico = medicoRepository.getById(idMedico);
        if (!medico) throw new Error("Médico no encontrado");

        const disponibilidadExistente = disponibilidadesRepository.findById(id);
        if (!disponibilidadExistente) throw new Error("Disponibilidad no encontrada");

        const disponibilidad = {
            id: parseInt(id),
            idMedico,
            ...disponibilidadActualizada
        };

        return disponibilidadesRepository.update(disponibilidad);
    }

    async delete(idMedico, id) {
        const medico = medicoRepository.getById(idMedico);
        if (!medico) throw new Error("Médico no encontrado");

        return disponibilidadesRepository.delete(id);
    }

    getAll() {
        return disponibilidadesRepository.getAll();
    }
}
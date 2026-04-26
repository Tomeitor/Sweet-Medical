import { disponibilidadesDB } from "../repositories/disponibilidades.repository.js";
import { MedicoRepository } from "../repositories/medicos.repository.js";
import MedicoService from "./medicos.service.js";

const medicoService = new MedicoService();

export default class DisponibilidadesService {
 /*async getByMedico(idMedico){
    const medico = await medicoService.getById(idMedico);
    return medico.disponibilidad;
  }*/

  async getById(idMedico, id) {
    const medico = await medicoService.getById(idMedico);
    return medico.disponibilidad;
  }

  async create(idMedico, nuevaDisponibilidad) {
    const newMedico = medicoService.update(idMedico, { disponibilidad: [ nuevaDisponibilidad ] })
    return newMedico.disponibilidad;
  }

  async update(idMedico, idDisp, disponibilidadActualizada) {
    const newMedico = medicoService.update(idMedico, { disponibilidad: [ { idDisp: nuevaDisponibilidad } ] })
    return newMedico.disponibilidad;
  }

  /*Falta actualizar esta funcion*/
  async delete(idMedico, idDisp) {
    const medico = medicoRepository.getById(idMedico);

    if (!medico) throw new Error("Médico no encontrado");

    const index = disponibilidadesDB.findIndex((m) => m.id === parseInt(id));
    if (index === -1) throw new Error("Disponibilidad no encontrada");

    const disponibilidadEliminada = disponibilidadesDB.splice(index, 1);
    return disponibilidadEliminada[0];
  }
}

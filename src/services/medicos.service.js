import { medicoRepository } from "../repositories/medicos.repository.js";
import { Medico } from "../domain/Medico.js";

export default class MedicoService {
  async getAll() {
    return medicoRepository.getAll();
  }

  async getById(id) {
    const medico = medicoRepository.getById(id);
    if (!medico) throw new Error("Médico no encontrado");
    return medico;
  }

  async create(medicoData) {
    return medicoRepository.add(new Medico(medicoData));
  }

  async update(id, medicoData) {
    const medico = await this.getById(id);
    const updatedMedico = { ...medico, ...medicoData, id: parseInt(id) };
    return medicoRepository.update(updatedMedico);
  }

  async delete(id) {
    const medico = await this.getById(id);
    medicoRepository.delete(medico.id);
    return medico;
  }
}

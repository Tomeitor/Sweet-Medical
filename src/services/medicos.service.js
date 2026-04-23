import { MedicoRepository } from "../repositories/medicos.repository.js";

const repository = new MedicoRepository();

export default class MedicoService {
  async getAll() {
    return repository.getAll();
  }

  async getById(id) {
    const medico = repository.getById(id);
    if (!medico) throw new Error("Médico no encontrado");
    return medico;
  }

  async create(medicoData) {
    return repository.add(new Medico(medicoData));
  }

  async update(id, medicoData) {
    
    const medico = this.getById(id);
    
    const updatedMedico = { ...medico, ...medicoData, id };

    return repository.update(updatedMedico);
  }

  async delete(id) {
    const medico = this.getById(id);

    repository.delete(medico.id);

    return medico;
  }
}

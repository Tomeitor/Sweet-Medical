import { MedicoRepository } from "../repositories/medicos.repository.js";
import { NotFoundError } from '../errors/AppError.js'

const repository = new MedicoRepository();

export default class MedicoService {
  async getAll() {
    return repository.getAll();
  }

  async getById(id) {
    const medico = repository.getById(id);
    if (!medico) throw new NotFoundError("El medico no fue encontrado");
    return medico;
  }

  async create(medicoData) {
    return repository.add(new Medico(medicoData));
  }

  async update(id, medicoData) {
    
    const medico = this.getById(id);
    if (!medico) throw new NotFoundError("El medico no fue encontrado");

    const updatedMedico = { ...medico, ...medicoData, id };

    return repository.update(updatedMedico);
  }

  async delete(id) {
    const medico = this.getById(id);
    if (!medico) throw new NotFoundError("El medico no fue encontrado");

    repository.delete(id);

    return medico;
  }
}

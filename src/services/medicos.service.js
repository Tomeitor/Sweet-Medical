import { MedicoRepository } from "../repositories/medicos.repository.js";
import { NotFoundError } from '../errors/AppError.js'
import Medico from "../domain/Medico.js";

const repository = new MedicoRepository();

export default class MedicoService {
  async getAll() {
    return repository.getAll();
  }

  async getById(id) {
    const medico = await repository.getById(id);
    if (!medico) throw new NotFoundError("El medico no fue encontrado");
    return medico;
  }

  async create(medicoData) {
    return repository.add(new Medico(medicoData));
  }

  async update(id, medicoData) {
    const medico = await this.getById(id);

    const updatedMedico = { ...medico, ...medicoData, id };

    return repository.update(new Medico(updatedMedico));
  }

  async delete(id) {
    const medico = await this.getById(id);

    repository.delete(id);

    return medico;
  }
}

import { medicoRepository } from "../repositories/medicos.repository.js";
import { NotFoundError } from '../errors/AppError.js'
import Medico from "../domain/Medico.js";

export default class MedicoService {
  async getAll() {
    return await medicoRepository.getAll();
  }

  async getById(id) {
    const medico = await medicoRepository.getById(id);
    if (!medico) throw new NotFoundError("El medico no fue encontrado");
    return medico;
  }

  async create(medicoData) {
    return medicoRepository.add(new Medico(medicoData));
  }

  async update(id, medicoData) {
    const medico = await this.getById(id);

    const updatedMedico = { ...medico, ...medicoData, id };

    return medicoRepository.update(new Medico(updatedMedico));
  }

  async delete(id) {
    const medico = await this.getById(id);

    medicoRepository.delete(id);

    return medico;
  }
}

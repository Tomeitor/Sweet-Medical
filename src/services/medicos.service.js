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

    const updatedMedico = new Medico({ ...medico.toObject?.(), ...medicoData, _id: medico._id });

    return medicoRepository.update(id, updatedMedico);
  }

  async delete(id) {
    await this.getById(id);

    return await medicoRepository.delete(id);
  }
}

import { NotFoundError } from "../errors/AppError.js";
import { disponibilidadesRepository } from "../repositories/disponibilidades.repository.js";

export default class DisponibilidadesService {
  
  async getAll() {
    const disponibilidades = await disponibilidadesRepository.getAll();
    return disponibilidades;
  }
  
  async getByMedico(idMedico) {
    const disponibilidad = await disponibilidadesRepository.getByMedico(idMedico);
    return disponibilidad;
  }

  async getById(id) {
    const disponibilidad = await disponibilidadesRepository.getById(id);
    if (!disponibilidad) throw new NotFoundError("La disponibilidad no fue encontrada");
    return disponibilidad;
  }

  async create(nuevaDisponibilidad) {
    const disponibilidad = await disponibilidadesRepository.create(nuevaDisponibilidad);
    return disponibilidad;
  }

  async update(idDisp, disponibilidadActualizada) {
    const dispoExist = await this.getById(idDisp);

    const disponibilidad = await disponibilidadesRepository.update({...dispoExist, ...disponibilidadActualizada, id: idDisp});
    return disponibilidad;
  }

  async delete(idDisp) {
    const dispoExist = await this.getById(idDisp);

    const newDisponibilidad = await disponibilidadesRepository.delete(idDisp);
    
    return newDisponibilidad;
  }
}


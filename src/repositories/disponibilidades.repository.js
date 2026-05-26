import { DisponibilidadModel } from "../schemas/disponibilidadesSchema.js";
import { ensureObjectId } from "../utils/objectId.js";

export default class DisponibilidadesRepository {
  constructor() {
    this.model = DisponibilidadModel;
  }

  async getByMedico(medicoId) {
    ensureObjectId(medicoId, "El id del médico no es válido");
    return await this.model.find({medico: medicoId, eliminado: false});
  }

  async getById(id) {
    ensureObjectId(id);
    return await this.model.findById(id);
  }

  async getAll() {
    return await this.model.find({eliminado: false});
  }

  async create(disponibilidad) {
    return await this.model.create(disponibilidad);
  }

  async update(id, disponibilidad){
    ensureObjectId(id);
    return await this.model.findByIdAndUpdate(id, disponibilidad, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id){
    ensureObjectId(id);

    return await this.model.findByIdAndUpdate(id,
        {
          eliminado: true
        },
        {
          new: true
        });
  }

}

export const disponibilidadesRepository = new DisponibilidadesRepository();

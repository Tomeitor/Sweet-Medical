import { DisponibilidadModel } from "../schemas/disponibilidadesSchema.js";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "../errors/AppError.js";

export default class DisponibilidadesRepository {
  constructor() {
    this.disponibilidades = {};

    this.nexId = 1;

    this.model = DisponibilidadModel;

  }

  async getByMedico(idMedico) {
    return await this.model.find({idMedico: idMedico, eliminado: false});
  }

  async getById(id) {
    return await this.model.findById(id);
  }

  async getAll() {
    return await this.model.find({eliminado: false});
  }

  async create(disponibilidad) {
    return await this.model.create(disponibilidad);
  }

  async update(disponibilidad){

    this.validateId(disponibilidad.id);

    const query = {_id: disponibilidad.id}

    return await this.model.findOneAndUpdate(
        query,
        disponibilidad,
        {
          new: true
        }
    );
  }

  async delete(id){
    this.validateId(id);

    return await this.model.findByIdAndUpdate(id,
        {
          eliminado: true
        },
        {
          new: true
        });
  }

  validateId(id) {
    const esObjectId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    const esNumerico = !Number.isNaN(Number(id)) && Number(id) > 0;
    if (!esObjectId && !esNumerico) {
      throw new BadRequestError("El id no es válido");
    }
  }
}

export const disponibilidadesRepository = new DisponibilidadesRepository();
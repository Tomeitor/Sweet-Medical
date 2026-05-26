import DisponibilidadesRepository from "./disponibilidades.repository.js";
import { MedicosModel } from "../schemas/medicosSchema.js";
import Medico from "../domain/Medico.js";
import Disponibilidad from "../domain/Disponibilidad.js";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "../errors/AppError.js";


export class MedicoRepository {
  constructor() {
    this.medicos = {};

    this.nextId = 1;

    this.model = MedicosModel;

  }

  getAll = async () => {
    return await this.model.find({eliminado: false});
  };

  getById = async (id) => {
    this.validateId(id);

    return await this.model.findOne({_id: id, eliminado: false}).populate('disponibilidades');
  };

  async add(medico) {
    this.validateMedico(medico);

    medico.id = this.nextId++;

    return await this.model.create(medico);
  }

  async update(medico) {
    this.validateMedico(medico);
    this.validateId(medico.id);

    return await this.model.findOneAndUpdate({_id: medico.id, eliminado: false}, medico, {new: true});
  }

  delete = async (id) => {
    this.validateId(id);

    return await this.model.findOneAndUpdate({_id: id, eliminado: false},
        {
          eliminado: true
        },
        {
          new: true
        });
  };

  validateMedico(medico) {
    if (!(medico instanceof Medico)) {
      throw new UnprocessableEntityError("El médico es inválido");
    }
  }
  validateDisponibilidad(disp) {
    if (!(disp instanceof Disponibilidad)) {
      throw new UnprocessableEntityError("La disponibilidad es inválido");
    }
  }

  validateId(id) {
    const esObjectId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    const esNumerico = !Number.isNaN(Number(id)) && Number(id) > 0;
    if (!esObjectId && !esNumerico) {
      throw new BadRequestError("El id no es válido");
    }
  }
}

export const medicoRepository = new MedicoRepository();

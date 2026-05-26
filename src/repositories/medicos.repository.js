import DisponibilidadesRepository from "./disponibilidades.repository.js";
import { MedicosModel } from "../schemas/medicosSchema.js";
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

    return await this.model.findById(id).populate('sedes').populate('disponibilidades');
  };

  async add(medico) {
    this.validateMedico(medico);

    medico.id = this.nextId++;

    return await this.model.create(medico);
  }

  async update(medico) {
    this.validateMedico(medico);
    this.validateId(medico.id);

    return await this.model.findByIdAndUpdate(medico.id, medico, {new: true});
  }

  delete = async (id) => {
    this.validateId(id);

    return await this.model.findByIdAndUpdate(id,
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
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new BadRequestError("El id no es válido");
    }
  }
}

export const medicoRepository = new MedicoRepository();

import { MedicosModel } from "../schemas/medicosSchema.js";
import {
  UnprocessableEntityError,
} from "../errors/AppError.js";
import { ensureObjectId } from "../utils/objectId.js";
import Medico from "../domain/Medico.js";


export class MedicoRepository {
  constructor() {
    this.model = MedicosModel;
  }

  getAll = async () => {
    return await this.model.find({eliminado: false}).populate('sedes');
  };

  getById = async (id) => {
    ensureObjectId(id);

    return await this.model.findById(id).populate('sedes');
  };

  async add(medico) {
    this.validateMedico(medico);

    return await this.model.create(medico);
  }

  async update(id, medico) {
    this.validateMedico(medico);
    ensureObjectId(id);

    return await this.model.findByIdAndUpdate(id, medico, {new: true, runValidators: true}).populate('sedes');
  }

  delete = async (id) => {
    ensureObjectId(id);

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
}

export const medicoRepository = new MedicoRepository();

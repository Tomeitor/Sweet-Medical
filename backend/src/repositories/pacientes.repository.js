import { BadRequestError } from '../errors/AppError.js';
import { PacientesModel } from '../schemas/pacientesSchema.js';

export const NivelCobertura = Object.freeze({
  TOTAL: 'TOTAL',
  PARCIAL: 'PARCIAL',
  NO_CUBIERTA: 'NO_CUBIERTA',
});

export class PacientesRepository {
  constructor() {
    this.model = PacientesModel;
  }

  async getById(id) {
    this.validateId(id);

    const numericId = Number(id);
    const query = {
      eliminado: false,
    };

    if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
      query._id = id;
    } else {
      query.legacyId = Number.isNaN(numericId) ? null : numericId;
    }

    return await this.model.findOne(query);
  }

  async getAll() {
    return await this.model.find({ eliminado: false });
  }

  validateId(id) {
    const esObjectId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    const esNumerico = !Number.isNaN(Number(id)) && Number(id) > 0;
    if (!esObjectId && !esNumerico) {
      throw new BadRequestError('El id no es válido');
    }
  }
}

export const pacientesRepository = new PacientesRepository();

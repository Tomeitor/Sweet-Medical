import mongoose from 'mongoose';

import { BadRequestError } from '../errors/AppError.js';

export function ensureObjectId(id, message = 'El id no es válido') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError(message);
  }

  return id;
}

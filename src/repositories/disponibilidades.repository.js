import Disponibilidad from "../domain/Disponibilidad.js";
import { DisponibilidadModel } from "../schemas/disponibilidadesSchema.js";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "../errors/AppError.js";

const disponibilidadesMock = [
  new Disponibilidad({
    id: 1,
    idMedico: 1,
    diaSemana: "MARTES",
    desde: "08:00",
    hasta: "12:00",
    eliminado: false,
  }),
  new Disponibilidad({
    id: 2,
    idMedico: 1,
    diaSemana: "MIERCOLES",
    desde: "08:00",
    hasta: "12:00",
    eliminado: false,
  }),
  new Disponibilidad({
    id: 4,
    idMedico: 2,
    diaSemana: "LUNES",
    desde: "08:00",
    hasta: "12:00",
    eliminado: false,
  })
];

export default class DisponibilidadesRepository {
  constructor() {
    /*
    disponibilidadesMock.forEach((disp) => {
      this.disponibilidades[disp.id] = disp;
    });

    this.nextId = disponibilidadesMock.length + 1;
    */

    this.disponibilidades = {};

    this.nexId = 1;

    this.model = DisponibilidadModel;

  }

  async getByMedico(idMedico) {
    /*
    const disponibilidad = Object.values(this.disponibilidades).filter(
      (m) => !m.eliminado && m.idMedico == idMedico,
    );
    if(!disponibilidad) return [];
     */
    return await this.model.findOne({ idMedico: idMedico });
  }

  async getById(id) {
    /*
    this.validateId(id);

    return this.disponibilidades[id] && !this.disponibilidades[id].eliminado
      ? this.disponibilidades[id]
      : null;
    */
    return await this.model.findById(id);
  }

  async getAll() {
    // return Object.values(this.disponibilidades).filter((m) => !m.eliminado);
    return await this.model.find({eliminado: false});
  }

  async create(disponibilidad) {
    /*
    disponibilidad.id = this.nextId++;
    this.disponibilidades[disponibilidad.id] = disponibilidad;
     */

    return await this.model.create({id : this.nextId++});
  }

  async update(disponibilidad){
    /*

    const dispActual = this.getById(disponibilidad.id);

    this.disponibilidades[disponibilidad.id] = {
      ...dispActual,
      ...disponibilidad,
    };
     */

    this.validateId(disponibilidad.id);

    const query = {_id: disponibilidad.id}

    return await this.model.findOneAndUpdate(
        query,
        disponibilidad
    );
  }

  async delete(id){
    this.validateId(id);

    // this.disponibilidades[id] = { ...this.disponibilidades[id], eliminado: true };

    return await this.model.findByIdAndUpdate(id,
        {
          eliminado: true
        },
        {
          new: true
        });
  }

  validateId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new BadRequestError("El id no es válido");
    }
  }
}

export const disponibilidadesRepository = new DisponibilidadesRepository();
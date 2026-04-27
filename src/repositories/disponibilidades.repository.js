import Disponibilidad from "../domain/Disponibilidad.js";
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
    this.disponibilidades = new Set();

    disponibilidadesMock.forEach((disp) => {
      this.disponibilidades[disp.id] = disp;
    });

    this.nextId = disponibilidadesMock.length + 1;
  }
  getByMedico(idMedico) {
    const disponibilidad = Object.values(this.disponibilidades).filter(
      (m) => !m.eliminado && m.idMedico == idMedico,
    );
    if(!disponibilidad) return [];
    return disponibilidad;
  }

  getById(id) {
    this.validateId(id);

    return this.disponibilidades[id] && !this.disponibilidades[id].eliminado
      ? this.disponibilidades[id]
      : null;
  }

  getAll() {
    return Object.values(this.disponibilidades).filter((m) => !m.eliminado);
  }

  create(disponibilidad) {
    disponibilidad.id = this.nextId++;
    this.disponibilidades[disponibilidad.id] = disponibilidad;
    return disponibilidad;
  }

  update(disponibilidad){
    this.validateId(disponibilidad.id);
    const dispActual = this.getById(disponibilidad.id);

    this.disponibilidades[disponibilidad.id] = {
      ...dispActual,
      ...disponibilidad,
    };
    return disponibilidad;
  }

  delete(id){
    this.validateId(id);
    const disponibilidadAEliminar = this.getById(id); // Se verifica que existe en el service

    this.disponibilidades[id] = { ...disponibilidadAEliminar, eliminado: true };
    return disponibilidadAEliminar;
  }

  validateId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new BadRequestError("El id no es válido");
    }
  }
}

export const disponibilidadesRepository = new DisponibilidadesRepository();
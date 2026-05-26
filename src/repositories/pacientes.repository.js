import { BadRequestError } from "../errors/AppError.js";

export const NivelCobertura = Object.freeze({
  TOTAL: "TOTAL",
  PARCIAL: "PARCIAL",
  NO_CUBIERTA: "NO_CUBIERTA",
});

const pacientesMock = [
  {
    id: 1,
    nombre: "Juan Perez",
    obraSocial: {
      id: 1,
      nombre: "OSDE",
    },
    plan: {
      id: 1,
      nombre: "210",
      coberturasEspecialidad: [
        { especialidad: "Cardiologia", nivel: NivelCobertura.TOTAL },
        { especialidad: "Dermatologia", nivel: NivelCobertura.PARCIAL },
      ],
      coberturasPractica: [
        { practica: "Electrocardiograma", nivel: NivelCobertura.PARCIAL },
        { practica: "Biopsia de piel", nivel: NivelCobertura.NO_CUBIERTA },
      ],
    },
  },
  {
    id: 2,
    nombre: "Maria Lopez",
    obraSocial: {
      id: 2,
      nombre: "Swiss Medical",
    },
    plan: {
      id: 2,
      nombre: "SMG20",
      coberturasEspecialidad: [
        { especialidad: "Clinica Medica", nivel: NivelCobertura.TOTAL },
      ],
      coberturasPractica: [
        { practica: "Consulta General", nivel: NivelCobertura.TOTAL },
      ],
    },
  },
];

export class PacientesRepository {
  constructor() {
    this.pacientes = {};

    pacientesMock.forEach((paciente) => {
      this.pacientes[paciente.id] = paciente;
    });
  }

  getById(id) {
    this.validateId(id);
    return this.pacientes[id] ?? null;
  }

  validateId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new BadRequestError("El id no es válido");
    }
  }
}

export const pacientesRepository = new PacientesRepository();

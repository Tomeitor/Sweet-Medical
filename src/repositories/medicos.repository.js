import Medico from "../domain/Medico.js";
import DisponibilidadesRepository from "./disponibilidades.repository.js";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "../errors/AppError.js";

const medicosMock = [
  new Medico({
    id: 1,
    usuario: "anagomez",
    matricula: "12345",
    nombre: "Dra. Ana Gómez",
    especialidades: [],
    practicas: [],
    sedes: [],
    eliminado: false,
  }),
  new Medico({
    id: 2,
    usuario: "joseperez",
    matricula: "54321",
    nombre: "Dr. José Perez",
    especialidades: [],
    practicas: [],
    sedes: [],
    eliminado: false,
  }),
  new Medico({
    id: 3,
    usuario: "mariafernandez",
    matricula: "67890",
    nombre: "Dra. Maria Fernandez",
    especialidades: [],
    practicas: [],
    sedes: [],
    eliminado: false,
  }),
  new Medico({
    id: 4,
    usuario: "pedrolopez",
    matricula: "98765",
    nombre: "Dr. Pedro Lopez",
    especialidades: [],
    practicas: [],
    sedes: [],
    eliminado: false,
  }),
  new Medico({
    id: 5,
    usuario: "mariajimenez",
    matricula: "24680",
    nombre: "Dra. Maria Jimenez",
    especialidades: [],
    practicas: [],
    sedes: [],
    eliminado: false,
  }),
  new Medico({
    id: 6,
    usuario: "josemartinez",
    matricula: "13579",
    nombre: "Dr. Jose Martinez",
    especialidades: [],
    practicas: [],
    sedes: [],
    eliminado: false,
  }),
  new Medico({
    id: 7,
    usuario: "anaalvarez",
    matricula: "86420",
    nombre: "Dra. Ana Alvarez",
    especialidades: [],
    practicas: [],
    sedes: [],
    eliminado: false,
  }),
];
const disponibilidadesRepository = new DisponibilidadesRepository();

export class MedicoRepository {
  constructor() {
    this.medicos = new Set();

    medicosMock.forEach((medico) => {
      this.medicos[medico.id] = medico;
    });

    this.nextId = medicosMock.length + 1;
  }

  getAll = async () => {
    const medicos = Object.values(this.medicos).filter((m) => !m.eliminado);
    const medicosConDisponibilidades = await Promise.all(
      medicos.map(async (medico) => {
        medico.disponibilidad = await disponibilidadesRepository.getByMedico(
          medico.id,
        );
        return medico;
      }),
    );
    console.log(medicosConDisponibilidades);
    return medicosConDisponibilidades;
  };

  getById = async (id) => {
    this.validateId(id);

    const medico =
      this.medicos[id] && !this.medicos[id].eliminado ? this.medicos[id] : null;
    medico.disponibilidad = await disponibilidadesRepository.getByMedico(id);

    return medico;
  };

  add(medico) {
    this.validateMedico(medico);

    medico.id = this.nextId++;
    this.medicos[medico.id] = medico;
    return medico;
  }

  update(medico) {
    this.validateMedico(medico);
    this.validateId(medico.id);

    this.medicos[medico.id] = medico;
    return medico;
  }

  delete = async (id) => {
    this.validateId(id);

    this.medicos[id] = { eliminado: true };
    return this.medicos[id];
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

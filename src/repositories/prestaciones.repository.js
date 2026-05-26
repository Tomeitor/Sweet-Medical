const especialidadesMock = [
  {
    nombre: "Cardiologia",
    costo: 15000,
    duracionTurnoMinutos: 30,
  },
  {
    nombre: "Dermatologia",
    costo: 12000,
    duracionTurnoMinutos: 15,
  },
  {
    nombre: "Clinica Medica",
    costo: 10000,
    duracionTurnoMinutos: 15,
  },
];

const practicasMock = [
  {
    nombre: "Electrocardiograma",
    costo: 25000,
    duracionTurnoMinutos: 45,
  },
  {
    nombre: "Biopsia de piel",
    costo: 30000,
    duracionTurnoMinutos: 30,
  },
  {
    nombre: "Consulta General",
    costo: 10000,
    duracionTurnoMinutos: 15,
  },
];

export class PrestacionesRepository {
  getEspecialidadByNombre(nombre) {
    return especialidadesMock.find((especialidad) =>
      especialidad.nombre.toLowerCase() === nombre.toLowerCase(),
    ) ?? null;
  }

  getPracticaByNombre(nombre) {
    return practicasMock.find((practica) =>
      practica.nombre.toLowerCase() === nombre.toLowerCase(),
    ) ?? null;
  }
}

export const prestacionesRepository = new PrestacionesRepository();

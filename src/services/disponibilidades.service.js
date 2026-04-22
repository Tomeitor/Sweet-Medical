import { disponibilidadesDB } from "../repositories/disponibilidades.repository.js";
import { medicosDB } from "../repositories/medicos.repository.js";

export default class DisponibilidadesService {
  async getByMedico(idMedico) {

    const medico = medicosDB.find(m => m.id == idMedico);

    if (!medico) throw new Error("Médico no encontrado");

    return disponibilidadesDB.filter(d => d.idMedico == idMedico);
  }

  async getById(idMedico, id) {

    const medico = medicosDB.find(m => m.id == idMedico);

    if (!medicosDB.find(m => m.id == idMedico)) throw new Error("Médico no encontrado");

    const disponibilidad = disponibilidadesDB.find((m) => m.id == id);
    if (!disponibilidad) throw new Error("Disponibilidad no encontrada");
    return disponibilidad;
  }

  async create(idMedico, nuevaDisponibilidad) {

    const medico = medicosDB.find(m => m.id == idMedico);

    if (!medico) throw new Error("Médico no encontrado");

    const disponibilidad = {
      id: disponibilidadesDB.length + 1,
      idMedico,
      ...nuevaDisponibilidad
    };
    disponibilidadesDB.push(disponibilidad);
    return disponibilidad;
  }


  async update(idMedico, id, disponibilidadActualizada) {

    const medico = medicosDB.find(m => m.id == idMedico);

    if (!medico) throw new Error("Médico no encontrado");

    const index = disponibilidadesDB.findIndex((m) => m.id === parseInt(id));
    if (index === -1) throw new Error("Disponibilidad no encontrada");

    disponibilidadesDB[index] = { ...disponibilidadesDB[index], ...disponibilidadActualizada };
    return disponibilidadesDB[index];
  }


  async delete(idMedico, id) {

    const medico = medicosDB.find(m => m.id == idMedico);

    if (!medico) throw new Error("Médico no encontrado");

    const index = disponibilidadesDB.findIndex((m) => m.id === parseInt(id));
    if (index === -1) throw new Error("Disponibilidad no encontrada");

    const disponibilidadEliminada = disponibilidadesDB.splice(index, 1);
    return disponibilidadEliminada[0];
  }
}

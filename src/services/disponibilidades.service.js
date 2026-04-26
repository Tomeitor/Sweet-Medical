import { NotFoundError } from "../errors/AppError.js";
import { disponibilidadesDB } from "../repositories/disponibilidades.repository.js";
import { MedicoRepository } from "../repositories/medicos.repository.js";
import MedicoService from "./medicos.service.js";

const medicoService = new MedicoService();

export default class DisponibilidadesService {
  async getByMedico(idMedico) {
    const medico = await medicoService.getById(idMedico);
    return medico.disponibilidad;
  }

  async getById(idMedico, id) {
    const medico = await medicoService.getById(idMedico);
    const disp = await medico.disponibilidad.find((disp) => disp.id == id);
    if (!disp) throw new NotFoundError("Disponibilidad no encontrada");
    return disp;
  }

  async create(idMedico, nuevaDisponibilidad) {
    const medico = await medicoService.getById(idMedico);

    const newMedico = await medicoService.update(idMedico, {
      disponibilidad: [...medico.disponibilidad, nuevaDisponibilidad],
    });
    return newMedico.disponibilidad;
  }

  async update(idMedico, idDisp, disponibilidadActualizada) {
    const medico = await medicoService.getById(idMedico);
    const newMedico = await medicoService.update(idMedico, {
      disponibilidad: medico.disponibilidad.map((disp) =>
        disp.id == idDisp ? disponibilidadActualizada : disp,
      ),
    });
    return newMedico.disponibilidad;
  }

  async delete(idMedico, idDisp) {
    const medico = await medicoService.getById(idMedico);
    const newMedico = await medicoService.update(idMedico, {
      disponibilidad: medico.disponibilidad.filter((disp) => disp.id != idDisp),
    });
    return newMedico.disponibilidad;
  }
}

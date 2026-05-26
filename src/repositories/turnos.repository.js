import { Turno } from "../domain/Turno.js"
import { TurnosModel } from "../schemas/turnosSchema.js";
import {
    UnprocessableEntityError,
    NotFoundError
} from "../errors/AppError.js"
import { ensureObjectId } from "../utils/objectId.js";

export class TurnosRepository {
    constructor() {
        this.model = TurnosModel;
    }

    async add(turno) {
        this.validateTurno(turno)

        return await this.model.create(turno);
    }

    async findById(id) {
        ensureObjectId(id)

        return await this.model.findById(id).populate('medico').populate('sede');
    }

    async findByMedicoYFecha(medicoId, fecha) {
        ensureObjectId(medicoId, "El id del médico no es válido")

        if (!(fecha instanceof Date)) {
            throw new UnprocessableEntityError("La fecha es obligatoria")
        }

        return await this.model.findOne({medico: medicoId, fechaHora: fecha});
    }

    async findByPaciente(pacienteId) {
        return await this.model.find({pacienteId}).populate('medico').populate('sede');
    }

    async update(id, turno) {
        this.validateTurno(turno)
        ensureObjectId(id)

        const turnoExistente = await this.model.findById(id);

        if (!turnoExistente) {
            throw new NotFoundError("El turno no existe")
        }

        return await this.model.findByIdAndUpdate(id, turno, { new: true, runValidators: true }).populate('medico').populate('sede');
    }

    async getAll() {
        return await this.model.find({}).populate('medico').populate('sede');
    }

    validateTurno(turno) {
        if (!(turno instanceof Turno)) {
            throw new UnprocessableEntityError("El turno es inválido")
        }
    }
}

export const turnosRepository = new TurnosRepository()

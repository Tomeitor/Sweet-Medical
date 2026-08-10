import { Turno } from "../domain/Turno.js"
import { TurnosModel } from "../schemas/turnosSchema.js";
import {
    BadRequestError,
    NotFoundError
} from "../errors/AppError.js"

export class TurnosRepository {
    constructor() {
        this.turnos = {}
        this.nextId = 1
        this.model = TurnosModel;
    }

    async add(turno) {
        this.validateTurno(turno)
        turno.id = this.nextId++

        return await this.model.create(turno);
    }

    async findById(id) {
        this.validateId(id)

        return await this.model.findById(id);
    }

    async findByMedicoYFecha(medicoId, fecha) {
        this.validateId(medicoId)

        if (!(fecha instanceof Date)) {
            throw new BadRequestError("La fecha es obligatoria")
        }

        return await this.model.findOne({medico: medicoId, fechaHora: fecha});
        
//         return Object.values(this.turnos).find(t =>
//             t.medico.id == medicoId &&
//             t.fechaHora.getTime() === fecha.getTime() &&
//             t.estado !== 'CANCELADO'
//         ) ?? null
    }

    async findByPaciente(pacienteId) {
        this.validateId(pacienteId)

        return await this.model.find({
            $or: [
                {"paciente.id": pacienteId},
                {paciente: pacienteId},
            ],
        });
      
    }

    async findByMedico(medicoId) {
        this.validateId(medicoId)

        return await this.model.find({ medico: medicoId });
    }

    async update(turno) {
        this.validateTurno(turno)
        this.validateId(turno.id)

        const turnoExistente = await this.model.findById(turno.id);

        if (!turnoExistente) {
            throw new NotFoundError("El turno no existe")
        }

        return await this.model.findByIdAndUpdate(turno.id, turno, { new: true });
    }

    async getAll() {
        return await this.model.find({});
    }

    validateTurno(turno) {
        const esTurnoDeDominio = turno instanceof Turno;
        const esDocumentoMongoose = turno instanceof this.model;

        if (!esTurnoDeDominio && !esDocumentoMongoose) {
            throw new BadRequestError("El turno es inválido")
        }
    }

    validateId(id) {
        const esObjectId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
        const esNumerico = !Number.isNaN(Number(id)) && Number(id) > 0;
        if (!esObjectId && !esNumerico) {
            throw new BadRequestError("El id no es válido")
        }
    }
}

export const turnosRepository = new TurnosRepository()

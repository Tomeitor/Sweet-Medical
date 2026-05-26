import { Turno } from "../domain/Turno.js"
import { EstadoTurno } from "../domain/EstadoTurno.js"
import { TurnosModel } from "../schemas/turnosSchema.js";
import {
    BadRequestError,
    NotFoundError
} from "../errors/AppError.js"

const ESTADOS_QUE_OCUPAN_TURNO = [
    EstadoTurno.RESERVADO,
    EstadoTurno.CONFIRMADO,
    EstadoTurno.REALIZADO,
]

export class TurnosRepository {
    constructor() {
        this.turnos = {}
        this.nextId = 1
        this.model = TurnosModel;
    }

    async add(turno) {
        /*
        this.turnos[turno.id] = turno
        return turno
         */
        this.validateTurno(turno)
        turno.id = this.nextId++

        return await this.model.create(turno);
    }

    async findById(id) {
        this.validateId(id)
        //return this.turnos[id] ?? null
        return await this.model.findById(id);
    }

    async findByMedicoYFecha(medicoId, fecha) {
        this.validateId(medicoId)
        if (!(fecha instanceof Date)) {
            throw new BadRequestError("La fecha es obligatoria")
        }

        /*
        return Object.values(this.turnos).find(t =>
            t.medico.id == medicoId &&
            t.fechaHora.getTime() === fecha.getTime() &&
            ESTADOS_QUE_OCUPAN_TURNO.includes(t.estado)
        ) ?? null
        */

        return await this.model.find({medico: medicoId, fechaHora: fecha});
    }

    async findByPaciente(pacienteId) {
        this.validateId(pacienteId)

        //return Object.values(this.turnos).filter(t => t.paciente === pacienteId)
        return await this.model.findById(pacienteId);
    }

    async update(turno) {
        this.validateTurno(turno)
        this.validateId(turno.id)


        const turnoExistente = await this.model.findById(turno.id);
        if (!turnoExistente) {
            throw new NotFoundError("El turno no existe")
        }

        /*
        this.turnos[turno.id] = turno
         */

        return await this.model.findByIdAndUpdate(turno.id, turno);
    }

    async getAll() {
        // return Object.values(this.turnos)
        return await this.model.find({});
    }

    validateTurno(turno) {
        if (!(turno instanceof Turno)) {
            throw new BadRequestError("El turno es inválido")
        }
    }

    validateId(id) {
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw new BadRequestError("El id no es válido")
        }
    }
}

export const turnosRepository = new TurnosRepository()

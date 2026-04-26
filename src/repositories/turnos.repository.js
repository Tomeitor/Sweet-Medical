import { Turno } from "../domain/Turno.js"
import {
    BadRequestError,
    NotFoundError,
    ConflictError
} from "../errors/AppError.js"

export class TurnosRepository {
    constructor() {
        this.turnos = {}
        this.nextId = 1
    }

    add(turno) {
        this.validateTurno(turno)
        turno.id = this.nextId++
        this.turnos[turno.id] = turno
        return turno
    }

    findById(id) {
        this.validateId(id)
        return this.turnos[id] ?? null
    }

    findByMedicoYFecha(medicoId, fecha) {
        this.validateId(medicoId)
        if (!(fecha instanceof Date)) {
            throw new BadRequestError("La fecha es obligatoria")
        }

        return Object.values(this.turnos).find(t =>
            t.medico.id === medicoId &&
            t.fechaHora.getTime() === fecha.getTime() &&
            t.estado !== 'CANCELADO'
        ) ?? null
    }

    update(turno) {
        this.validateTurno(turno)
        this.validateId(turno.id)

        const turnoExistente = this.turnos[turno.id]
        if (!turnoExistente) {
            throw new NotFoundError("El turno no existe")
        }

        this.turnos[turno.id] = turno
        return turno
    }

    getAll() {
        return Object.values(this.turnos)
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

import { Disponibilidad } from "../domain/Disponibilidad.js"
import {
    BadRequestError,
    NotFoundError
} from "../errors/AppError.js"

const disponibilidadesMock = [
    new Disponibilidad(1, 1, 'LUNES', '09:00', '17:00'),
    new Disponibilidad(2, 1, 'MARTES', '09:00', '17:00'),
    new Disponibilidad(3, 1, 'MIERCOLES', '09:00', '17:00'),
    new Disponibilidad(4, 1, 'JUEVES', '09:00', '17:00'),
    new Disponibilidad(5, 1, 'VIERNES', '09:00', '17:00'),
    new Disponibilidad(6, 16, 'LUNES', '08:00', '14:00'),
    new Disponibilidad(7, 16, 'MARTES', '08:00', '14:00'),
    new Disponibilidad(8, 16, 'MIERCOLES', '08:00', '14:00'),
    new Disponibilidad(9, 16, 'JUEVES', '08:00', '14:00'),
    new Disponibilidad(10, 16, 'VIERNES', '08:00', '14:00'),
    new Disponibilidad(11, 17, 'LUNES', '12:00', '19:00'),
    new Disponibilidad(12, 17, 'MARTES', '12:00', '19:00'),
    new Disponibilidad(13, 17, 'MIERCOLES', '12:00', '19:00'),
    new Disponibilidad(14, 17, 'JUEVES', '12:00', '19:00'),
    new Disponibilidad(15, 17, 'VIERNES', '12:00', '19:00'),
    new Disponibilidad(16, 2, 'MARTES', '08:00', '12:00'),
    new Disponibilidad(17, 2, 'JUEVES', '14:00', '18:00'),
    new Disponibilidad(18, 3, 'LUNES', '10:00', '16:00'),
    new Disponibilidad(19, 3, 'MIERCOLES', '10:00', '16:00'),
    new Disponibilidad(20, 3, 'VIERNES', '10:00', '16:00'),
    new Disponibilidad(21, 5, 'MARTES', '09:00', '15:00'),
    new Disponibilidad(22, 5, 'JUEVES', '09:00', '15:00'),
    new Disponibilidad(23, 7, 'LUNES', '14:00', '18:00'),
    new Disponibilidad(24, 7, 'JUEVES', '14:00', '18:00'),
    new Disponibilidad(25, 9, 'MIERCOLES', '08:00', '14:00'),
    new Disponibilidad(26, 9, 'VIERNES', '08:00', '14:00'),
    new Disponibilidad(27, 10, 'MARTES', '14:00', '18:00'),
    new Disponibilidad(28, 10, 'JUEVES', '14:00', '18:00'),
    new Disponibilidad(29, 10, 'SABADO', '09:00', '13:00'),
    new Disponibilidad(30, 12, 'LUNES', '08:00', '12:00'),
    new Disponibilidad(31, 12, 'MIERCOLES', '08:00', '12:00'),
    new Disponibilidad(32, 14, 'MARTES', '10:00', '17:00'),
    new Disponibilidad(33, 14, 'VIERNES', '10:00', '17:00'),
    new Disponibilidad(34, 18, 'LUNES', '09:00', '13:00'),
    new Disponibilidad(35, 18, 'MIERCOLES', '09:00', '13:00'),
    new Disponibilidad(36, 18, 'VIERNES', '09:00', '13:00'),
    new Disponibilidad(37, 20, 'MARTES', '15:00', '19:00'),
    new Disponibilidad(38, 20, 'JUEVES', '15:00', '19:00'),
    new Disponibilidad(39, 4, 'VIERNES', '09:00', '13:00'),
    new Disponibilidad(40, 6, 'MARTES', '13:00', '17:00'),
    new Disponibilidad(41, 8, 'JUEVES', '10:00', '14:00'),
    new Disponibilidad(42, 11, 'LUNES', '14:00', '18:00'),
    new Disponibilidad(43, 13, 'MIERCOLES', '10:00', '16:00'),
    new Disponibilidad(44, 15, 'LUNES', '08:00', '12:00'),
    new Disponibilidad(45, 19, 'VIERNES', '08:00', '12:00')
]

export class DisponibilidadesRepository {
    constructor() {
        this.disponibilidades = {}

        disponibilidadesMock.forEach(disp => {
            this.disponibilidades[disp.id] = disp
        })

        this.nextId = disponibilidadesMock.length + 1
    }

    getAll() {
        return Object.values(this.disponibilidades)
    }

    getByMedico(idMedico) {
        this.validateIdMedico(idMedico)
        return Object.values(this.disponibilidades).filter(d => d.idMedico === Number(idMedico))
    }

    findById(id) {
        this.validateId(id)
        return this.disponibilidades[id] ?? null
    }

    add(disponibilidad) {
        this.validateDisponibilidad(disponibilidad)
        disponibilidad.id = this.nextId++
        this.disponibilidades[disponibilidad.id] = disponibilidad
        return disponibilidad
    }

    update(disponibilidad) {
        this.validateDisponibilidad(disponibilidad)
        this.validateId(disponibilidad.id)

        const dispExistente = this.disponibilidades[disponibilidad.id]
        if (!dispExistente) {
            throw new NotFoundError("La disponibilidad no existe")
        }

        this.disponibilidades[disponibilidad.id] = disponibilidad
        return disponibilidad
    }

    delete(id) {
        this.validateId(id)

        const dispAEliminar = this.disponibilidades[id]
        if (!dispAEliminar) {
            throw new NotFoundError("La disponibilidad no existe")
        }

        delete this.disponibilidades[id]
        return dispAEliminar
    }

    validateDisponibilidad(disp) {
        if (!(disp instanceof Disponibilidad)) {
            throw new BadRequestError("La disponibilidad es inválida")
        }
    }

    validateId(id) {
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw new BadRequestError("El id no es válido")
        }
    }

    validateIdMedico(idMedico) {
        if (!Number.isInteger(Number(idMedico)) || Number(idMedico) <= 0) {
            throw new BadRequestError("El id del médico no es válido")
        }
    }
}
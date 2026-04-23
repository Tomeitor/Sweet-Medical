import { Medico } from "../domain/Medico.js"
import {
    BadRequestError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"


const medicosMock = [
    new Medico({ id: 1, nombre: 'Dra. Ana Gómez', especialidad: 'Pediatría', matricula: '12345' }),
    new Medico({ id: 2, nombre: 'Dr. Luis Pérez', especialidad: 'Cardiología', matricula: '67890' }),
    new Medico({ id: 3, nombre: 'Dra. María Fernández', especialidad: 'Neurología', matricula: '23456' }),
    new Medico({ id: 4, nombre: 'Dr. Carlos Ruiz', especialidad: 'Dermatología', matricula: '78901' }),
    new Medico({ id: 5, nombre: 'Dra. Laura Martínez', especialidad: 'Traumatología', matricula: '34567' }),
    new Medico({ id: 6, nombre: 'Dr. Jorge Silva', especialidad: 'Ginecología', matricula: '89012' }),
    new Medico({ id: 7, nombre: 'Dra. Sofía López', especialidad: 'Oftalmología', matricula: '45678' }),
    new Medico({ id: 8, nombre: 'Dr. Diego Torres', especialidad: 'Psiquiatría', matricula: '90123' }),
    new Medico({ id: 9, nombre: 'Dra. Valentina Castro', especialidad: 'Oncología', matricula: '56789' }),
    new Medico({ id: 10, nombre: 'Dr. Martín Romero', especialidad: 'Urología', matricula: '01234' }),
    new Medico({ id: 11, nombre: 'Dra. Camila Sosa', especialidad: 'Endocrinología', matricula: '13579' }),
    new Medico({ id: 12, nombre: 'Dr. Fernando Iglesias', especialidad: 'Gastroenterología', matricula: '24680' }),
    new Medico({ id: 13, nombre: 'Dra. Paula Navarro', especialidad: 'Otorrinolaringología', matricula: '11223' }),
    new Medico({ id: 14, nombre: 'Dr. Javier Molina', especialidad: 'Neumonología', matricula: '44556' }),
    new Medico({ id: 15, nombre: 'Dra. Lucía Herrera', especialidad: 'Reumatología', matricula: '77889' }),
    new Medico({ id: 16, nombre: 'Dr. Andrés Giménez', especialidad: 'Cirugía General', matricula: '99001' }),
    new Medico({ id: 17, nombre: 'Dra. Florencia Ríos', especialidad: 'Medicina Interna', matricula: '22334' }),
    new Medico({ id: 18, nombre: 'Dr. Pablo Vargas', especialidad: 'Infectología', matricula: '55667' }),
    new Medico({ id: 19, nombre: 'Dra. Natalia Domínguez', especialidad: 'Nefrología', matricula: '88990' }),
    new Medico({ id: 20, nombre: 'Dr. Gabriel Blanco', especialidad: 'Hematología', matricula: '33445' })
];

export class MedicoRepository {
    constructor() {
        this.medicos = {}
        
        medicosMock.forEach(medico => {
            this.medicos[medico.id] = medico 
        })
        
        this.nextId = medicosMock.length + 1 
    }

    getAll() {
        return Object.values(this.medicos)
    }

    getPaginated(numeroPagina, limitePorPagina, filtros = {}) {
        let medicos = Object.values(this.medicos)

        if (filtros.especialidad !== undefined) {
            const especialidadNormalizada = filtros.especialidad.trim().toLowerCase()
            medicos = medicos.filter((m) => m.especialidad.trim().toLowerCase() === especialidadNormalizada)
        }
        
        if (filtros.nombre !== undefined) {
            const nombreNormalizado = filtros.nombre.trim().toLowerCase()
            medicos = medicos.filter((m) => m.nombre.trim().toLowerCase().includes(nombreNormalizado))
        }

        const inicio = (numeroPagina - 1) * limitePorPagina
        const fin = inicio + limitePorPagina

        return {
            medicos: medicos.slice(inicio, fin),
            totalMedicos: medicos.length
        }
    }

    add(medico) {
        this.validateMedico(medico)
        medico.id = this.nextId++
        this.medicos[medico.id] = medico
        return medico
    }

    update(medico){
        this.validateMedico(medico)
        this.validateId(medico.id)

        const medicoExistente = this.medicos[medico.id]

        if (!medicoExistente) {
            throw new NotFoundError("El id no pertenece a un médico")
        }

        this.medicos[medico.id] = medico
        return medico
    }

    saveAll(medicos) {
        if (!Array.isArray(medicos)) {
            throw new BadRequestError("Debe enviar una lista de médicos")
        }

        return medicos.map((medico) => this.add(medico))
    }

    getById(id) {
        this.validateId(id)

        return this.medicos[id] ?? null
    }

    getByNombre(nombre) {
        this.validateNombre(nombre)
        const nombreNormalizado = nombre.trim().toLowerCase()

        return (
            Object.values(this.medicos).find((medico) => {
                return medico.nombre.trim().toLowerCase() === nombreNormalizado
            }) ?? null
        )
    }

    getByMatricula(matricula) {
        if (typeof matricula !== "string" || matricula.trim().length === 0) {
            throw new BadRequestError("La matrícula del médico es obligatoria")
        }
        
        const matriculaNormalizada = matricula.trim()

        return (
            Object.values(this.medicos).find((medico) => {
                return medico.matricula.trim() === matriculaNormalizada
            }) ?? null
        )
    }

    delete(id) {
        this.validateId(id)

        const medicoAEliminar = this.medicos[id]

        if (!medicoAEliminar) {
            throw new NotFoundError("El id no pertenece a un médico")
        }

        delete this.medicos[id]
        return medicoAEliminar
    }

    validateMedico(medico) {
        if (!(medico instanceof Medico)) {
            throw new UnprocessableEntityError("El médico es inválido")
        }
    }

    validateId(id) {
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw new BadRequestError("El id no es válido")
        }
    }

    validateNombre(nombre) {
        if (typeof nombre !== "string" || nombre.trim().length === 0) {
            throw new BadRequestError("El nombre del médico es obligatorio")
        }
    }
}
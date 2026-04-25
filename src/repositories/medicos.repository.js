import Medico from "../domain/Medico.js"
import {
    BadRequestError,
    UnprocessableEntityError
} from "../errors/AppError.js"


const medicosMock = [
    new Medico({ id: 1, usuario: "anagomez", matricula: "12345", nombre: "Dra. Ana Gómez", especialidades: [], practicas: [], sedes: [], disponibilidad: [], eliminado: false,}),
    new Medico({ id: 2, usuario: "joseperez", matricula: "54321", nombre: "Dr. José Perez", especialidades: [], practicas: [], sedes: [], disponibilidad: [], eliminado: false,}),
    new Medico({ id: 3, usuario: "mariafernandez", matricula: "67890", nombre: "Dra. Maria Fernandez", especialidades: [], practicas: [], sedes: [], disponibilidad: [], eliminado: false,}),
    new Medico({ id: 4, usuario: "pedrolopez", matricula: "98765", nombre: "Dr. Pedro Lopez", especialidades: [], practicas: [], sedes: [], disponibilidad: [], eliminado: false,}),
    new Medico({ id: 5, usuario: "mariajimenez", matricula: "24680", nombre: "Dra. Maria Jimenez", especialidades: [], practicas: [], sedes: [], disponibilidad: [], eliminado: false,}),
    new Medico({ id: 6, usuario: "josemartinez", matricula: "13579", nombre: "Dr. Jose Martinez", especialidades: [], practicas: [], sedes: [], disponibilidad: [], eliminado: false,}),
    new Medico({ id: 7, usuario: "anaalvarez", matricula: "86420", nombre: "Dra. Ana Alvarez", especialidades: [], practicas: [], sedes: [], disponibilidad: [], eliminado: false,}),           
];

export class MedicoRepository {
    constructor() {
        this.medicos = new Set()
        
        medicosMock.forEach(medico => {
            this.medicos[medico.id] = medico 
        })
        
        this.nextId = medicosMock.length + 1 
    }

    getAll() {
        return Object.values(this.medicos).filter((m) => !m.eliminado)
    }

    // getPaginated(numeroPagina, limitePorPagina, filtros = {}) {
    //     let medicos = Object.values(this.medicos)

    //     if (filtros.especialidad !== undefined) {
    //         const especialidadNormalizada = filtros.especialidad.trim().toLowerCase()
    //         medicos = medicos.filter((m) => m.especialidad.trim().toLowerCase() === especialidadNormalizada)
    //     }
        
    //     if (filtros.nombre !== undefined) {
    //         const nombreNormalizado = filtros.nombre.trim().toLowerCase()
    //         medicos = medicos.filter((m) => m.nombre.trim().toLowerCase().includes(nombreNormalizado))
    //     }

    //     const inicio = (numeroPagina - 1) * limitePorPagina
    //     const fin = inicio + limitePorPagina

    //     return {
    //         medicos: medicos.slice(inicio, fin),
    //         totalMedicos: medicos.length
    //     }
    // }

    add(medico) {
        this.validateMedico(medico)
        // Validar que la disponibilidad sea ub objeto adecuado
        
        medico.id = this.nextId++
        this.medicos[medico.id] = medico
        return medico
    }

    update(medico){
        this.validateMedico(medico)
        this.validateId(medico.id)
        // Validar que la disponibilidad sea ub objeto adecuado

        this.medicos[medico.id] = medico
        return medico
    }

    // saveAll(medicos) {
    //     if(!Array.isArray(medicos)) {
    //         throw new BadRequestError("Debe enviar una lista de médicos")
    //     }

    //     return medicos.map((medico) => this.add(medico))
    // }

    getById(id) {
        this.validateId(id)

        return this.medicos[id] && !this.medicos[id].eliminado ? this.medicos[id] : null
    }

    /*getByNombre(nombre) {
        this.validateNombre(nombre)
        const nombreNormalizado = nombre.trim().toLowerCase()

        return (
            Object.values(this.medicos).find((medico) => {
                return medico.nombre.trim().toLowerCase() === nombreNormalizado
            }) ?? null
        )
    }*/

    /*getByMatricula(matricula) {
        if (typeof matricula !== "string" || matricula.trim().length === 0) {
            throw new BadRequestError("La matrícula del médico es obligatoria")
        }
        
        const matriculaNormalizada = matricula.trim()

        return (
            Object.values(this.medicos).find((medico) => {
                return medico.matricula.trim() === matriculaNormalizada
            }) ?? null
        )
    }*/

    delete(id) {
        this.validateId(id)

        const medicoAEliminar = this.getById(id)

        this.medicos[id] = {...medicoAEliminar, borrado: true}
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


import Medico from "../domain/Medico.js"
import {
    BadRequestError,
    UnprocessableEntityError
} from "../errors/AppError.js"
import Disponibilidad from '../domain/Disponibilidad.js' 

const medicosMock = [
    new Medico({ id: 1, usuario: "anagomez", matricula: "12345", nombre: "Dra. Ana Gómez", especialidades: [], practicas: [], sedes: [], "disponibilidad": [{
      "id":1,
      "diaSemana": "VIERNES",
      "desde": "08:00",
      "hasta": "12:00"
    }], eliminado: false,}),
    new Medico({ id: 2, usuario: "joseperez", matricula: "54321", nombre: "Dr. José Perez", especialidades: [], practicas: [], sedes: [], "disponibilidad": [{
      "id":1,
      "diaSemana": "MARTES",
      "desde": "08:00",
      "hasta": "12:00"
    }], eliminado: false,}),
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

    add(medico) {
        this.validateMedico(medico)
        if(medico.disponibilidad.length > 0){
            medico.disponibilidad.forEach(disp => {
                disp.id = medico.disponibilidad.length + 1
                this.validateDisponibilidad(new Disponibilidad(disp))
            })
        }
        medico.id = this.nextId++
        this.medicos[medico.id] = medico
        return medico
    }

    update(medico){
        console.log(medico)
        this.validateMedico(medico)
        this.validateId(medico.id)
        if(medico.disponibilidad.length > 0){
            medico.disponibilidad.forEach(disp => {
                if(!disp.id){
                    disp.id = medico.disponibilidad.length + 1
                }
                this.validateDisponibilidad(new Disponibilidad(disp))
            })
        }

        this.medicos[medico.id] = medico
        return medico
    }

    getById(id) {
        this.validateId(id)

        return this.medicos[id] && !this.medicos[id].eliminado ? this.medicos[id] : null
    }

    delete(id) {
        this.validateId(id)
        const medicoAEliminar = this.getById(id) // Se verifica que existe en el service

        this.medicos[id] = {...medicoAEliminar, eliminado: true}
        return medicoAEliminar
    }

    

    validateMedico(medico) {
        if (!(medico instanceof Medico)) {
            throw new UnprocessableEntityError("El médico es inválido")
        }
    }
    validateDisponibilidad(disp) {
        if (!(disp instanceof Disponibilidad)) {
            throw new UnprocessableEntityError("La disponibilidad es inválido")
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


export default class Medico {
    constructor({id, usuario, matricula, nombre, especialidades = [], practicas = [], sedes = [], disponibilidad = []}) {
        this.id = id;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = especialidades;
        this.practicas = practicas;
        this.sedes = sedes;
        this.eliminado = false;
    }
}
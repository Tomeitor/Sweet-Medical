export default class Medico {
    constructor({_id, id, usuario, matricula, nombre, especialidades = [], practicas = [], sedes = [], eliminado = false}) {
        this._id = _id ?? id ?? null;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = especialidades;
        this.practicas = practicas;
        this.sedes = sedes;
        this.eliminado = eliminado;
    }
}

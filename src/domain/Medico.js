export default class Medico {
    constructor({id, usuarioId, usuario, matricula, nombre, especialidades = [], practicas = [], sedes = []}) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = especialidades;
        this.practicas = practicas;
        this.sedes = sedes;
        this.eliminado = false;
    }
}

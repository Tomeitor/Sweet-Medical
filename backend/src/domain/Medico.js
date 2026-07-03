export default class Medico {
    constructor({id, usuario, usuarioId = null, matricula, nombre, especialidades = [], practicas = [], sedes = [], disponibilidades = []}) {
        this.id = id;
        this.usuario = usuario;
        this.usuarioId = usuarioId;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = especialidades;
        this.practicas = practicas;
        this.sedes = sedes;
        this.disponibilidades = disponibilidades;
        this.eliminado = false;
    }
}

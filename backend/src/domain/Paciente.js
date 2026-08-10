export default class Paciente {
    constructor({
        id,
        legacyId = null,
        usuario,
        usuarioId = null,
        nombre,
        obraSocial,
        plan,
        eliminado = false,
    } = {}) {
        this.id = id;
        this.legacyId = legacyId;
        this.usuario = usuario;
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.obraSocial = obraSocial;
        this.plan = plan;
        this.eliminado = eliminado;
    }
}

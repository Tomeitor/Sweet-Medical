export default class Disponibilidad {
    constructor({_id, id, medico, medicoId, diaSemana, desde, hasta, eliminado = false}) {
        this._id = _id ?? id ?? null;
        this.medico = medico ?? medicoId;
        this.diaSemana = diaSemana;
        this.desde = desde;
        this.hasta = hasta;
        this.eliminado = eliminado;
    }
}

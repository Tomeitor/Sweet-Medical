import mongoose from "mongoose";
import { Turno } from "../domain/Turno.js";
import { EstadoTurno } from "../domain/EstadoTurno.js";

const turnosSchema = new mongoose.Schema({
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: true
    },
    pacienteId: {
        type: String,
        required: true
    },
    fechaHora: {
        type: Date,
        required: true
    },
    sede: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sede',
        required: true
    },
    practica: {
        type: String,
        required: true
    },
    costo: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: Object.values(EstadoTurno),
        default: EstadoTurno.RESERVADO
    },
    historialEstados: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    }
},{
    timestamps: true,
    versionKey: false,
    collection: 'turnos'
});

turnosSchema.loadClass(Turno);

export const TurnosModel = mongoose.models.Turno || mongoose.model('Turno', turnosSchema);

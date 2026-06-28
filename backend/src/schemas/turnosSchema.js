import mongoose from "mongoose";
import { Turno } from "../domain/Turno.js";

const turnosSchema = new mongoose.Schema({
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: true
    },
    paciente: {
        id: String
    },
    fechaHora: {
        type: Date,
        required: true
    },
    sede: {
        type: String,
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
        enum: ["RESERVADO", "CONFIRMADO", "REALIZADO"]
    },
    historialEstados: {
        type: [],
        required: false
    }
},{
    timestamps: true,
    //versionKey: false,
    collection: 'turnos'
});

turnosSchema.loadClass(Turno);

export const TurnosModel = mongoose.model('Turno', turnosSchema);
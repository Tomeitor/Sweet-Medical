import mongoose from "mongoose";
import { Turno } from "../domain/Turno.js";

const turnosSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: true
    },
    paciente: {

    },
    fechaHora: {
        type: Date,
        required: true
    },
    sede: {

    },
    practica: {

    },
    costo: {
        type: Number,
        required: true
    },
    estado: {

    },
    historialEstados: {
        type: [],
        required: false
    }
},{

});

turnosSchema.loadClass(Turno);

export const TurnosModel = mongoose.model('Turno', turnosSchema);
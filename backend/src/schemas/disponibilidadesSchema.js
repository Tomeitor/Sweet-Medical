import mongoose from 'mongoose';
import Disponibilidad from '../domain/Disponibilidad.js';

const disponibilidadesSchema = new mongoose.Schema({
    idMedico: {
        type: String,
        required: true
    },
    diaSemana: {
        type: String,
        enum: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"]
    },
    desde: {
        type: String,
        required: true
    },
    hasta: {
        type: String,
        required: true
    },
    eliminado: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    //versionKey: false,
    collection: 'disponibilidades'
});

disponibilidadesSchema.loadClass(Disponibilidad)

export const DisponibilidadModel = mongoose.model('Disponibilidad', disponibilidadesSchema);
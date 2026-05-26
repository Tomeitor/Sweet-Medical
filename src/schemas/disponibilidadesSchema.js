import mongoose from 'mongoose';
import { Disponibilidad } from '../domain/Disponibilidad.js';

const disponibilidadesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    idMedico: {
        type: String,
        required: true
    },
    diaSemana: {

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
    collection: 'disponibilidades'
});

disponibilidadesSchema.loadClass(Disponibilidad)

export const DisponibilidadModel = mongoose.model('Disponibilidad', disponibilidadesSchema);
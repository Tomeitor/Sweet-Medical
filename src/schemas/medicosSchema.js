import mongoose from 'mongoose';
import { Medico } from '../domain/Medico.js';

const medicosSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    matricula: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    especialidades: {
        type: [String],
        required: true
    },
    practicas: {
        type: [String],
        required: true
    },
    sedes: {

    },
    disponibilidades: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disponibilidad',
        required: true
    },
    eliminado: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

medicosSchema.loadClass(Medico);

export const MedicosModel = mongoose.model('Medico', medicosSchema);
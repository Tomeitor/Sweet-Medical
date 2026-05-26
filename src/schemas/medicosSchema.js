import mongoose from 'mongoose';
import Medico from '../domain/Medico.js';
import './sedesSchema.js';
import './disponibilidadesSchema.js';

const medicosSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required:true
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
    sedes: [{
        type: String,
        required: true
    }],
    disponibilidades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disponibilidad',
        required: true
    }],
    eliminado: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    //versionKey: false,
    collection: 'medicos'
});

medicosSchema.loadClass(Medico);

export const MedicosModel = mongoose.model('Medico', medicosSchema);
import mongoose from 'mongoose';
import Paciente from '../domain/Paciente.js';

const coberturaSchema = new mongoose.Schema({
    especialidad: {
        type: String,
        required: false,
    },
    practica: {
        type: String,
        required: false,
    },
    nivel: {
        type: String,
        required: true,
    },
}, { _id: false });

const pacientesSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null,
    },
    legacyId: {
        type: Number,
        unique: true,
        sparse: true,
        default: null,
    },
    nombre: {
        type: String,
        required: true,
    },
    obraSocial: {
        id: {
            type: Number,
            required: true,
        },
        nombre: {
            type: String,
            required: true,
        },
    },
    plan: {
        id: {
            type: Number,
            required: true,
        },
        nombre: {
            type: String,
            required: true,
        },
        coberturasEspecialidad: {
            type: [coberturaSchema],
            default: [],
        },
        coberturasPractica: {
            type: [coberturaSchema],
            default: [],
        },
    },
    eliminado: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    collection: 'pacientes',
});

pacientesSchema.loadClass(Paciente);

export const PacientesModel = mongoose.model('Paciente', pacientesSchema);

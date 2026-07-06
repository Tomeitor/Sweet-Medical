import mongoose from 'mongoose';
import { Usuario } from '../domain/Usuario.js';

const usuariosSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['PACIENTE', 'MEDICO'],
    },
    profileType: {
        type: String,
        required: true,
        enum: ['PACIENTE', 'MEDICO'],
    },
    profileId: {
        type: String,
        required: true,
        index: true,
    },
    nombre: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
    collection: 'usuarios',
});

usuariosSchema.loadClass(Usuario);

export const UsuariosModel = mongoose.model('Usuario', usuariosSchema);

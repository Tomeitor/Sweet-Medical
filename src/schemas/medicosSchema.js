import mongoose from 'mongoose';

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sede',
        required: true
    }],
    eliminado: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false,
    collection: 'medicos'
});

export const MedicosModel = mongoose.models.Medico || mongoose.model('Medico', medicosSchema);

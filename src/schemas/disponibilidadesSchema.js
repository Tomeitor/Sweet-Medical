import mongoose from 'mongoose';

const disponibilidadesSchema = new mongoose.Schema({
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
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
    versionKey: false,
    collection: 'disponibilidades'
});

export const DisponibilidadModel = mongoose.models.Disponibilidad || mongoose.model('Disponibilidad', disponibilidadesSchema);

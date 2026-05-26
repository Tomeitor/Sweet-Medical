import mongoose from 'mongoose';
import { Notificacion } from "../domain/Notificacion.js";

const notificacionSchema = new mongoose.Schema({
    destinatarioId: {
        type: String,
        required: true
    },
    remitenteId: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    fechaHoraCreacion: {
        type: Date,
        required: true
    },
    fechaHoraLeida: {
        type: Date,
        required: false,
        default: null
    },
    leida: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false,
    collection: 'notificaciones'
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.models.Notificacion || mongoose.model('Notificacion', notificacionSchema);

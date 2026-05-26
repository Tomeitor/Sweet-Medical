import mongoose from 'mongoose';
import { Notificacion } from "../domain/Notificacion.js";

const notificacionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    destinatario: {
        id: String
    },
    remitente: {
        id: String
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
        required: true
    },
    leida: {
        type: Boolean
    }
},{
    timestamps: true,
    //versionKey: false,
    collection: 'notificaciones'
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);
import mongoose from 'mongoose';
import { Notificacion } from "../domain/Notificacion.js";

const notificacionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    destinatario: {

    },
    remitente: {

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

});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);
import mongoose from "mongoose";
import { Notificacion } from "../domain/Notificacion.js";

const notificacionSchema = new mongoose.Schema(
  {
    destinatario: {
      id: String,
    },
    remitente: {
      id: String,
    },
    mensaje: {
      type: String,
      required: true,
    },
    meta: {
      type: Object,
      default: null,
    },
    fechaHoraCreacion: {
      type: Date,
      required: true,
    },
    fechaHoraLeida: {
      type: Date,
      default: null,
    },
    leida: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    //versionKey: false,
    collection: "notificaciones",
  },
);

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model(
  "Notificacion",
  notificacionSchema,
);

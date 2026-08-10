import mongoose from "mongoose";
import { Sede } from "../domain/Sede.js";

const sedesSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps: true,
    //versionKey: false,
    collection: 'sedes'
});

sedesSchema.loadClass(Sede);

export const SedesModel = mongoose.model('Sede', sedesSchema);
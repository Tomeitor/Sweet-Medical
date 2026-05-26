import mongoose from "mongoose";

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
    versionKey: false,
    collection: 'sedes'
});

export const SedesModel = mongoose.models.Sede || mongoose.model('Sede', sedesSchema);

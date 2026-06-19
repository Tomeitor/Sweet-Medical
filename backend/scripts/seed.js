import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { MedicosModel } from "../src/schemas/medicosSchema.js";
import { DisponibilidadModel } from "../src/schemas/disponibilidadesSchema.js";

async function run() {
  await mongoose.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}?authSource=admin`,
  );
  console.log("Connected to Mongo for seeding");

  const medico = await MedicosModel.create({
    usuario: "ana",
    matricula: "12345",
    nombre: "Dra. Ana Gomez",
    especialidades: ["Cardiologia"],
    practicas: ["Consulta General"],
    sedes: ["Sede Centro"],
    disponibilidades: [],
  });

  const disponibilidad = await DisponibilidadModel.create({
    idMedico: medico._id.toString(),
    diaSemana: "LUNES",
    desde: "08:00",
    hasta: "12:00",
  });

  await MedicosModel.findByIdAndUpdate(medico._id, {
    $push: { disponibilidades: disponibilidad._id },
  });

  console.log(
    "Seed inserted:",
    medico._id.toString(),
    disponibilidad._id.toString(),
  );
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

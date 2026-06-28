import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { MedicosModel } from "../src/schemas/medicosSchema.js";
import { DisponibilidadModel } from "../src/schemas/disponibilidadesSchema.js";

const medicos_data = [
  {
    usuario: "ana",
    matricula: "12345",
    nombre: "Dra. Ana Gomez",
    especialidades: ["Cardiologia"],
    practicas: ["Electrocardiograma", "Consulta General"],
    sedes: ["Sede Centro", "Sede Norte"],
  },
  {
    usuario: "juan",
    matricula: "12346",
    nombre: "Dr. Juan Martinez",
    especialidades: ["Dermatologia"],
    practicas: ["Biopsia de piel", "Consulta General"],
    sedes: ["Sede Centro", "Sede Sur"],
  },
  {
    usuario: "carlos",
    matricula: "12347",
    nombre: "Dr. Carlos Lopez",
    especialidades: ["Clinica Medica"],
    practicas: ["Consulta General"],
    sedes: ["Sede Centro", "Sede Norte", "Sede Este"],
  },
  {
    usuario: "maria",
    matricula: "12348",
    nombre: "Dra. Maria Rodriguez",
    especialidades: ["Cardiologia", "Clinica Medica"],
    practicas: ["Electrocardiograma", "Consulta General"],
    sedes: ["Sede Norte", "Sede Este"],
  },
  {
    usuario: "pedro",
    matricula: "12349",
    nombre: "Dr. Pedro Sanchez",
    especialidades: ["Dermatologia"],
    practicas: ["Biopsia de piel"],
    sedes: ["Sede Sur", "Sede Este"],
  },
  {
    usuario: "lucia",
    matricula: "12350",
    nombre: "Dra. Lucia Garcia",
    especialidades: ["Cardiologia"],
    practicas: ["Electrocardiograma"],
    sedes: ["Sede Centro"],
  },
  {
    usuario: "diego",
    matricula: "12351",
    nombre: "Dr. Diego Ortiz",
    especialidades: ["Clinica Medica"],
    practicas: ["Consulta General"],
    sedes: ["Sede Norte", "Sede Sur", "Sede Este"],
  },
  {
    usuario: "sofia",
    matricula: "12352",
    nombre: "Dra. Sofia Torres",
    especialidades: ["Dermatologia", "Clinica Medica"],
    practicas: ["Biopsia de piel", "Consulta General"],
    sedes: ["Sede Centro", "Sede Sur"],
  },
];

const horarios = [
  { desde: "08:00", hasta: "12:00" },
  { desde: "13:00", hasta: "17:00" },
  { desde: "09:00", hasta: "13:00" },
  { desde: "14:00", hasta: "18:00" },
];

const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];

async function run() {
  await mongoose.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}?authSource=admin`,
  );
  console.log("Connected to Mongo for seeding");

  // Limpiar base de datos
  await MedicosModel.deleteMany({});
  await DisponibilidadModel.deleteMany({});
  console.log("Database cleaned");

  for (const medico_data of medicos_data) {
    const medico = await MedicosModel.create({
      usuario: medico_data.usuario,
      matricula: medico_data.matricula,
      nombre: medico_data.nombre,
      especialidades: medico_data.especialidades,
      practicas: medico_data.practicas,
      sedes: medico_data.sedes,
      disponibilidades: [],
    });

    // Crear disponibilidades: 2-3 días por médico, múltiples horarios
    const diasAsignados = dias.slice(0, Math.floor(Math.random() * 2) + 2);
    for (const dia of diasAsignados) {
      for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
        const horario = horarios[Math.floor(Math.random() * horarios.length)];
        const disponibilidad = await DisponibilidadModel.create({
          idMedico: medico._id.toString(),
          diaSemana: dia,
          desde: horario.desde,
          hasta: horario.hasta,
        });

        await MedicosModel.findByIdAndUpdate(medico._id, {
          $push: { disponibilidades: disponibilidad._id },
        });
      }
    }

    console.log(
      `Médico insertado: ${medico.nombre} (${medico.especialidades.join(", ")})`,
    );
  }

  console.log("✅ Seed completed successfully!");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env" });

import { UsuariosModel } from "../src/schemas/usuariosSchema.js";
import { PacientesModel } from "../src/schemas/pacientesSchema.js";
import { MedicosModel } from "../src/schemas/medicosSchema.js";
import { DisponibilidadModel } from "../src/schemas/disponibilidadesSchema.js";
import { TurnosModel } from "../src/schemas/turnosSchema.js";
import { NotificacionModel } from "../src/schemas/notificacionSchema.js";

const demoPassword = "Demo123!";

const doctorIds = [
  "66a000000000000000000001",
  "66a000000000000000000002",
  "66a000000000000000000003",
  "66a000000000000000000004",
  "66a000000000000000000005",
  "66a000000000000000000006",
  "66a000000000000000000007",
  "66a000000000000000000008",
];

const patientIds = [
  "66b000000000000000000001",
  "66b000000000000000000002",
];

const userIds = [
  "66c000000000000000000001",
  "66c000000000000000000002",
  "66c000000000000000000003",
  "66c000000000000000000004",
  "66c000000000000000000005",
  "66c000000000000000000006",
  "66c000000000000000000007",
  "66c000000000000000000008",
  "66c000000000000000000009",
  "66c00000000000000000000a",
];

const medicos_data = [
  {
    username: "ana.gomez",
    matricula: "12345",
    nombre: "Dra. Ana Gomez",
    especialidades: ["Cardiologia"],
    practicas: ["Electrocardiograma", "Consulta General"],
    sedes: ["Sede Centro", "Sede Norte"],
  },
  {
    username: "juan.martinez",
    matricula: "12346",
    nombre: "Dr. Juan Martinez",
    especialidades: ["Dermatologia"],
    practicas: ["Biopsia de piel", "Consulta General"],
    sedes: ["Sede Centro", "Sede Sur"],
  },
  {
    username: "carlos.lopez",
    matricula: "12347",
    nombre: "Dr. Carlos Lopez",
    especialidades: ["Clinica Medica"],
    practicas: ["Consulta General"],
    sedes: ["Sede Centro", "Sede Norte", "Sede Este"],
  },
  {
    username: "maria.rodriguez",
    matricula: "12348",
    nombre: "Dra. Maria Rodriguez",
    especialidades: ["Cardiologia", "Clinica Medica"],
    practicas: ["Electrocardiograma", "Consulta General"],
    sedes: ["Sede Norte", "Sede Este"],
  },
  {
    username: "pedro.sanchez",
    matricula: "12349",
    nombre: "Dr. Pedro Sanchez",
    especialidades: ["Dermatologia"],
    practicas: ["Biopsia de piel"],
    sedes: ["Sede Sur", "Sede Este"],
  },
  {
    username: "lucia.garcia",
    matricula: "12350",
    nombre: "Dra. Lucia Garcia",
    especialidades: ["Cardiologia"],
    practicas: ["Electrocardiograma"],
    sedes: ["Sede Centro"],
  },
  {
    username: "diego.ortiz",
    matricula: "12351",
    nombre: "Dr. Diego Ortiz",
    especialidades: ["Clinica Medica"],
    practicas: ["Consulta General"],
    sedes: ["Sede Norte", "Sede Sur", "Sede Este"],
  },
  {
    username: "sofia.torres",
    matricula: "12352",
    nombre: "Dra. Sofia Torres",
    especialidades: ["Dermatologia", "Clinica Medica"],
    practicas: ["Biopsia de piel", "Consulta General"],
    sedes: ["Sede Centro", "Sede Sur"],
  },
];

const pacientes_data = [
  {
    username: "juan.perez",
    nombre: "Juan Perez",
    obraSocial: { id: 1, nombre: "OSDE" },
    plan: {
      id: 1,
      nombre: "210",
      coberturasEspecialidad: [
        { especialidad: "Cardiologia", nivel: "TOTAL" },
        { especialidad: "Dermatologia", nivel: "PARCIAL" },
      ],
      coberturasPractica: [
        { practica: "Electrocardiograma", nivel: "PARCIAL" },
        { practica: "Biopsia de piel", nivel: "NO_CUBIERTA" },
      ],
    },
  },
  {
    username: "maria.lopez",
    nombre: "Maria Lopez",
    obraSocial: { id: 2, nombre: "Swiss Medical" },
    plan: {
      id: 2,
      nombre: "SMG20",
      coberturasEspecialidad: [
        { especialidad: "Clinica Medica", nivel: "TOTAL" },
      ],
      coberturasPractica: [
        { practica: "Consulta General", nivel: "TOTAL" },
      ],
    },
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

  await UsuariosModel.deleteMany({});
  await PacientesModel.deleteMany({});
  await MedicosModel.deleteMany({});
  await DisponibilidadModel.deleteMany({});
  await TurnosModel.deleteMany({});
  await NotificacionModel.deleteMany({});
  console.log("Database cleaned");

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  for (let index = 0; index < medicos_data.length; index += 1) {
    const medicoData = medicos_data[index];
    const usuarioId = userIds[index];
    const medicoId = doctorIds[index];

    await UsuariosModel.create({
      _id: usuarioId,
      username: medicoData.username,
      passwordHash,
      role: "MEDICO",
      profileType: "MEDICO",
      profileId: medicoId,
      nombre: medicoData.nombre,
    });

    const medico = await MedicosModel.create({
      _id: medicoId,
      usuario: medicoData.username,
      usuarioId,
      matricula: medicoData.matricula,
      nombre: medicoData.nombre,
      especialidades: medicoData.especialidades,
      practicas: medicoData.practicas,
      sedes: medicoData.sedes,
      disponibilidades: [],
    });

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

  for (let index = 0; index < pacientes_data.length; index += 1) {
    const pacienteData = pacientes_data[index];
    const usuarioId = userIds[medicos_data.length + index];
    const pacienteId = patientIds[index];

    await UsuariosModel.create({
      _id: usuarioId,
      username: pacienteData.username,
      passwordHash,
      role: "PACIENTE",
      profileType: "PACIENTE",
      profileId: pacienteId,
      nombre: pacienteData.nombre,
    });

    await PacientesModel.create({
      _id: pacienteId,
      legacyId: index + 1,
      usuario: pacienteData.username,
      usuarioId,
      nombre: pacienteData.nombre,
      obraSocial: pacienteData.obraSocial,
      plan: pacienteData.plan,
    });

    console.log(`Paciente insertado: ${pacienteData.nombre}`);
  }

  console.log(`✅ Demo credentials: username + password = ${demoPassword}`);
  console.log("✅ Seed completed successfully!");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

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
import { SedesModel } from "../src/schemas/sedesSchema.js";

const demoPassword = "Demo123!";

const sedesData = [
  { nombre: "Sede Centro", direccion: "Av. Corrientes 1234, CABA" },
  { nombre: "Sede Norte", direccion: "Av. Cabildo 4321, CABA" },
  { nombre: "Sede Sur", direccion: "Almirante Brown 2210, CABA" },
  { nombre: "Sede Este", direccion: "Av. Rivadavia 8901, CABA" },
];

const medicosData = [
  {
    username: "ana.gomez",
    matricula: "12345",
    nombre: "Dra. Ana Gomez",
    especialidades: ["Cardiologia", "Clinica Medica"],
    practicas: ["Electrocardiograma", "Consulta General"],
    sedes: ["Sede Centro", "Sede Norte"],
    disponibilidades: [
      { diaSemana: "LUNES", desde: "08:00", hasta: "12:00" },
      { diaSemana: "MIERCOLES", desde: "13:00", hasta: "17:00" },
      { diaSemana: "VIERNES", desde: "08:00", hasta: "11:30" },
    ],
  },
  {
    username: "juan.martinez",
    matricula: "12346",
    nombre: "Dr. Juan Martinez",
    especialidades: ["Dermatologia"],
    practicas: ["Biopsia de piel", "Consulta General"],
    sedes: ["Sede Centro", "Sede Sur"],
    disponibilidades: [
      { diaSemana: "MARTES", desde: "09:00", hasta: "13:00" },
      { diaSemana: "JUEVES", desde: "14:00", hasta: "18:00" },
    ],
  },
  {
    username: "carlos.lopez",
    matricula: "12347",
    nombre: "Dr. Carlos Lopez",
    especialidades: ["Clinica Medica"],
    practicas: ["Consulta General"],
    sedes: ["Sede Centro", "Sede Este"],
    disponibilidades: [
      { diaSemana: "MIERCOLES", desde: "08:00", hasta: "12:00" },
      { diaSemana: "VIERNES", desde: "13:00", hasta: "17:00" },
    ],
  },
  {
    username: "maria.rodriguez",
    matricula: "12348",
    nombre: "Dra. Maria Rodriguez",
    especialidades: ["Cardiologia"],
    practicas: ["Electrocardiograma"],
    sedes: ["Sede Norte", "Sede Este"],
    disponibilidades: [
      { diaSemana: "LUNES", desde: "14:00", hasta: "18:00" },
      { diaSemana: "JUEVES", desde: "08:00", hasta: "12:00" },
    ],
  },
  {
    username: "pedro.sanchez",
    matricula: "12349",
    nombre: "Dr. Pedro Sanchez",
    especialidades: ["Dermatologia", "Clinica Medica"],
    practicas: ["Biopsia de piel", "Consulta General"],
    sedes: ["Sede Sur", "Sede Centro"],
    disponibilidades: [
      { diaSemana: "MARTES", desde: "08:00", hasta: "12:00" },
      { diaSemana: "VIERNES", desde: "09:00", hasta: "13:00" },
    ],
  },
  {
    username: "lucia.garcia",
    matricula: "12350",
    nombre: "Dra. Lucia Garcia",
    especialidades: ["Clinica Medica", "Cardiologia"],
    practicas: ["Consulta General", "Electrocardiograma"],
    sedes: ["Sede Este", "Sede Norte"],
    disponibilidades: [
      { diaSemana: "LUNES", desde: "09:00", hasta: "13:00" },
      { diaSemana: "MIERCOLES", desde: "14:00", hasta: "18:00" },
    ],
  },
];

const pacientesData = [
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
        { especialidad: "Cardiologia", nivel: "PARCIAL" },
      ],
      coberturasPractica: [
        { practica: "Consulta General", nivel: "TOTAL" },
      ],
    },
  },
  {
    username: "lucas.fernandez",
    nombre: "Lucas Fernandez",
    obraSocial: { id: 3, nombre: "Galeno" },
    plan: {
      id: 3,
      nombre: "Plan Azul",
      coberturasEspecialidad: [
        { especialidad: "Clinica Medica", nivel: "TOTAL" },
      ],
      coberturasPractica: [
        { practica: "Consulta General", nivel: "PARCIAL" },
        { practica: "Electrocardiograma", nivel: "NO_CUBIERTA" },
      ],
    },
  },
  {
    username: "sofia.navarro",
    nombre: "Sofia Navarro",
    obraSocial: { id: 4, nombre: "OMINT" },
    plan: {
      id: 4,
      nombre: "Classic",
      coberturasEspecialidad: [
        { especialidad: "Cardiologia", nivel: "PARCIAL" },
        { especialidad: "Dermatologia", nivel: "PARCIAL" },
      ],
      coberturasPractica: [
        { practica: "Electrocardiograma", nivel: "PARCIAL" },
        { practica: "Biopsia de piel", nivel: "PARCIAL" },
      ],
    },
  },
  {
    username: "martin.suarez",
    nombre: "Martin Suarez",
    obraSocial: { id: 5, nombre: "Medife" },
    plan: {
      id: 5,
      nombre: "Platinum",
      coberturasEspecialidad: [
        { especialidad: "Clinica Medica", nivel: "TOTAL" },
        { especialidad: "Cardiologia", nivel: "TOTAL" },
      ],
      coberturasPractica: [
        { practica: "Consulta General", nivel: "TOTAL" },
        { practica: "Electrocardiograma", nivel: "TOTAL" },
      ],
    },
  },
];

const turnosData = [
  {
    medicoIndex: 0,
    pacienteIndex: 0,
    weekday: "LUNES",
    time: "08:15",
    sede: "Sede Centro",
    practica: "Electrocardiograma",
    costo: 15000,
    estado: "RESERVADO",
  },
  {
    medicoIndex: 1,
    pacienteIndex: 1,
    weekday: "MARTES",
    time: "09:30",
    sede: "Sede Sur",
    practica: "Biopsia de piel",
    costo: 30000,
    estado: "CONFIRMADO",
    historialEstados: [
      { offsetMinutes: -120, estado: "RESERVADO", quien: "recepcion", motivo: "Turno cargado por teléfono" },
      { offsetMinutes: -30, estado: "CONFIRMADO", quien: "maria.lopez", motivo: "Paciente confirmó asistencia" },
    ],
  },
  {
    medicoIndex: 2,
    pacienteIndex: 2,
    weekday: "MIERCOLES",
    time: "10:00",
    sede: "Sede Centro",
    practica: "Consulta General",
    costo: 10000,
    estado: "REALIZADO",
    direction: "past",
    historialEstados: [
      { offsetMinutes: -150, estado: "RESERVADO", quien: "sistema", motivo: "Reserva inicial" },
      { offsetMinutes: -45, estado: "CONFIRMADO", quien: "lucas.fernandez", motivo: "Paciente confirmó por la app" },
      { offsetMinutes: 30, estado: "REALIZADO", quien: "Dr. Carlos Lopez", motivo: "Atendido en consultorio" },
    ],
  },
  {
    medicoIndex: 3,
    pacienteIndex: 3,
    weekday: "LUNES",
    time: "14:30",
    sede: "Sede Norte",
    practica: "Electrocardiograma",
    costo: 15000,
    estado: "RESERVADO",
  },
  {
    medicoIndex: 4,
    pacienteIndex: 4,
    weekday: "VIERNES",
    time: "09:15",
    sede: "Sede Sur",
    practica: "Consulta General",
    costo: 10000,
    estado: "CONFIRMADO",
    historialEstados: [
      { offsetMinutes: -180, estado: "RESERVADO", quien: "recepcion", motivo: "Turno creado en mostrador" },
      { offsetMinutes: -20, estado: "CONFIRMADO", quien: "martin.suarez", motivo: "Paciente confirmó asistencia" },
    ],
  },
  {
    medicoIndex: 5,
    pacienteIndex: 0,
    weekday: "MIERCOLES",
    time: "15:45",
    sede: "Sede Este",
    practica: "Consulta General",
    costo: 10000,
    estado: "REALIZADO",
    direction: "past",
    historialEstados: [
      { offsetMinutes: -90, estado: "RESERVADO", quien: "sistema", motivo: "Turno generado desde agenda" },
      { offsetMinutes: -15, estado: "CONFIRMADO", quien: "juan.perez", motivo: "Paciente confirmó asistencia" },
      { offsetMinutes: 20, estado: "REALIZADO", quien: "Dra. Lucia Garcia", motivo: "Consulta finalizada" },
    ],
  },
];

const notificationsData = [
  {
    destinatarioType: "patient",
    destinatarioIndex: 0,
    remitenteType: "doctor",
    remitenteIndex: 0,
    mensaje: "Tu turno de cardiología fue reservado para el lunes a las 08:15 en Sede Centro.",
    offsetMinutes: -55,
    leida: false,
  },
  {
    destinatarioType: "patient",
    destinatarioIndex: 1,
    remitenteType: "doctor",
    remitenteIndex: 1,
    mensaje: "Tu turno con Dermatología quedó confirmado para mañana a las 09:30.",
    offsetMinutes: -40,
    leida: true,
    leidaOffsetMinutes: 20,
  },
  {
    destinatarioType: "doctor",
    destinatarioIndex: 2,
    remitenteType: "patient",
    remitenteIndex: 2,
    mensaje: "El turno de control clínico fue marcado como realizado.",
    offsetMinutes: -30,
    leida: true,
    leidaOffsetMinutes: 5,
  },
  {
    destinatarioType: "patient",
    destinatarioIndex: 3,
    remitenteType: "doctor",
    remitenteIndex: 3,
    mensaje: "Recordatorio: tenés un electrocardiograma el lunes a las 14:30 en Sede Norte.",
    offsetMinutes: -25,
    leida: false,
  },
  {
    destinatarioType: "patient",
    destinatarioIndex: 4,
    remitenteType: "doctor",
    remitenteIndex: 4,
    mensaje: "Tu consulta general quedó confirmada para el viernes a las 09:15.",
    offsetMinutes: -15,
    leida: true,
    leidaOffsetMinutes: 10,
  },
  {
    destinatarioType: "patient",
    destinatarioIndex: 0,
    remitenteType: "doctor",
    remitenteIndex: 5,
    mensaje: "Se registró una nueva notificación del consultorio de cardiología.",
    offsetMinutes: -10,
    leida: false,
  },
];

const weekdayToIndex = {
  DOMINGO: 0,
  LUNES: 1,
  MARTES: 2,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  SABADO: 6,
};

function buildDateForWeekday(weekday, time, direction = "future", weeksOffset = 0) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const targetDay = weekdayToIndex[weekday];
  const currentDay = now.getDay();
  const result = new Date(now);

  let dayDelta = targetDay - currentDay;

  if (direction === "future") {
    if (dayDelta <= 0) dayDelta += 7;
    dayDelta += weeksOffset * 7;
  } else {
    if (dayDelta >= 0) dayDelta -= 7;
    dayDelta -= weeksOffset * 7;
  }

  result.setDate(result.getDate() + dayDelta);
  result.setHours(hours, minutes, 0, 0);

  return result;
}

function offsetDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

async function run() {
  await mongoose.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}?authSource=admin`,
  );
  console.log("Connected to Mongo for seeding");

  await Promise.all([
    UsuariosModel.deleteMany({}),
    PacientesModel.deleteMany({}),
    MedicosModel.deleteMany({}),
    DisponibilidadModel.deleteMany({}),
    TurnosModel.deleteMany({}),
    NotificacionModel.deleteMany({}),
    SedesModel.deleteMany({}),
  ]);
  console.log("Database cleaned");

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await SedesModel.insertMany(sedesData);

  const medicos = [];
  for (const medicoData of medicosData) {
    const usuarioId = new mongoose.Types.ObjectId();
    const medicoId = new mongoose.Types.ObjectId();

    await UsuariosModel.create({
      _id: usuarioId,
      username: medicoData.username,
      passwordHash,
      role: "MEDICO",
      profileType: "MEDICO",
      profileId: medicoId.toString(),
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

    const disponibilidadIds = [];
    for (const slot of medicoData.disponibilidades) {
      const disponibilidad = await DisponibilidadModel.create({
        idMedico: medico._id.toString(),
        diaSemana: slot.diaSemana,
        desde: slot.desde,
        hasta: slot.hasta,
      });
      disponibilidadIds.push(disponibilidad._id);
    }

    await MedicosModel.findByIdAndUpdate(medico._id, {
      $push: { disponibilidades: { $each: disponibilidadIds } },
    });

    medicos.push({ ...medico.toObject(), usuarioId: usuarioId.toString() });
    console.log(`Médico insertado: ${medico.nombre} (${medico.especialidades.join(", ")})`);
  }

  const pacientes = [];
  for (const pacienteData of pacientesData) {
    const usuarioId = new mongoose.Types.ObjectId();
    const pacienteId = new mongoose.Types.ObjectId();

    await UsuariosModel.create({
      _id: usuarioId,
      username: pacienteData.username,
      passwordHash,
      role: "PACIENTE",
      profileType: "PACIENTE",
      profileId: pacienteId.toString(),
      nombre: pacienteData.nombre,
    });

    const paciente = await PacientesModel.create({
      _id: pacienteId,
      legacyId: pacientes.length + 1,
      usuario: pacienteData.username,
      usuarioId,
      nombre: pacienteData.nombre,
      obraSocial: pacienteData.obraSocial,
      plan: pacienteData.plan,
    });

    pacientes.push({ ...paciente.toObject(), usuarioId: usuarioId.toString() });
    console.log(`Paciente insertado: ${pacienteData.nombre}`);
  }

  const turnos = [];
  for (const turnoData of turnosData) {
    const medico = medicos[turnoData.medicoIndex];
    const paciente = pacientes[turnoData.pacienteIndex];
    const direction = turnoData.direction ?? (turnoData.estado === "REALIZADO" ? "past" : "future");
    const fechaHora = buildDateForWeekday(turnoData.weekday, turnoData.time, direction, turnoData.weeksOffset ?? 0);

    const historialEstados = (turnoData.historialEstados ?? []).map((cambio) => {
      const estadoFechaHora = offsetDate(fechaHora, cambio.offsetMinutes);

      return {
        fechaHora: estadoFechaHora,
        estado: cambio.estado,
        quien: cambio.quien,
        motivo: cambio.motivo,
        ...(cambio.fechaHoraAnterior ? { fechaHoraAnterior: cambio.fechaHoraAnterior } : {}),
        ...(cambio.fechaHoraNueva ? { fechaHoraNueva: cambio.fechaHoraNueva } : {}),
      };
    });

    const turno = await TurnosModel.create({
      medico: medico._id,
      paciente: { id: paciente._id.toString() },
      fechaHora,
      sede: turnoData.sede,
      practica: turnoData.practica,
      costo: turnoData.costo,
      estado: turnoData.estado,
      historialEstados,
    });

    turnos.push(turno);
  }

  for (const notificationData of notificationsData) {
    const destinatario = notificationData.destinatarioType === "doctor"
      ? medicos[notificationData.destinatarioIndex]
      : pacientes[notificationData.destinatarioIndex];
    const remitente = notificationData.remitenteType === "doctor"
      ? medicos[notificationData.remitenteIndex]
      : pacientes[notificationData.remitenteIndex];
    const fechaHoraCreacion = offsetDate(new Date(), notificationData.offsetMinutes);
    const fechaHoraLeida = notificationData.leida
      ? offsetDate(fechaHoraCreacion, notificationData.leidaOffsetMinutes ?? 5)
      : null;

    await NotificacionModel.create({
      destinatario: { id: String(destinatario._id) },
      remitente: { id: String(remitente._id) },
      mensaje: notificationData.mensaje,
      fechaHoraCreacion,
      fechaHoraLeida,
      leida: notificationData.leida,
    });
  }

  console.log(`✅ Seed completed: ${medicos.length} médicos, ${pacientes.length} pacientes, ${turnos.length} turnos, ${notificationsData.length} notificaciones, ${sedesData.length} sedes.`);
  console.log(`✅ Demo credentials: any seeded username + password = ${demoPassword}`);
  console.log("   Examples: ana.gomez / Demo123! | juan.perez / Demo123!");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

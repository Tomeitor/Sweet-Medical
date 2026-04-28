import express from "express"
import dotenv from 'dotenv'

import medicosRouter from './medicos.routes.js'
import disponibilidadRouter from './disponibilidades.routes.js'
import turnosRouter from './turnos.routes.js';

const router = express.Router()

// Configuración de paths bases para cada recurso
router.use(process.env.PATH_APP + '/medicos', medicosRouter);
router.use(process.env.PATH_APP + '/disponibilidades', disponibilidadRouter);
router.use(process.env.PATH_APP + '/turnos', turnosRouter);

export default router
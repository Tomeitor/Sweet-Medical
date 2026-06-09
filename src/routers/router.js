import express from "express"

import medicosRouter from './medicos.routes.js'
import disponibilidadRouter from './disponibilidades.routes.js'
import turnosRouter from './turnos.routes.js';
import notificacionRoutes from './notificacion.routes.js';

const router = express.Router()

// Configuración de paths bases para cada recurso
router.use('/medicos', medicosRouter);
router.use('/disponibilidades', disponibilidadRouter);
router.use('/turnos', turnosRouter);
router.use('/notificaciones', notificacionRoutes);

export default router
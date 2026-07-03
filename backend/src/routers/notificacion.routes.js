import { Router } from "express";
import { notificacionController } from "../controllers/notificacion.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Endpoint unificado para obtener notificaciones (usa req.query internamente)
router.get('/usuarios/:usuarioId/notificaciones', requireRole('MEDICO'), notificacionController.getNotificaciones);

// Endpoint para marcar una notificación específica
router.patch('/usuarios/:usuarioId/notificaciones/:notificacionId', requireRole('MEDICO'), notificacionController.patchEstadoLectura);

export default router;

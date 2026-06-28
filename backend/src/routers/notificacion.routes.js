import { Router } from "express";
import { notificacionController } from "../controllers/notificacion.controller.js";

const router = Router();

// Endpoint unificado para obtener notificaciones (usa req.query internamente)
router.get('/usuarios/:usuarioId/notificaciones', notificacionController.getNotificaciones);

// Endpoint para marcar una notificación específica
router.patch('/usuarios/:usuarioId/notificaciones/:notificacionId', notificacionController.patchEstadoLectura);

export default router;
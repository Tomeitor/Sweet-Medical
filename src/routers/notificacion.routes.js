import { Router } from "express";
import { notificacionController } from "../controllers/notificacion.controller.js";

const router = Router();

//obtener la lista de notificaciones sin leer de un usuario
router.get('/usuario/:usuarioId/sin-leer', notificacionController.getSinLeer);

//obtener la lista de notificaciones leídas de un usuario
router.get('/usuario/:usuarioId/leidas', notificacionController.getLeidas);

//marcar una notificación específica como leída
router.patch('/:id/marcar-leida', notificacionController.patchMarcarLeida);

export default router;
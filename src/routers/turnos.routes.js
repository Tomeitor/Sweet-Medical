import { Router } from 'express';
import { TurnosController } from '../controllers/turnos.controller.js';

const router = Router();
const controller = new TurnosController();

//ENDPOINTS:
router.post('/', (req, res) => controller.alta(req, res));
router.delete('/:id', (req, res) => controller.baja(req, res));

//faltan get y put pero no son necesarios para el alta y baja de turnos

export default router;
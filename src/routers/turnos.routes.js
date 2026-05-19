import { Router } from 'express';
import { TurnosController } from '../controllers/turnos.controller.js';

const router = Router();
const controller = new TurnosController();

//ENDPOINTS:
router.post('/', controller.alta);
router.delete('/:id', controller.baja);

//faltan get y put pero no son necesarios para el alta y baja de turnos

export default router;
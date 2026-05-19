import { Router } from 'express';
import DisponibilidadController from '../controllers/disponibilidades.controller.js';

const controller = new DisponibilidadController();
const router = Router({mergeParams: true});

router.get('/', controller.getDisponibilidades);
router.get('/:id', controller.getDisponibilidadById);
router.post('/', controller.createDisponibilidad);
router.put('/:id', controller.updateDisponibilidad);
router.delete('/:id', controller.deleteDisponibilidad);

export default router; 

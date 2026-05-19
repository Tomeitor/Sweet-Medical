import { Router } from 'express';
import MedicoController from '../controllers/medicos.controller.js';

const controller = new MedicoController();
const router = Router();

// En lo requerimientos no se piden estos endpoints
router.get('/', controller.getMedicos);
router.get('/:id', controller.getMedicoById);
router.post('/', controller.createMedico);
router.put('/:id', controller.updateMedico);
router.delete('/:id', controller.deleteMedico);

export default router; 

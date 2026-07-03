import { Router } from 'express';
import MedicoController from '../controllers/medicos.controller.js';
import { optionalAuthenticate, requireRole } from '../middlewares/auth.middleware.js';

const controller = new MedicoController();
const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Medicos
 *     description: Gestion de medicos
 * components:
 *   schemas:
 *     Medico:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         usuario:
 *           type: string
 *           example: anagomez
 *         matricula:
 *           type: string
 *           example: '12345'
 *         nombre:
 *           type: string
 *           example: Dra. Ana Gomez
 *         especialidades:
 *           type: array
 *           items:
 *             type: string
 *           example: [Cardiologia]
 *         practicas:
 *           type: array
 *           items:
 *             type: string
 *           example: [Consulta]
 *         sedes:
 *           type: array
 *           items:
 *             type: string
 *           example: [Sede Centro]
 *         eliminado:
 *           type: boolean
 *           example: false
 *     MedicoInput:
 *       type: object
 *       required:
 *         - usuario
 *         - matricula
 *         - nombre
 *       properties:
 *         usuario:
 *           type: string
 *           minLength: 1
 *           example: anagomez
 *         matricula:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: '12345'
 *         nombre:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: Dra. Ana Gomez
 *         especialidades:
 *           type: array
 *           items:
 *             type: string
 *           example: [Cardiologia]
 *         practicas:
 *           type: array
 *           items:
 *             type: string
 *           example: [Consulta]
 *         sedes:
 *           type: array
 *           items:
 *             type: string
 *           example: [Sede Centro]
 */

// En lo requerimientos no se piden estos endpoints
/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Obtener todos los medicos
 *     tags: [Medicos]
 *     responses:
 *       200:
 *         description: Lista de medicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Medico'
 */
router.get('/', optionalAuthenticate, controller.getMedicos);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Obtener un medico por id
 *     tags: [Medicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id del medico
 *     responses:
 *       200:
 *         description: Medico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Medico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', optionalAuthenticate, controller.getMedicoById);

/**
 * @swagger
 * /medicos:
 *   post:
 *     summary: Crear un medico
 *     tags: [Medicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicoInput'
 *     responses:
 *       201:
 *         description: Medico creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Medico invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', requireRole('MEDICO'), controller.createMedico);

/**
 * @swagger
 * /medicos/{id}:
 *   put:
 *     summary: Actualizar un medico
 *     tags: [Medicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id del medico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicoInput'
 *     responses:
 *       200:
 *         description: Medico actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Medico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Medico invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', requireRole('MEDICO'), controller.updateMedico);

/**
 * @swagger
 * /medicos/{id}:
 *   delete:
 *     summary: Eliminar un medico
 *     tags: [Medicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id del medico
 *     responses:
 *       200:
 *         description: Medico eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medico eliminado correctamente
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Medico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', requireRole('MEDICO'), controller.deleteMedico);

export default router; 

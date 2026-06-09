import { Router } from 'express';
import DisponibilidadController from '../controllers/disponibilidades.controller.js';

const controller = new DisponibilidadController();
const router = Router({mergeParams: true});

/**
 * @swagger
 * tags:
 *   - name: Disponibilidades
 *     description: Gestion de disponibilidades medicas
 * components:
 *   schemas:
 *     Disponibilidad:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         idMedico:
 *           type: integer
 *           example: 1
 *         diaSemana:
 *           type: string
 *           enum: [LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO]
 *           example: MARTES
 *         desde:
 *           type: string
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: '08:00'
 *         hasta:
 *           type: string
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: '12:00'
 *         eliminado:
 *           type: boolean
 *           example: false
 *     DisponibilidadInput:
 *       type: object
 *       required:
 *         - diaSemana
 *         - desde
 *         - hasta
 *       properties:
 *         diaSemana:
 *           type: string
 *           enum: [LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO]
 *           example: LUNES
 *         desde:
 *           type: string
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: '09:00'
 *         hasta:
 *           type: string
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: '13:00'
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         message:
 *           type: string
 *           example: El id no es valido
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /disponibilidades:
 *   get:
 *     summary: Obtener todas las disponibilidades
 *     tags: [Disponibilidades]
 *     responses:
 *       200:
 *         description: Lista de disponibilidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Disponibilidad'
 */
router.get('/', controller.getDisponibilidades);

/**
 * @swagger
 * /disponibilidades/{id}:
 *   get:
 *     summary: Obtener una disponibilidad por id
 *     tags: [Disponibilidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id de la disponibilidad
 *     responses:
 *       200:
 *         description: Disponibilidad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disponibilidad'
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Disponibilidad no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', controller.getDisponibilidadById);

/**
 * @swagger
 * /disponibilidades:
 *   post:
 *     summary: Crear una disponibilidad
 *     tags: [Disponibilidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisponibilidadInput'
 *     responses:
 *       201:
 *         description: Disponibilidad creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disponibilidad'
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', controller.createDisponibilidad);

/**
 * @swagger
 * /disponibilidades/{id}:
 *   put:
 *     summary: Actualizar una disponibilidad
 *     tags: [Disponibilidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id de la disponibilidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisponibilidadInput'
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disponibilidad'
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Disponibilidad no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', controller.updateDisponibilidad);

/**
 * @swagger
 * /disponibilidades/{id}:
 *   delete:
 *     summary: Eliminar una disponibilidad
 *     tags: [Disponibilidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id de la disponibilidad
 *     responses:
 *       200:
 *         description: Disponibilidad eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disponibilidad'
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Disponibilidad no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', controller.deleteDisponibilidad);

export default router; 

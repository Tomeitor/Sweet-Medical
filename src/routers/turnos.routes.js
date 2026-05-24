import { Router } from 'express';
import { TurnosController } from '../controllers/turnos.controller.js';

const router = Router();
const controller = new TurnosController();

//ENDPOINTS:
/**
 * @swagger
 * tags:
 *   - name: Turnos
 *     description: Gestion de turnos medicos
 * components:
 *   schemas:
 *     HistorialEstadoTurno:
 *       type: object
 *       properties:
 *         fechaHora:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           enum: [DISPONIBLE, RESERVADO, CONFIRMADO, CANCELADO, REALIZADO]
 *           example: CANCELADO
 *         quien:
 *           type: string
 *           example: SISTEMA
 *         motivo:
 *           type: string
 *           example: Turno cancelado por el paciente
 *     Turno:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         medico:
 *           $ref: '#/components/schemas/Medico'
 *         paciente:
 *           type: string
 *           example: '1'
 *         fechaHora:
 *           type: string
 *           format: date-time
 *           example: '2026-06-01T12:00:00.000Z'
 *         sede:
 *           type: string
 *           example: Sede Centro
 *         practica:
 *           type: string
 *           example: Consulta
 *         costo:
 *           type: number
 *           example: 15000
 *         estado:
 *           type: string
 *           enum: [DISPONIBLE, RESERVADO, CONFIRMADO, CANCELADO, REALIZADO]
 *           example: RESERVADO
 *         historialEstados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HistorialEstadoTurno'
 *     TurnoInput:
 *       type: object
 *       required:
 *         - medicoId
 *         - pacienteId
 *         - fechaHora
 *         - sede
 *         - practica
 *         - costo
 *       properties:
 *         medicoId:
 *           type: string
 *           example: '1'
 *         pacienteId:
 *           type: string
 *           example: '1'
 *         fechaHora:
 *           type: string
 *           format: date-time
 *           example: '2026-06-01T12:00:00.000Z'
 *         sede:
 *           type: string
 *           example: Sede Centro
 *         practica:
 *           type: string
 *           example: Consulta
 *         costo:
 *           type: number
 *           minimum: 0
 *           exclusiveMinimum: true
 *           example: 15000
 *     CancelarTurnoInput:
 *       type: object
 *       required:
 *         - motivo
 *       properties:
 *         motivo:
 *           type: string
 *           minLength: 1
 *           example: No puedo asistir
 *     CambioTurnoInput:
 *       type: object
 *       required:
 *         - fechaHora
 *         - motivo
 *       properties:
 *         fechaHora:
 *           type: string
 *           format: date-time
 *           example: '2026-06-01T12:30:00.000Z'
 *         motivo:
 *           type: string
 *           minLength: 1
 *           example: Necesito cambiar el horario
 *     TurnoDisponible:
 *       type: object
 *       properties:
 *         medico:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             nombre:
 *               type: string
 *               example: Dra. Ana Gomez
 *             matricula:
 *               type: string
 *               example: '12345'
 *         fechaHora:
 *           type: string
 *           format: date-time
 *           example: '2026-06-01T12:00:00.000Z'
 *         diaSemana:
 *           type: string
 *           enum: [LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO]
 *           example: LUNES
 *         hora:
 *           type: string
 *           example: '12:00'
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
 */

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear un turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoInput'
 *     responses:
 *       201:
 *         description: Turno creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Datos invalidos
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
 *       409:
 *         description: El turno no se puede reservar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', controller.alta);

/**
 * @swagger
 * /turnos/disponibles:
 *   get:
 *     summary: Obtener turnos disponibles
 *     tags: [Turnos]
 *     description: Debe indicarse al menos una especialidad o una practica.
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: string
 *         description: Especialidad medica para filtrar turnos
 *       - in: query
 *         name: practica
 *         schema:
 *           type: string
 *         description: Practica medica para filtrar turnos
 *     responses:
 *       200:
 *         description: Lista de turnos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TurnoDisponible'
 *       400:
 *         description: Filtros invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/disponibles', controller.disponibles);

/**
 * @swagger
 * /turnos/historial/{pacienteId}:
 *   get:
 *     summary: Obtener historial de turnos de un paciente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del paciente
 *     responses:
 *       200:
 *         description: Historial de turnos del paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Id de paciente invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/historial/:pacienteId/', controller.historialPaciente);

/**
 * @swagger
 * /turnos/{id}/cambio:
 *   patch:
 *     summary: Cambiar un turno a otro slot disponible del mismo medico
 *     tags: [Turnos]
 *     description: El cambio requiere motivo, al menos una hora de anticipacion y mantiene el mismo profesional.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id del turno actual
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CambioTurnoInput'
 *     responses:
 *       200:
 *         description: Turno cambiado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El turno no puede cambiarse
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/cambio', controller.cambiar);

/**
 * @swagger
 * /turnos/{id}/realizado:
 *   patch:
 *     summary: Marcar un turno como realizado
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id del turno
 *     responses:
 *       200:
 *         description: Turno marcado como realizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El turno no puede marcarse como realizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/realizado', controller.marcarComoRealizado);

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Cancelar un turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id del turno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelarTurnoInput'
 *     responses:
 *       200:
 *         description: Turno cancelado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Turno cancelado con exito
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El turno no puede cancelarse
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', controller.baja);

export default router;

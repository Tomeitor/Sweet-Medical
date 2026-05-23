import { notificacionService } from "../services/notificacion.service.js";

export class NotificacionController {
    constructor() {
        this.service = notificacionService;
    }

    getSinLeer = async (req, res, next) => {
        try {
            const { usuarioId } = req.params;
            const notificaciones = await this.service.obtenerSinLeer(usuarioId);
            res.status(200).json({ status: "success", data: notificaciones });
        } catch (error) {
            next(error);
        }
    }

    getLeidas = async (req, res, next) => {
        try {
            const { usuarioId } = req.params;
            const notificaciones = await this.service.obtenerLeidas(usuarioId);
            res.status(200).json({ status: "success", data: notificaciones });
        } catch (error) {
            next(error);
        }
    }

    patchMarcarLeida = async (req, res, next) => {
        try {
            const { id } = req.params;
            const notificacionActualizada = await this.service.marcarComoLeida(id);
            res.status(200).json({ status: "success", data: notificacionActualizada });
        } catch (error) {
            next(error); 
        }
    }
}

export const notificacionController = new NotificacionController();
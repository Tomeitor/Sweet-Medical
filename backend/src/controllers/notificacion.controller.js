import { notificacionService } from "../services/notificacion.service.js";
import { BadRequestError, ForbiddenError } from "../errors/AppError.js";

export class NotificacionController {
    constructor() {
        this.service = notificacionService;
    }

    getNotificaciones = async (req, res, next) => {
        try {
            const { usuarioId } = req.params;
            const leidaQuery = req.query.leida; 

            if (req.auth?.role === 'MEDICO' && String(usuarioId) !== String(req.auth.username)) {
                throw new ForbiddenError("No podés ver notificaciones de otro médico");
            }

            if (leidaQuery === undefined) {
                 throw new BadRequestError("Falta el parámetro de búsqueda. Debes especificar '?leida=true' o '?leida=false' en la URL.");
            }

            if (leidaQuery !== 'true' && leidaQuery !== 'false') {
                throw new BadRequestError("Valor inválido. El parámetro 'leida' debe ser 'true' o 'false'.");
            }
            
            const estaLeida = leidaQuery === 'true'; 
    
            const notificaciones = await this.service.obtenerPorEstado(String(req.auth?.username ?? usuarioId), estaLeida);

            res.status(200).json({ status: "success", data: notificaciones });
        } catch (error) {
            next(error);
        }
    }
    patchEstadoLectura = async (req, res, next) => {
        try {
            const { notificacionId } = req.params;
            const { usuarioId } = req.params;
            const { leida } = req.body;

            if (req.auth?.role === 'MEDICO' && String(usuarioId) !== String(req.auth.username)) {
                throw new ForbiddenError("No podés modificar notificaciones de otro médico");
            }

            if (typeof leida !== 'boolean') {
                throw new BadRequestError("El body debe contener la propiedad 'leida' con un valor booleano (true o false)");
            }

            const notificacionActualizada = await this.service.actualizarEstadoLectura(notificacionId, String(req.auth?.username ?? usuarioId), leida);
            
            res.status(200).json({ status: "success", data: notificacionActualizada });
        } catch (error) {
            next(error); 
        }
    }
}

export const notificacionController = new NotificacionController();

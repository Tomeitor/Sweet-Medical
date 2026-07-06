import z from 'zod';

import { BadRequestError } from '../errors/AppError.js';
import { authService } from '../services/auth.service.js';

const loginSchema = z.object({
    username: z.string().trim().min(1, 'El usuario es obligatorio'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
});

export class AuthController {
    constructor() {
        this.service = authService;
    }

    login = async (req, res, next) => {
        try {
            const result = loginSchema.safeParse(req.body);

            if (!result.success) {
                throw new BadRequestError('Datos inválidos');
            }

            const session = await this.service.login(
                result.data.username,
                result.data.password,
            );

            res.status(200).json({ status: 'success', data: session });
        } catch (error) {
            next(error);
        }
    };

    me = async (req, res, next) => {
        try {
            const session = await this.service.me(req.auth.sub);
            res.status(200).json({ status: 'success', data: session });
        } catch (error) {
            next(error);
        }
    };
}

export const authController = new AuthController();

import jwt from 'jsonwebtoken';

import { ForbiddenError, UnauthorizedError } from '../errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecret() {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is required');
    }

    return JWT_SECRET;
}

export function authenticate(req, _res, next) {
    try {
        const header = req.headers.authorization ?? '';
        const [scheme, token] = header.split(' ');

        if (scheme !== 'Bearer' || !token) {
            throw new UnauthorizedError('Debes iniciar sesión para continuar');
        }

        req.auth = jwt.verify(token, getJwtSecret());
        next();
    } catch (error) {
        next(error instanceof Error && ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)
            ? new UnauthorizedError('Sesión inválida o expirada')
            : error);
    }
}

export function optionalAuthenticate(req, res, next) {
    const header = req.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        next();
        return;
    }

    authenticate(req, res, next);
}

export function requireRole(...roles) {
    return (req, res, next) => {
        authenticate(req, res, (error) => {
            if (error) {
                next(error);
                return;
            }

            if (!roles.includes(req.auth?.role)) {
                next(new ForbiddenError('No tenés permisos para acceder a este recurso'));
                return;
            }

            next();
        });
    };
}

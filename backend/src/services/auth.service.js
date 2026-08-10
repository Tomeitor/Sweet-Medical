import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UnauthorizedError, NotFoundError } from '../errors/AppError.js';
import { usuariosRepository } from '../repositories/usuarios.repository.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

function getJwtSecret() {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is required');
    }

    return JWT_SECRET;
}

export class AuthService {
    constructor() {
        this.repo = usuariosRepository;
    }

    buildSession(user) {
        const payload = {
            sub: String(user._id ?? user.id),
            role: user.role,
            profileId: String(user.profileId),
            username: user.username,
            profileType: user.profileType,
        };

        return {
            token: jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN }),
            user: {
                id: String(user._id ?? user.id),
                username: user.username,
                role: user.role,
                profileId: String(user.profileId),
                profileType: user.profileType,
                nombre: user.nombre ?? null,
            },
        };
    }

    async login(username, password) {
        const user = await this.repo.findByUsername(username);

        if (!user) {
            throw new UnauthorizedError('Usuario o contraseña inválidos');
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            throw new UnauthorizedError('Usuario o contraseña inválidos');
        }

        return this.buildSession(user);
    }

    async me(userId) {
        const user = await this.repo.findById(userId);

        if (!user) {
            throw new NotFoundError('La sesión no fue encontrada');
        }

        return this.buildSession(user).user;
    }
}

export const authService = new AuthService();

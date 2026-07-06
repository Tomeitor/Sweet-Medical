import { UsuariosModel } from '../schemas/usuariosSchema.js';

export class UsuariosRepository {
    constructor() {
        this.model = UsuariosModel;
    }

    async create(usuario) {
        return await this.model.create(usuario);
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findByUsername(username) {
        return await this.model.findOne({ username: String(username).toLowerCase() });
    }
}

export const usuariosRepository = new UsuariosRepository();

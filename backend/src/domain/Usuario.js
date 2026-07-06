export class Usuario {
    constructor({
        id,
        username,
        passwordHash,
        role,
        profileType,
        profileId,
        nombre = null,
    } = {}) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.profileType = profileType;
        this.profileId = profileId;
        this.nombre = nombre;
    }
}

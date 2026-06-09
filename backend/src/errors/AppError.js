export class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.status = statusCode >= 500 ? 'error' : 'fail';
        this.timestamp = new Date().toISOString();
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request - Petición incorrecta') {
        super(400, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found - Recurso no encontrado') {
        super(404, message);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict - Conflicto en el estado del recurso') {
        super(409, message);
    }
}

export class TurnoFuturoError extends AppError {
    constructor(message = 'No se puede marcar como realizado un turno futuro') {
        super(409, message);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message = 'Unprocessable Entity - Error de validación') {
        super(422, message);
    }
}

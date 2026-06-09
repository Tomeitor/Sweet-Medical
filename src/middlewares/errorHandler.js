import { AppError } from "../errors/AppError.js"
import { ZodError } from "zod"

export default function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            timestamp: err.timestamp,
        })
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: "fail",
            message: "Error de validación",
            errors: err.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
            timestamp: new Date().toISOString(),
        })
    }

    return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
        timestamp: new Date().toISOString(),
    })
}

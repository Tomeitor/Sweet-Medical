import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import router from "./src/routers/router.js"

import errorHandler from './src/middlewares/errorHandler.js'
import errorLogger from './src/middlewares/errorLogger.js'
import notFoundHandler from './src/middlewares/notFoundHandler.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

const PREFIX = process.env.PATH_APP || '/api/v1';

app.get(PREFIX + '/healthcheck', (req, res) => {
    res.status(200).json({status: 'ok'})
})

app.use(PREFIX, router) // todo el router bajo el prefijo /api/v1

// Middlewares de error
app.use(notFoundHandler)
app.use(errorLogger)
app.use(errorHandler)

export default app
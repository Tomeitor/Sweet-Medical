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
app.use(router)

app.use(notFoundHandler)
app.use(errorLogger)
app.use(errorHandler)

export default app
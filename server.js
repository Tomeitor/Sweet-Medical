import express from 'express'

import medicosRouter from './src/routers/medicos.routes.js'
import disponibilidadRouter from './src/routers/disponibilidades.routes.js'
import turnosRouter from './src/routers/turnos.routes.js';

import errorHandler from './src/middlewares/errorHandler.js'
import errorLogger from './src/middlewares/errorLogger.js'
import notFoundHandler from './src/middlewares/notFoundHandler.js'

const PATH_APP = '/api/v1'
const PORT = process.env.PORT || 3000
const app = express()


app.use(express.json())
app.get(PATH_APP + '/healthcheck', (req, res) => {
    res.status(200).json({status: 'ok'})
})
app.use(PATH_APP + '/medicos', medicosRouter);
app.use(PATH_APP + '/disponibilidades', disponibilidadRouter);
app.use(PATH_APP + '/turnos', turnosRouter);

app.use(notFoundHandler)
app.use(errorLogger);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
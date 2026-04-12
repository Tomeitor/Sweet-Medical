import express from 'express'
import medicosRouter from './src/medicos/medicos.routes.js'

const app = express()
app.use(express.json())

const PATH_APP = '/api/v1'
const PORT = process.env.PORT || 3000

app.get(PATH_APP + '/healthcheck', (req, res) => {
    res.status(200).json({status: 'ok'})
})

app.use(PATH_APP + '/medicos', medicosRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
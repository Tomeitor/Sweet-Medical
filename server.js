import express from 'express'
import dotenv from 'dotenv'

import app from './app.js'

const PATH_APP = '/api/v1'
const PORT = process.env.PORT || 3000

app.use(express.json())
app.get(process.env.PATH_APP + '/healthcheck', (req, res) => {
    res.status(200).json({status: 'ok'})
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
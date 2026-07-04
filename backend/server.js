import express from 'express'

import { MongoDBClient } from "./src/config/database.js";
import { iniciarRecordatoriosTurnos } from "./src/services/turnosReminder.cron.js";

import app from './app.js'

const PORT = process.env.PORT || 3000

await MongoDBClient.connect()

iniciarRecordatoriosTurnos()

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

import express from 'express'

import { MongoDBClient } from "./src/config/database.js";

import app from './app.js'

const PORT = process.env.PORT || 3000

await MongoDBClient.connect()

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

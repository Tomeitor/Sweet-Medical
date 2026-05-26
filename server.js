import express from 'express'

import app from './app.js'

import { MongoDBClient } from "./src/config/database.js"

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        // conectar mongo
        await MongoDBClient.connect()
        // levantar servidor
        app.use(express.json())
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error(error)
    }
}

start()

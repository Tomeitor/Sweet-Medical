import express from 'express'
import dotenv from 'dotenv'

import app from './app.js'

const PATH_APP = '/api/v1'
const PORT = process.env.PORT || 3000

app.use(express.json())


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
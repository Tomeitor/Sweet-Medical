import express from 'express'

import app from './app.js'

const PORT = process.env.PORT || 3000

app.use(express.json())


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
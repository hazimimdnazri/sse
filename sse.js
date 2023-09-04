import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from "./routes.js"

dotenv.config()
const app = express()

app.use(cors())
app.use('/', routes)

app.listen(process.env.PORT, () => {
    console.log(`Event started on port ${process.env.PORT}...`)
});
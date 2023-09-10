import express from 'express'
import {ApiController} from './controllers/ApiController.js'

const routes = express.Router()
routes.use(express.json())

routes.get('/', (req, res) => {
    res.send('The server is up and running!')
})

routes.get('/events', ApiController.eventsHandler)
routes.post('/trigger', ApiController.triggerEvent)
routes.get('*', ApiController.unknownRoute)
routes.post('*', ApiController.unknownRoute)

export default routes

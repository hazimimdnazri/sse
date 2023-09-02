const express = require('express')
const cors = require('cors')
const uuid = require('uuid')
const app = express()

app.use(cors())
app.use(express.json())
require('dotenv').config()

let subscribers = []

sendHeartbeat = (res) => {
    setInterval(() => {
        res.write(': ping\n\n'); // Send a comment line as a heartbeat
    }, 10000); // Send a heartbeat every 10 seconds (adjust as needed)
}

eventsHandler = (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }
  
    res.writeHead(200, headers)
    
    const subscriberId = uuid.v4()
    const subscriber = {
        id: subscriberId,
        res
    }

    subscribers.push(subscriber)
    
    req.on('close', () => {
        subscribers = subscribers.filter(sub => sub.id !== subscriberId)
    })

    sendHeartbeat(res);
}
  
async function triggerEvent(req, res) {
    const data = req.body
    subscribers.forEach(subscriber => subscriber.res.write(`data: ${JSON.stringify(data)}\n\n`))

    res.json({success: true});
}

app.get('/', (req, res) => {res.send('The server is up and running!')})
app.get('/events', eventsHandler)
app.post('/trigger', triggerEvent)

app.listen(process.env.PORT, () => {
    console.log(`Event started on port ${process.env.PORT}...`)
});
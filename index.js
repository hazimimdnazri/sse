const express = require('express');
const cors = require('cors');
const uuid = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());
require('dotenv').config()

let subscribers = []

eventsHandler = (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
  
    res.writeHead(200, headers);
    
    const subscriberId = uuid.v4();  
    const subscriber = {
        id: subscriberId,
        res
    };

    subscribers.push(subscriber);
    
    req.on('close', () => {
        subscribers = subscribers.filter(sub => sub.id !== subscriberId);
    });
}
  
async function triggerEvent(req, res) {
    const data = req.body;
    subscribers.forEach(subscriber => subscriber.res.write(`data: ${JSON.stringify(data)}\n\n`));

    res.json({success: true});
}

app.get('/', (req, res) => {res.send('The server is up and running!')})
app.get('/events', eventsHandler)
app.post('/trigger', triggerEvent)

app.listen(process.env.PORT, () => {
    console.log('Event started...')
});
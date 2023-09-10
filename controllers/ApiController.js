import { v4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()

let subscribers = []
    
// Send a heartbeat every 10 seconds to keep connection alive.
const sendHeartbeat = (res) => {
    setInterval(() => {
        res.write('event: heartbeat\n');
        res.write('data: Heartbeating\n\n');
    }, 10000);
}

const eventsHandler = (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }

    res.writeHead(200, headers)
    
    const subscriberId = v4()
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

const triggerEvent = async (req, res) => {
    
    const data = req.body
    if(req.headers.accept == process.env.ACCEPT_HEADER){
        if(req.body.SECRET_KEY == process.env.SECRET_KEY){
            delete data['SECRET_KEY']
            subscribers.forEach(subscriber => subscriber.res.write(`data: ${JSON.stringify(data)}\n\n`))
    
            res.status(200).json({
                success: true,
                'message': 'Alert sent.'
            });
        } else {
            res.status(401).json({
                success: false,
                'message': 'Unauthorized.'
            });
        }
    } else {
        res.status(406).json({
            success: false,
            'message': 'Unknown header sent.'
        });
    }
}

const unknownRoute = (req, res) => {
    res.status(404).send(":-(");
}

export const ApiController = {
    eventsHandler,
    triggerEvent,
    unknownRoute
};

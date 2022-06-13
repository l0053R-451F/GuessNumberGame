const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
require("dotenv").config();

const port = process.env.PORT || 8485;

const wss = new WebSocket.Server({ server:server ,path:'/api/v1/ws/game1'});


const clients = new Map();
wss.on('connection', ws=> {
    const id = uuidv4();
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', (messageAsString) => {
        const data = JSON.parse(messageAsString)
        const username =data.username;
        if (data.action === 'connect' ){
            const metadata = { id, username};
            ws.send(JSON.stringify({id,username}))
            clients.set(ws, metadata);
            console.log(clients.get(ws))
        }
        if (data.action === 'testmessage'){
            ws.send(JSON.stringify({message: `connection ok. you send ${data.message}`}))
        }
    })

});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
    });
}, 300);


wss.on("close", () => {
    clearInterval(interval);
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function heartbeat() {
    this.isAlive = true;
}

app.get('/', (req, res) => res.send('Hello World!'))

server.listen(port, () => console.log(`Lisening on port ${port}`))
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
require("dotenv").config();

const port = process.env.PORT || 8485;

const wss = new WebSocket.Server({server: server, path: '/api/v1/ws/game1'});


const clients = new Map();
const gameList = []
wss.on('connection', ws => {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', (messageAsString) => {

        const data = JSON.parse(messageAsString)

        if (data.action === 'connect') {
            const id = uuidv4();
            ws.uid = id
            const username = data.username;
            const metadata = {id, username};
            ws.send(JSON.stringify({id, username}))
            clients.set(ws, metadata);
            sendAvailableGameToSelf(ws.uid)
        }
        if (data.action === 'create') {
            const newGameData = {
                id: Math.floor(1000 + Math.random() * 9000),
                players: [ws.uid]
            }
            gameList.push(newGameData)
            sendAvailableGameToAll()
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


function sendAvailableGameToSelf(id) {
    wss.clients.forEach(ws => {
        if (ws.uid === id) {
            ws.send(JSON.stringify({
                'message': 'gamesAvailResponse',
                 gameList,

            }))
        }
    })
}
function sendAvailableGameToAll() {
    wss.clients.forEach(ws => {
        ws.send(JSON.stringify({
            'message': 'gamesAvailResponse',
            gameList,

        }))
    })
}


wss.on("close", () => {
    clearInterval(interval);
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function heartbeat() {
    this.isAlive = true;
}

function send(payload) {

}

app.get('/', (req, res) => res.send('Hello World!'))

server.listen(port, () => console.log(`Lisening on port ${port}`))
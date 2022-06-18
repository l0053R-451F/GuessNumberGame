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
            ws.send(JSON.stringify({
                'message': 'userInfo',
                id,
                username
            }))
            clients.set(ws, metadata);
            sendAvailableGameToSelf(ws.uid)
        }

        if (data.action === 'create') {
            const mainNumbers = [4,9,2,3,5,7,8,1,6]
            const mainResult = 15;
            const random = Math.floor(Math.random() * 10)
            const newNumbers =[]
            const newResult = Math.pow(random, mainResult);
            for (let number of mainNumbers){
                newNumbers.push(Math.pow(random, number))
            }
            const newGameData = {
                id: Math.floor(1000 + Math.random() * 9000),
                players: [ws.uid],
                numbers:newNumbers,
                result:newResult,
                createdAt: new Date()
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
    /*
    * this process it not perfect
    * */
    for (let game of gameList) {
        const created = new Date(game.createdAt)
        if (new Date() > new Date(created.getTime() + 5 * 60000)) {
            gameList.splice(gameList.indexOf(game), 1);
            sendAvailableGameToAll()
        }
    }
    /**/
    this.isAlive = true;
}

app.get('/', (req, res) => res.send('Hello World!'))

server.listen(port, () => console.log(`Lisening on port ${port}`))
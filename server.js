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
            ws.userName = data.username;
            ws.uid = id
            const username = data.username;
            const metadata = {id, username};
            ws.send(JSON.stringify({
                'message': 'userInfo',
                id,
                username
            }))
            clients.set(ws, metadata);
            sendAvailableGameToAll()
        }

        if (data.action === 'create') {
            const mainNumbers = [4,9,2,3,5,7,8,1,6]
            const mainResult = 15;

            const random = randomNumber()
            const newNumbers =[]
            const newResult = Math.pow(random, mainResult);
            for (let number of mainNumbers){
                const ne = Math.pow(random, number)
                newNumbers.push(ne)
                console.log(random, number,ne)
            }
            const newGameData = {
                id: Math.floor(1000 + Math.random() * 9000),
                players: [
                    {
                        id:ws.uid,
                        userName:ws.userName,
                        isTurn:true,
                        picketNumbers:[]
                    }
                    ],
                numbers:newNumbers,
                result:newResult,
                createdAt: new Date()
            }
            gameList.push(newGameData)
            sendAvailableGameToAll()
            //curentGame(newGameData.id,newGameData.players)
        }
        if (data.action === 'join'){
            const gameId = data.gameId;
            const uid = ws.uid
            ///console.log(uid,gameId)
            for (let game of gameList){
               if (game.id.toString() === gameId.toString()){
                   game.players.push({
                       id:ws.uid,
                       userName:ws.userName,
                       isTurn:false,
                       picketNumbers:[]
                   })
               }
            }

            sendAvailableGameToAll()

        }
        if (data.action === 'picked'){
            const gameId = data.gameId;
            const playerId = data.playerId
            const number = data.number
            for (let game of gameList){
                if (game.id.toString() === gameId.toString()){
                    for (let player of game.players){
                        if (player.id.toString() === playerId.toString() ){
                            player.picketNumbers.push(number)
                            player.isTurn =false
                        }
                        else {
                            player.isTurn = true
                        }
                    }
                    console.log(game.numbers.indexOf(parseInt(number)))
                    game.numbers[game.numbers.indexOf(parseInt(number))] =0
                }
            }
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


function sendAvailableGameToAll() {
    wss.clients.forEach(ws => {
        ws.send(JSON.stringify({
            'message': 'gamesAvailResponse',
            gameList

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
function randomNumber(){
    let range = {min: 2, max: 9}
    let delta = range.max - range.min

    const rand = Math.round(range.min + Math.random() * delta)
    console.log(rand,'rand')
    return rand
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
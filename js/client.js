let ws
let gamesAvail
let userInfo
let currentGame
function heartbeat() {
    clearTimeout(this.pingTimeout);
    this.pingTimeout = setTimeout(() => {
        this.terminate();
        console.log('dead')
    }, 300 + 100);
}
//disable game bord for initial entry
document.getElementById('gameBoard').classList.add('hidden')
document.getElementById('in-game-chat').classList.add('hidden')
let gameConst
function getFormData(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    connect(formProps)
}

document.getElementById('userform').addEventListener('submit',getFormData)


function connect(userData) {
    //disable game bord for initial entry
    document.getElementById('gameBoard').classList.add('hidden')

    //live https://ishaf-ws.herokuapp.com/
    ws = new WebSocket('ws://localhost:8485/api/v1/ws/game1')
    ws.addEventListener('ping', heartbeat)
    ws.addEventListener('close', ()=> {
        document.getElementById('connect').disabled =false;
        clearTimeout(this.pingTimeout);
    })
    ws.addEventListener("open", (res) => {
        console.log('Connected')

        //disable connect button
        document.getElementById('connect-box').classList.add('hidden')
        const payLoad = {
            'action': 'connect',
            'username': userData.username
        }
        send(payLoad)

        ws.addEventListener("message", (res) => {
            const data = JSON.parse(res.data)
            if (data.message === 'gamesAvailResponse') {
                gamesAvail = data.gameList;
                let gameHTML=''

                for (let game of gamesAvail){
                    gameConst = game
                    if (game.players.length<2 && game.players[0].id !== userInfo.id){
                        //create list
                        gameHTML =gameHTML+`
                            <div class="game-list">
                                <span>${game.id}</span>
                                <button id="${game.id}" onclick="joinGame(this)" class="join-button">Join Now!</button>
                            </div>
                            `
                    }
                    document.getElementById("gameList").innerHTML = gameHTML;


                    if (game.players[0].id === userInfo.id || game.players[1].id === userInfo.id){
                        document.getElementById('gameBoard').classList.remove('hidden')
                        let cards =''
                        for (let number of game.numbers){
                            for (let player of game.players){
                                if (player.id === userInfo.id){
                                    if (player.isTurn && number !==0){
                                        cards =cards+ `
                            <div id="${number}" class="card" style="cursor: pointer" onclick="pickCard(gameConst.id,userInfo.id,this)">${number}</div>
                            `
                                    }
                                    else if (number ===0){
                                        cards =cards+ `
                            <div style="cursor: not-allowed" class="card"></div>
                            `
                                    }
                                    else {
                                        cards =cards+ `
                            <div style="cursor: not-allowed" class="card">${number}</div>
                            `
                                    }
                                }

                            }

                        }
                        document.getElementById('result').innerHTML =`
                                        You are Playing For total <span style="color:red">${game.result}</span> Points
                                        <p style="color: white;font-size: 21px">Pick one card for each turn carefuly. Multiply them and you will get the result</p>
                                        `
                        document.getElementById('cards').innerHTML =cards
                        document.getElementById('in-game-chat').classList.remove('hidden')
                        if (game.players[0].id === userInfo.id){
                            document.getElementById('player1').innerHTML = `${game.players[0].userName} numbers: ${game.players[0].picketNumbers}`
                            if (game.players[1].id){
                                document.getElementById('player2').innerHTML = `${game.players[1].userName} numbers: ${game.players[1].picketNumbers}`
                            }
                        }else if (game.players[1].id === userInfo.id){
                            document.getElementById('player2').innerHTML = `${game.players[1].userName} numbers: ${game.players[1].picketNumbers}`
                            document.getElementById('player1').innerHTML = `${game.players[0].userName} numbers: ${game.players[0].picketNumbers}`
                        }
                    }
                }

            }
            if (data.message === 'yourGame') {

            }
            if (data.message === 'userInfo') {
                userInfo = {
                    'username':data.username,
                    'id':data.id
                }
                const userInfoHTML = `
                <div >
                    <span> ${data.username}</span>
                </div>
                `
                document.getElementById("userInfo").innerHTML = userInfoHTML;
            }
        })
    })

}

function createNewGame() {
    const payLoad = {
        'action': 'create',
    }
    send(payLoad)
}

function joinGame(event){
    const gameId= event.id
    const payLoad = {
        'action': 'join',
        'gameId':gameId
    }
    send(payLoad)
}
function pickCard(gameId,playerId,that){
    const payLoad = {
        'action': 'picked',
        'gameId':gameId,
        playerId,
        number:that.id
    }
    send(payLoad)
}
function send(payLoad) {
    ws.send(JSON.stringify(payLoad))
}
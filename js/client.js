let ws
let gamesAvail
let userInfo
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


function connect() {
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
        document.getElementById('connect').disabled =true;
        const payLoad = {
            'action': 'connect',
            'username': 'ishaf'
        }
        send(payLoad)

        ws.addEventListener("message", (res) => {
            const data = JSON.parse(res.data)
            if (data.message === 'gamesAvailResponse') {
                gamesAvail = data.gameList;
                let gameHTML=''
                for (let game of gamesAvail){
                    //console.log(userInfo.id)
                    if (game.players[0] === userInfo.id || game.players[1] === userInfo.id){
                        document.getElementById('gameBoard').classList.remove('hidden')
                        document.getElementById('in-game-chat').classList.remove('hidden')
                    }
                    gameHTML =gameHTML+`
                    <div class="game-list">
                        <span>${game.id}</span>
                        <button class="join-button">Join Now!</button>
                    </div>
                    `
                }
                document.getElementById("gameList").innerHTML = gameHTML;
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

const id = localStorage.getItem('id');
if (id) {
    //document.getElementById('connect').disabled =true
    console.log('test storage', id) // now need to reconnect with existing id
}

function send(payLoad) {
    ws.send(JSON.stringify(payLoad))
}
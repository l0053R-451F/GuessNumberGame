let ws
let gamesAvail

function heartbeat() {
    clearTimeout(this.pingTimeout);
    this.pingTimeout = setTimeout(() => {
        this.terminate();
        console.log('dead')
    }, 300 + 100);
}

function connect() {
    //live https://ishaf-ws.herokuapp.com/
    ws = new WebSocket('ws://localhost:8485/api/v1/ws/game1')
    ws.addEventListener('ping', heartbeat)
    ws.addEventListener("open", (res) => {
        console.log('Connected')
        const id = localStorage.getItem('id');
        const payLoad = {
            'action': 'connect',
            'username': 'ishaf'
        }
        send(payLoad)

        ws.addEventListener("message", (res) => {
            const data = JSON.parse(res.data)
            if (data.message === 'gamesAvailResponse') {
                gamesAvail = data.gameList
                document.getElementById("gameList").innerHTML = JSON.stringify(gamesAvail);
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

if (ws) {

    ws.on('close', function clear() {
        clearTimeout(this.pingTimeout);
    });
}
const id = localStorage.getItem('id');
if (id) {
    //document.getElementById('connect').disabled =true
    console.log('test storage', id) // now need to reconnect with existing id
}

function send(payLoad) {
    ws.send(JSON.stringify(payLoad))
}
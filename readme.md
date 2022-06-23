# Game2

## [Live Demo](https://l0053r-451f.github.io/GuessNumberGame/game2.html)

**Note:** you may face some issues with **'Websocket Heartbeat Keep Alive'** for heroku server. use locally, its the best :unamused:

## WS APIs
**End Point:** `api/v1/ws/game1`
### Connect
**Request**
```json
{
  "action": "connect",
  "username": "String"
}
```
**Response**
```json
{
    "message": "userInfo",
    "id": "String",
    "username": "String"
}
```

### Available Game/Games
**Response**
```json
{
    "message": "gamesAvailResponse",
    "gameList": [
        {
            "id": "Number",
            "players": [
                {
                    "id": "String",
                    "userName": "String",
                    "isTurn": "Boolean",
                    "picketNumbers": "Number[]"
                }
            ],
            "numbers": "Number[]",
            "result": "Number",
            "status": "String",
            "createdAt": "String"
        }
    ]
}
```
### Create New Game
**Request**
```json
{
  "action": "create"
}
```
**Response**
<br/>
**[Available Game/Games](#available-gamegames)**
### Join A Game
**Request**
```json
{
  "action": "join",
  "gameId":"Number"
}
```
**Response**
<br/>
**[Available Game/Games](#available-gamegames)**
### Pick A Card
**Request**
```json
{
  "action": "picked",
  "gameId":"Number",
  "playerId":"Number"
  "number":"Number"
}
```
**Response**
<br/>
**[Available Game/Games](#available-gamegames)**
### Finish A Game
**Request**
```json
{
  "action": "gameFinished",
  "gameId":"Number",
}
```
**Response**
<br/>
**[Available Game/Games](#available-gamegames)**

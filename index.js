var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) { 
  res.sendFile(__dirname + '/public/html/menu.html'); 
});


class Game{

  constructor(gameId, hostId){
    this.gameId = gameId;
    this.hostId = hostId;
    this.players = [hostId];
    this.currentTurn = 0;
    this.words = [];
  }

  addPlayer(playerId){
    if(!this.players.includes(playerId)){
      this.players.push(playerId);
      console.log("Игрок добавлен:", playerId);
    }
  }

  removePlayer(playerId){
    this.players = this.players.filter(p => p !== playerId);
    console.log("Игрок удалён:", playerId);

    if (this.currentTurn >= this.players.length) {
      this.currentTurn = 0;
    }
  }


}

const games = {};


io.on('connection', function(socket){



  socket.on('create room', function(gameId){
  
    if (!games[gameId]) {
      games[gameId] = new Game(gameId, socket.id);
      console.log("Создана игра:", gameId);
    }
    
    socket.gameId = gameId;
    socket.join(gameId);

    console.log('createdRoom', socket.gameId)
    io.emit('createdRoom', gameId);
  });

  socket.on('join room', function(gameId){

    const game = games[gameId];
    if (!game) return;

    game.addPlayer(socket.id);

    socket.gameId = gameId;
    socket.join(gameId);

    console.log("Пользователь/ " + socket.id + " / вошёл в комнату:", gameId);
  });

  socket.on('send message', function(data) {
    const { gameId, userId, msg } = data;

    if (!gameId) {
      console.log("gameId отсутствует, сообщение не отправлено");
      return;
    }

    console.log("СЕРВЕР ПОЛУЧИЛ:", data);

    io.to(gameId).emit('receive message', { msg });
  });

  socket.on('disconnect', function(){
    console.log("Пользователь/ " + socket.id + " / покинул комнату:", socket.gameId);

    const gameId = socket.gameId;

    // 💥 ВОТ ЭТО ВАЖНО
    if (!gameId) {
      console.log("Игрок не был в комнате");
      return;
    }

    const game = games[gameId];
    if (!game) return;

    game.removePlayer(socket.id);

    socket.to(gameId).emit('user left', socket.id);

    console.log("game.players:", game.players); 

    if (game.players.length === 0) {
      io.emit("deleteRoom", gameId);
      delete games[gameId];
      console.log("Игра удалена:", gameId);
    }
  });

});


http.listen(3000, function() {
  console.log('listening on *:3000');
});
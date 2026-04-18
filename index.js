var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) { 
  res.sendFile(__dirname + '/public/html/menu.html'); 
});


class Room{

  constructor(roomId, hostId){
    this.roomId = roomId;
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

const rooms = {};


io.on('connection', function(socket){



  socket.on('StartCreateRoom', function(roomId){
  
    if (!rooms[roomId]) {
      rooms[roomId] = new Room(roomId, socket.id);
      console.log("Создана игра:", roomId);
    }
    
    socket.roomId = roomId;
    socket.join(roomId);

    io.emit('createdRoomBtn', roomId);
  });

  socket.on('join room', function(roomId){

    const room = rooms[roomId];
    if (!room) return;

    room.addPlayer(socket.id);

    socket.roomId = roomId;
    socket.join(roomId);

    console.log("Пользователь/ " + socket.id + " / вошёл в комнату:", roomId);
  });

  socket.on('send message', function(data) {
    const { roomId, userId, msg } = data;

    if (!roomId) {
      console.log("roomId отсутствует, сообщение не отправлено");
      return;
    }

    io.to(roomId).emit('receive message', { msg });
  });

  socket.on('disconnect', function(){
    console.log("Пользователь/ " + socket.id + " / покинул комнату:", socket.roomId);

    const roomId = socket.roomId;

    if (!roomId) {
      console.log("Игрок не был в комнате");
      return;
    }

    const room = rooms[roomId];
    if (!room) return;

    room.removePlayer(socket.id);

    console.log("room.players:", room.players); 

    if (room.players.length === 0) {
      io.emit("deleteRoom", roomId);
      delete room[roomId];
      console.log("Игра удалена:", roomId);
    }
  });

});


http.listen(3000, function() {
  console.log('listening on *:3000');
});
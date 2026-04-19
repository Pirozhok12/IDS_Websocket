var express = require("express");
const Room = require('./Room');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/html/menu.html');
});




const rooms = {};


io.on('connection', function(socket){



socket.on('StartCreateRoom', function(roomId){
    if (!rooms[roomId]) {
      rooms[roomId] = new Room(roomId, socket.id);
      console.log("Створена гра:", roomId);
    }
    
    socket.roomId = roomId; 
    socket.join(roomId);
    io.emit('createdRoom', roomId);
});

  socket.on('join room', function(roomId){

    const room = rooms[roomId];
    if (!room) return;

    room.addUser(socket.id);

    if(room.canStart())room.start();


    socket.roomId = roomId;
    socket.join(roomId);

    io.to(roomId).emit('infoData', {
      host:room.hostId,
      users:room.users.length,
      roomId:roomId
    });

    console.log("Пользователь/ " + socket.id + " / вошёл в комнату:", roomId);
  });

  socket.on('send message', function(data) {
    var { roomId, userId, msg } = data;
    
    const room = rooms[roomId];
    if (!room) return;
    
    if (!roomId) {
      console.log("roomId отсутствует, сообщение не отправлено");
      return;
    }
    
    const currentPlayer = room.users[room.currentTurn];

    const resVal = room.isValidWord(msg);
    const isMyTurn = currentPlayer === socket.id;
    const isPlaying = room.getGameStatus() === 'playing';

    if (isPlaying && isMyTurn && resVal.ok) {
      room.applyWord(msg);
      io.to(roomId).emit('receive message', { msg });
      return;
    }

    let errorMsg;
    if (!isPlaying)       errorMsg = 'Not start yet';
    else if (!isMyTurn)   errorMsg = 'Not your turn';
    else                  errorMsg = resVal.error;  

    socket.emit('receive message', { msg: errorMsg });

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

    const isHost = room.hostId === socket.id;


    room.removeUser(socket.id);

    console.log("room.users:", room.users); 
    if(room.isUserHost(socket.id)){
    console.log("this user is host");
    }
    else{
      console.log("this user !host");
      io.to(roomId).emit('infoData', {
      host:room.hostId,
      users:room.users.length,
      roomId:roomId
    });
    }

    

    if (isHost || room.users.length === 0) {
      io.to(roomId).emit("forceLeave"); 
      io.emit("deleteRoom", roomId);

      delete rooms[roomId];

      io.to(roomId).emit('infoData', {
      host:"Host is disconnected",
      users:"Host is disconnected",
      roomId:"Host is disconnected"
    });

      console.log("Комната удалена:", roomId);
    }
  });

});


http.listen(3000, function() {
  console.log('listening on *:3000');
});
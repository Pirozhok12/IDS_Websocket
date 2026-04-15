var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) { 
  res.sendFile(__dirname + '/public/html/menu.html'); 
});

io.on('connection', function(socket){
  console.log("Кто-то подключился");

  socket.on('join room', function(gameId){
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
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
var express = require("express"); // окрема змінна для зручності
var path = require('path'); 

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public')); // вказівка каталогу для статичних ресурсів, у якому буде розташовано файл css, що підключається.

app.get('/', function(req, res) { 
  res.sendFile(__dirname + '/public/html/menu.html'); 

});

io.on('connection', function(socket){
  socket.on('send message', function(msg) {
	io.emit('receive message', msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
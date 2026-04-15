src="/socket.io/socket.io.js";
 src="https://code.jquery.com/jquery-1.11.1.js";
  
  
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("id");

  console.log("ID игры:", gameId);

  var socket = io();

  socket.on('connect', () => {
    console.log("Подключено к серверу");

    if (!gameId) {
      console.warn("gameId не найден");
      return;
    }
    console.log(socket.id + "socket.id")
    console.log("JOIN ОТПРАВЛЯЕМ:", gameId);
    socket.emit('join room', gameId);
  });

  document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();

    if (!gameId) {
      console.warn("gameId отсутствует");
      return;
    }

    socket.emit('send message', {
      gameId: gameId,
      userId: socket.id,
      msg: document.getElementById("m").value
    });

    document.getElementById("m").value = "";
  });

  socket.on('receive message', function(data){
    var li = document.createElement("li");
    li.textContent = data.msg;
    console.log(data);
    document.getElementById("messages").appendChild(li);
  });
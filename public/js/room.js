  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("id");


  var socket = io();

  socket.on('connect', () => {

    if (!roomId) {
      console.warn("gameId не найден");
      return;
    }

    socket.emit('StartCreateRoom', roomId);
    socket.emit('join room', roomId);
  });


  socket.on('infoData', (data) => {
    
    document.getElementById("btnStart").style.display = "none";
    
    
    const { host, users, roomId } = data;

    var usersField = document.getElementById("usersField");
    usersField.textContent = "all users: " + users;
    var hostField = document.getElementById("hostField");
    hostField.textContent = "host: " + host;
    var userIdField = document.getElementById("userIdField");
    userIdField.textContent = "You: " + socket.id;
    var roomIdField = document.getElementById("roomIdField");
    roomIdField.textContent = "Room ID: " + roomId;

    if(host === socket.id && users >= 2){
      document.getElementById("btnStart").style.display = "block";
    }

});

socket.on("forceLeave", () => {
  window.close();
  window.location.href = "about:blank";
});

  document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();

    if (!roomId) {
      console.warn("roomId отсутствует");
      return;
    }

    socket.emit('send message', {
      roomId: roomId,
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



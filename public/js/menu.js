const RoomIdList = [];

var socket = io();


window.onload = () =>{
    const Ids = JSON.parse(localStorage.getItem("Rooms")) || [];
    console.log('Ids', Ids);
    RoomIdList.push(...Ids);
    Ids.forEach(roomId => {createRoomButton(roomId); });
}

function createRoom() {
    const roomId = generateId();
   
    window.open(`/html/room.html?id=${roomId}`, '_blank');
    RoomIdList.push(roomId)
    localStorage.setItem("Rooms", JSON.stringify(RoomIdList));
    createRoomButton(roomId)

}

socket.on('createdRoom', (roomId) => {
    if (!RoomIdList.includes(roomId)) {
        RoomIdList.push(roomId);
        localStorage.setItem("Rooms", JSON.stringify(RoomIdList));
        createRoomButton(roomId);
    }
});

socket.on('deleteRoom',(roomId) => {
    
    const index = RoomIdList.indexOf(roomId);
    if (index !== -1) {
        RoomIdList.splice(index, 1);
    }

    localStorage.setItem("Rooms", JSON.stringify(RoomIdList));

    const el = document.getElementById(roomId);
    if (el) el.remove();

})

function generateId() {
    return Math.random().toString(36).substring(2, 10);
}

function createRoomButton(newRoomId){
    const button = document.createElement('button');
    button.textContent = newRoomId;
    button.id = newRoomId;

    button.onclick = () => {
        window.open(`/html/room.html?id=${newRoomId}`, '_blank');
    };

    document.getElementById('rooms').appendChild(button);
}




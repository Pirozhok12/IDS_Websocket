console.log("js is connected");

const GamesList = [];


window.onload = () =>{
    const savedGames = JSON.parse(localStorage.getItem("Rooms")) || [];
    GamesList.push(...savedGames);
    savedGames.forEach(gameId => {
        loadWorkingRooms(gameId);
    });

}

function createGame() {
    const gameId = generateId();
    window.open(`/html/room.html?id=${gameId}`, '_blank');
    GamesList.push(gameId)
    localStorage.setItem("Rooms", JSON.stringify(GamesList));
    loadWorkingRooms(gameId)

}

function generateId() {
    return Math.random().toString(36).substring(2, 10);
}

function loadWorkingRooms(newItem){
    const button = document.createElement('button');
    button.textContent = newItem;
    button.id = newItem;

    button.onclick = () => {
        window.open(`/html/room.html?id=${newItem}`, '_blank');
    };

    document.getElementById('rooms').appendChild(button);
}




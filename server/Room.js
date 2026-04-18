class Room{

  constructor(roomId, hostId){
    this.roomId = roomId;
    this.hostId = hostId;
    this.users = [hostId];
    this.currentTurn = 0;
    this.words = [];
  }


  

  addUser(userId){
    if(!this.users.includes(userId)){
      this.users.push(userId);
      console.log("Игрок добавлен:", userId);
    }
  }

  removeUser(userId){
    this.users = this.users.filter(p => p !== userId);
    console.log("Игрок удалён:", userId);

    if (this.currentTurn >= this.users.length) {
      this.currentTurn = 0;
    }
  }

  isUserHost(userId){
    if(this.hostId === userId)
      return 1;
    return 0;
  }

  startGame(){}



}
module.exports = Room;
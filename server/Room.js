class Room{

  constructor(roomId, hostId){
    this.roomId = roomId;
    this.hostId = hostId;
    this.users = [hostId];
    this.currentTurn = 0;
    this.status = 'waiting';
    this.words = [];
    this.usedWords = [];
    
  }


  getInfo(){
    return {
      host: this.hostId,
      users: this.users.length,
      roomId: this.roomId
    };
  }

  
  // getWinner() {
  //   return this.activePlayers.length === 1 ? this.activePlayers[0] : null;
  // }
  

  getStatus(){
    return this.status;
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



  // skipPlayer(userId) {
  //   this.activePlayers = this.activePlayers.filter(id => id !== userId);
  //   if (this.currentTurn >= this.activePlayers.length) this.currentTurn = 0;
  //   if (this.activePlayers.length <= 1) this.status = 'finished';
  // }
  
  nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % this.users.length;
  }

  // applyWord(word) {
  //   this.usedWords.push(word.toLowerCase());
  //   this.lastWord = word;
  //   this.nextTurn();
  // }

  currentPlayerId() {
    return this.activePlayers[this.currentTurn];
  }

  start() {
    this.status = 'playing';
    this.currentTurn = 0;
  }

  canStart() {
    return this.status === 'waiting' && this.users.length >= 2;
  }



}
module.exports = Room;
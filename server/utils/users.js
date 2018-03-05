[{
  id: '/#12poiajdspfoif',
  name: 'Andrew',
  room: 'The Office Fans'
}]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor () {
    this.users = [];
    // this.rooms=[];
  }
  addUser (id, name, room) {
    var user = {id, name,room };
    this.users.push(user);
    return user;
  }
  logoutUser(name){
    var user=this.getUserName(name);
    console.log(user);
    if (user) {
      this.users = this.users.filter((user) => user.name !== name);
    }
    return user;
  }

  getUserName(name){
    return this.users.filter((user) => user.name.toLowerCase() === name.toLowerCase())[0]
  }

  // getRoom(room){
  //   return this.
  // }
  removeUser (id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0]
  }
  getUserList (room) {
    var users = this.users.filter((user) => user.room.toLowerCase() === room.toLowerCase());
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = {Users};

 

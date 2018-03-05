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
  }
  addUser (id, name) {
    var user = {id, name};
    this.users.push(user);
    return user;
  }
  logoutUser(name){
    var user=this.getUserName(name);
    if (user) {
      this.users = this.users.filter((user) => user.name !== name);
    }
    return user;
  }

  getUserName(name){
    return this.users.filter((user) => user.name.toLowerCase() === name.toLowerCase())[0]
  }
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
  getUserList () {
    // var users = this.users.filter((user) => user.room === room);
    var namesArray = this.users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users};

 

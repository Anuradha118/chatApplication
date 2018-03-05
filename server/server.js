const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment=require('moment');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const chatManager=require('./utils/chatManager');
const publicPath = path.join(__dirname, '../public');
const port = 3000;

var {mongoose}=require('./db/mongoose');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');
  var message;
  var chat;
  var room;
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name)) {
      return callback('Name and room name are required.');
    }else if(users.getUserName(params.name)){
      return callback('User Name already taken');
    }
    var room=params.room.toLowerCase();
    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, room);
    io.to(room).emit('updateUserList', users.getUserList(params.room));
    
    chat={userName:'Admin',room:room,text:`${params.name} has joined.`};
    chatManager.saveChat(chat,function(doc){
      message=generateMessage(doc._id,doc.userName,doc.text,doc.createdAt);
      socket.broadcast.to(room).emit('newMessage', message);
    });
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
       chat={userName:user.name,room:user.room,text:message.text};
      
      chatManager.saveChat(chat,function(doc){
        message=generateMessage(doc._id,doc.userName,doc.text,doc.createdAt);
        io.to(user.room).emit('newMessage', message);
      });
    }

    callback();
  });

  socket.on('notifyUser', function(user){
    io.emit('notifyUser', user);
  });

  socket.on('logout',(user)=>{
    var user=users.logoutUser(user);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      chat={userName:'Admin',room:user.room,text:`${user.name} has left.`};
      chatManager.saveChat(chat,function(doc){
        message=generateMessage(doc._id,doc.userName,doc.text,doc.createdAt);
      io.to(user.room).emit('logout-response',{user:user,error:false,message:message});  
      });
      
    }
    // socket.disconnect();
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      chat={userName:'Admin',room:user.room,text:`${user.name} has left.`};
      chatManager.saveChat(chat,function(doc){
        message=generateMessage(doc._id,doc.userName,doc.text,doc.createdAt);
      io.to(user.room).emit('newMessage', message);
      })
    }
  });
});

app.get('/loadmsg/',function(req,res){
  // var filterdate=moment(req.query.createdAt,'YYYY-MM-DD HH:mm:ss:SSS Z').toDate().toISOString();
  // console.log(filterdate);
  var data={
    mId:req.query.mId,
    room:req.query.room
  }
  chatManager.getHistory(data,function(chats){
    res.send({'status':200,'oldmsg':chats});
  });
})

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

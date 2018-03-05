var {chatModel}=require('./../models/chatModel');
var {mongoose}=require('./../db/mongoose');

const save_chat = function (chat,callback) {  
    var data = new chatModel({    
        room: chat.room,
        userName:chat.userName,
        text:chat.text   
    });
    data.save(function (err, doc) { 
        if (err) {  
            return console.error(err);  
        }
        else{
            return callback(doc);
        }
    }); 
};  
  
const get_history = function (chatRoom,callback) { 
    // var time=new Date(chatRoom.createdAt);
    chatModel.find({room:chatRoom.room,_id:{$lt:mongoose.Types.ObjectId(chatRoom.mId)}}).sort({_id:-1}).limit(10).exec(function (err, chats) { 
        
        if (err) return console.error(err);  
        return callback(chats);  
    }); 
};


module.exports = { saveChat: save_chat, getHistory: get_history };
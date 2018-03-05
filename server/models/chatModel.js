const mongoose=require('mongoose');
const moment = require('moment');
const schema = mongoose.Schema;  
const chatSchema = new schema( {    
    room: {
        type:String 
    },
    userName: {
        type:String
    },
    text:{
        type:String
    },
    createdAt:{
        type:Date,
        default:moment().valueOf()
    } 
});  

const chatModel = mongoose.model('Chat', chatSchema);


module.exports={chatModel};
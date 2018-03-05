var socket = io();
var user='';
var firstMessagecreatedAt;
var firstMessageId;
function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);
  this.user=params.name;
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ul = jQuery('<ul></ul>');

  users.forEach(function (user) {
    ul.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ul);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('YYYY-MM-DD HH:mm');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    id:message.id,
    text: message.text,
    from: this.user===message.from?'You':message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

function loadOldMsg(){
  // this.firstMessagecreatedAt = jQuery('#messages').children('li:first-child').find('span').text();
  this.firstMessageId = jQuery('#messages').children('li:first-child').find('h5').text();
  // var time=moment(this.firstMessagecreatedAt+' +0530','YYYY-MM-DD HH:mm:ss:SSS Z').toDate().toISOString();
  var params=jQuery.deparam(window.location.search);
  $.ajax({
    url:'/loadmsg/?mId='+this.firstMessageId,
    type:'get',
    success:function(response){
      if(response.oldmsg.length<1){
        alert('No messages to load');
      }else{
        for(var i=0;i<response.oldmsg.length;i++){
          var formattedTime = moment(response.oldmsg[i].createdAt).format('YYYY-MM-DD HH:mm');
          var template = jQuery('#message-template').html();
          var html = Mustache.render(template, {
            id:response.oldmsg[i]._id,
          text: response.oldmsg[i].text,
          from: params.name===response.oldmsg[i].userName?'You':response.oldmsg[i].userName,
          createdAt: formattedTime
        });
        jQuery('#messages').prepend(html); 
        }
      }
    },
    error:function(err){
      console.log(err);
    }
  })
}


jQuery('#messages').scroll(function(){
  if(jQuery('#messages').scrollTop()==0){
    jQuery('#old').show();
  }
});
var loadMsgtButton=jQuery('#old');
loadMsgtButton.on('click',loadOldMsg);

function notifyTyping() { 
  var name = jQuery.deparam(window.location.search).name;
  socket.emit('notifyUser', name);
}
socket.on('notifyUser', function(user){
    if(this.user!=user){
      $('#notifyUser').text(user + ' is typing ...');
    }
    setTimeout(function(){ $('#notifyUser').text(''); }, 2000);;
  });

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var logoutButton=jQuery('#logout');
logoutButton.on('click',function(){
  var params=jQuery.deparam(window.location.search);
  socket.emit('logout',params.name);
});

socket.on('logout-response',(response)=>{
  var params=jQuery.deparam(window.location.search);
  if (!response.error) {
    if(params.name!=response.user.name){
      var formattedTime = moment(response.message.createdAt).format('YYYY-MM-DD HH:mm');
      var template = jQuery('#message-template').html();
      var html = Mustache.render(template, {
        id:response.message.id,
        text: response.message.text,
        from: response.message.from,
        createdAt: formattedTime
      });
      jQuery('#messages').append(html);
      scrollToBottom();
    }
    else{
      setTimeout(function(){ window.location.href='/'; }, 1000);
    }  
  }
});	
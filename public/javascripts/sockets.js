var socket = io();
//var chat = io.connect('http://localhost/chat')

//socket.emit('chat message',"hellow message");

socket.on('new message', function(data){
  addTweetInChatList(data.tweetHtml,data.tweet);
});

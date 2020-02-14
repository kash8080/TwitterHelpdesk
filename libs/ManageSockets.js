var intervalId;
var fs=require("fs");
const ejs = require("ejs");
const Twit = require("twit");
const TimestampUtil = require("../utils/TimestampUtil");
var passportSocketIo = require("passport.socketio");
const cookieParser = require("cookie-parser");

var twitterMap;

module.exports= function(io,sessionStore){

  twitterMap = new Map()


    //With Socket.io >= 1.0
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key:          'connect.sid',       // the name of the cookie where express/connect stores its session_id //make sure is the same as in your session settings in app.js
    secret:       process.env.session_secret,    // the session_secret to parse the cookie //make sure is the same as in your session settings in app.js
    store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
    success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }));


  function onAuthorizeSuccess(data, accept){

    //console.log('successful connection to socket.io ',data.sessionID,data.user,data.cookie);
   
    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    if(data.user){
      accept();

    }else{
      //reject
      accept(new Error('Not logged in'));
    }

  }
   
  function onAuthorizeFail(data, message, error, accept){
    if(error)
      throw new Error(message);
    console.log('failed connection to socket.io:', message);
   
    // We use this callback to log all of our failed connections.
    //accept(null, false);
    accept();
  }
  function addTwitterListener(sessionId,user,socket){
    var T = new Twit(require("../utils/TwitterConfig").getLive(user));
    var stream = T.stream('statuses/filter', { track: user.username }) //to track words
    twitterMap.set(sessionId,{
      stream : stream,
      user:user,
      socket:socket
    });
    console.log("cur stream size = "+twitterMap.size);
    

    stream.on('tweet', function (tweet) {
      console.log("new tweet");

      if (!tweet.in_reply_to_status_id_str){
        console.log("tweet not in reply");
        return;
      }
      if(!tweet.text.includes("@"+user.username)){
        console.log("does not include username");
        return;
      }

      tweet = require("../libs/ParseTweetText")(tweet,user.username);

      var filename = __dirname + "/../views/tweets/tweetReply.ejs";
      var messageHtml = fs.readFileSync(filename, "utf8");
      var renderedHtml = ejs.render(messageHtml, {
        tweet: tweet,
        my_screen_name: user.username
      });
      socket.emit('new message', { tweetHtml: renderedHtml, tweet: tweet }); // emit an event to this socket only
    })
    
    
  }
  function removeTwitterListener(sessionId){
    var data = twitterMap.get(sessionId);
    var stream = data.stream;
    twitterMap.delete(sessionId);

    stream.stop();
  }

  io.on('connection', function(socket){
    //var userId
    console.log('a user connected',socket.id);

    addTwitterListener(socket.id,socket.request.user,socket);

    socket.on('disconnect', function(){
      console.log('user disconnected');
      removeTwitterListener(socket.id);

      if(intervalId){
        clearInterval(intervalId);
        intervalId=null;
      }
    });


/*
    intervalId = setInterval(() => {
      console.log("emiting new message");
      
      
      var tweet={id_str: "122647763423615361",
      created_at: "Sun Feb 09",
      text: "thanks for replying",
      user: { screen_name: "addfg", name: "Bot" }};
      var filename = __dirname + "/../views/tweets/tweetReply.ejs";
      var messageHtml = fs.readFileSync(filename, "utf8");
      var renderedHtml = ejs.render(messageHtml, {
        tweet: tweet,
        my_screen_name: "req.user.username"
      });
      socket.emit('new message', { tweetHtml: renderedHtml, tweet: tweet }); // emit an event to this socket only

    }, 10000);*/
/*
    socket.on('chat message', function(data){
      console.log('message: ' + data);
    });
*/

    //socket.broadcast.emit('hi'); to send to everyone except this user
  });

  //io.emit('chat message', msg); to broadcast to everyone

}
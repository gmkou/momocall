var express = require('express')
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, {log:false, origins:'*:*'})

var PORT = 8888;
server.listen(PORT);

console.log("http://localhost:" + PORT);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

var controller = {};
controller.index  = require('./controller/index.js');
controller.video = require('./controller/video.js');

require('./router.js')(app, controller);


io.sockets.on('connection', function (socket) {
  console.log(socket.id + ':connection');

  var status = ''
  var count = 0;
  var intervalId = null;

  var countFunc = function() {
    if (status == 'playing') {
      count++;
      socket.emit('event', {eventType:'message', eventAttr:count});
    } 
  }

  socket.on('command', function(command) {
    console.log(socket.id + ':<' + command.commandType + ':' + command.commandAttr);
    status = command.commandType;
    switch (command.commandType) {
      case 'setVideoId' : videoId = command.commandAttr;
      break;
      case 'playing' :
        intervalId = setInterval(countFunc,1000);
        break;
      case 'buffering' :
      case 'cued' :
      break;
      case 'ended' :
        count = 0;
      case 'paused' :
        clearInterval(intervalId);
        count = parseInt(command.commandAttr);
      break;
      default:
      /* do nothing */
      /* echo back
         socket.emit('event', {eventType:command.commandType});
       */
    }
  });

  socket.on('disconnect', function() {
    console.log(socket.id + ':disconnect');
  });

});



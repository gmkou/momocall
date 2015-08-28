var express = require('express')
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, {log:false, origins:'*:*'})

var PORT = 8888;
server.listen(PORT);
var gSocket = null;

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
  gSocket = socket;

  console.log(socket.id + ':connection');

  socket.on('command', function(command) {
    console.log(socket.id + ':<' + command.commandType + ':' + command.commandAttr);

    switch (command.commandType) {
      case 'playing' :
      case 'buffering' :
      case 'paused' :
      case 'cued' :
      case 'ended' :
      default:
      socket.emit('event', {eventType:command.commandType});
    }
  });

  socket.on('disconnect', function() {
    console.log(socket.id + ':disconnect');
  });
});


